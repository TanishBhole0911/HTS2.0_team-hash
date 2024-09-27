from fastapi import APIRouter, HTTPException
from models import PageContentRequest
from database import user_collection, note_collection
from pymongo import ReturnDocument

router = APIRouter()


@router.get("/")
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

        # Find the page content
        for page in note.get("pages", []):
            if page["page_number"] == request.page_number:
                return {"content": page["content"]}

        raise HTTPException(status_code=404, detail="Page not found")

    except Exception as e:
        print(f"\033[91m{e}\033[0m")
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
