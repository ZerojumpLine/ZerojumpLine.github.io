// Custom category toggle functionality
// This file ensures the category toggle works with the enhanced styling

document.addEventListener('DOMContentLoaded', function() {
  // Wait for the main quarto-listing.js to load and then override the category click handlers
  setTimeout(function() {
    // Attach click handlers to filter categories with toggle functionality
    const categoryEls = document.querySelectorAll(
      ".quarto-listing-category .category"
    );

    for (const categoryEl of categoryEls) {
      // Remove any existing click handlers
      categoryEl.onclick = null;
      
      // category needs to support non ASCII characters
      const category = decodeURIComponent(
        atob(categoryEl.getAttribute("data-category"))
      );
      
      categoryEl.onclick = () => {
        // Check if this category is already active
        const isActive = categoryEl.classList.contains("active");
        
        if (isActive) {
          // If already active, deactivate it (remove filter)
          activateCategory("");
          setCategoryHash("");
        } else {
          // If not active, activate it (apply filter)
          activateCategory(category);
          setCategoryHash(category);
        }
      };
    }

    // Attach click handlers to individual category tags on listing items
    const individualCategoryEls = document.querySelectorAll(
      ".listing-categories .listing-category"
    );

    for (const categoryEl of individualCategoryEls) {
      // Remove any existing click handlers
      categoryEl.onclick = null;
      
      // Get the category text from the element
      const category = categoryEl.textContent.trim();
      
      categoryEl.onclick = (event) => {
        // Prevent the default link behavior if it's a link
        event.preventDefault();
        event.stopPropagation();
        
        // Check if this category is already active in the filter
        const filterCategoryEl = document.querySelector(
          `.quarto-listing-category .category[data-category='${btoa(
            encodeURIComponent(category)
          )}']`
        );
        
        if (filterCategoryEl && filterCategoryEl.classList.contains("active")) {
          // If already active, deactivate it (remove filter)
          activateCategory("");
          setCategoryHash("");
        } else {
          // If not active, activate it (apply filter)
          activateCategory(category);
          setCategoryHash(category);
        }
      };
    }

    // Attach a click handler to the category title
    const categoryTitleEls = document.querySelectorAll(
      ".quarto-listing-category-title"
    );
    for (const categoryTitleEl of categoryTitleEls) {
      categoryTitleEl.onclick = () => {
        activateCategory("");
        setCategoryHash("");
      };
    }
  }, 100); // Small delay to ensure main script has loaded
});

// Override the activateCategory function to handle empty category properly
function activateCategory(category) {
  // Deactivate existing categories in filter
  const activeFilterEls = document.querySelectorAll(
    ".quarto-listing-category .category.active"
  );
  for (const activeEl of activeFilterEls) {
    activeEl.classList.remove("active");
  }

  // Deactivate existing individual category tags
  const activeIndividualEls = document.querySelectorAll(
    ".listing-categories .listing-category.active"
  );
  for (const activeEl of activeIndividualEls) {
    activeEl.classList.remove("active");
  }

  // Only activate this category if it's not empty
  if (category !== "") {
    // Activate filter category
    const filterCategoryEl = document.querySelector(
      `.quarto-listing-category .category[data-category='${btoa(
        encodeURIComponent(category)
      )}']`
    );
    if (filterCategoryEl) {
      filterCategoryEl.classList.add("active");
    }

    // Activate individual category tags that match
    const individualCategoryEls = document.querySelectorAll(
      ".listing-categories .listing-category"
    );
    for (const individualEl of individualCategoryEls) {
      if (individualEl.textContent.trim() === category) {
        individualEl.classList.add("active");
      }
    }
  }

  // Filter the listings to this category
  filterListingCategory(category);
} 