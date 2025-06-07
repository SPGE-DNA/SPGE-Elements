// Advanced experiment simulations for the virtual laboratory

// Use global currentLanguage from main.js, don't redeclare
// let currentLanguage = 'en'; // Removed to prevent conflicts

// Ensure we have a getCurrentLanguage function for compatibility
if (typeof getCurrentLanguage !== 'function') {
  function getCurrentLanguage() {
    // If not defined elsewhere, try to get it from localStorage or default to 'en'
    return localStorage.getItem('language') || 'en';
  }
}

// Experiment data and configurations
const experimentConfigs = {
    'combustion-advanced': {
        title: 'Combustion Analysis - C₈H₁₈',
        type: 'combustion',
        duration: 12000,
        data: ['Temperature', 'Pressure', 'CO₂ Production', 'Energy Release'],
        safety: ['High temperature', 'Ventilation required', 'Safety goggles mandatory']
    },
    'acid-base': {
        title: 'Acid-Base Neutralization',
        type: 'titration',
        duration: 8000,
        data: ['pH Value', 'Volume Added', 'Temperature', 'Conductivity'],
        safety: ['Chemical resistant gloves', 'Eye protection', 'Fume hood recommended']
    },
    'color-change': {
        title: 'Chromatic Reactions',
        type: 'colorimetric',
        duration: 6000,
        data: ['Color Intensity', 'Wavelength', 'Absorbance', 'Concentration'],
        safety: ['Standard lab safety', 'Avoid skin contact', 'Proper disposal']
    },
    'electrolysis': {
        title: 'Electrolysis of Water',
        type: 'electrochemical',
        duration: 10000,
        data: ['Current', 'Voltage', 'Gas Volume', 'Efficiency'],
        safety: ['Electrical safety', 'Wet hands danger', 'Gas ventilation']
    },
    'galvanic': {
        title: 'Galvanic Cell Construction',
        type: 'electrochemical',
        duration: 9000,
        data: ['Cell Potential', 'Current Flow', 'Ion Concentration', 'Time'],
        safety: ['Metal handling', 'Solution safety', 'Electrical precautions']
    },
    'polymer': {
        title: 'Polymer Synthesis',
        type: 'organic',
        duration: 15000,
        data: ['Molecular Weight', 'Polymerization Rate', 'Temperature', 'Viscosity'],
        safety: ['Organic solvent handling', 'Heat safety', 'Ventilation required']
    },
    'chromatography': {
        title: 'Paper Chromatography',
        type: 'analytical',
        duration: 7000,
        data: ['Rf Values', 'Separation Distance', 'Mobile Phase', 'Retention Time'],
        safety: ['Chemical handling', 'Proper ventilation', 'Waste disposal']
    }
};

// Multi-language experiment titles
const experimentTitles = {
    en: {
        'combustion-advanced': 'Advanced Combustion Analysis',
        'acid-base': 'Acid-Base Titration Laboratory',
        'color-change': 'Chromatic Chemical Reactions',
        'electrolysis': 'Water Electrolysis Experiment',
        'galvanic': 'Galvanic Cell Construction',
        'polymer': 'Polymer Synthesis Laboratory',
        'chromatography': 'Chromatography Separation'
    },
    bg: {
        'combustion-advanced': 'Напреднал анализ на горене',
        'acid-base': 'Лаборатория за киселинно-основно титруване',
        'color-change': 'Хроматични химически реакции',
        'electrolysis': 'Експеримент с електролиза на вода',
        'galvanic': 'Изграждане на галванична клетка',
        'polymer': 'Лаборатория за синтез на полимери',
        'chromatography': 'Хроматографско разделяне'
    }
};

// Global variables
let currentExperiment = null;
let experimentData = {};
let isExperimentRunning = false;
// currentLanguage is already declared in main.js

// Experiment progress tracking
let experimentProgress = {
    completedExperiments: [],
    dataPointsCollected: 0,
    achievementLevel: 'Beginner Scientist'
};

// Initialize experiments page
document.addEventListener('DOMContentLoaded', function() {
    initializeExperiments();
    loadLabProgress();
    // Use currentLanguage from main.js or fallback
    if (typeof currentLanguage === 'undefined') {
        currentLanguage = localStorage.getItem('himiq_language') || 'en';
    }
});

// Handle language changes
document.addEventListener('languageChanged', function(e) {
    if (e.detail) {
        currentLanguage = e.detail.language;
        updateExperimentTitles();
    }
});

function initializeExperiments() {
    const experimentBtns = document.querySelectorAll('.experiment-btn');
    const experimentModal = document.getElementById('experimentModal');
    const closeBtn = document.getElementById('closeExperimentModal');
    
    // Set up experiment buttons
    experimentBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const experimentType = this.getAttribute('data-experiment');
            if (experimentConfigs[experimentType]) {
                startExperimentSession(experimentType);
            }
        });
    });
    
    // Set up close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeExperimentModal);
    }
    
    // Set up outside click to close modal
    if (experimentModal) {
        experimentModal.addEventListener('click', function(e) {
            if (e.target === experimentModal) {
                closeExperimentModal();
            }
        });
    }
    
    updateProgressDisplay();
}

function startExperimentSession(experimentType) {
    const config = experimentConfigs[experimentType];
    if (!config) return;
    
    // Set current experiment
    currentExperiment = {
        type: experimentType,
        config: config,
        startTime: Date.now(),
        dataPoints: [],
        phase: 'setup'
    };
    
    // Get experiment title based on current language
    const experimentTitle = experimentTitles[currentLanguage] && experimentTitles[currentLanguage][experimentType] 
        ? experimentTitles[currentLanguage][experimentType] 
        : config.title;
    
    // Update workspace title
    const workspaceTitle = document.getElementById('experimentTitle');
    if (workspaceTitle) {
        workspaceTitle.textContent = experimentTitle;
    }
    
    // Setup experiment workspace directly instead of modal
    setupExperimentWorkspace(experimentType);
    
    // Enable controls
    const controls = document.querySelectorAll('.workspace-controls .control-btn');
    controls.forEach(btn => btn.disabled = false);
    
    // Record this experiment as completed after some time
    setTimeout(() => {
        recordCompletedExperiment(experimentType);
    }, 5000);
}

function openExperimentModal(config) {
    const modal = document.getElementById('experimentModal');
    const title = document.getElementById('experimentTitle');
    
    if (title) {
        title.textContent = config.title;
    }
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    // Add safety information
    displaySafetyInfo(config.safety);
}

function closeExperimentModal() {
    const modal = document.getElementById('experimentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Reset experiment state
    currentExperiment = null;
    isExperimentRunning = false;
}

function displaySafetyInfo(safetyItems) {
    const safetyContainer = document.getElementById('safetyInfo');
    if (!safetyContainer || !safetyItems) return;
    
    const safetyList = safetyItems.map(item => `<li>${item}</li>`).join('');
    safetyContainer.innerHTML = `
        <h4>${currentLanguage === 'bg' ? 'Мерки за безопасност:' : 'Safety Precautions:'}</h4>
        <ul>${safetyList}</ul>
    `;
}

function setupExperimentWorkspace(experimentType) {
    const workspace = document.getElementById('experimentWorkspace');
    if (!workspace) return;
    
    // Clear the placeholder content
    workspace.innerHTML = `
        <div class="experiment-interface">
            <div class="experiment-header">
                <h4>${currentLanguage === 'bg' ? 'Експериментална установка' : 'Experiment Setup'}</h4>
                <div class="safety-info">
                    <span class="safety-icon">⚠️</span>
                    <span>${currentLanguage === 'bg' ? 'Следвайте инструкциите за безопасност' : 'Follow safety instructions'}</span>
                </div>
            </div>
            <div class="experiment-controls" id="experimentControls">
                ${createExperimentControls(experimentType)}
            </div>
            <div class="experiment-visualization" id="experimentVisualization">
                ${createExperimentVisualization(experimentType)}
            </div>
            <div class="experiment-data" id="experimentData">
                <h4>${currentLanguage === 'bg' ? 'Данни от експеримента:' : 'Experiment Data:'}</h4>
                <div class="data-display">
                    <p class="data-placeholder">${currentLanguage === 'bg' ? 'Данните ще се показват тук...' : 'Data will appear here...'}</p>
                </div>
            </div>
        </div>
    `;
    
    // Initialize experiment-specific interactions
    initializeExperimentInteractions(experimentType);
    
    // Start data collection after a short delay
    setTimeout(() => {
        startDataCollection(experimentType);
    }, 1000);
}

function startDataCollection(experimentType) {
    const config = experimentConfigs[experimentType];
    if (!config || !config.data) return;
    
    const dataDisplay = document.querySelector('.experiment-data .data-display');
    if (dataDisplay) {
        dataDisplay.innerHTML = '';
        
        // Create data points for each measurement
        config.data.forEach((dataType, index) => {
            const dataPoint = document.createElement('div');
            dataPoint.className = 'data-point';
            dataPoint.innerHTML = `
                <span class="data-label">${dataType}:</span>
                <span class="data-value" id="dataValue_${index}">0</span>
            `;
            dataDisplay.appendChild(dataPoint);
        });
        
        // Simulate data updates
        startDataSimulation(experimentType);
    }
}

function startDataSimulation(experimentType) {
    const config = experimentConfigs[experimentType];
    if (!config) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        if (progress >= 1) {
            clearInterval(interval);
            return;
        }
        
        progress += 0.1;
        
        // Update each data point
        config.data.forEach((dataType, index) => {
            const valueElement = document.getElementById(`dataValue_${index}`);
            if (valueElement) {
                let value = generateRealisticValue(experimentType, dataType, progress);
                valueElement.textContent = value;
                
                // Add animation
                valueElement.style.animation = 'none';
                setTimeout(() => {
                    valueElement.style.animation = 'pulse 0.3s ease-in-out';
                }, 10);
            }
        });
        
        // Update progress tracking
        experimentProgress.dataPointsCollected++;
        updateProgressDisplay();
        
    }, 1000);
}

function generateRealisticValue(experimentType, dataType, progress) {
    switch(experimentType) {
        case 'combustion-advanced':
            if (dataType === 'Temperature') {
                return Math.round(25 + progress * 475 + Math.random() * 10) + '°C';
            } else if (dataType === 'Pressure') {
                return (1 + progress * 2 + Math.random() * 0.1).toFixed(2) + ' atm';
            } else if (dataType === 'CO₂ Production') {
                return (progress * 24 + Math.random() * 1.5).toFixed(1) + ' g';
            } else if (dataType === 'Energy Release') {
                return Math.round(progress * 5200 + Math.random() * 50) + ' kJ';
            }
            break;
        case 'acid-base':
            if (dataType === 'pH Value') {
                return (14 - progress * 11 + Math.random() * 0.2).toFixed(2);
            } else if (dataType === 'Volume Added') {
                return (progress * 25 + Math.random() * 0.5).toFixed(1) + ' mL';
            } else if (dataType === 'Temperature') {
                return Math.round(20 + progress * 15 + Math.random() * 2) + '°C';
            } else if (dataType === 'Conductivity') {
                return Math.round(100 + progress * 800 + Math.random() * 20) + ' µS/cm';
            }
            break;
        case 'electrolysis':
            if (dataType === 'Current') {
                return (0.2 + progress * 0.8 + Math.random() * 0.1).toFixed(2) + ' A';
            } else if (dataType === 'Voltage') {
                return (1.2 + progress * 0.5 + Math.random() * 0.1).toFixed(1) + ' V';
            } else if (dataType === 'H₂ Volume') {
                return Math.round(progress * 24 + Math.random() * 2) + ' mL';
            } else if (dataType === 'O₂ Volume') {
                return Math.round(progress * 12 + Math.random() * 1) + ' mL';
            }
            break;
        default:
            return Math.round(progress * 100 + Math.random() * 10);
    }
    return Math.round(progress * 100 + Math.random() * 10);
}

function createExperimentControls(experimentType) {
    const controlsMap = {
        'combustion-advanced': createCombustionControls,
        'acid-base': createAcidBaseControls,
        'color-change': createColorChangeControls,
        'electrolysis': createElectrolysisControls,
        'galvanic': createGalvanicControls,
        'polymer': createPolymerControls,
        'chromatography': createChromatographyControls
    };
    
    const createFunction = controlsMap[experimentType];
    return createFunction ? createFunction() : createDefaultControls();
}

function createExperimentVisualization(experimentType) {
    const visualizationMap = {
        'combustion-advanced': createCombustionVisualization,
        'acid-base': createAcidBaseVisualization,
        'color-change': createColorChangeVisualization,
        'electrolysis': createElectrolysisVisualization,
        'galvanic': createGalvanicVisualization,
        'polymer': createPolymerVisualization,
        'chromatography': createChromatographyVisualization
    };
    
    const createFunction = visualizationMap[experimentType];
    return createFunction ? createFunction() : createDefaultVisualization();
}

// Control creation functions
function createCombustionControls() {
    return `
        <div class="control-group">
            <label>${currentLanguage === 'bg' ? 'Скорост на въздуха:' : 'Air Flow Rate:'}</label>
            <input type="range" id="airFlow" min="1" max="10" value="5">
            <span id="airFlowValue">5</span>
        </div>
        <div class="control-group">
            <label>${currentLanguage === 'bg' ? 'Температура:' : 'Temperature:'}</label>
            <input type="range" id="temperature" min="200" max="800" value="400">
            <span id="temperatureValue">400°C</span>
        </div>
        <button class="experiment-button" onclick="startCombustion()">${currentLanguage === 'bg' ? 'Започни горене' : 'Start Combustion'}</button>
    `;
}

function createAcidBaseControls() {
    return `
        <div class="control-group">
            <label>${currentLanguage === 'bg' ? 'Обем на титрант:' : 'Titrant Volume:'}</label>
            <input type="range" id="titrantVolume" min="0" max="50" value="0" step="0.5">
            <span id="titrantVolumeValue">0.0 mL</span>
        </div>
        <button class="experiment-button" onclick="addTitrant()">${currentLanguage === 'bg' ? 'Добави титрант' : 'Add Titrant'}</button>
        <button class="experiment-button" onclick="resetTitration()">${currentLanguage === 'bg' ? 'Нулиране' : 'Reset'}</button>
    `;
}

function createColorChangeControls() {
    return `
        <div class="control-group">
            <button class="experiment-button" onclick="mixSolution('A')">${currentLanguage === 'bg' ? 'Разтвор А' : 'Solution A'}</button>
            <button class="experiment-button" onclick="mixSolution('B')">${currentLanguage === 'bg' ? 'Разтвор Б' : 'Solution B'}</button>
            <button class="experiment-button" onclick="mixSolution('C')">${currentLanguage === 'bg' ? 'Разтвор В' : 'Solution C'}</button>
        </div>
        <button class="experiment-button" onclick="resetSolutions()">${currentLanguage === 'bg' ? 'Нулиране' : 'Reset'}</button>
    `;
}

function createElectrolysisControls() {
    return `
        <div class="control-group">
            <label>${currentLanguage === 'bg' ? 'Напрежение:' : 'Voltage:'}</label>
            <input type="range" id="voltage" min="1" max="12" value="6">
            <span id="voltageValue">6V</span>
        </div>
        <button class="experiment-button" onclick="startElectrolysis()">${currentLanguage === 'bg' ? 'Започни електролиза' : 'Start Electrolysis'}</button>
        <button class="experiment-button" onclick="stopElectrolysis()">${currentLanguage === 'bg' ? 'Спри' : 'Stop'}</button>
    `;
}

function createGalvanicControls() {
    return `
        <div class="control-group">
            <button class="experiment-button" onclick="connectCell()">${currentLanguage === 'bg' ? 'Свържи клетката' : 'Connect Cell'}</button>
            <button class="experiment-button" onclick="measureVoltage()">${currentLanguage === 'bg' ? 'Измери напрежение' : 'Measure Voltage'}</button>
        </div>
    `;
}

function createPolymerControls() {
    return `
        <div class="control-group">
            <label>${currentLanguage === 'bg' ? 'Температура на реакция:' : 'Reaction Temperature:'}</label>
            <input type="range" id="reactionTemp" min="50" max="200" value="100">
            <span id="reactionTempValue">100°C</span>
        </div>
        <button class="experiment-button" onclick="startPolymerization()">${currentLanguage === 'bg' ? 'Започни полимеризация' : 'Start Polymerization'}</button>
    `;
}

function createChromatographyControls() {
    return `
        <div class="control-group">
            <button class="experiment-button" onclick="startSeparation()">${currentLanguage === 'bg' ? 'Започни разделяне' : 'Start Separation'}</button>
            <button class="experiment-button" onclick="calculateRf()">${currentLanguage === 'bg' ? 'Изчисли Rf' : 'Calculate Rf'}</button>
        </div>
    `;
}

function createDefaultControls() {
    return `
        <div class="control-group">
            <button class="experiment-button">${currentLanguage === 'bg' ? 'Започни експеримент' : 'Start Experiment'}</button>
        </div>
    `;
}

// Visualization creation functions
function createCombustionVisualization() {
    return `
        <div class="combustion-chamber">
            <div class="flame" id="combustionFlame"></div>
            <div class="fuel-indicator" id="fuelLevel"></div>
        </div>
    `;
}

function createAcidBaseVisualization() {
    return `
        <div class="titration-setup">
            <div class="burette" id="burette"></div>
            <div class="solution-beaker" id="solutionBeaker">
                <div class="solution" id="mainSolution"></div>
            </div>
            <div class="ph-indicator" id="phIndicator">pH: 7.0</div>
        </div>
    `;
}

function createColorChangeVisualization() {
    return `
        <div class="reaction-vessels">
            <div class="beaker" id="reactionBeaker">
                <div class="solution" id="reactionSolution"></div>
            </div>
            <div class="color-analysis" id="colorAnalysis"></div>
        </div>
    `;
}

function createElectrolysisVisualization() {
    return `
        <div class="electrolysis-cell">
            <div class="electrode cathode" id="cathode"></div>
            <div class="electrode anode" id="anode"></div>
            <div class="electrolyte" id="electrolyte"></div>
            <div class="bubble-container" id="bubbleContainer"></div>
        </div>
    `;
}

function createGalvanicVisualization() {
    return `
        <div class="galvanic-setup">
            <div class="half-cell" id="anodeCell"></div>
            <div class="salt-bridge" id="saltBridge"></div>
            <div class="half-cell" id="cathodeCell"></div>
            <div class="voltmeter" id="voltmeter">0.00V</div>
        </div>
    `;
}

function createPolymerVisualization() {
    return `
        <div class="polymer-reaction">
            <div class="monomer-container" id="monomers"></div>
            <div class="polymer-chain" id="polymerChain"></div>
            <div class="reaction-progress" id="reactionProgress"></div>
        </div>
    `;
}

function createChromatographyVisualization() {
    return `
        <div class="chromatography-setup">
            <div class="chromatography-paper" id="chromPaper"></div>
            <div class="solvent-front" id="solventFront"></div>
            <div class="sample-spots" id="sampleSpots"></div>
        </div>
    `;
}

function createDefaultVisualization() {
    return `
        <div class="default-visualization">
            <div class="experiment-placeholder">
                ${currentLanguage === 'bg' ? 'Визуализация на експеримента' : 'Experiment Visualization'}
            </div>
        </div>
    `;
}

// Experiment interaction functions
function initializeExperimentInteractions(experimentType) {
    // Add range input listeners
    const rangeInputs = document.querySelectorAll('#experimentWorkspace input[type="range"]');
    rangeInputs.forEach(input => {
        input.addEventListener('input', function() {
            const valueSpan = document.getElementById(this.id + 'Value');
            if (valueSpan) {
                let value = this.value;
                if (this.id === 'temperature' || this.id === 'reactionTemp') {
                    value += '°C';
                } else if (this.id === 'voltage') {
                    value += 'V';
                } else if (this.id === 'titrantVolume') {
                    value += ' mL';
                }
                valueSpan.textContent = value;
            }
        });
    });
    
    // Initialize experiment-specific interactions
    switch (experimentType) {
        case 'electrolysis':
            initializeElectrolysisAnimation();
            break;
        case 'acid-base':
            initializeTitrationAnimation();
            break;
        // Add more specific initializations as needed
    }
}

// Specific experiment functions
function startCombustion() {
    const airFlow = document.getElementById('airFlow').value;
    const temperature = document.getElementById('temperature').value;
    
    console.log('Starting combustion with air flow:', airFlow, 'and temperature:', temperature);
    
    // Animate flame
    const flame = document.getElementById('combustionFlame');
    if (flame) {
        flame.style.height = (airFlow * 10) + 'px';
        flame.style.backgroundColor = temperature > 600 ? '#ff4500' : '#ff6600';
    }
    
    updateExperimentData('Temperature', temperature + '°C');
    updateExperimentData('Air Flow', airFlow + ' L/min');
}

function addTitrant() {
    const volume = document.getElementById('titrantVolume').value;
    const solution = document.getElementById('mainSolution');
    const phIndicator = document.getElementById('phIndicator');
    
    if (solution && phIndicator) {
        // Calculate pH based on volume added
        const ph = Math.max(1, 14 - (volume / 3.5));
        phIndicator.textContent = `pH: ${ph.toFixed(1)}`;
        
        // Change solution color based on pH
        const hue = Math.min(120, ph * 10);
        solution.style.backgroundColor = `hsl(${hue}, 50%, 50%)`;
    }
    
    updateExperimentData('Volume Added', volume + ' mL');
    updateExperimentData('pH', phIndicator ? phIndicator.textContent : 'N/A');
}

function resetTitration() {
    const solution = document.getElementById('mainSolution');
    const phIndicator = document.getElementById('phIndicator');
    const volumeSlider = document.getElementById('titrantVolume');
    
    if (solution) solution.style.backgroundColor = '#87CEEB';
    if (phIndicator) phIndicator.textContent = 'pH: 7.0';
    if (volumeSlider) {
        volumeSlider.value = 0;
        document.getElementById('titrantVolumeValue').textContent = '0.0 mL';
    }
}

function startElectrolysis() {
    const voltage = document.getElementById('voltage').value;
    
    console.log('Starting electrolysis with voltage:', voltage);
    
    // Start bubble animation
    const bubbleContainer = document.getElementById('bubbleContainer');
    if (bubbleContainer) {
        startBubbleAnimation(bubbleContainer, voltage);
    }
    
    updateExperimentData('Voltage', voltage + 'V');
    updateExperimentData('Status', 'Running');
}

function stopElectrolysis() {
    const bubbleContainer = document.getElementById('bubbleContainer');
    if (bubbleContainer) {
        bubbleContainer.innerHTML = '';
    }
    
    updateExperimentData('Status', 'Stopped');
}

function startBubbleAnimation(container, intensity) {
    const createBubble = () => {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDuration = (2 + Math.random() * 2) + 's';
        container.appendChild(bubble);
        
        setTimeout(() => {
            if (container.contains(bubble)) {
                container.removeChild(bubble);
            }
        }, 4000);
    };
    
    // Create bubbles based on voltage intensity
    const interval = Math.max(100, 1000 / intensity);
    const bubbleTimer = setInterval(createBubble, interval);
    
    // Stop after 10 seconds
    setTimeout(() => {
        clearInterval(bubbleTimer);
    }, 10000);
}

function initializeElectrolysisAnimation() {
    // Add CSS for bubble animation if not already present
    if (!document.getElementById('bubbleStyles')) {
        const style = document.createElement('style');
        style.id = 'bubbleStyles';
        style.textContent = `
            .bubble {
                position: absolute;
                bottom: 0;
                width: 8px;
                height: 8px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                animation: bubbleRise 3s linear forwards;
            }
            
            @keyframes bubbleRise {
                0% { transform: translateY(0); opacity: 1; }
                100% { transform: translateY(-200px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function initializeTitrationAnimation() {
    // Initialize pH indicator colors and animations
    const solution = document.getElementById('mainSolution');
    if (solution) {
        solution.style.backgroundColor = '#87CEEB';
        solution.style.transition = 'background-color 0.5s ease';
    }
}

// Data handling functions
function updateExperimentData(parameter, value) {
    const dataDisplay = document.querySelector('.data-display');
    if (!dataDisplay) return;
    
    const timestamp = new Date().toLocaleTimeString();
    const dataPoint = document.createElement('div');
    dataPoint.className = 'data-point';
    dataPoint.innerHTML = `
        <span class="timestamp">${timestamp}</span>
        <span class="parameter">${parameter}:</span>
        <span class="value">${value}</span>
    `;
    
    dataDisplay.appendChild(dataPoint);
    dataDisplay.scrollTop = dataDisplay.scrollHeight;
    
    // Update progress tracking
    experimentProgress.dataPointsCollected++;
    updateProgressDisplay();
}

function recordCompletedExperiment(experimentType) {
    if (!experimentProgress.completedExperiments.includes(experimentType)) {
        experimentProgress.completedExperiments.push(experimentType);
        updateAchievementLevel();
        saveLabProgress();
    }
}

function updateAchievementLevel() {
    const completed = experimentProgress.completedExperiments.length;
    const dataPoints = experimentProgress.dataPointsCollected;
    
    if (completed >= 7 && dataPoints >= 50) {
        experimentProgress.achievementLevel = 'Master Chemist';
    } else if (completed >= 5 && dataPoints >= 30) {
        experimentProgress.achievementLevel = 'Advanced Researcher';
    } else if (completed >= 3 && dataPoints >= 15) {
        experimentProgress.achievementLevel = 'Skilled Scientist';
    } else if (completed >= 1 && dataPoints >= 5) {
        experimentProgress.achievementLevel = 'Junior Researcher';
    }
}

function updateProgressDisplay() {
    const progressContainer = document.getElementById('labProgress');
    if (!progressContainer) return;
    
    const completed = experimentProgress.completedExperiments.length;
    const total = Object.keys(experimentConfigs).length;
    const percentage = Math.round((completed / total) * 100);
    
    progressContainer.innerHTML = `
        <div class="progress-info">
            <h3>${currentLanguage === 'bg' ? 'Прогрес в лабораторията' : 'Laboratory Progress'}</h3>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
            </div>
            <p>${completed}/${total} ${currentLanguage === 'bg' ? 'експеримента завършени' : 'experiments completed'}</p>
            <p>${currentLanguage === 'bg' ? 'Ниво:' : 'Level:'} ${experimentProgress.achievementLevel}</p>
            <p>${currentLanguage === 'bg' ? 'Данни:' : 'Data Points:'} ${experimentProgress.dataPointsCollected}</p>
        </div>
    `;
}

// Storage functions
function saveLabProgress() {
    try {
        localStorage.setItem('himiq_lab_progress', JSON.stringify(experimentProgress));
    } catch (error) {
        console.warn('Could not save lab progress:', error);
    }
}

function loadLabProgress() {
    try {
        const saved = localStorage.getItem('himiq_lab_progress');
        if (saved) {
            const parsed = JSON.parse(saved);
            experimentProgress = { ...experimentProgress, ...parsed };
        }
    } catch (error) {
        console.warn('Could not load lab progress:', error);
    }
}

// Language support functions
function updateExperimentTitles() {
    const title = document.getElementById('experimentTitle');
    if (title && currentExperiment) {
        const experimentType = currentExperiment.type;
        const translatedTitle = experimentTitles[currentLanguage] && experimentTitles[currentLanguage][experimentType] 
            ? experimentTitles[currentLanguage][experimentType] 
            : experimentConfigs[experimentType].title;
        title.textContent = translatedTitle;
    }
}

console.log('Himiq School Virtual Laboratory loaded successfully');
