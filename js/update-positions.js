// Utility script to update element positions in school-data.json
// This creates a periodic table layout for school elements - Browser version

// This version runs directly in the browser to fix positioning issues
document.addEventListener('DOMContentLoaded', function() {
    // On page load, try to fix element positions
    fixElementPositions();
    
    // Add window resize handler to reposition elements if needed
    window.addEventListener('resize', debounce(fixElementPositions, 250));
});

// Define a mapping function to convert element number to grid position
function getPeriodicTablePosition(number) {
    // This function places elements in a typical periodic table layout
    // with appropriate gaps for lanthanides and actinides
    
    // Handle first 20 elements specially (main groups)
    if (number <= 20) {
        switch (number) {
            case 1: return { row: 1, col: 1 };
            case 2: return { row: 1, col: 18 };
            case 3: return { row: 2, col: 1 };
            case 4: return { row: 2, col: 2 };
            case 5: return { row: 2, col: 13 };
            case 6: return { row: 2, col: 14 };
            case 7: return { row: 2, col: 15 };
            case 8: return { row: 2, col: 16 };
            case 9: return { row: 2, col: 17 };
            case 10: return { row: 2, col: 18 };
            case 11: return { row: 3, col: 1 };
            case 12: return { row: 3, col: 2 };
            case 13: return { row: 3, col: 13 };
            case 14: return { row: 3, col: 14 };
            case 15: return { row: 3, col: 15 };
            case 16: return { row: 3, col: 16 };
            case 17: return { row: 3, col: 17 };
            case 18: return { row: 3, col: 18 };
            case 19: return { row: 4, col: 1 };
            case 20: return { row: 4, col: 2 };
        }
    }
    
    // Transition elements - row 4
    if (number >= 21 && number <= 30) {
        return { row: 4, col: number - 18 };
    }
    
    // Post-transition elements row 4
    if (number >= 31 && number <= 36) {
        return { row: 4, col: number - 12 };
    }
    
    // Row 5 elements
    if (number >= 37 && number <= 54) {
        if (number <= 38) {
            return { row: 5, col: number - 36 };
        } else if (number <= 48) {
            return { row: 5, col: number - 36 };
        } else {
            return { row: 5, col: number - 30 };
        }
    }
    
    // Row 6 elements including lanthanides
    if (number >= 55 && number <= 86) {
        if (number <= 56) {
            return { row: 6, col: number - 54 };
        } else if (number <= 70) {
            // Lanthanides go in row 8 (below main table)
            return { row: 8, col: number - 54 };
        } else if (number <= 80) {
            return { row: 6, col: number - 68 };
        } else {
            return { row: 6, col: number - 62 };
        }
    }
    
    // Row 7 elements including actinides
    if (number >= 87) {
        if (number <= 88) {
            return { row: 7, col: number - 86 };
        } else if (number <= 102) {
            // Actinides go in row 9 (below main table)
            return { row: 9, col: number - 86 };
        } else {
            return { row: 7, col: number - 100 };
        }
    }
    
    // Fallback for any other number
    const row = Math.ceil(number / 18);
    const col = number % 18 || 18;
    return { row, col };
}

// Utility function to debounce frequent events like resize
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Fix element positions at runtime
function fixElementPositions() {
    // Check if we have elements in memory
    if (!window.schoolElements || !Array.isArray(window.schoolElements)) {
        console.warn('⚠️ No school elements found in memory to fix positions');
        return;
    }

    console.log(`🔄 Fixing positions for ${window.schoolElements.length} elements`);
    let fixedCount = 0;
    
    // Update positions for all elements
    window.schoolElements.forEach(element => {
        // Only update elements that don't have a position already
        if (!element.position) {
            element.position = getPeriodicTablePosition(element.number);
            fixedCount++;
        }
    });
      // If we fixed any elements, update the periodic table
    if (fixedCount > 0) {
        console.log(`✅ Fixed positions for ${fixedCount} elements`);
        
        // Recreate the periodic table with updated positions
        if (typeof createPeriodicTable === 'function') {
            setTimeout(() => {
                createPeriodicTable();
                
                // Apply CSS fixes to ensure elements are rendered properly
                const elements = document.querySelectorAll('.element');
                elements.forEach(el => {
                    el.style.minWidth = '70px';
                    el.style.minHeight = '70px';
                    el.style.margin = '4px';
                });
                
                console.log(`✅ Applied styling fixes to ${elements.length} elements`);
            }, 100);
        }
    }
}

// Function to fix hover effect issues
function fixHoverEffects() {
    // Wait for DOM to be ready
    setTimeout(() => {
        // Remove transform scale that causes row expansion
        const styleSheet = document.createElement('style');
        styleSheet.innerText = `
            .element:hover {
                transform: none !important;
                box-shadow: 0 0 10px var(--accent-primary) !important;
                z-index: 10;
            }
        `;
        document.head.appendChild(styleSheet);
        
        console.log('✅ Fixed hover effects to prevent row expansion');
    }, 500);
}

// Call the fix functions when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    fixElementPositions();
    fixHoverEffects();
});
