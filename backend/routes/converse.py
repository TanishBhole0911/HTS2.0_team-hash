from fastapi import HTTPException, APIRouter, Request
from pydantic import BaseModel
from typing import List, Dict, Any
from database import note_collection
from groq import Groq
import os

router = APIRouter()

# Initialize the Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class ConversationRequest(BaseModel):
    username: str
    project_title: str
    user_response: str = None


@router.post("/")
async def converse(request: ConversationRequest) -> Dict[str, Any]:
    try:
        # Retrieve the note
        note = await note_collection.find_one(
            {"username": request.username, "project_title": request.project_title}
        )
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        # Concatenate all page contents
        content = " ".join(page["content"] for page in note.get("pages", []))

        # Generate a question based on the content
        prompt = f"Generate a question based on the following content: {content}"
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt},
            ],
            model="llama3-8b-8192",
        )
        question = chat_completion.choices[0].message.content.strip()

        # If user response is provided, evaluate it
        if request.user_response:
            evaluation_prompt = f"Evaluate the following response: '{request.user_response}' based on the content: {content}"
            evaluation_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": evaluation_prompt},
                ],
                model="llama3-8b-8192",
            )
            evaluation = evaluation_completion.choices[0].message.content.strip()

            # Generate a follow-up question or correction
            follow_up_prompt = f"Generate a follow-up question or correction based on the evaluation: {evaluation}"
            follow_up_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": follow_up_prompt},
                ],
                model="llama3-8b-8192",
            )
            follow_up = follow_up_completion.choices[0].message.content.strip()

            return {
                "question": follow_up,
                "evaluation": evaluation,
            }

        return {
            "question": question,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
