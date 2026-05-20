from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from vision import detect_ingredients
from crew_runner import run_pipeline

load_dotenv()

app = FastAPI(title="Health-Aware Recipe API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate")
async def generate_plan(
    health_conditions: str = Form("None"),
    allergies: str = Form("None"),
    diet: str = Form("Vegetarian"),
    cuisine: str = Form("Any"),
    mode: str = Form("Flexible"),
    image: UploadFile = File(...)
):
    # Validate image
    if not image:
        raise HTTPException(status_code=400, detail="No image uploaded")

    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Upload an image.")

    image_bytes = await image.read()

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image file")

    # Detect ingredients (Vision Agent)
    ingredients = detect_ingredients(image_bytes)

    if not ingredients:
        raise HTTPException(status_code=500, detail="Could not detect ingredients. Try a clearer photo.")

    if ingredients.startswith("Error:"):
        raise HTTPException(status_code=500, detail=f"Vision API failed: {ingredients}")

    # Run pipeline (all other agents)
    results = run_pipeline(
        ingredients=ingredients,
        health_conditions=health_conditions,
        allergies=allergies,
        diet=diet,
        cuisine=cuisine,
        mode=mode
    )

    results["ingredients"] = ingredients

    return {
        "status": "success",
        "data": results
    }