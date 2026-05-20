from crewai import Task


def create_tasks(agents, ingredients, health_conditions, allergies, diet, cuisine, mode):
    health_task = Task(
        description=f"""
        Analyze these ingredients: {ingredients}
        Health Conditions: {health_conditions}
        Allergies: {allergies}
        Diet Preference: {diet}
        Mode: {mode}

        Filter the ingredients and label each as:
        ✅ Safe
        ⚠️ Moderate
        ❌ Avoid

        Suggest healthier swaps for 'Avoid' or 'Moderate' items.
        Return the result clearly.
        """,
        expected_output="Categorized list of ingredients with safety labels and swap suggestions.",
        agent=agents['health_agent']
    )

    recipe_task = Task(
        description=f"""
        Based on the safe ingredients from the health analysis, generate EXACTLY 3 recipes.
        Cuisine preference: {cuisine}

        Include for each recipe:
        - Name
        - Ingredients with quantities
        - Steps
        - Cook time
        - Health suitability reason
        """,
        expected_output="3 detailed recipes using only safe ingredients.",
        agent=agents['recipe_agent'],
        context=[health_task]
    )

    nutrition_task = Task(
        description="""
        For the 3 generated recipes, provide a nutritional table.
        Format as Markdown table:
        | Recipe | Calories | Protein | Carbs | Fibre | Sodium | GI |
        """,
        expected_output="Markdown table containing nutritional values for the 3 recipes.",
        agent=agents['nutrition_agent'],
        context=[recipe_task]
    )

    meal_plan_task = Task(
        description="""
        Create a 7-day meal plan (Breakfast, Lunch, Dinner, Snack).
        Use the available safe ingredients and the generated recipes as a basis, adding generic safe meals as needed.
        """,
        expected_output="A 7-day meal plan clearly structured by day and meal type.",
        agent=agents['meal_planner_agent'],
        context=[health_task, recipe_task]
    )

    shopping_task = Task(
        description="""
        Based on the 7-day meal plan and the original ingredients available, determine what is missing.
        Generate a shopping list for missing items only.
        Format as Markdown table:
        | Item | Quantity | Category | Health Upgrade |
        """,
        expected_output="Markdown table of missing grocery items.",
        agent=agents['shopping_agent'],
        context=[meal_plan_task]
    )

    tip_task = Task(
        description=f"""
        Generate exactly 1 short daily health tip (max 2 sentences) based on the user's profile:
        Conditions: {health_conditions}, Diet: {diet}.
        """,
        expected_output="A 1-2 sentence health tip.",
        agent=agents['tip_agent'],
        context=[meal_plan_task]
    )

    return {
        'health_task': health_task,
        'recipe_task': recipe_task,
        'nutrition_task': nutrition_task,
        'meal_plan_task': meal_plan_task,
        'shopping_task': shopping_task,
        'tip_task': tip_task
    }