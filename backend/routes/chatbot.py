from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from database import user_collection, note_collection, conversation_collection
from groq import Groq
import os

router = APIRouter()

# Initialize the Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


class ChatRequest(BaseModel):
    username: str
    project_title: str
    message: str


@router.post("/")
async def chat(request: ChatRequest) -> Dict[str, Any]:
    username = request.username
    project_title = request.project_title
    user_message = request.message

    # Retrieve the note
    note = await note_collection.find_one(
        {"username": username, "project_title": project_title}
    )
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")

    # Retrieve the conversation history
    conversation = await conversation_collection.find_one(
        {"username": username, "project_title": project_title}
    )
    if not conversation:
        conversation = {
            "username": username,
            "project_title": project_title,
            "conversation": [],
        }

    # Concatenate all page contents
    content = " ".join(page["content"] for page in note.get("pages", []))

    # Add the user's message to the conversation history
    conversation["conversation"].append({"role": "user", "content": user_message})

    # Construct the prompt with the conversation history
    conversation_history = "\n".join(
        f"{entry['role'].capitalize()}: {entry['content']}"
        for entry in conversation["conversation"]
    )
    prompt = f"{conversation_history}\nAI:"
    print(prompt)
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": "You are a helpful assistant whose main goal is to help users with their examination. You are knowledgeable and patient. For each question asked to you, you use your knowledge to provide the best possible answer. You should also ask a related question to keep the conversation going. Correct the user if they ask a question that is not related to the exam. Correct the user if they do not answer the question correctly. You should also provide proper feedback on the user's answer.\n",
            },
            {
                "role": "system",
                "content": "Your Previous Conversation:\n"
                + conversation_history
                + "\n",
            },
            {
                "role": "user",
                "content": f"Hi, I am preparing for my {project_title} exam. These are my current notes:\n{content}. Can you help me with following quetion? {user_message} Only answer from within the notes.",
            },
        ],
        model="llama3-8b-8192",
    )
    bot_response = chat_completion.choices[0].message.content.strip()

    # Add the bot's response to the conversation history
    conversation["conversation"].append({"role": "bot", "content": bot_response})

    # Update the conversation history in the database
    await conversation_collection.update_one(
        {"username": username, "project_title": project_title},
        {"$set": conversation},
        upsert=True,
    )

    return {"response": bot_response}
