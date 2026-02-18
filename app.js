// ==========================
// Original Recipe Data
// ==========================

const originalRecipes = [
  { id: 1, title: "Spaghetti Bolognese", time: 45, difficulty: "medium", description: "Classic Italian pasta.", category: "dinner" },
  { id: 2, title: "Avocado Toast", time: 10, difficulty: "easy", description: "Simple healthy breakfast.", category: "breakfast" },
  { id: 3, title: "Chicken Curry", time: 60, difficulty: "hard", description: "Spicy and flavorful.", category: "dinner" },
  { id: 4, title: "Grilled Cheese", time: 15, difficulty: "easy", description: "Quick comfort food.", category: "snack" },
  { id: 5, title: "Caesar Salad", time: 20, difficulty: "easy", description: "Fresh and crunchy.", category: "lunch" },
  { id: 6, title: "Beef Steak", time: 50, difficulty: "hard", description: "Juicy grilled steak.", category: "dinner" },
  { id: 7, title: "Pancakes", time: 25, difficulty: "medium", description: "Fluffy breakfast favorite.", category: "breakfast" },
  { id: 8, title: "Vegetable Stir Fry", time: 30, difficulty: "medium", description: "Healthy mixed veggies.", category: "lunch" }
];

// ==========================
// State
// ==========================

let currentFilter = "all";
let currentSort = "none";

// ==========================
// Create Card
// ==========================

const createRecipeCard = (recipe) => {
  return `
    <div class="recipe-card" data-id="${recipe.id}">
      <h3>${recipe.title}</h3>
      <p><strong>Time:</strong> ${recipe.time} mins</p>
      <p>
        <span class="difficulty ${recipe.difficulty}">
          ${recipe.difficulty.toUpperCase()}
        </span>
      </p>
      <p>${recipe.description}</p>
    </div>
  `;
};

// ==========================
// Render
// ==========================

const renderRecipes = (recipes) => {
  const container = document.getElementById("recipe-container");

  const html = recipes
    .map(recipe => createRecipeCard(recipe))
    .join("");

  container.innerHTML = html;
};

// ==========================
// Filter Logic
// ==========================

const applyFilter = (recipes, filter) => {
  switch (filter) {
    case "easy":
    case "medium":
    case "hard":
      return recipes.filter(recipe => recipe.difficulty === filter);

    case "quick":
      return recipes.filter(recipe => recipe.time <= 30);

    default:
      return recipes;
  }
};

// ==========================
// Sort Logic
// ==========================

const applySort = (recipes, sortType) => {
  switch (sortType) {
    case "name":
      return [...recipes].sort((a, b) =>
        a.title.localeCompare(b.title)
      );

    case "time":
      return [...recipes].sort((a, b) =>
        a.time - b.time
      );

    default:
      return recipes;
  }
};

// ==========================
// Update Display
// ==========================

const updateDisplay = () => {

  let updatedRecipes = [...originalRecipes];

  updatedRecipes = applyFilter(updatedRecipes, currentFilter);
  updatedRecipes = applySort(updatedRecipes, currentSort);

  renderRecipes(updatedRecipes);

  // Console Logging for Testing
  console.log(
    `Displaying ${updatedRecipes.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`
  );
};

// ==========================
// Event Listeners
// ==========================

const filterButtons = document.querySelectorAll("[data-filter]");
const sortButtons = document.querySelectorAll("[data-sort]");

// Filter Buttons
filterButtons.forEach(button => {
  button.addEventListener("click", (event) => {

    currentFilter = event.target.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    updateDisplay();
  });
});

// Sort Buttons
sortButtons.forEach(button => {
  button.addEventListener("click", (event) => {

    currentSort = event.target.dataset.sort;

    sortButtons.forEach(btn => btn.classList.remove("active"));
    event.target.classList.add("active");

    updateDisplay();
  });
});

// Initial Load
updateDisplay();
