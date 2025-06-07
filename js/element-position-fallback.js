// Element Position Fallback System
// Provides backup positioning when regular position data or update-positions.js is unavailable

// Fallback map for known elements
const elementPositionMap = {
    // Format: elementNumber: { col: x, row: y }
    1: { col: 1, row: 1 },
    2: { col: 18, row: 1 },
    3: { col: 1, row: 2 },
    4: { col: 2, row: 2 },
    5: { col: 13, row: 2 },
    6: { col: 14, row: 2 },
    7: { col: 15, row: 2 },
    8: { col: 16, row: 2 },
    9: { col: 17, row: 2 },
    10: { col: 18, row: 2 }
    // Add more as needed
};

// Main fallback function
function getElementFallbackPosition(elementNumber) {
    // Check if we have a known position
    if (elementPositionMap[elementNumber]) {
        return elementPositionMap[elementNumber];
    }
    
    // Generate a position based on element number
    const row = Math.ceil(elementNumber / 18);
    const col = elementNumber % 18 || 18;
    
    // Check for potential overlaps in generated positions
    return { col, row };
}

// Apply fallback positions to fix layout issues
function applyFallbackPositions() {
    console.log("Applying element position fallbacks...");
    
    // Find all elements without position data
    const elements = document.querySelectorAll('.element[style*="grid-column: auto"]');
    if (elements.length > 0) {
        console.log(`Found ${elements.length} elements with missing position data`);
        
        elements.forEach(el => {
            const number = parseInt(el.getAttribute('data-number'), 10);
            if (!isNaN(number)) {
                const position = getElementFallbackPosition(number);
                el.style.gridColumn = position.col;
                el.style.gridRow = position.row;
                console.log(`Applied fallback position to element #${number}: ${position.col}, ${position.row}`);
            }
        });
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit to allow other positioning systems to work first
    setTimeout(applyFallbackPositions, 500);
});

// Expose functions to global scope
window.getElementFallbackPosition = getElementFallbackPosition;
window.applyFallbackPositions = applyFallbackPositions;
