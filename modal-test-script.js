// Modal Selector Test Script - Updated for Removed Elements
// Run this in the browser console after opening a modal

function testModalSelectors() {
    console.log('🔍 Testing Modal Selectors (After Element Removal)...\n');
    
    // Check if modal is open
    const modal = document.querySelector("#elementModal");
    if (!modal || window.getComputedStyle(modal).display === 'none') {
        console.error('❌ Modal is not open! Click on an element first.');
        return;
    }
    
    console.log('✅ Modal is open');
    
    // Test that removed elements are gone
    console.log('\n📍 Testing Removed Elements:');
    
    const removedSpan = document.querySelector("#elementModal .element-symbol-container .element-number");
    console.log(`❌ Element number span (should be undefined): ${removedSpan ? 'STILL EXISTS!' : 'undefined ✅'}`);
    
    const removedWeight = document.querySelector("#elementModal .element-symbol-container .atomic-weight");
    console.log(`❌ Atomic weight div (should be undefined): ${removedWeight ? 'STILL EXISTS!' : 'undefined ✅'}`);
    
    // Test that remaining elements still work
    console.log('\n📍 Testing Remaining Elements:');
    
    const elementSymbol = document.querySelector("#elementModal .element-symbol");
    console.log(`✅ Element symbol: ${elementSymbol ? 'FOUND - ' + elementSymbol.textContent : 'undefined'}`);
    
    const elementName = document.querySelector("#elementModal .element-name");
    console.log(`✅ Element name: ${elementName ? 'FOUND - ' + elementName.textContent : 'undefined'}`);
    
    // Check H3 font size
    if (elementName) {
        const computedStyle = window.getComputedStyle(elementName);
        console.log(`📏 H3 Font size: ${computedStyle.fontSize}`);
    }
    
    // Show cleaned up structure
    console.log('\n📋 Current Modal Structure:');
    console.log('element-symbol-container now contains only:');
    console.log('  - element-symbol div');
    console.log('Removed elements:');
    console.log('  - element-number span (with #ID)');
    console.log('  - atomic-weight div (with weight info)');
}

// Run the test
testModalSelectors();
