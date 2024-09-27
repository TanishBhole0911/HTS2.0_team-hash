import json
import os
from fastapi import HTTPException, APIRouter
from pydantic import BaseModel
from models import MindmapRequest
from typing import List, Dict, Any
from dotenv import load_dotenv
from groq import Groq
import networkx as nx
import matplotlib.pyplot as plt
from database import user_collection, note_collection, mindmap_collection

router = APIRouter()

load_dotenv()

# Retrieve the Groq API key from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize the Groq client
client = Groq(api_key=GROQ_API_KEY)


def process_text(text: str) -> str:
    # Here you could add any text preprocessing steps
    return text


def generate_mindmap(text: str) -> str:
    example = """{  "nodes": [    {      "id": "Qalaherriaq",      "type": "person",      "name": "Qalaherriaq"    },    {      "id": "Erasmus-Augustine-Kallihirua",      "type": "name",      "name": "Erasmus Augustine Kallihirua"    },    {      "id": "HMS-Assistance",      "type": "vehicle",      "name": "HMS Assistance"    },    {      "id": "Franklin's-Expedition",      "type": "event",      "name": "Franklin's lost expedition"    },    {      "id": "Wolstenholme-Fjord",      "type": "location",      "name": "Wolstenholme Fjord"    },    {      "id": "Society-for-Promoting-Christian-Knowledge",      "type": "organization",      "name": "Society for Promoting Christian Knowledge"    },    {      "id": "St-Augustine's-College",      "type": "school",      "name": "St Augustine's College"    },    {      "id": "Edward-Feild",      "type": "person",      "name": "Edward Feild"    },    {      "id": "Labrador-Inuit",      "type": "group",      "name": "Labrador Inuit"    },    {      "id": "St-John's",      "type": "location",      "name": "St. John's"    }  ],  "edges": [    {      "from": "Qalaherriaq",      "to": "Erasmus-Augustine-Kallihirua",      "label": "Name"    },    {      "from": "Qalaherriaq",      "to": "HMS-Assistance",      "label": "Taken aboard"    },    {      "from": "HMS-Assistance",      "to": "Franklin's-Expedition",      "label": "Search for"    },    {      "from": "HMS-Assistance",      "to": "Wolstenholme-Fjord",      "label": "Rumors of massacre"    },    {      "from": "Qalaherriaq",      "to": "Society-for-Promoting-Christian-Knowledge",      "label": "Custody"    },    {      "from": "Qalaherriaq",      "to": "St-Augustine's-College",      "label": "Studied"    },    {      "from": "Qalaherriaq",      "to": "Edward-Feild",      "label": "Tasked by"    },    {      "from": "Qalaherriaq",      "to": "Labrador-Inuit",      "label": "Mission"    },    {      "from": "Qalaherriaq",      "to": "St-John's",      "label": "Died"    }  ]}"""
    prompt = f"Generate a hierarchical structure for the following text as a JSON object with 'nodes' and 'edges' example: {example} generate for following: {text}"

    max_attempts = 3
    for attempt in range(max_attempts):
        try:
            chat_completion = client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt},
                ],
                model="llama3-8b-8192",
            )
        except Exception as e:
            print(f"Error: {str(e)}")
            raise HTTPException(
                status_code=500, detail="Error calling language model API"
            )

        result = chat_completion.choices[0].message.content
        start_index = result.find("```") + len("```")
        end_index = result.rfind("```")
        cleaned_result = result[start_index:end_index].strip()
        cleaned_result = cleaned_result.replace('\\"', '"')
        cleaned_result = cleaned_result.replace("\n", "")

        try:
            json.loads(cleaned_result)
            return cleaned_result  # Return if valid JSON
        except json.JSONDecodeError:
            print(f"Attempt {attempt + 1} failed: Invalid JSON content")

    raise HTTPException(
        status_code=500, detail="Invalid JSON content in API response after 3 attempts"
    )


def convert_to_gojs_format(mindmap_content: str) -> Dict[str, Any]:
    try:
        mindmap_data = json.loads(mindmap_content)
        gojs_data = {
            "nodeDataArray": [
                {"key": node["id"], "category": node["type"], "text": node["name"]}
                for node in mindmap_data["nodes"]
            ],
            "linkDataArray": [
                {"from": edge["from"], "to": edge["to"], "text": edge["label"]}
                for edge in mindmap_data["edges"]
            ],
        }
        return gojs_data
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error converting to GoJS format: {str(e)}"
        )


@router.post("/")
async def create_mindmap(request: MindmapRequest) -> Dict[str, Any]:
    try:
        # Check if user exists
        user_exists = await user_collection.find_one({"username": request.username})
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if mindmap already exists in the mindmap_collection
        existing_mindmap = await mindmap_collection.find_one(
            {"username": request.username, "note_title": request.note_title}
        )
        if existing_mindmap and request.refresh == False:
            return {
                "message": "Mindmap retrieved successfully from DB",
                "data": existing_mindmap["mindmap"],
            }

        # Retrieve the note
        note = await note_collection.find_one(
            {"username": request.username, "note_title": request.note_title}
        )
        # print(note)
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        # Concatenate all page contents
        content = " ".join(page["content"] for page in note.get("pages", []))

        # Process and generate mindmap
        processed_text = process_text(content)
        mindmap_content = generate_mindmap(processed_text)

        # Convert mindmap to GoJS format
        gojs_mindmap = convert_to_gojs_format(mindmap_content)

        # Upload the mindmap to the mindmap_collection in the database
        mindmap_data = {
            "username": request.username,
            "note_title": request.note_title,
            "mindmap": gojs_mindmap,
        }
        await mindmap_collection.insert_one(mindmap_data)

        return {
            "message": "Mindmap created successfully and uploaded to DB",
            "data": gojs_mindmap,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
