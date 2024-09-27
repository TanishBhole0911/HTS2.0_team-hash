from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import user_collection, note_collection

router = APIRouter()


@router.get("/{username}")
async def get_user_info(username: str):
    try:
        # Check if user exists
        user = await user_collection.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Fetch all notes associated with the user
        notes = await note_collection.find({"username": username}).to_list(length=None)

        # Extract project titles and file names
        projects = {}
        for note in notes:
            project_title = note["project_title"]
            file_names = [page["note_title"] for page in note.get("pages", [])]
            projects[project_title] = file_names

        return {"username": username, "projects": projects}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {str(e)}"
        )
