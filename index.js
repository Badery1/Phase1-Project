const recipeNamesList = document.getElementById('recipe-names');
const recipeDetailsContent = document.getElementById('recipe-details-content');

fetch("http://localhost:3000/foods")
    .then((res) => res.json())
    .then((data) => {
        data.forEach((recipe) => {
            const listItem = document.createElement('li');
            listItem.textContent = recipe.name;
            listItem.addEventListener('click', () => showRecipeDetails(recipe));
            recipeNamesList.appendChild(listItem);
        });
    })
    .catch((error) => {
        console.error('Error:', error);
    });

    function showRecipeDetails(recipe) {
        recipeDetailsContent.innerHTML = "";

        const recipeName = document.createElement('h3');
        recipeName.textContent = recipe.name;

        const recipeImage = document.createElement('img');
        recipeImage.src = recipe.image;
        recipeImage.alt = recipe.name;

        const recipeCategory = document.createElement('p');
        recipeCategory.textContent = recipe.category;

        const recipeCookingTime = document.createElement('p');
        recipeCookingTime.textContent = "Cooking Time " + recipe.cookingTimeMinutes + " minutes.";

        const recipePrepTime = document.createElement('p');
        recipePrepTime.textContent = "Prep Time " + recipe.prepTimeMinutes + " minutes.";

        const recipeServings = document.createElement('p');
        recipeServings.textContent = recipe.servings + " servings.";

        const recipeCalories = document.createElement('p');
        recipeCalories.textContent = recipe.caloriesPerServing + " calories per serving.";

        const recipeLink = document.createElement('a');
        recipeLink.textContent = "Link to full recipe!";
        recipeLink.href = recipe.recipeLink;
        recipeLink.target = "_blank";
 
        recipeDetailsContent.appendChild(recipeImage);
        recipeDetailsContent.appendChild(recipeName);
        recipeDetailsContent.appendChild(recipeCategory);
        recipeDetailsContent.appendChild(recipeCookingTime);
        recipeDetailsContent.appendChild(recipeServings);
        recipeDetailsContent.appendChild(recipeCalories);
        recipeDetailsContent.appendChild(recipePrepTime);
        recipeDetailsContent.appendChild(recipeLink);
    }