// Custom category toggle functionality
// This file ensures the category toggle works with the enhanced styling

// Global flag to track if our custom handlers are set up
window.customCategoryHandlersSetup = false;

// Override the quartoListingCategory function to use our custom URL encoding
window.quartoListingCategory = function(category) {
  console.log('Custom quartoListingCategory called with:', category);
  // category is URI encoded in EJS template for UTF-8 support
  const decodedCategory = decodeURIComponent(atob(category));
  console.log('Decoded category:', decodedCategory);
  
  if (window.categoriesLoaded) {
    window.activateCategory(decodedCategory);
    window.setCategoryHash(decodedCategory);
  }
};

// Override the global Quarto functions immediately to ensure they're available before any other scripts
window.setCategoryHash = function(category) {
  console.log('Custom setCategoryHash called with:', category);
  if (category === "") {
    // Remove category from hash
    const currentHash = window.getHash() || {};
    delete currentHash.category;
    window.setHash(currentHash);
  } else {
    // Add category to hash with proper URL encoding
    const currentHash = window.getHash() || {};
    currentHash.category = encodeURIComponent(category);
    console.log('Setting category hash with encoded value:', encodeURIComponent(category));
    window.setHash(currentHash);
  }
};

// Override the getHash function to properly handle URL encoding
window.getHash = function() {
  // Hashes are of the form
  // #name=value&name1=value1&name2=value2
  const currentUrl = new URL(window.location);
  const hashRaw = currentUrl.hash ? currentUrl.hash.slice(1) : undefined;
  console.log('Custom getHash called, raw hash:', hashRaw);
  return window.parseHash(hashRaw);
};

// Override the parseHash function to properly decode URL encoded values
window.parseHash = function(hash) {
  console.log('Custom parseHash called with:', hash);
  if (!hash) {
    return undefined;
  }
  const hasValuesStrs = hash.split("&");
  const hashValues = hasValuesStrs
    .map((hashValueStr) => {
      const vals = hashValueStr.split("=");
      if (vals.length === 2) {
        return { name: vals[0], value: vals[1] };
      } else {
        return undefined;
      }
    })
    .filter((value) => {
      return value !== undefined;
    });

  const hashObj = {};
  hashValues.forEach((hashValue) => {
    try {
      hashObj[hashValue.name] = decodeURIComponent(hashValue.value);
    } catch (error) {
      console.warn('Failed to decode hash value:', hashValue.value, error);
      hashObj[hashValue.name] = hashValue.value;
    }
  });
  console.log('Parsed hash object:', hashObj);
  return hashObj;
};

// Override the makeHash function to properly URL encode values
window.makeHash = function(obj) {
  console.log('Custom makeHash called with:', obj);
  const result = Object.keys(obj)
    .map((key) => {
      return `${key}=${encodeURIComponent(obj[key])}`;
    })
    .join("&");
  console.log('Generated hash:', result);
  return result;
};

// Override the setHash function to use our custom makeHash
window.setHash = function(obj) {
  console.log('Custom setHash called with:', obj);
  const hash = window.makeHash(obj);
  console.log('Setting URL hash to:', `#${hash}`);
  window.history.pushState(null, null, `#${hash}`);
};

// Safe category decoding function with multiple fallback strategies
function safeDecodeCategory(dataCategory, textContent) {
  try {
    if (!dataCategory) {
      console.warn('No data-category attribute found, using text content');
      return textContent;
    }
    
    // First try to decode as base64
    const base64Decoded = atob(dataCategory);
    console.log('Base64 decoded:', base64Decoded);
    
    // Then try to URL decode
    const finalDecoded = decodeURIComponent(base64Decoded);
    console.log('Final decoded:', finalDecoded);
    
    // Verify the decoded value makes sense
    if (finalDecoded && finalDecoded.trim() !== '') {
      return finalDecoded;
    } else {
      console.warn('Decoded category is empty, using text content');
      return textContent;
    }
  } catch (error) {
    console.error('Failed to decode category:', dataCategory, error);
    // Fallback: use the text content directly
    return textContent;
  }
}

// Override the activateCategory function to handle empty category properly
window.activateCategory = function(category) {
  console.log('Custom activateCategory called with:', category);
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
    // Activate filter category - try multiple strategies to find the element
    let filterCategoryEl = document.querySelector(
      `.quarto-listing-category .category[data-category='${btoa(
        encodeURIComponent(category)
      )}']`
    );
    
    // If not found, try to find by text content
    if (!filterCategoryEl) {
      const allCategoryEls = document.querySelectorAll(".quarto-listing-category .category");
      for (const el of allCategoryEls) {
        const elText = el.textContent.trim();
        if (elText === category) {
          filterCategoryEl = el;
          break;
        }
      }
    }
    
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
  if (window.filterListingCategory) {
    window.filterListingCategory(category);
  }
};

// Also override the local functions that might be called from within quarto-listing.js
// This ensures that even if the original functions are called directly, they use our URL encoding
(function() {
  // Store original functions
  const originalMakeHash = window.makeHash;
  const originalSetHash = window.setHash;
  const originalGetHash = window.getHash;
  const originalParseHash = window.parseHash;
  
  // Override the setCategoryHash function that might be called from quarto-listing.js
  // We need to intercept calls to the original setHash function
  const originalSetCategoryHash = function(category) {
    console.log('Intercepted setCategoryHash call with:', category);
    if (category === "") {
      const currentHash = window.getHash() || {};
      delete currentHash.category;
      window.setHash(currentHash);
    } else {
      const currentHash = window.getHash() || {};
      currentHash.category = encodeURIComponent(category);
      console.log('Setting category hash with encoded value:', encodeURIComponent(category));
      window.setHash(currentHash);
    }
  };
  
  // Override the setHash function to ensure it always uses URL encoding
  window.setHash = function(obj) {
    console.log('Custom setHash called with:', obj);
    const hash = window.makeHash(obj);
    console.log('Setting URL hash to:', `#${hash}`);
    window.history.pushState(null, null, `#${hash}`);
  };
  
  // Override the makeHash function to ensure it always URL encodes
  window.makeHash = function(obj) {
    console.log('Custom makeHash called with:', obj);
    const result = Object.keys(obj)
      .map((key) => {
        return `${key}=${encodeURIComponent(obj[key])}`;
      })
      .join("&");
    console.log('Generated hash:', result);
    return result;
  };
})();

// Function to set up category click handlers
function setupCategoryHandlers() {
  if (window.customCategoryHandlersSetup) {
    console.log('Category handlers already set up, skipping');
    return;
  }
  
  console.log('Setting up category click handlers');
  
  // Attach click handlers to filter categories with toggle functionality
  const categoryEls = document.querySelectorAll(
    ".quarto-listing-category .category"
  );

  for (const categoryEl of categoryEls) {
    // Remove any existing click handlers
    categoryEl.onclick = null;
    
    // Safely decode the category with fallback to text content
    const dataCategory = categoryEl.getAttribute("data-category");
    const textContent = categoryEl.textContent.trim();
    const category = safeDecodeCategory(dataCategory, textContent);
    
    console.log('Setting up handler for category:', category, 'data-category:', dataCategory, 'text:', textContent);
    
    categoryEl.onclick = () => {
      console.log('Category clicked:', category);
      // Check if this category is already active
      const isActive = categoryEl.classList.contains("active");
      
      if (isActive) {
        // If already active, deactivate it (remove filter)
        window.activateCategory("");
        window.setCategoryHash("");
      } else {
        // If not active, activate it (apply filter)
        window.activateCategory(category);
        window.setCategoryHash(category);
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
      
      console.log('Individual category clicked:', category);
      // Check if this category is already active in the filter
      const filterCategoryEl = document.querySelector(
        `.quarto-listing-category .category[data-category='${btoa(
          encodeURIComponent(category)
        )}']`
      );
      
      if (filterCategoryEl && filterCategoryEl.classList.contains("active")) {
        // If already active, deactivate it (remove filter)
        window.activateCategory("");
        window.setCategoryHash("");
      } else {
        // If not active, activate it (apply filter)
        window.activateCategory(category);
        window.setCategoryHash(category);
      }
    };
  }

  // Attach a click handler to the category title
  const categoryTitleEls = document.querySelectorAll(
    ".quarto-listing-category-title"
  );
  for (const categoryTitleEl of categoryTitleEls) {
    categoryTitleEl.onclick = () => {
      console.log('Category title clicked - clearing filter');
      window.activateCategory("");
      window.setCategoryHash("");
    };
  }
  
  window.customCategoryHandlersSetup = true;
  console.log('Category handlers setup complete');
}

// Set up handlers when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Custom category toggle script loaded');
  
  // Try to set up handlers immediately
  setupCategoryHandlers();
  
  // Also try after a delay to ensure Quarto's scripts have loaded
  setTimeout(setupCategoryHandlers, 100);
  
  // And try again after a longer delay
  setTimeout(setupCategoryHandlers, 500);
  
  // And one more time after a second
  setTimeout(setupCategoryHandlers, 1000);
});

// Also set up handlers when the page loads completely
window.addEventListener('load', function() {
  console.log('Page loaded, setting up category handlers');
  setupCategoryHandlers();
}); 