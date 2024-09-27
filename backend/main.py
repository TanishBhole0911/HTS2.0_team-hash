from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from routes.login import router as login_router
from routes.register import router as register_router
from routes.notes import router as notes_router
from routes.mindmap import router as mindmap_router
from routes.get_user import router as get_user_router
from routes.get_notes import router as get_notes_router
from routes.flash_cards import router as flash_cards_router
from routes.converse import router as converse_router
from routes.proxy import router as proxy_router

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(login_router, prefix="/login", tags=["Login"])
app.include_router(notes_router, prefix="/notes", tags=["Notes"])
app.include_router(proxy_router, prefix="/proxy", tags=["Proxy"])
app.include_router(mindmap_router, prefix="/mindmap", tags=["Mindmap"])
app.include_router(register_router, prefix="/register", tags=["Register"])
app.include_router(get_user_router, prefix="/get_user", tags=["Get User"])
app.include_router(converse_router, prefix="/converse", tags=["Converse"])
app.include_router(get_notes_router, prefix="/get_notes", tags=["Get Notes"])
app.include_router(flash_cards_router, prefix="/flashcards", tags=["Flashcards"])


# Define a basic GET endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}
