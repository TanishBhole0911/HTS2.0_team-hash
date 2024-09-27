import json
import os
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from models import FlashcardRequest
from typing import List, Dict, Any
from dotenv import load_dotenv
from groq import Groq
import networkx as nx
import matplotlib.pyplot as plt
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
    system_prompt = f"You are an helpful guide which specializes in generation of question and answer from context given to you. You are given a text and you have to generate a list of important questions and answers which is only from from within the given text (Do not put anything from outside the given context) in JSON format."
    prompt = f"Generate a list of important questions and answers in JSON format from the following text: {text}. Remember to generate questions with one word answers only and make the answers one word."
    max_attempts = 8
    for attempt in range(max_attempts):
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt},
                ],
                model="llama3-8b-8192",
            )
        except Exception as e:
            print(f"Error: {str(e)}")  # Debugging line
            raise HTTPException(
                status_code=500, detail="Error calling language model API"
            )

        result = chat_completion.choices[0].message.content
        start_index = result.find("```") + len("```")
        end_index = result.rfind("```")
        cleaned_result = result[start_index:end_index].strip()
        cleaned_result = cleaned_result.replace('\\"', '"')
        cleaned_result = cleaned_result.replace("\n", "")
        # print(cleaned_result)
        # print("----")
        try:
            flashcards = json.loads(cleaned_result)
            return flashcards  # Return if valid JSON
        except json.JSONDecodeError:
            print(f"Attempt {attempt + 1} failed: Invalid JSON content")

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
            {"username": request.username, "note_title": request.note_title}
        )
        if existing_flashcards:
            return {
                "message": "Flashcards retrieved successfully from DB",
                "data": existing_flashcards["flashcards"],
            }

        # Retrieve the note
        note = await note_collection.find_one(
            {"username": request.username, "note_title": request.note_title}
        )
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        # Concatenate all page contents
        content = " ".join(page["content"] for page in note.get("pages", []))

        # Process and generate flashcards
        processed_text = process_text(content)
        flashcards = generate_flashcards(processed_text)

        # Upload the flashcards to the flashcard_collection in the database
        flashcard_data = {
            "username": request.username,
            "note_title": request.note_title,
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
