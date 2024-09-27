from fastapi import APIRouter, HTTPException
from models import UserLogin
from database import user_collection
from passlib.context import CryptContext
import pymongo.errors

router = APIRouter()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/")
async def login(user: UserLogin):
    try:
        # Retrieve user from the database
        existing_user = await user_collection.find_one({"username": user.username})
        if not existing_user:
            raise HTTPException(status_code=401, detail="Invalid username or password")

        # Verify the password
        if not pwd_context.verify(user.password, existing_user["password"]):
            raise HTTPException(status_code=401, detail="Invalid username or password")

        return {"message": "Login successful"}

    except pymongo.errors.PyMongoError as e:
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500, detail="An unexpected error occurred: " + str(e)
        )
