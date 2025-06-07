// Himiq School - Periodic Table of Our School
// Chemistry-themed educational website with interactive periodic table

// Global variables
let schoolElements = [];
let scheduleData = [];
let teachersData = [];
let periodicTable;
let modal;
let closeModal;
let navbar;
let currentOpenElement = null; // Track currently open element for language switching
// currentLanguage is declared in language.js

// Listen for language changes
document.addEventListener('languageChanged', function() {
  if (periodicTable) {
    createPeriodicTable(); // Rebuild the table with new language
  }
});

// Export schedule data for other pages
function exportScheduleData() {
  return scheduleData;
}

// ===== SIMPLIFIED SUBJECTS SYSTEM =====
// No more classes or schedules - each subject has its own chemistry connection

// Load consolidated school data
async function loadSchoolData() {  try {
    // First try to fetch from the server
    const response = await fetch('data/school-data.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
      const data = await response.json();
    // Combine all data into schoolElements array for the periodic table
    schoolElements = [
      ...(data.subjects || []),
      ...(data.administration || []),
      ...(data.values || []),
      ...(data.events || [])
    ];
    scheduleData = []; // No more schedules in simplified system
    teachersData = []; // No more separate teachers data
    
    console.log(`✅ Loaded ${schoolElements.length} school elements (subjects, admin, values, events)`);
    
    // Initialize the periodic table after data is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
      initializeApp();
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error loading school data:', error);
    // Fallback to hardcoded data if JSON fails
    initializeFallbackData();
    return false;
  }
}

// Fallback data in case JSON loading fails
function initializeFallbackData() {
  // Use the fallback data we defined in fallback-data.js
  if (window.fallbackSchoolData && window.fallbackSchoolData.elements) {
    console.log(`✅ Fallback data initialized`);
    schoolElements = window.fallbackSchoolData.elements;
      // Make sure all elements have positions
    schoolElements.forEach(element => {
      if (!element.gridPosition) {
        // Assign a position based on number if available
        if (element.number) {
          // Use a simple formula for positioning
          const row = Math.ceil(element.number / 18);
          const column = element.number % 18 || 18;
          element.gridPosition = { row, column };
        }
      }
    });
    
    // Initialize the app with fallback data
    initializeApp();
    return;
  }
    // Fallback to hardcoded elements if fallback-data.js is not available
  console.error('❌ No fallback data available. Please ensure school-data.json is accessible.');
  schoolElements = [];
  
  console.log('❌ Fallback data initialization failed');
  // Still try to initialize the app to show an empty state
  initializeApp();
}

// Initialize DOM elements
function initializeDOMElements() {
  periodicTable = document.getElementById('periodicTable');
  modal = document.getElementById('elementModal');
  closeModal = document.getElementById('closeModal');
  navbar = document.querySelector('.navbar');
  
  console.log('📊 DOM Elements Status:');
  console.log('- Periodic Table:', periodicTable ? '✅ Found' : '❌ Not found');
  console.log('- Modal:', modal ? '✅ Found' : '❌ Not found');
  console.log('- Close Modal:', closeModal ? '✅ Found' : '❌ Not found');
  console.log('- Navbar:', navbar ? '✅ Found' : '❌ Not found');
}

// Create periodic table elements using grid pattern
function createPeriodicTable() {
  if (!periodicTable) {
    console.error('❌ Periodic table container not found');
    return;
  }
  console.log('🔬 Generating periodic table with', schoolElements.length, 'elements');
  periodicTable.innerHTML = '';
  
  // Get category filter only (no more class filtering)
  const categoryFilter = window.currentCategoryFilter || 'all';

  // Create elements based on their gridPosition
  schoolElements.forEach(element => {
    if (!element.gridPosition) {
      console.warn(`⚠️ Element ${element.symbol} has no gridPosition`);
      return;
    }    const elementDiv = document.createElement('div');
    elementDiv.className = `element ${element.category}`;            elementDiv.setAttribute('data-category', element.category);
    elementDiv.setAttribute('data-number', element.number);
    
    // Position in grid using gridPosition from data
    elementDiv.style.gridColumn = element.gridPosition.column;
    elementDiv.style.gridRow = element.gridPosition.row;
    
    // Add content
    elementDiv.innerHTML = `
      <div class="element-content">
        <div class="atomic-number">${element.number}</div>
        <div class="symbol">${element.symbol}</div>
        <div class="name">${currentLanguage === 'bg' ? (element.nameBg || element.name) : element.name}</div>
      </div>
    `;

    // Set initial visibility based on category filter only
    const matchesCategory = categoryFilter === 'all' || element.category === categoryFilter;
    
    if (!matchesCategory) {
      elementDiv.style.opacity = '0.3';
      elementDiv.style.pointerEvents = 'none';
    } else {
      elementDiv.style.opacity = '1';
      elementDiv.style.pointerEvents = 'auto';
    }
    
    // Add click event
    elementDiv.addEventListener('click', () => openElementModal(element));
    
    periodicTable.appendChild(elementDiv);
  });
    console.log('✅ Periodic table generation complete. Total elements added:', periodicTable.children.length);
  
  // If we're filtering, update the filter button UI
  if (categoryFilter !== 'all') {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.classList.toggle('active', button.getAttribute('data-filter') === categoryFilter);
    });
  }
  console.log(`✅ Created periodic table with category filter: ${categoryFilter}`);
}

// Add empty placeholders to maintain the real periodic table layout
function addPeriodicTablePlaceholders() {
  if (!periodicTable) return;
  
  // REMOVED: Period and group labels that were causing gridColumn=0 and gridRow=0 issues
  // These were pushing elements outside the valid CSS Grid structure
  
  // Only add valid placeholders within the 18x7 grid if absolutely necessary
  // Row 1 gap between positions 2-17 (but only if screen is large enough)
  if (window.innerWidth >= 1200) {
    for (let col = 2; col <= 17; col++) {
      addEmptyElement(1, col);
    }
    
    // Row 2-3 gaps (between s and p block elements)
    for (let row = 2; row <= 3; row++) {
      for (let col = 3; col <= 12; col++) {
        addEmptyElement(row, col);
      }
    }
  }
}

// Add an empty placeholder element
function addEmptyElement(row, col) {
  const emptyElement = document.createElement('div');
  emptyElement.className = 'element-placeholder';
  emptyElement.style.gridColumn = col;
  emptyElement.style.gridRow = row;
  periodicTable.appendChild(emptyElement);
}

// Add special placeholder with text that indicates elements below
function addSpecialGapElement(row, col, text) {
  const gapElement = document.createElement('div');
  gapElement.className = 'element-gap';
  gapElement.textContent = text;
  gapElement.style.gridColumn = col;
  gapElement.style.gridRow = row;
  periodicTable.appendChild(gapElement);
}

// Open element modal
function openElementModal(element) {
  if (!modal) {
    console.error('❌ Modal not found');
    return;
  }
  // Store the current element for language switching
  currentOpenElement = element;

  const modalContent = modal.querySelector('.modal-content');
  if (!modalContent) {
    console.error('❌ Modal content not found');
    return;
  }

  // Get localized content
  const name = currentLanguage === 'bg' ? (element.nameBg || element.name) : element.name;
  const description = currentLanguage === 'bg' ? (element.descriptionBg || element.description) : element.description;
  const chemistryRelation = currentLanguage === 'bg' ? (element.chemistryRelationBg || element.chemistryRelation) : element.chemistryRelation;  const facts = currentLanguage === 'bg' ? (element.factsBg || element.facts) : element.facts;
    // Create category badge with icon
  const categoryLabel = getCategoryLabel(element.category);
  const categoryIcon = getCategoryIcon(element.category);
      modalContent.innerHTML = `
    <div class="modal-watermark">${element.symbol}</div>
    <span class="close" id="closeModal">&times;</span>    <div class="element-header ${element.category}">
      <div class="element-symbol-container">
        <div class="element-symbol">${element.symbol}</div>
      </div>
      <div class="element-info">
        <div class="element-title-container">
          <h2>ELEMENT</h2>
          <h3 class="element-name">${name}</h3>
        </div>
        <div class="element-meta">
          <span class="element-category-badge ${element.category}">
            <span class="category-icon">${categoryIcon}</span>
            ${categoryLabel}
          </span>
        </div>
      </div>
    </div>
      <div class="element-details">
      <div class="info-box description-box">
        <h3>
          <span class="icon">📖</span>
          <span>${currentLanguage === 'bg' ? 'Описание' : 'Description'}</span>
        </h3>
        <p>${description}</p>
      </div>
      
      <div class="info-box chemistry-box">
        <h3>
          <span class="icon">🧪</span>
          <span>${currentLanguage === 'bg' ? 'Връзка с Химията' : 'Chemistry Connection'}</span>
        </h3>
        <p>${chemistryRelation || (currentLanguage === 'bg' ? 'Няма налична информация' : 'No chemistry relation available')}</p>
      </div>
      
      <div class="info-box facts-box">
        <h3>
          <span class="icon">✨</span>
          <span>${currentLanguage === 'bg' ? 'Ключови характеристики' : 'Key Features'}</span>
        </h3>
        <ul>
          ${Array.isArray(facts) ? facts.map(fact => `<li>${fact}</li>`).join('') : 
            `<li>${currentLanguage === 'bg' ? 'Няма налична информация' : 'No facts available'}</li>`}
        </ul>
      </div>
    </div>
    
    <div class="modal-actions">
      <button class="share-btn" onclick="shareElement('${element.symbol}')">
        <span class="share-icon">🔗</span>
        ${currentLanguage === 'bg' ? 'Споделяне на елемент' : 'Share this element'}
      </button>
      
      <button class="print-btn" onclick="printElementDetail('${element.symbol}')">
        <span class="print-icon">🖨️</span>
        ${currentLanguage === 'bg' ? 'Принтиране' : 'Print'}
      </button>
    </div>
  `;

  // Reattach close event listener
  const newCloseModal = modal.querySelector('#closeModal');
  if (newCloseModal) {
    newCloseModal.addEventListener('click', closeElementModal);
  }

  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Add a subtle entrance animation
  modalContent.style.animation = 'modalFadeIn 0.3s ease forwards';
}

// Helper function to get category label
function getCategoryLabel(category) {
  const categoryLabels = {
    'science': currentLanguage === 'bg' ? 'Наука' : 'Science',
    'humanities': currentLanguage === 'bg' ? 'Хуманитарни' : 'Humanities',
    'sports': currentLanguage === 'bg' ? 'Спорт' : 'Sports',
    'values': currentLanguage === 'bg' ? 'Ценности' : 'Values',
    'events': currentLanguage === 'bg' ? 'Събития' : 'Events',
    'admin': currentLanguage === 'bg' ? 'Администрация' : 'Administration'
  };
  
  return categoryLabels[category] || category;
}

// Helper function to get category icon
function getCategoryIcon(category) {
  const icons = {
    'science': '🧪',
    'humanities': '📚',
    'sports': '🏆',
    'values': '🌟',
    'events': '🎭',
    'admin': '🏢'
  };
  
  return icons[category] || '📌';
}

// Close element modal
function closeElementModal() {
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
  
  // Clear the current element reference when modal is closed
  currentOpenElement = null;
}

// Share element function
function shareElement(elementSymbol) {
  const element = schoolElements.find(el => el.symbol === elementSymbol);
  if (!element) return;

  const shareData = {
    title: `${element.name} - Himiq School`,
    text: `Check out ${element.name} at Himiq School!`,
    url: `${window.location.origin}${window.location.pathname}?element=${elementSymbol}`
  };

  if (navigator.share) {
    navigator.share(shareData).catch(err => console.log('Error sharing:', err));
  } else {
    // Fallback: copy to clipboard
    const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
    navigator.clipboard.writeText(shareText).then(() => {
      showNotification('Element details copied to clipboard!');
    }).catch(() => {
      showNotification('Unable to share element');
    });
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--primary-color);
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Theme management removed - dark mode only
// Original theme functions have been removed to enforce single dark theme

// Language switching
// Language switching is handled by language.js
// Remove switchLanguage function from main.js to prevent conflicts
// The language.js file handles all language switching functionality

function updateContentLanguage() {
  // Update UI elements with data-lang-key attributes (used by language.js)
  const langElements = document.querySelectorAll('[data-lang-key]');
  langElements.forEach(element => {
    const key = element.dataset.langKey;
    
    // Check if language.js translations are available
    if (typeof translations !== 'undefined' && translations[currentLanguage] && translations[currentLanguage][key]) {
      if (element.tagName === 'INPUT' && element.placeholder) {
        element.placeholder = translations[currentLanguage][key];
      } else {
        element.textContent = translations[currentLanguage][key];
      }
    }
  });
  
  // Update elements with data-en/data-bg attributes (legacy support)
  const legacyElements = document.querySelectorAll('[data-en][data-bg]');
  legacyElements.forEach(element => {
    const text = element.getAttribute(`data-${currentLanguage}`);
    if (text) {
      element.textContent = text;
    }
  });
}

// Filter elements by category
function filterElements(category) {
  const elements = document.querySelectorAll('.element');
  
  // Store current category filter
  window.currentCategoryFilter = category;
  
  elements.forEach(element => {
    const elementCategory = element.getAttribute('data-category');
    
    let showByCategory = category === 'all' || elementCategory === category;
    
    if (showByCategory) {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    } else {
      element.style.opacity = '0.3';
      element.style.pointerEvents = 'none';
    }
  });
  
  // Update active filter button
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.classList.toggle('active', button.getAttribute('data-filter') === category);
  });
  
  console.log(`✅ Filtered elements by category: ${category}`);
}

// Setup filter buttons
// DEPRECATED: Filter functionality removed as requested
// function setupFilterButtons() {
//   const filterButtons = document.querySelectorAll('.filter-btn');
//   if (filterButtons.length === 0) return;
//   
//   filterButtons.forEach(button => {
//     button.addEventListener('click', (e) => {
//       const category = button.getAttribute('data-filter');
//       filterElements(category);
//     });
//   });
//   
//   console.log('✅ Filter buttons setup complete');
// }

// Setup event listeners
function setupEventListeners() {
  // Theme toggle removed - dark mode only

  // Modal close events
  if (closeModal) {
    closeModal.addEventListener('click', closeElementModal);
  }

  // Click outside modal to close
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeElementModal();
      }
    });
  }

  // Keyboard events
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
      closeElementModal();
    }
  });
  // Language selector - delegate to language.js
  const langSelector = document.getElementById('languageSelector');
  if (langSelector) {
    langSelector.addEventListener('change', (e) => {
      // Dispatch event for language.js to handle
      const event = new CustomEvent('requestLanguageChange', { detail: { language: e.target.value } });
      document.dispatchEvent(event);
    });
  }

  console.log('✅ Event listeners setup complete');
}

// Setup theme - dark mode only (no toggle functionality)
function setupThemeToggle() {
  // Force dark theme only
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
  console.log('✅ Dark theme enforced - light mode removed');
}

// Setup element search functionality
function setupElementSearch() {
  const searchInput = document.getElementById('elementSearch');
  const searchButton = document.getElementById('searchButton');
  if (!searchInput) return;

  // Create a debounced search function
  const debouncedSearch = debounce((searchTerm) => {
    searchElements(searchTerm);
  }, 300);

  // Handle input changes
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    debouncedSearch(searchTerm);
  });

  // Handle search button clicks
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const searchTerm = searchInput.value.toLowerCase().trim();
      searchElements(searchTerm);
    });
  }

  // Handle Enter key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const searchTerm = searchInput.value.toLowerCase().trim();
      searchElements(searchTerm);
    }
  });

  console.log('✅ Element search setup complete');
}

// Actual search function
function searchElements(searchTerm) {
  const elements = document.querySelectorAll('.element');
  const searchFeedback = document.getElementById('searchFeedback') || createSearchFeedback();
  
  // Convert search term to lowercase
  searchTerm = searchTerm ? searchTerm.toLowerCase() : '';
  
  // Remove any existing highlights
  elements.forEach(el => el.classList.remove('highlight'));
    if (!searchTerm) {
    // If search is empty, restore all elements based on current filters
    const categoryFilter = window.currentCategoryFilter || 'all';
    filterElements(categoryFilter);
    searchFeedback.style.display = 'none';
    return;
  }
  
  let hasMatches = false;
  let matchCount = 0;
  
  elements.forEach(element => {
    const name = element.querySelector('.name').textContent.toLowerCase();
    const symbol = element.querySelector('.symbol').textContent.toLowerCase();
    const number = element.querySelector('.atomic-number').textContent;
    
    if (name.includes(searchTerm) || symbol.includes(searchTerm) || number.includes(searchTerm)) {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
      element.classList.add('highlight');
      element.style.animation = 'pulse 0.5s ease-in-out';
      hasMatches = true;
      matchCount++;
      
      // Ensure element is visible if it's a match
      element.style.display = 'flex';
    } else {
      element.style.opacity = '0.3';
      element.style.pointerEvents = 'none';
      element.style.animation = '';
    }
  });
  
  // Provide visual feedback for search results
  if (searchTerm) {
    searchFeedback.style.display = 'block';
    if (hasMatches) {
      searchFeedback.textContent = `${matchCount} ${currentLanguage === 'bg' ? 'елемент(и) намерени' : 'element(s) found'}`;
      searchFeedback.className = 'search-feedback success';
    } else {
      searchFeedback.textContent = currentLanguage === 'bg' 
        ? `Няма намерени елементи за "${searchTerm}"` 
        : `No elements match "${searchTerm}"`;
      searchFeedback.className = 'search-feedback warning';
    }
  } else {
    searchFeedback.style.display = 'none';
  }
}

// Create search feedback element if it doesn't exist
function createSearchFeedback() {
  const searchContainer = document.querySelector('.search-container');
  if (!searchContainer) return null;
  
  const feedback = document.createElement('div');
  feedback.id = 'searchFeedback';
  feedback.className = 'search-feedback';
  feedback.style.display = 'none';
  
  searchContainer.parentNode.insertBefore(feedback, searchContainer.nextSibling);
  return feedback;
}

// Removed class selector functionality - no longer needed
// Each subject now has its own chemistry relation instead of class assignments

// Removed class-based filtering functionality
// Subjects now focus on their individual chemistry connections

// Check if element has schedule for specific class
function checkElementScheduleForClass(element, classType) {
  // Check if element has the specified class in its classes array
  if (!element.classes) {
    return false;
  }
  return element.classes.includes(classType);
}

// Initialize mobile menu
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu');
  const navMenu = document.querySelector('.nav-menu');
  const navControls = document.querySelector('.nav-controls');
  
  if (mobileToggle && navMenu) {
    // Ensure menu starts closed
    navMenu.classList.remove('active');
    mobileToggle.classList.remove('active');
    
    // Clean toggle function
    const toggleMenu = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const isActive = navMenu.classList.contains('active');
      
      if (isActive) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      } else {
        navMenu.classList.add('active');
        mobileToggle.classList.add('active');
        
        // Clone controls to mobile menu if not already there
        if (navControls && !navMenu.querySelector('.nav-controls')) {
          const controlsClone = navControls.cloneNode(true);
          navMenu.appendChild(controlsClone);
        }
      }
    };
    
    // Add click listener
    mobileToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!mobileToggle.contains(e.target) && 
          !navMenu.contains(e.target) && 
          navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
    
    // Close menu on window resize if desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
    
    console.log('✅ Mobile menu initialized');
  } else {
    console.log('❌ Mobile menu elements not found');
  }
}

// Initialize language selector
function initLanguageSelector() {
  const savedLanguage = localStorage.getItem('language') || 'en';
  currentLanguage = savedLanguage;
    // Listen for language change events from language.js
  document.addEventListener('languageChanged', (event) => {
    currentLanguage = event.detail.language;
    updateContentLanguage();
    createPeriodicTable(); // Recreate table with new language
    
    // If modal is open, regenerate its content with new language
    if (currentOpenElement && modal && modal.style.display === 'flex') {
      openElementModal(currentOpenElement);
    }
    
    console.log(`🌐 Language changed to: ${currentLanguage}`);
  });
  
  // Apply initial content update
  updateContentLanguage();
  console.log('✅ Language selector initialized');
}

// Initialize navbar scroll effect
function initNavbarScrollEffect() {
  if (!navbar) return;
  
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      navbar.style.transform = 'translateY(-100%)';
    } else {
      // Scrolling up
      navbar.style.transform = 'translateY(0)';
    }
    
    // Add/remove scrolled class
    if (scrollTop > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop;
  });
  
  console.log('✅ Navbar scroll effect initialized');
}

// Debug and fix element positioning issues
function debugAndFixElementPositions() {
  console.log('🔧 Debug: Checking element positions...');
  
  const elements = document.querySelectorAll('.element');
  let fixedCount = 0;
  
  elements.forEach(el => {
    const number = parseInt(el.getAttribute('data-number'), 10);
    const currentCol = el.style.gridColumn;
    const currentRow = el.style.gridRow;
    
    // Check if element has valid position
    if (!currentCol || currentCol === 'auto' || !currentRow || currentRow === 'auto') {
      console.log(`🔧 Fixing position for element #${number}`);
      
      // Find the element data
      const elementData = schoolElements.find(e => e.number === number);
      if (elementData && elementData.position) {
        el.style.gridColumn = elementData.position.col;
        el.style.gridRow = elementData.position.row;
        fixedCount++;
      } else if (typeof getElementFallbackPosition === 'function') {
        const position = getElementFallbackPosition(number);
        el.style.gridColumn = position.col;
        el.style.gridRow = position.row;
        fixedCount++;
      }
    }
  });
  
  if (fixedCount > 0) {
    console.log(`✅ Fixed positioning for ${fixedCount} elements`);
  } else {
    console.log('✅ All elements have proper positioning');
  }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Initializing application...');
  initializeApp();

  // Initialize back-to-top button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Main initialization
function initializeApp() {
  console.log('🚀 Initializing Himiq School App...');
  
  try {
    // Initialize DOM elements first
    initializeDOMElements();
    
    // Setup theme early to prevent flash
    setupThemeToggle();
    
    // Create periodic table
    createPeriodicTable();
      // Setup all event listeners    setupEventListeners();
    setupElementSearch();// Initialize mobile features
    initMobileMenu();
    initLanguageSelector();
    initNavbarScrollEffect();
      // Admin panel functionality is separate - no need to initialize here
    
    console.log('🎉 Himiq School app initialized successfully!');
  } catch (error) {
    console.error('❌ Error initializing app:', error);
  }
}

// Force dark theme only - no theme switching
(function() {
  document.documentElement.setAttribute('data-theme', 'dark');
  localStorage.setItem('theme', 'dark');
})();

// Start the application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadSchoolData();
  });
} else {
  loadSchoolData();
}

// Print element detail
function printElementDetail(elementSymbol) {
  const element = schoolElements.find(el => el.symbol === elementSymbol);
  if (!element) return;

  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please enable popups to print element details');
    return;
  }
  // Get localized content
  const name = currentLanguage === 'bg' ? (element.nameBg || element.name) : element.name;
  const description = currentLanguage === 'bg' ? (element.descriptionBg || element.description) : element.description;
  const chemistryRelation = currentLanguage === 'bg' ? (element.chemistryRelationBg || element.chemistryRelation) : element.chemistryRelation;
  const facts = currentLanguage === 'bg' ? (element.factsBg || element.facts) : element.facts;
  const categoryLabel = getCategoryLabel(element.category);
  
  // Generate print HTML content
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${name} - Himiq School</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .element-symbol { font-size: 48px; font-weight: bold; }
        .element-name { font-size: 24px; margin: 10px 0; }
        .element-number { font-size: 16px; color: #666; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .info-list { padding-left: 20px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #999; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="element-symbol">${element.symbol}</div>
        <h1 class="element-name">${name}</h1>
        <div class="element-number">#${element.id} - ${categoryLabel}</div>
      </div>
        <div class="section">
        <h2 class="section-title">${currentLanguage === 'bg' ? 'Описание' : 'Description'}</h2>
        <p>${description}</p>
      </div>
      
      <div class="section">
        <h2 class="section-title">${currentLanguage === 'bg' ? 'Връзка с химията' : 'Chemistry Connection'}</h2>
        <p>${chemistryRelation || (currentLanguage === 'bg' ? 'Няма налична информация' : 'No chemistry relation available')}</p>
      </div>
      
      <div class="section">
        <h2 class="section-title">${currentLanguage === 'bg' ? 'Ключови характеристики' : 'Key Features'}</h2>
        <ul class="info-list">
          ${Array.isArray(facts) ? facts.map(fact => `<li>${fact}</li>`).join('') : 
            `<li>${currentLanguage === 'bg' ? 'Няма налична информация' : 'No facts available'}</li>`}
        </ul>
      </div>
      
      <div class="footer">
        <p>Himiq School - ${new Date().toLocaleDateString()}</p>
      </div>
    </body>
    </html>
  `);
  
  // Print and close the window
  printWindow.document.close();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

// Export functions for global access
// Theme toggle removed - dark mode only
window.shareElement = shareElement;
window.openElementModal = openElementModal;
window.closeElementModal = closeElementModal;
window.exportScheduleData = exportScheduleData;
window.showElementStats = showElementStats;
window.runOptimizationAnalysis = runOptimizationAnalysis;
window.printElementDetail = printElementDetail;

// Add missing functions to prevent errors
function generateUsageReport() {
  console.log('📊 Generating usage report...');
  return {
    totalElements: schoolElements.length,
    categories: schoolElements.reduce((acc, el) => {
      acc[el.category] = (acc[el.category] || 0) + 1;
      return acc;
    }, {}),
    timestamp: new Date().toISOString()
  };
}

function showElementStats() {
  console.log('📈 Element stats:', {
    total: schoolElements.length,
    byCategory: schoolElements.reduce((acc, el) => {
      acc[el.category] = (acc[el.category] || 0) + 1;
      return acc;
    }, {})
  });
}

function runOptimizationAnalysis() {
  console.log('🔍 Running optimization analysis...');
  const analysis = {
    elementsWithoutPositions: schoolElements.filter(el => !el.gridPosition).length,
    elementsWithoutTranslations: schoolElements.filter(el => !el.nameBg).length,
    totalElements: schoolElements.length
  };
  console.log('Optimization results:', analysis);
  return analysis;
}

function initializeClassSchedules() {
  // Placeholder function - admin functionality is handled separately
  console.log('📅 Class schedules initialized (placeholder)');
}

// Export the new functions
window.generateUsageReport = generateUsageReport;

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Define resetNewCategoryForm function if it doesn't exist
if (typeof resetNewCategoryForm === 'undefined') {
  window.resetNewCategoryForm = function() {
    console.log('Reset form called, but function is not fully implemented');
    // This is a placeholder - implement actual form reset logic if needed
    const form = document.getElementById('newCategoryForm');
    if (form) {
      form.reset();
    }
  };
}