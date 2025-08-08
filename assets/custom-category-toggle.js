// Custom category toggle functionality - Simple URL encoding fix
// Only runs on pages that have listings

// Check if we're on a page with listings
function hasListings() {
  return document.querySelector('.quarto-listing-category') !== null;
}

// Only run if we're on a page with listings
if (hasListings()) {
  console.log('Custom category toggle script loaded on listing page');
  
  // Simple fix: Override only the quartoListingCategory function
  // This is the function that gets called when clicking category elements
  window.quartoListingCategory = function(category) {
    console.log('Custom quartoListingCategory called with:', category);
    // category is URI encoded in EJS template for UTF-8 support
    const decodedCategory = decodeURIComponent(atob(category));
    console.log('Decoded category:', decodedCategory);
    
    // Use the original Quarto functions but ensure proper URL encoding
    if (window.categoriesLoaded) {
      // Call the original activateCategory function
      if (window.activateCategory) {
        window.activateCategory(decodedCategory);
      }
      
      // Set the hash with proper URL encoding
      const currentHash = window.getHash ? window.getHash() || {} : {};
      if (decodedCategory === "") {
        delete currentHash.category;
      } else {
        currentHash.category = encodeURIComponent(decodedCategory);
      }
      
      // Use the original setHash function
      if (window.setHash) {
        window.setHash(currentHash);
      }
    }
  };
  
  console.log('Category URL encoding fix applied');
} else {
  console.log('Custom category toggle script loaded on non-listing page, skipping setup');
} 