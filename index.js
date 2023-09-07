const recipeNamesList = document.getElementById('recipe-names');
const recipeDetailsContent = document.getElementById('recipe-details-content');
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
const dropdownContents = document.querySelectorAll('.dropdown-content');
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
const recipeForm = document.getElementById('New Recipe');
let originalArray = [];

fetch("http://localhost:3000/foods")
  .then((res) => res.json())
  .then((data) => {
    data.forEach((recipe) => {
      const listItem = document.createElement('li');
      listItem.textContent = recipe.name;
      listItem.addEventListener('click', () => showRecipeDetails(recipe));
      recipeNamesList.appendChild(listItem);
    });
    originalArray.push(data);
    showRandomRecipe();
  })
  .catch((error) => {
    console.error('Error:', error);
  });

function showRecipeDetails(recipe) {
    
    const recipeDetailsTitle = document.querySelector('body > main > div.recipe-details > h2');
    recipeDetailsTitle.style.display = 'block';

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

    const recipeCookingMethod = document.createElement('p');
    recipeCookingMethod.textContent = recipe.cookingMethod;

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
    recipeDetailsContent.appendChild(recipeCookingMethod);
    recipeDetailsContent.appendChild(recipeCookingTime);
    recipeDetailsContent.appendChild(recipeServings);
    recipeDetailsContent.appendChild(recipeCalories);
    recipeDetailsContent.appendChild(recipePrepTime);
    recipeDetailsContent.appendChild(recipeLink);
}

dropdownToggles.forEach((toggle, index) => {
    toggle.addEventListener('click', () => {
        dropdownContents[index].classList.toggle('show');
    });
});

document.body.addEventListener('click', (event) => {
  dropdownToggles.forEach((toggle, index) => {
      const dropdownContent = dropdownContents[index];
      if (!toggle.contains(event.target) && !dropdownContent.contains(event.target)) {
          dropdownContent.classList.remove('show');
      }
  });
});

filterCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', filterRecipes);
});

function filterRecipes() {
  const selectedFilters = {};

  filterCheckboxes.forEach(checkbox => {
    if (checkbox.checked) {
      const filterType = checkbox.getAttribute('data-filter');
      const filterValue = checkbox.value;

      if (!selectedFilters[filterType]) {
        selectedFilters[filterType] = [];
      }
      selectedFilters[filterType].push(filterValue);
    }
  });

  const filteredRecipes = originalArray[0].filter(recipe => {
    let passesAllFilters = true;

    for (const filterType in selectedFilters) {
      if (selectedFilters[filterType].length > 0) {
        const filterValues = selectedFilters[filterType];

        if (filterType === 'cookingTime') {
          const cookingAndPrepTime = recipe.cookingTimeMinutes + recipe.prepTimeMinutes;
          let passesCookingTimeFilter = false;

          if (filterValues.includes('Less than 10 minutes') && cookingAndPrepTime < 10) {
            passesCookingTimeFilter = true;
          }

          if (filterValues.includes('10-30 minutes') && cookingAndPrepTime >= 10 && cookingAndPrepTime <= 30) {
            passesCookingTimeFilter = true;
          }

          if (filterValues.includes('30 minutes and up') && cookingAndPrepTime > 30) {
            passesCookingTimeFilter = true;
          }

          if (!passesCookingTimeFilter) {
            passesAllFilters = false;
            break;
          }
        } else if (filterType === 'servings') {
          const servings = recipe.servings;
          let passesServingsFilter = false;

          if (filterValues.includes('less than 5') && servings < 5) {
            passesServingsFilter = true;
          }

          if (filterValues.includes('5 to 10') && servings >= 5 && servings <= 10) {
            passesServingsFilter = true;
          }

          if (filterValues.includes('10 and up') && servings >= 10) {
            passesServingsFilter = true;
          }

          if (!passesServingsFilter) {
            passesAllFilters = false;
            break;
          }
        } else if (filterType === 'calories') {
          const calories = recipe.caloriesPerServing;
          let passesCaloriesFilter = false;

          if (filterValues.includes('Less than 100') && calories < 100) {
            passesCaloriesFilter = true;
          }

          if (filterValues.includes('100 to 500') && calories >= 100 && calories <= 500) {
            passesCaloriesFilter = true;
          }

          if (filterValues.includes('500 and up') && calories >= 500) {
            passesCaloriesFilter = true;
          }

          if (!passesCaloriesFilter) {
            passesAllFilters = false;
            break;
          }
        } else {
          if (!filterValues.includes(recipe[filterType])) {
            passesAllFilters = false;
            break;
          }
        }
      }
    }
    return passesAllFilters;
  });

  recipeNamesList.innerHTML = '';
  filteredRecipes.forEach(recipe => {
    const listItem = document.createElement('li');
    listItem.textContent = recipe.name;
    listItem.addEventListener('click', () => showRecipeDetails(recipe));
    recipeNamesList.appendChild(listItem);
  });
}

const randomRecipeButton = document.getElementById('random-recipe-button');
randomRecipeButton.addEventListener('click', showRandomRecipe);

function showRandomRecipe() {
  const recipes = originalArray[0];

  const randomIndex = Math.floor(Math.random() * recipes.length);
  const randomRecipe = recipes[randomIndex];

  showRecipeDetails(randomRecipe);
}

recipeForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const imageURL = document.getElementById('meal image').value;
  const mealCategory = document.getElementById('meal category').value;
  const cookingMethod = document.getElementById('cooking method').value;
  const cookingTime = document.getElementById('meal cook time').value;
  const mealName = document.getElementById('meal name').value;
  const prepTime = document.getElementById('meal prep time').value;
  const servings = document.getElementById('meal servings').value;
  const caloriesPerServing = document.getElementById('meal calories').value;
  const recipeLink = document.getElementById('recipe link').value;

  const newRecipe = {
    name: mealName,
    image: imageURL,
    category: mealCategory,
    cookingMethod: cookingMethod,
    cookingTimeMinutes: parseInt(cookingTime),
    prepTimeMinutes: parseInt(prepTime),
    servings: parseInt(servings),
    caloriesPerServing: parseInt(caloriesPerServing),
    recipeLink: recipeLink
  };

  originalArray.push(newRecipe);

  const listItem = document.createElement('li');
  listItem.textContent = newRecipe.name;

  listItem.addEventListener('click', () => showRecipeDetails(newRecipe));

  recipeNamesList.appendChild(listItem);

  document.getElementById('meal image').value = '';
  document.getElementById('meal category').value = '';
  document.getElementById('cooking method').value = '';
  document.getElementById('meal cook time').value = '';
  document.getElementById('meal name').value = '';
  document.getElementById('meal prep time').value = '';
  document.getElementById('meal servings').value = '';
  document.getElementById('meal calories').value = '';
  document.getElementById('recipe link').value = '';
});