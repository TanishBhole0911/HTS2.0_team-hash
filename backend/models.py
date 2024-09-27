from pydantic import BaseModel, EmailStr, constr
from typing import List, Optional


# Pydantic model for user login
class UserLogin(BaseModel):
    username: str
    password: str
