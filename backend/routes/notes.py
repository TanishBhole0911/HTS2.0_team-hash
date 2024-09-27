from fastapi import APIRouter, HTTPException
from models import NoteSaveRequest
from database import user_collection, note_collection
from pymongo import ReturnDocument

router = APIRouter()

@router.post("/save_note")
async def save_note(note_request: NoteSaveRequest):
    try:
        # Check if user exists
        user_exists = await user_collection.find_one({"username": note_request.username})
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")

        # Check if note already exists, and append/update pages accordingly
        existing_note = await note_collection.find_one_and_update(
            {"username": note_request.username, "project_title": note_request.project_title},
            {"$setOnInsert": {"username": note_request.username, "project_title": note_request.project_title}},
            upsert=True,
            return_document=ReturnDocument.AFTER
        )

        # Check if pages array exists, if not, initialize it
        if "pages" not in existing_note:
            existing_note["pages"] = []

        # Append or update pages in the note
        for page in note_request.pages:
            # Check if page number exists, then update it
            for existing_page in existing_note["pages"]:
                if existing_page["page_number"] == page.page_number:
                    existing_page["content"] = page.content
                    break
            else:
                # If page number does not exist, append it
                existing_note["pages"].append(page.dict())

        # Save the updated note
        result = await note_collection.find_one_and_update(
            {"username": note_request.username, "project_title": note_request.project_title},
            {"$set": {"pages": existing_note["pages"]}},
            return_document=ReturnDocument.AFTER
        )

        if not result:
            raise HTTPException(status_code=500, detail="Failed to save the note")

        return {"message": "Note saved successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
