from fastapi import FastAPI

# Create an instance of FastAPI
app = FastAPI()

# Define a basic GET endpoint
@app.get("/")
async def read_root():
    return {"message": "Welcome to FastAPI!"}

