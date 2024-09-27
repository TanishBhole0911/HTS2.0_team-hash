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


# Model for saving a note
class NotePage(BaseModel):
    title: str
    page_number: int
    content: str  # Markdown content of the page


class NoteSaveRequest(BaseModel):
    username: str
    note_title: str
    pages: List[NotePage]  # List of pages to be saved


class MindmapRequest(BaseModel):
    username: str
    note_title: str
    refresh: Optional[bool] = False


class Note(BaseModel):
    content: str


class PageContentRequest(BaseModel):
    username: str
    note_title: str


class FlashcardRequest(BaseModel):
    username: str
    note_title: str
