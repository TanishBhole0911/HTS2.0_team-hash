import json
import os
import re
import asyncio
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from models import FlashcardRequest
from typing import List, Dict, Any
from dotenv import load_dotenv
from groq import Groq
from database import (
    user_collection,
    note_collection,
    flashcard_collection,
)

router = APIRouter()

load_dotenv()

# Retrieve the Groq API key from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize the Groq client
client = Groq(api_key=GROQ_API_KEY)


def process_text(text: str) -> str:
    # Here you could add any text preprocessing steps
    return text


def generate_flashcards(text: str) -> List[Dict[str, str]]:
    # Truncate to ~2000 chars to stay within Groq free-tier TPM limits
    truncated = text[:2000]
    system_prompt = (
        "You are a flashcard generator. Return ONLY a JSON array with no explanation. "
        "Each element must have exactly two keys: \"question\" and \"answer\". "
        "Example: [{\"question\": \"Who is Harry?\", \"answer\": \"A wizard\"}]"
    )
    prompt = f"Generate 8 flashcards as a JSON array from this text:\n\n{truncated}"
    max_attempts = 8
    for attempt in range(max_attempts):
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                model="llama-3.1-8b-instant",
            )
        except Exception as e:
            print(f"Error: {str(e)}")  # Debugging line
            raise HTTPException(
                status_code=500, detail="Error calling language model API"
            )

        result = chat_completion.choices[0].message.content

        # Extract JSON from ```json ... ``` block, or fall back to raw [...] / {...}
        code_block = re.search(r'```(?:json)?\s*([\s\S]*?)```', result)
        if code_block:
            cleaned_result = code_block.group(1).strip()
        else:
            raw_match = re.search(r'[\[{][\s\S]*[\]}]', result)
            cleaned_result = raw_match.group(0).strip() if raw_match else result.strip()

        cleaned_result = cleaned_result.replace('\\"', '"')

        try:
            flashcards = json.loads(cleaned_result)
            if not flashcards[0].get("question"):
                raise json.JSONDecodeError("Missing question key", "", 0)
            return flashcards
        except (json.JSONDecodeError, IndexError, KeyError):
            print(f"Attempt {attempt + 1} failed: Invalid JSON content\nRaw: {result[:200]}")

    # If all attempts fail, raise an HTTP exception
    raise HTTPException(
        status_code=500, detail="Invalid JSON content in API response after 3 attempts"
    )


@router.post("/")
async def create_flashcards(request: FlashcardRequest) -> Dict[str, Any]:
    try:
        # Check if user exists
        user_exists = await user_collection.find_one({"username": request.username})
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if flashcards already exist in the flashcard_collection
        existing_flashcards = await flashcard_collection.find_one(
            {"username": request.username, "project_title": request.project_title}
        )
        if existing_flashcards:
            return {
                "message": "Flashcards retrieved successfully from DB",
                "data": existing_flashcards["flashcards"],
            }

        # Retrieve the note
        note = await note_collection.find_one(
            {"username": request.username, "project_title": request.project_title}
        )
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        # Concatenate all page contents
        content = " ".join(page["content"] for page in note.get("pages", []))

        # Run sync Groq calls in a thread so the event loop stays free
        processed_text = process_text(content)
        flashcards = await asyncio.to_thread(generate_flashcards, processed_text)

        # Upload the flashcards to the flashcard_collection in the database
        flashcard_data = {
            "username": request.username,
            "project_title": request.project_title,
            "flashcards": flashcards,
        }
        await flashcard_collection.insert_one(flashcard_data)

        return {
            "message": "Flashcards created successfully and uploaded to DB",
            "data": flashcards,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
