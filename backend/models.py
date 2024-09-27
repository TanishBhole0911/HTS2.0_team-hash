from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional


# Pydantic model for user login
class UserLogin(BaseModel):
    username: str
    password: str

# Pydantic model for user registration
class User(BaseModel):
    username: str
    email: EmailStr
    password: str