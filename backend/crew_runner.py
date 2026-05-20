from crewai import Crew
from crew_agents import create_agents
from tasks import create_tasks


def run_pipeline(ingredients, health_conditions, allergies, diet, cuisine, mode):
    agents = create_agents()
    tasks = create_tasks(
        agents,
        ingredients,
        health_conditions,
        allergies,
        diet,
        cuisine,
        mode
    )

    crew = Crew(
        agents=[
            agents['health_agent'],
            agents['recipe_agent'],
            agents['nutrition_agent'],
            agents['meal_planner_agent'],
            agents['shopping_agent'],
            agents['tip_agent']
        ],
        tasks=[
            tasks['health_task'],
            tasks['recipe_task'],
            tasks['nutrition_task'],
            tasks['meal_plan_task'],
            tasks['shopping_task'],
            tasks['tip_task']
        ],
        verbose=True
    )
    
    crew.kickoff()

    def get_output(task_name):
        out = tasks[task_name].output
        if hasattr(out, 'raw'):
            return out.raw.strip()
        return str(out).strip()

    return {
        "health": get_output('health_task'),
        "recipes": get_output('recipe_task'),
        "nutrition": get_output('nutrition_task'),
        "meal_plan": get_output('meal_plan_task'),
        "shopping": get_output('shopping_task'),
        "tip": get_output('tip_task')
    }