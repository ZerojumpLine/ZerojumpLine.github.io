// Category Button Style Override
// This JavaScript forces the category button styles after page load
// to override any conflicting CSS that loads after our theme files

(function() {
    'use strict';
    
    // Category button styles
    const categoryStyles = {
        backgroundColor: '#4a5568',
        color: '#ffffff',
        borderColor: '#718096',
        opacity: '1'
    };
    
    const categoryHoverStyles = {
        backgroundColor: '#718096',
        color: '#ffffff',
        borderColor: '#a0aec0',
        opacity: '1'
    };
    
    function applyCategoryStyles() {
        // Find all category buttons
        const categoryButtons = document.querySelectorAll('.quarto-category');
        
        categoryButtons.forEach(button => {
            // Apply base styles
            Object.assign(button.style, categoryStyles);
            
            // Add hover event listeners
            button.addEventListener('mouseenter', function() {
                Object.assign(this.style, categoryHoverStyles);
            });
            
            button.addEventListener('mouseleave', function() {
                Object.assign(this.style, categoryStyles);
            });
        });
        
        console.log(`Applied custom styles to ${categoryButtons.length} category buttons`);
    }
    
    // Apply styles when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyCategoryStyles);
    } else {
        applyCategoryStyles();
    }
    
    // Also apply after a short delay to catch any dynamically loaded content
    setTimeout(applyCategoryStyles, 500);
    
    // Apply styles when page is fully loaded (including all CSS)
    window.addEventListener('load', function() {
        setTimeout(applyCategoryStyles, 100);
    });
    
})();