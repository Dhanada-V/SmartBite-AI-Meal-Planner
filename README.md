# SmartBite-AI-Meal-Planner

The Health-Aware Recipe Generator is an AI-powered application that helps you create personalized, health-conscious recipes and meal plans based on the ingredients you already have. Simply snap a photo of your fridge or pantry, provide your dietary preferences, and let our multi-agent AI system do the rest!

##  Features

- **Ingredient Recognition**: Upload an image of your ingredients, and our Vision AI will automatically detect what you have available.
- **Health & Allergy Analysis**: Analyzes detected ingredients against your specific health conditions and allergies, categorizing them into Safe, Moderate, or Avoid, while suggesting healthier swaps.
- **Smart Recipe Generation**: Automatically generates exactly 3 delicious recipes tailored to your cuisine preferences using only safe ingredients.
- **Nutritional Insights**: Provides detailed macro and micro-nutritional breakdowns (Calories, Protein, Carbs, Fibre, Sodium, Glycemic Index) for every generated recipe.
- **7-Day Meal Planning**: Creates a comprehensive, balanced 7-day meal plan based on your profile and available ingredients.
- **Automated Shopping List**: Compares your generated meal plan with your current ingredients and produces a consolidated, cost-efficient shopping list for missing items.
- **Daily Wellness Tips**: Offers personalized daily health tips based on your specific dietary needs and conditions.

## Architecture & Technology Stack

This project is built using a modern, decoupled architecture:

### Backend
- **Framework**: Python with [FastAPI](https://fastapi.tiangolo.com/) for building a robust and fast REST API.
- **AI Orchestration**: [CrewAI](https://www.crewai.com/) is used to orchestrate a team of specialized AI agents working sequentially.
- **LLM Models**: Powered by Groq (`llama-3.3-70b-versatile`) for fast, intelligent reasoning and Google GenAI for Vision tasks.
- **Image Processing**: `Pillow` and `python-multipart` for handling image uploads.

### Frontend
- **Framework**: React.js bootstrapped with [Vite](https://vitejs.dev/) for a lightning-fast development experience.
- **Icons & Markdown**: Uses `lucide-react` for beautiful UI icons and `react-markdown` (with `remark-gfm`) to render the structured AI outputs beautifully.

##  The CrewAI Agents Pipeline

Our backend leverages a sophisticated pipeline of AI agents, each with a specific role:

1. **Vision Agent**: Detects ingredients from the uploaded image.
2. **Health & Nutrition Specialist**: Filters ingredients based on user health profiles.
3. **Culinary Chef**: Crafts custom recipes.
4. **Dietary Analyst**: Calculates precise nutritional values.
5. **Meal Planning Coordinator**: Structures the 7-day diet plan.
6. **Procurement Specialist**: Generates the smart shopping list.
7. **Wellness Coach**: Provides personalized health advice.

##  Getting Started

### Prerequisites

- Node.js (v18+)
- Python (3.9+)
- API Keys for Groq and Google Gemini

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend` directory and add your API keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend API will run on `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend application will be accessible at `http://localhost:5173`.

##  API Endpoints

### `POST /generate`

Main endpoint to trigger the AI pipeline.

**Form Data Parameters:**
- `health_conditions` (string)
- `allergies` (string)
- `diet` (string)
- `cuisine` (string)
- `mode` (string)
- `image` (file: image/jpeg, image/png, etc.)

## License

This project is open-source and available under the [MIT License](LICENSE).
