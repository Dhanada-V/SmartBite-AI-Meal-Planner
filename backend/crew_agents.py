import os
from crewai import Agent
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv(), override=True)

LLM_MODEL = "groq/llama-3.3-70b-versatile"

AGENT_DEFAULTS = {
    "verbose": True,
    "allow_delegation": False,
    "llm": LLM_MODEL
}

def create_agents():
    health_agent = Agent(
        role='Health & Nutrition Specialist',
        goal='Filter ingredients based on health conditions, allergies, and diet.',
        backstory='Expert nutritionist who categorizes food safety for specific health profiles.',
        **AGENT_DEFAULTS
    )

    recipe_agent = Agent(
        role='Culinary Chef',
        goal='Generate safe, delicious recipes based on filtered ingredients.',
        backstory='Master chef specializing in tailored recipes.',
        **AGENT_DEFAULTS
    )

    nutrition_agent = Agent(
        role='Dietary Analyst',
        goal='Calculate nutritional values and assess dietary balance.',
        backstory='Clinical dietitian with expertise in macro and micronutrient analysis.',
        **AGENT_DEFAULTS
    )

    meal_planner_agent = Agent(
        role='Meal Planning Coordinator',
        goal='Create a balanced 7-day meal plan using approved recipes.',
        backstory='Certified meal planner with expertise in weekly diet structuring.',
        **AGENT_DEFAULTS
    )

    shopping_agent = Agent(
        role='Procurement Specialist',
        goal='Generate a consolidated, cost-efficient shopping list.',
        backstory='Smart grocery planner skilled at eliminating redundancy across recipes.',
        **AGENT_DEFAULTS
    )

    tip_agent = Agent(
        role='Wellness Coach',
        goal='Provide a personalized daily health tip based on user profile.',
        backstory='Certified health advisor with a focus on sustainable lifestyle habits.',
        **AGENT_DEFAULTS
    )

    return {
        'health_agent': health_agent,
        'recipe_agent': recipe_agent,
        'nutrition_agent': nutrition_agent,
        'meal_planner_agent': meal_planner_agent,
        'shopping_agent': shopping_agent,
        'tip_agent': tip_agent
    }