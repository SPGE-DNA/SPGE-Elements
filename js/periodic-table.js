// Periodic Table functionality for Himiq School

document.addEventListener('DOMContentLoaded', () => {
  // Initialize class selector functionality if on index page
  const classSelector = document.getElementById('classSelector');
  if (classSelector) {
    classSelector.addEventListener('change', () => {
      createPeriodicTable();
    });
  }
});

// Create periodic table with proper layout
function createPeriodicTable() {
  const periodicTable = document.getElementById('periodicTable');
  if (!periodicTable) {
    console.error('❌ Periodic table container not found');
    return;
  }

  periodicTable.innerHTML = '';
  
  // Get selected class
  const classSelector = document.getElementById('classSelector');
  const selectedClass = classSelector ? classSelector.value : 'all';
  
  // Filter elements by selected class
  const filteredElements = selectedClass === 'all' 
    ? schoolElements 
    : schoolElements.filter(element => element.classes && element.classes.includes(selectedClass));

  console.log(`Filtering for class: ${selectedClass}`);
  console.log(`Found ${filteredElements.length} elements for this class`);
  
  // Create elements
  filteredElements.forEach(element => {
    const elementDiv = document.createElement('div');
    elementDiv.className = `element ${element.category}`;
    elementDiv.setAttribute('data-category', element.category);
    elementDiv.setAttribute('data-number', element.number);
    
    // Position according to periodic table layout
    if (element.position) {
      elementDiv.style.gridColumn = element.position.col;
      elementDiv.style.gridRow = element.position.row;
    } else {
      // Fallback positioning for elements without position data
      console.warn(`⚠️ No position data for element ${element.symbol} (${element.name})`);
      // Use a default position
      const defaultCol = (element.number % 18) || 18; // 1-18
      const defaultRow = Math.ceil(element.number / 18);
      elementDiv.style.gridColumn = defaultCol;
      elementDiv.style.gridRow = defaultRow;
    }
    
    elementDiv.innerHTML = `
      <div class="atomic-number">${element.number}</div>
      <div class="symbol">${element.symbol}</div>
      <div class="name">${currentLanguage === 'bg' ? element.nameBg : element.name}</div>
    `;
      elementDiv.addEventListener('click', () => openElementModal(element));
    periodicTable.appendChild(elementDiv);
  });

  // REMOVED: addPeriodicTablePlaceholders call that was causing layout issues
  // Elements with gridColumn=0 and gridRow=0 were pushing content outside grid bounds
  
  console.log(`✅ Created ${filteredElements.length} periodic table elements in grid layout`);
}

// Add empty placeholders to maintain the real periodic table layout
function addPeriodicTablePlaceholders(periodicTable) {
  // Define empty spaces in the periodic table (standard periodic table has specific gaps)
  // For example, in a standard periodic table:
  // - No elements in positions (row 1, cols 2-17)
  // - No elements in positions (row 2, cols 3-12)
  // - No elements in positions (row 3, cols 3-12)
  
  // Row 1 gap between H and He
  for (let col = 2; col <= 17; col++) {
    addEmptyElement(periodicTable, 1, col);
  }
  
  // Row 2 and 3 gaps
  for (let row = 2; row <= 3; row++) {
    for (let col = 3; col <= 12; col++) {
      addEmptyElement(periodicTable, row, col);
    }
  }
  
  // Create gap for lanthanides and actinides (rows 6 and 7)
  // This is a simplification - real periodic tables handle this differently
  /* 
  for (let row = 6; row <= 7; row++) {
    for (let col = 4; col <= 17; col++) {
      if (col === 4) {
        addGapIndicator(periodicTable, row, col);
      } else {
        addEmptyElement(periodicTable, row, col);
      }
    }
  }
  */
}

// Add an empty placeholder element
function addEmptyElement(container, row, col) {
  const emptyElement = document.createElement('div');
  emptyElement.className = 'element-placeholder';
  emptyElement.style.gridColumn = col;
  emptyElement.style.gridRow = row;
  container.appendChild(emptyElement);
}

// Add a gap indicator (for lanthanides/actinides)
function addGapIndicator(container, row, col) {
  const gapElement = document.createElement('div');
  gapElement.className = 'element-gap';
  gapElement.style.gridColumn = col;
  gapElement.style.gridRow = row;
  gapElement.textContent = row === 6 ? '*' : '**';
  container.appendChild(gapElement);
}

// Expose function to global scope - REMOVED to prevent conflict with main.js
// window.createPeriodicTable = createPeriodicTable;
