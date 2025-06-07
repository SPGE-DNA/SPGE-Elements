/**
 * Utility functions for Himiq School website
 * These functions provide fallbacks and utility features
 */

// Reset form utility function - used when resetNewCategoryForm is called
function resetNewCategoryForm() {
  console.log('Reset form called - utility function');
  const form = document.getElementById('newCategoryForm');
  if (form) {
    form.reset();
  }
}

// Admin configuration utility
function loadConfiguration() {
  console.log('Loading admin configuration...');
  return {
    theme: localStorage.getItem('adminTheme') || 'dark',
    language: localStorage.getItem('language') || 'en',
    showAdvancedOptions: localStorage.getItem('showAdvancedOptions') === 'true',
    elementsPerPage: parseInt(localStorage.getItem('elementsPerPage')) || 10,
    classesManaged: JSON.parse(localStorage.getItem('classesManaged')) || []
  };
}

// Export schedule data utility
function exportScheduleData() {
  console.log('Exporting schedule data...');
  try {
    const scheduleData = JSON.stringify(window.scheduleData || []);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(scheduleData);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "schedule-export.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    return true;
  } catch (error) {
    console.error('Error exporting schedule data:', error);
    return false;
  }
}

// Generate usage report utility
function generateUsageReport() {
  console.log('Generating usage report...');
  return {
    elements: (window.schoolElements || []).length,
    activeFilters: window.currentCategoryFilter || 'all',
    selectedClass: localStorage.getItem('selectedClass') || 'all',
    timestamp: new Date().toISOString()
  };
}

// Show element stats utility
function showElementStats() {
  console.log('Showing element stats...');
  const stats = {
    total: (window.schoolElements || []).length,
    byCategory: {}
  };
  
  if (window.schoolElements) {
    window.schoolElements.forEach(element => {
      if (!stats.byCategory[element.category]) {
        stats.byCategory[element.category] = 0;
      }
      stats.byCategory[element.category]++;
    });
  }
  
  return stats;
}

// Run optimization analysis utility
function runOptimizationAnalysis() {
  console.log('Running optimization analysis...');
  return {
    status: 'completed',
    recommendations: [
      'Consider using lazy loading for offscreen elements',
      'Batch DOM updates for improved performance',
      'Implement debouncing for search input',
      'Cache element references that are accessed frequently'
    ]
  };
}

// Class management utilities
function initializeClassSchedules() {
  console.log('Initializing class schedules...');
  return true;
}

// Debounce function to limit how often a function is called
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}

// Get the appropriate icon for an element category
function getCategoryIcon(category) {
  switch (category) {
    case 'science':
      return '🔬';
    case 'humanities':
      return '📚';
    case 'sports':
      return '🏆';
    case 'values':
      return '💎';
    case 'events':
      return '🎭';
    case 'admin':
      return '🏫';
    default:
      return '⚗️';
  }
}

// Initialize back-to-top button
document.addEventListener('DOMContentLoaded', function() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    // Show button when user scrolls down 300px
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
    
    // Smooth scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// Export all utilities to global scope
window.resetNewCategoryForm = resetNewCategoryForm;
window.loadConfiguration = loadConfiguration;
window.exportScheduleData = exportScheduleData;
window.generateUsageReport = generateUsageReport;
window.showElementStats = showElementStats;
window.runOptimizationAnalysis = runOptimizationAnalysis;
window.initializeClassSchedules = initializeClassSchedules;
window.debounce = debounce;
window.getCategoryIcon = getCategoryIcon;
