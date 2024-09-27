from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from routes.login import router as login_router
from routes.register import router as register_router

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
app.include_router(register_router, prefix="/register", tags=["Register"])

# Define a basic GET endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}
