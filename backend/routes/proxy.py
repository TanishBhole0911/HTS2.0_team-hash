from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
import requests

router = APIRouter()


@router.post("/")
async def proxy(request: Request):
    # Get the 'url' query parameter from the request
    url = request.query_params.get("url")

    if not url:
        raise HTTPException(status_code=400, detail="URL parameter is required")

    try:
        # Fetch the webpage content using requests
        response = requests.get(url)
        response.raise_for_status()  # Raise an error if the request failed
        return response.text  # Return the raw HTML of the page
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=str(e))
