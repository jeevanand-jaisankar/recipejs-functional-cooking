const RecipeApp = (() => {

  console.log("RecipeApp initializing...");

  // =========================
  // DATA (8 RECIPES)
  // =========================

  const recipes = [
    { id:1, title:"Spaghetti Carbonara", time:25, difficulty:"easy",
      description:"Classic creamy Italian pasta.",
      ingredients:["Spaghetti","Eggs","Pancetta","Cheese","Pepper"],
      steps:[
        "Boil water",
        { text:"Prepare sauce", substeps:["Beat eggs","Grate cheese",{text:"Season",substeps:["Add pepper","Mix well"]}]},
        "Cook pancetta",
        "Combine and serve"
      ]
    },
    { id:2, title:"Avocado Toast", time:10, difficulty:"easy",
      description:"Healthy quick breakfast.",
      ingredients:["Bread","Avocado","Salt","Pepper","Lemon"],
      steps:["Toast bread","Mash avocado","Spread and season"]
    },
    { id:3, title:"Chicken Curry", time:45, difficulty:"medium",
      description:"Spicy and flavorful curry.",
      ingredients:["Chicken","Onion","Tomatoes","Spices","Cream"],
      steps:["Saute onions","Add spices","Cook chicken","Simmer with cream"]
    },
    { id:4, title:"Beef Wellington", time:90, difficulty:"hard",
      description:"Classic gourmet dish.",
      ingredients:["Beef","Mushrooms","Puff pastry","Egg yolk"],
      steps:["Prepare beef","Wrap with pastry","Bake until golden"]
    },
    { id:5, title:"Greek Salad", time:15, difficulty:"easy",
      description:"Fresh Mediterranean salad.",
      ingredients:["Tomatoes","Cucumber","Feta","Olives","Olive oil"],
      steps:["Chop vegetables","Mix ingredients","Drizzle olive oil"]
    },
    { id:6, title:"Pancakes", time:20, difficulty:"easy",
      description:"Fluffy breakfast pancakes.",
      ingredients:["Flour","Milk","Eggs","Sugar","Baking powder"],
      steps:["Mix ingredients","Pour batter","Flip and serve"]
    },
    { id:7, title:"Lasagna", time:60, difficulty:"medium",
      description:"Layered pasta with meat sauce.",
      ingredients:["Lasagna sheets","Beef","Cheese","Tomato sauce"],
      steps:["Cook beef","Layer ingredients","Bake"]
    },
    { id:8, title:"Chocolate Souffle", time:50, difficulty:"hard",
      description:"Light and airy dessert.",
      ingredients:["Chocolate","Eggs","Sugar","Butter"],
      steps:["Melt chocolate","Whisk eggs","Fold gently","Bake carefully"]
    }
  ];

  // =========================
  // STATE
  // =========================

  let currentFilter = "all";
  let currentSort = "none";
  const expandedSections = new Set();

  const recipeContainer = document.querySelector("#recipe-container");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const sortButtons = document.querySelectorAll(".sort-btn");

  // =========================
  // RECURSION
  // =========================

  const renderSteps = (steps, level=0) => {
    const listClass = level === 0 ? "steps-list" : "substeps-list";
    let html = `<ol class="${listClass}">`;
    steps.forEach(step=>{
      if(typeof step === "string"){
        html += `<li>${step}</li>`;
      } else {
        html += `<li>${step.text}`;
        if(step.substeps){
          html += renderSteps(step.substeps, level+1);
        }
        html += `</li>`;
      }
    });
    html += "</ol>";
    return html;
  };

  // =========================
  // CARD CREATION
  // =========================

  const createRecipeCard = (recipe) => {

    const ingKey = `${recipe.id}-ingredients`;
    const stepKey = `${recipe.id}-steps`;

    const ingVisible = expandedSections.has(ingKey) ? "visible" : "";
    const stepVisible = expandedSections.has(stepKey) ? "visible" : "";

    return `
      <div class="recipe-card">
        <h3>${recipe.title}</h3>
        <p><strong>Time:</strong> ${recipe.time} min</p>
        <p class="difficulty ${recipe.difficulty}">${recipe.difficulty}</p>
        <p>${recipe.description}</p>

        <div class="card-actions">
          <button class="toggle-btn" data-id="${recipe.id}" data-type="ingredients">
            ${ingVisible ? "Hide Ingredients" : "Show Ingredients"}
          </button>
          <button class="toggle-btn" data-id="${recipe.id}" data-type="steps">
            ${stepVisible ? "Hide Steps" : "Show Steps"}
          </button>
        </div>

        <div class="ingredients-container ${ingVisible}" data-id="${recipe.id}">
          <ul>${recipe.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
        </div>

        <div class="steps-container ${stepVisible}" data-id="${recipe.id}">
          ${renderSteps(recipe.steps)}
        </div>
      </div>
    `;
  };

  // =========================
  // FILTER + SORT
  // =========================

  const applyFilter = (data)=>{
    if(currentFilter==="quick") return data.filter(r=>r.time<=30);
    if(currentFilter==="all") return data;
    return data.filter(r=>r.difficulty===currentFilter);
  };

  const applySort = (data)=>{
    if(currentSort==="name") return [...data].sort((a,b)=>a.title.localeCompare(b.title));
    if(currentSort==="time") return [...data].sort((a,b)=>a.time-b.time);
    return data;
  };

  const updateDisplay = ()=>{
    let updated = applyFilter(recipes);
    updated = applySort(updated);
    recipeContainer.innerHTML = updated.map(createRecipeCard).join("");
    console.log(`Displaying ${updated.length} recipes (Filter:${currentFilter}, Sort:${currentSort})`);
  };

  // =========================
  // EVENTS
  // =========================

  recipeContainer.addEventListener("click", e=>{
    if(!e.target.classList.contains("toggle-btn")) return;

    const id = e.target.dataset.id;
    const type = e.target.dataset.type;
    const key = `${id}-${type}`;

    if(expandedSections.has(key)){
      expandedSections.delete(key);
    } else {
      expandedSections.add(key);
    }

    updateDisplay();
  });

  filterButtons.forEach(btn=>{
    btn.addEventListener("click", e=>{
      filterButtons.forEach(b=>b.classList.remove("active"));
      e.target.classList.add("active");
      currentFilter = e.target.dataset.filter;
      updateDisplay();
    });
  });

  sortButtons.forEach(btn=>{
    btn.addEventListener("click", e=>{
      sortButtons.forEach(b=>b.classList.remove("active"));
      e.target.classList.add("active");
      currentSort = e.target.dataset.sort;
      updateDisplay();
    });
  });

  const init = ()=>{
    updateDisplay();
    console.log("Event listeners attached!");
    console.log("RecipeApp ready!");
  };

  return { init, updateDisplay };

})();

RecipeApp.init();
