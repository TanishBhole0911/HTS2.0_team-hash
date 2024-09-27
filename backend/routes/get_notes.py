from fastapi import APIRouter, HTTPException
from models import PageContentRequest
from database import user_collection, note_collection
from pymongo import ReturnDocument

router = APIRouter()


@router.post("/")
async def get_page_content(request: PageContentRequest):
    try:
        # Check if user exists
        user_exists = await user_collection.find_one({"username": request.username})
        if not user_exists:
            raise HTTPException(status_code=404, detail="User not found")

        # Retrieve the note
        note = await note_collection.find_one(
            {"username": request.username, "note_title": request.note_title}
        )
        if not note:
            raise HTTPException(status_code=404, detail="Note not found")

        # Return all pages
        return {"pages": note.get("pages", [])}

    except Exception as e:
        print(f"\033[91m{e}\033[0m")
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
