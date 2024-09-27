from fastapi import FastAPI
from routes.test import router as test_router

# Create an instance of FastAPI
app = FastAPI()

# Include the routes
app.include_router(test_router, prefix="/", tags=["test"])


# Define a basic GET endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}

