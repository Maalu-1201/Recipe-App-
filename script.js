const searchBox = document.querySelector('.searchBox');
const searchbtn = document.querySelector('.searchbtn');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseBtn = document.querySelector('.recipe-close-btn');

// Function to get recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipes...</h2>";

    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeContainer.innerHTML = "";

    if (!response.meals) {
        recipeContainer.innerHTML = "<h3>No recipes found!</h3>";
        return;
    }

    response.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe');

        recipeDiv.innerHTML = `
            <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span></p>
            <p>Belongs to <span>${meal.strCategory}</span> Category</p>
        `;

        const button = document.createElement('button');
        button.textContent = "View Recipe";
        recipeDiv.appendChild(button);

        // Popup open
        button.addEventListener('click', () => {
            openRecipePopup(meal);
        });

        recipeContainer.appendChild(recipeDiv);
    });
};

// FIXED INGREDIENT FUNCTION
const fetchIngredients = (meal) => {
    let ingredientsList = "";

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        } else {
            break;
        }
    }

    return ingredientsList;
};

// Popup Function
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        
        <div>
            <h3>Instructions:</h3>
            <p class="recipeInstructions">${meal.strInstructions}</p>
        </div>
    `;

    recipeDetailsContent.parentElement.style.display = "block";
};

// Close Popup
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

// Search Button
searchbtn.addEventListener('click', (e) => {
    e.preventDefault();
    
    const query = searchBox.value.trim();
    if (query === "") {
        recipeContainer.innerHTML = "<h3>Please enter a recipe name!</h3>";
        return;
    }

    fetchRecipes(query);
});
