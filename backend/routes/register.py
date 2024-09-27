from fastapi import APIRouter, HTTPException
from models import User
from database import user_collection
from passlib.context import CryptContext
import pymongo.errors

router = APIRouter()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/")
async def register(user: User):
    try:
        # Check if username or email already exists
        existing_user = await user_collection.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
        if existing_user:
            if existing_user['username'] == user.username:
                raise HTTPException(status_code=409, detail="Username already exists")
            if existing_user['email'] == user.email:
                raise HTTPException(status_code=409, detail="Email already exists")

        # Hash the password before saving
        hashed_password = pwd_context.hash(user.password)
        user_dict = user.dict()
        user_dict['password'] = hashed_password

        # Save new user to the database
        result = await user_collection.insert_one(user_dict)
        if not result.inserted_id:
            raise HTTPException(status_code=500, detail="User registration failed")

        return {"message": "User registered successfully"}

    except pymongo.errors.PyMongoError as e:
        raise HTTPException(status_code=500, detail="Database error: " + str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="An unexpected error occurred: " + str(e))
