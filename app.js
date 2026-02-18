(() => {

  // =========================
  // DATA
  // =========================
  const recipes = [
    { id: 1, title: "Paneer Butter Masala", type: "veg", time: 30, rating: 4.5, ingredients: ["paneer", "butter", "tomato"], steps: ["Cook gravy", "Add paneer"] },
    { id: 2, title: "Chicken Curry", type: "non-veg", time: 45, rating: 4.7, ingredients: ["chicken", "spices"], steps: ["Cook chicken", "Add masala"] },
    { id: 3, title: "Veg Biryani", type: "veg", time: 40, rating: 4.2, ingredients: ["rice", "vegetables"], steps: ["Cook rice", "Mix veggies"] },
    { id: 4, title: "Grilled Fish", type: "non-veg", time: 25, rating: 4.3, ingredients: ["fish", "lemon"], steps: ["Marinate", "Grill"] },
    { id: 5, title: "Dal Tadka", type: "veg", time: 20, rating: 4.1, ingredients: ["dal", "spices"], steps: ["Boil dal", "Add tadka"] },
    { id: 6, title: "Mutton Curry", type: "non-veg", time: 60, rating: 4.8, ingredients: ["mutton", "spices"], steps: ["Cook mutton", "Simmer"] },
    { id: 7, title: "Pasta Alfredo", type: "veg", time: 35, rating: 4.4, ingredients: ["pasta", "cream"], steps: ["Boil pasta", "Add sauce"] },
    { id: 8, title: "Omelette", type: "non-veg", time: 10, rating: 4.0, ingredients: ["eggs", "salt"], steps: ["Beat eggs", "Cook on pan"] }
  ];

  // =========================
  // STATE
  // =========================
  let currentFilter = "all";
  let currentSort = "default";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
  let debounceTimer;

  // =========================
  // DOM
  // =========================
  const recipeContainer = document.getElementById("recipe-container");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const sortButtons = document.querySelectorAll("[data-sort]");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  const recipeCounter = document.getElementById("recipe-counter");

  // =========================
  // FUNCTIONS
  // =========================

  const saveFavorites = () => {
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
  };

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      favorites = favorites.filter(fav => fav !== id);
    } else {
      favorites.push(id);
    }
    saveFavorites();
    updateDisplay();
  };

  const applySearch = (recipes) => {
    if (!searchQuery) return recipes;

    const query = searchQuery.toLowerCase();

    return recipes.filter(recipe => {
      const titleMatch = recipe.title.toLowerCase().includes(query);
      const ingredientMatch = recipe.ingredients.some(ing =>
        ing.toLowerCase().includes(query)
      );
      return titleMatch || ingredientMatch;
    });
  };

  const applyFilter = (recipes) => {
    switch (currentFilter) {
      case "veg":
      case "non-veg":
        return recipes.filter(r => r.type === currentFilter);
      case "favorites":
        return recipes.filter(r => favorites.includes(r.id));
      default:
        return recipes;
    }
  };

  const applySort = (recipes) => {
    const sorted = [...recipes];
    switch (currentSort) {
      case "time":
        return sorted.sort((a, b) => a.time - b.time);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  };

  const updateCounter = (visibleCount) => {
    recipeCounter.textContent = `Showing ${visibleCount} of ${recipes.length} recipes`;
  };

  const createRecipeCard = (recipe) => {
    const isFavorite = favorites.includes(recipe.id);

    return `
      <div class="recipe-card">
        <span class="favorite-btn ${isFavorite ? "active" : ""}" 
          data-id="${recipe.id}">❤️</span>
        <h3>${recipe.title}</h3>
        <p>Time: ${recipe.time} mins</p>
        <p>Rating: ${recipe.rating} ⭐</p>

        <div class="toggle-section" onclick="this.nextElementSibling.classList.toggle('hidden')">
          Ingredients
        </div>
        <ul class="hidden">
          ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}
        </ul>

        <div class="toggle-section" onclick="this.nextElementSibling.classList.toggle('hidden')">
          Steps
        </div>
        <ul class="hidden">
          ${recipe.steps.map(step => `<li>${step}</li>`).join("")}
        </ul>
      </div>
    `;
  };

  const updateDisplay = () => {
    let result = applySearch(recipes);
    result = applyFilter(result);
    result = applySort(result);

    updateCounter(result.length);

    recipeContainer.innerHTML = result.map(createRecipeCard).join("");
  };

  // =========================
  // EVENT LISTENERS
  // =========================

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      updateDisplay();
    });
  });

  sortButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      currentSort = btn.dataset.sort;
      updateDisplay();
    });
  });

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);

    if (searchInput.value.trim() !== "") {
      clearSearchBtn.classList.remove("hidden");
    } else {
      clearSearchBtn.classList.add("hidden");
    }

    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value.trim();
      updateDisplay();
    }, 300);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.classList.add("hidden");
    updateDisplay();
  });

  recipeContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("favorite-btn")) {
      const id = Number(e.target.dataset.id);
      toggleFavorite(id);
    }
  });

  // =========================
  // INIT
  // =========================
  updateDisplay();

})();
