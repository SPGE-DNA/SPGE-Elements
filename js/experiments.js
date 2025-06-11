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

// Update experiment titles when language changes
function updateExperimentTitles() {
    console.log('🌐 Updating experiment titles for language:', currentLanguage);
    
    const experimentCards = document.querySelectorAll('.experiment-card');
    experimentCards.forEach(card => {
        const button = card.querySelector('.experiment-btn');
        if (!button) return;
        
        const experimentType = button.dataset.experiment;
        if (experimentTitles[currentLanguage] && experimentTitles[currentLanguage][experimentType]) {
            const title = card.querySelector('h4');
            if (title) {
                title.textContent = experimentTitles[currentLanguage][experimentType];
            }
        }
    });
    
    // Update experiment modal title if open
    const experimentTitle = document.getElementById('experimentTitle');
    if (experimentTitle && currentExperiment) {
        const experimentType = currentExperiment.type;
        if (experimentTitles[currentLanguage] && experimentTitles[currentLanguage][experimentType]) {
            experimentTitle.textContent = experimentTitles[currentLanguage][experimentType];
        }
    }
}

// Experiment progress display update
function updateProgressDisplay() {
    const progressContainer = document.getElementById('progressDisplay');
    if (!progressContainer) return;
    
    // Clear existing content
    progressContainer.innerHTML = '';
    
    // Create progress elements
    const completedText = document.createElement('div');
    completedText.className = 'progress-item';
    completedText.innerHTML = `<strong>${experimentProgress.completedExperiments.length}</strong> ${currentLanguage === 'bg' ? 'завършени експеримента' : 'completed experiments'}`;
    
    const dataPointsText = document.createElement('div');
    dataPointsText.className = 'progress-item';
    dataPointsText.innerHTML = `<strong>${experimentProgress.dataPointsCollected}</strong> ${currentLanguage === 'bg' ? 'събрани данни' : 'data points collected'}`;
    
    const achievementText = document.createElement('div');
    achievementText.className = 'progress-item';
    achievementText.innerHTML = `<strong>${experimentProgress.achievementLevel}</strong>`;
    
    // Append to container
    progressContainer.appendChild(completedText);
    progressContainer.appendChild(dataPointsText);
    progressContainer.appendChild(achievementText);
}

// Initialize experiments page
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
    
    // Set up experiment control buttons
    const startExperimentBtn = document.getElementById('startExperiment');
    const resetExperimentBtn = document.getElementById('resetExperiment');
    const pauseExperimentBtn = document.getElementById('pauseExperiment');
      if (startExperimentBtn) {
        startExperimentBtn.addEventListener('click', function() {
            if (currentExperiment) {
                startExperimentAnimation(currentExperiment.type);
                this.classList.add('experiment-btn-hidden');
                if (pauseExperimentBtn) {
                    pauseExperimentBtn.classList.remove('experiment-btn-hidden');
                    pauseExperimentBtn.classList.add('experiment-btn-visible');
                }
            }
        });
    }
      if (resetExperimentBtn) {
        resetExperimentBtn.addEventListener('click', function() {
            if (currentExperiment) {
                resetExperimentAnimation(currentExperiment.type);
                if (startExperimentBtn) {
                    startExperimentBtn.classList.remove('experiment-btn-hidden');
                    startExperimentBtn.classList.add('experiment-btn-visible');
                }
                if (pauseExperimentBtn) {
                    pauseExperimentBtn.classList.add('experiment-btn-hidden');
                    pauseExperimentBtn.classList.remove('experiment-btn-visible');
                }
            }
        });
    }
      if (pauseExperimentBtn) {
        pauseExperimentBtn.addEventListener('click', function() {
            if (currentExperiment) {
                pauseExperimentAnimation(currentExperiment.type);
                this.classList.add('experiment-btn-hidden');
                this.classList.remove('experiment-btn-visible');
                if (startExperimentBtn) {
                    startExperimentBtn.classList.remove('experiment-btn-hidden');
                    startExperimentBtn.classList.add('experiment-btn-visible');
                }
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
    
    // Open the experiment modal
    openExperimentModal({
        title: experimentTitle,
        type: experimentType
    });
    
    // Setup experiment workspace
    setupExperimentWorkspace(experimentType);
    
    // Initialize experiment interactions
    initializeExperimentInteractions(experimentType);
    
    // Enable controls
    const controls = document.querySelectorAll('.experiment-controls .btn');
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
        title.dataset.experimentType = config.type;
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
    const workspace = document.getElementById('experimentArea');
    if (!workspace) {
        console.warn('Experiment area not found');
        return;
    }
    
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
            <div class="fuel-indicator" id="fuelLevel">
                <div class="fuel-gauge">
                    <span class="fuel-label">Fuel Level</span>
                    <div class="fuel-bar">
                        <div class="fuel-fill" id="fuelFill"></div>
                    </div>
                </div>
            </div>
            <div class="temperature-display" id="tempDisplay">400°C</div>
            <div class="emission-particles" id="emissionParticles"></div>
        </div>
    `;
}

function createAcidBaseVisualization() {
    return `
        <div class="titration-setup">
            <div class="burette" id="burette">
                <div class="burette-solution" id="buretteSolution"></div>
                <div class="droplet" id="droplet"></div>
            </div>
            <div class="solution-beaker" id="solutionBeaker">
                <div class="solution" id="mainSolution"></div>
                <div class="ph-paper" id="phPaper"></div>
            </div>
            <div class="ph-indicator" id="phIndicator">pH: 7.0</div>
            <div class="titration-curve" id="titrationCurve">
                <canvas id="curveCanvas" width="200" height="150"></canvas>
            </div>
        </div>
    `;
}

function createColorChangeVisualization() {
    return `
        <div class="reaction-vessels">
            <div class="beaker" id="reactionBeaker">
                <div class="solution" id="reactionSolution"></div>
                <div class="mixing-animation" id="mixingAnimation"></div>
            </div>
            <div class="color-analysis" id="colorAnalysis">
                <h5>Spectral Analysis</h5>
                <div class="spectrum-display" id="spectrumDisplay"></div>
                <p>Select a solution to analyze</p>
            </div>
            <div class="molecular-structure" id="molecularStructure">
                <div class="molecule" id="activeMolecule"></div>
            </div>
        </div>
    `;
}

function createElectrolysisVisualization() {
    return `
        <div class="electrolysis-cell">
            <div class="electrode cathode" id="cathode">
                <span class="electrode-label">Cathode (-)</span>
            </div>
            <div class="electrode anode" id="anode">
                <span class="electrode-label">Anode (+)</span>
            </div>
            <div class="electrolyte" id="electrolyte">
                <div class="ion-flow" id="ionFlow"></div>
            </div>
            <div class="bubble-container" id="bubbleContainer"></div>
            <div class="current-flow" id="currentFlow">
                <div class="electron-path" id="electronPath"></div>
            </div>
            <div class="voltage-meter" id="voltageMeter">
                <span class="meter-display">6.0V</span>
            </div>
        </div>
    `;
}

function createGalvanicVisualization() {
    return `
        <div class="galvanic-setup">
            <div class="half-cell anode-cell" id="anodeCell">
                <div class="electrode-rod" id="anodeRod"></div>
                <div class="solution" id="anodeSolution"></div>
                <span class="cell-label">Zn | Zn²⁺</span>
            </div>
            <div class="salt-bridge" id="saltBridge">
                <span class="bridge-label">KCl Bridge</span>
                <div class="ion-movement" id="ionMovement"></div>
            </div>
            <div class="half-cell cathode-cell" id="cathodeCell">
                <div class="electrode-rod" id="cathodeRod"></div>
                <div class="solution" id="cathodeSolution"></div>
                <span class="cell-label">Cu²⁺ | Cu</span>
            </div>
            <div class="voltmeter" id="voltmeter">
                <div class="meter-face">
                    <div class="meter-needle" id="meterNeedle"></div>
                    <span class="voltage-reading">0.00V</span>
                </div>
            </div>
            <div class="electron-circuit" id="electronCircuit">
                <div class="electron-flow" id="electronFlow"></div>
            </div>
        </div>
    `;
}

function createPolymerVisualization() {
    return `
        <div class="polymer-reaction">
            <div class="monomer-container" id="monomers">
                <div class="monomer" data-type="A">A</div>
                <div class="monomer" data-type="B">B</div>
                <div class="monomer" data-type="A">A</div>
                <div class="monomer" data-type="B">B</div>
            </div>
            <div class="polymer-chain" id="polymerChain">
                <div class="chain-indicator">Polymer Formation</div>
            </div>
            <div class="reaction-progress" id="reactionProgress">
                <div class="progress-bar">
                    <div class="progress-fill" id="polymerProgress"></div>
                </div>
                <span class="progress-text">0% Complete</span>
            </div>
            <div class="molecular-weight" id="molecularWeight">
                <span>MW: 0 g/mol</span>
            </div>
        </div>
    `;
}

function createChromatographyVisualization() {
    return `
        <div class="chromatography-setup">
            <div class="chromatography-paper" id="chromPaper">
                <div class="paper-grid"></div>
                <div class="sample-origin" id="sampleOrigin"></div>
            </div>
            <div class="solvent-front" id="solventFront">
                <div class="solvent-line" id="solventLine"></div>
            </div>
            <div class="sample-spots" id="sampleSpots">
                <div class="spot red-spot" id="redSpot"></div>
                <div class="spot blue-spot" id="blueSpot"></div>
                <div class="spot green-spot" id="greenSpot"></div>
            </div>
            <div class="rf-calculations" id="rfCalculations">
                <h5>Rf Values</h5>
                <div class="rf-table">
                    <div class="rf-row"><span>Red:</span> <span id="rfRed">0.00</span></div>
                    <div class="rf-row"><span>Blue:</span> <span id="rfBlue">0.00</span></div>
                    <div class="rf-row"><span>Green:</span> <span id="rfGreen">0.00</span></div>
                </div>
            </div>
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

// Enhanced visual feedback and animation system
class ExperimentAnimationManager {
    constructor() {
        this.activeAnimations = new Map();
        this.particleSystems = new Map();
        this.performanceMode = this.detectPerformanceMode();
    }

    detectPerformanceMode() {
        // Detect device capabilities for adaptive animations
        const isHighPerformance = window.devicePixelRatio > 1 && 
                                  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return isHighPerformance ? 'high' : 'standard';
    }

    createParticleSystem(container, options = {}) {
        const defaults = {
            particleCount: this.performanceMode === 'high' ? 20 : 10,
            particleSize: 3,
            particleSpeed: 2,
            particleLife: 3000,
            particleColors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502'],
            emissionRate: 100
        };
        
        const config = { ...defaults, ...options };
        const particleSystem = {
            container,
            particles: [],
            config,
            lastEmission: 0,
            isActive: false
        };
        
        this.particleSystems.set(container.id, particleSystem);
        return particleSystem;
    }

    startParticleSystem(containerId) {
        const system = this.particleSystems.get(containerId);
        if (!system) return;
        
        system.isActive = true;
        this.animateParticleSystem(system);
    }

    stopParticleSystem(containerId) {
        const system = this.particleSystems.get(containerId);
        if (system) {
            system.isActive = false;
        }
    }

    animateParticleSystem(system) {
        if (!system.isActive) return;
        
        const now = Date.now();
        
        // Emit new particles
        if (now - system.lastEmission > system.config.emissionRate) {
            this.emitParticle(system);
            system.lastEmission = now;
        }
        
        // Update existing particles
        system.particles = system.particles.filter(particle => {
            this.updateParticle(particle);
            return particle.life > 0;
        });
        
        requestAnimationFrame(() => this.animateParticleSystem(system));
    }

    emitParticle(system) {
        const particle = document.createElement('div');
        particle.className = 'animated-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${system.config.particleSize}px;
            height: ${system.config.particleSize}px;
            background: ${system.config.particleColors[Math.floor(Math.random() * system.config.particleColors.length)]};
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            bottom: 0;
            z-index: 10;
            box-shadow: 0 0 5px currentColor;
        `;
        
        particle.life = system.config.particleLife;
        particle.velocity = {
            x: (Math.random() - 0.5) * system.config.particleSpeed,
            y: system.config.particleSpeed + Math.random() * 2
        };
        
        system.container.appendChild(particle);
        system.particles.push(particle);
    }

    updateParticle(particle) {
        particle.life -= 16; // Assuming 60fps
        const progress = 1 - (particle.life / 3000);
        
        const currentBottom = parseFloat(particle.style.bottom) || 0;
        const currentLeft = parseFloat(particle.style.left) || 0;
        
        particle.style.bottom = (currentBottom + particle.velocity.y) + 'px';
        particle.style.left = (currentLeft + particle.velocity.x) + '%';
        particle.style.opacity = Math.max(0, 1 - progress);
        particle.style.transform = `scale(${1 - progress * 0.5})`;
        
        if (particle.life <= 0) {
            particle.remove();
        }
    }

    createRippleEffect(element, x = 0.5, y = 0.5) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(0, 212, 255, 0.3);
            transform: scale(0);
            animation: ripple-expand 0.6s linear;
            pointer-events: none;
            left: ${x * rect.width - 10}px;
            top: ${y * rect.height - 10}px;
            width: 20px;
            height: 20px;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    pulseElement(element, intensity = 1.05, duration = 300) {
        element.style.transition = `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        element.style.transform = `scale(${intensity})`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration / 2);
    }

    glowElement(element, color = 'rgba(0, 212, 255, 0.8)', duration = 1000) {
        const originalBoxShadow = element.style.boxShadow;
        element.style.transition = `box-shadow ${duration}ms ease-in-out`;
        element.style.boxShadow = `0 0 20px ${color}`;
        
        setTimeout(() => {
            element.style.boxShadow = originalBoxShadow;
        }, duration);
    }

    morphElement(element, targetStyles, duration = 500) {
        const originalStyles = {};
        
        // Store original styles
        Object.keys(targetStyles).forEach(property => {
            originalStyles[property] = element.style[property] || '';
        });
        
        // Apply transition
        element.style.transition = `all ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        
        // Apply target styles
        Object.keys(targetStyles).forEach(property => {
            element.style[property] = targetStyles[property];
        });
        
        // Return to original after duration
        setTimeout(() => {
            Object.keys(originalStyles).forEach(property => {
                element.style[property] = originalStyles[property];
            });
        }, duration);
    }
}

// Initialize animation manager
const animationManager = new ExperimentAnimationManager();

// Enhanced experiment functions with better visual feedback
function startCombustion() {
    const airFlow = document.getElementById('airFlow')?.value || 5;
    const temperature = document.getElementById('temperature')?.value || 400;
    
    console.log('Starting combustion with air flow:', airFlow, 'and temperature:', temperature);
    
    // Enhanced flame animation
    const flame = document.getElementById('combustionFlame');
    const emissionContainer = document.getElementById('emissionParticles');
    
    if (flame) {
        // Dynamic flame size and color based on parameters
        const flameHeight = Math.max(40, airFlow * 8);
        const flameIntensity = temperature / 800;
        
        flame.style.height = flameHeight + 'px';
        flame.style.filter = `hue-rotate(${(800 - temperature) / 10}deg) brightness(${0.8 + flameIntensity * 0.4})`;
        
        // Add flame particle effects
        if (emissionContainer) {
            const particleSystem = animationManager.createParticleSystem(emissionContainer, {
                particleCount: Math.floor(airFlow * 2),
                particleColors: temperature > 600 ? 
                    ['#ff4500', '#ff6b00', '#ffaa00', '#fff'] : 
                    ['#ff6b00', '#ffa502', '#ffeb3b'],
                emissionRate: Math.max(50, 200 - airFlow * 10)
            });
            
            animationManager.startParticleSystem(emissionContainer.id);
            
            // Stop particles after 10 seconds
            setTimeout(() => {
                animationManager.stopParticleSystem(emissionContainer.id);
            }, 10000);
        }
        
        // Pulse the combustion chamber
        const chamber = flame.closest('.combustion-chamber');
        if (chamber) {
            animationManager.glowElement(chamber, `rgba(255, ${Math.floor(107 + temperature/20)}, 0, 0.6)`, 2000);
        }
    }
    
    // Update data with visual feedback
    updateExperimentDataWithEffect('Temperature', temperature + '°C');
    updateExperimentDataWithEffect('Air Flow', airFlow + ' L/min');
    updateExperimentDataWithEffect('Combustion Status', 'Active');
}

// Enhanced titration with smoother color transitions
function addTitrant() {
    const volumeSlider = document.getElementById('titrantVolume');
    const volumeDisplay = document.getElementById('titrantVolumeValue');
    
    if (!volumeSlider) return;
    
    const volume = parseFloat(volumeSlider.value);
    const droplet = document.getElementById('droplet');
    const solution = document.getElementById('mainSolution');
    const phIndicator = document.getElementById('phIndicator');
    const curveCanvas = document.getElementById('curveCanvas');
    const phPaper = document.getElementById('phPaper');
    
    // Update volume display
    if (volumeDisplay) {
        volumeDisplay.textContent = volume.toFixed(1) + ' mL';
        animationManager.pulseElement(volumeDisplay, 1.1, 200);
    }
    
    // Enhanced droplet animation
    if (droplet) {
        droplet.style.opacity = '1';
        droplet.style.animation = 'droplet-fall-smooth 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        
        setTimeout(() => {
            droplet.style.opacity = '0';
        }, 1200);
    }
    
    // Smooth pH and color calculation
    if (solution && phIndicator) {
        const pH = calculatePH(volume);
        const colors = {
            1: '#ff0000',   // Strong acid - red
            3: '#ff4500',   // Weak acid - orange
            5: '#ffff00',   // Weak acid - yellow
            7: '#00ff00',   // Neutral - green
            9: '#00ffff',   // Weak base - cyan
            11: '#0000ff',  // Strong base - blue
            13: '#8000ff'   // Very strong base - purple
        };
        
        const nearestpH = Math.round(pH);
        const color = colors[nearestpH] || colors[7];
        
        // Smooth color transition
        solution.style.backgroundColor = color;
        solution.style.height = Math.min(70 + volume * 2, 90) + '%';
        
        // Enhanced pH paper color
        if (phPaper) {
            phPaper.style.backgroundColor = color;
            animationManager.glowElement(phPaper, color, 1000);
        }
        
        // Enhanced pH indicator
        phIndicator.textContent = `pH: ${pH.toFixed(1)}`;
        
        // Color the pH indicator based on acidity/basicity with smooth transitions
        let bgGradient;
        if (pH < 7) {
            bgGradient = `linear-gradient(135deg, #ff6b6b, #ff4757)`;
        } else if (pH > 7) {
            bgGradient = `linear-gradient(135deg, #4ecdc4, #45b7d1)`;
        } else {
            bgGradient = `linear-gradient(135deg, #2ed573, #20bf6b)`;
        }
        
        phIndicator.style.background = bgGradient;
        animationManager.pulseElement(phIndicator, 1.05, 300);
        
        // Enhanced titration curve drawing
        if (curveCanvas) {
            drawEnhancedTitrationCurve(curveCanvas, volume, pH);
        }
    }
    
    updateExperimentDataWithEffect('Volume Added', volume + ' mL');
    updateExperimentDataWithEffect('pH', pH.toFixed(1));
    updateExperimentDataWithEffect('Solution Color', getColorName(color));
}

function drawEnhancedTitrationCurve(canvas, volume, pH) {
    const ctx = canvas.getContext('2d');
    
    // Initialize curve data if not exists
    if (!canvas.curveData) {
        canvas.curveData = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw enhanced axes with grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        
        // Grid lines
        for (let i = 1; i < 8; i++) {
            const x = 30 + (i * 20);
            ctx.beginPath();
            ctx.moveTo(x, 20);
            ctx.lineTo(x, 130);
            ctx.stroke();
        }
        
        for (let i = 1; i < 6; i++) {
            const y = 20 + (i * 20);
            ctx.beginPath();
            ctx.moveTo(30, y);
            ctx.lineTo(180, y);
            ctx.stroke();
        }
        
        // Main axes
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, 20);
        ctx.lineTo(30, 130);
        ctx.lineTo(180, 130);
        ctx.stroke();
        
        // Enhanced labels
        ctx.fillStyle = '#ccc';
        ctx.font = 'bold 11px Arial';
        ctx.fillText('pH', 10, 25);
        ctx.fillText('Volume (mL)', 110, 145);
        
        // pH scale
        ctx.font = '9px Arial';
        for (let i = 0; i <= 14; i += 2) {
            const y = 130 - (i * 8);
            ctx.fillText(i.toString(), 15, y + 3);
        }
    }
    
    // Add new data point with smooth interpolation
    canvas.curveData.push({ volume: parseFloat(volume), pH: parseFloat(pH) });
    
    // Enhanced curve drawing with gradient
    if (canvas.curveData.length > 1) {
        const gradient = ctx.createLinearGradient(30, 20, 180, 130);
        gradient.addColorStop(0, '#ff6b6b');
        gradient.addColorStop(0.5, '#ffeb3b');
        gradient.addColorStop(1, '#4ecdc4');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.shadowColor = 'rgba(0, 212, 255, 0.5)';
        ctx.shadowBlur = 5;
        
        ctx.beginPath();
        
        for (let i = 0; i < canvas.curveData.length; i++) {
            const point = canvas.curveData[i];
            const x = 30 + (point.volume * 3);
            const y = 130 - (point.pH * 8);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                // Smooth curve with quadratic curves
                const prevPoint = canvas.curveData[i - 1];
                const prevX = 30 + (prevPoint.volume * 3);
                const prevY = 130 - (prevPoint.pH * 8);
                
                const cpX = (prevX + x) / 2;
                const cpY = (prevY + y) / 2;
                ctx.quadraticCurveTo(cpX, cpY, x, y);
            }
        }
        
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        // Enhanced data points
        canvas.curveData.forEach((point, index) => {
            const x = 30 + (point.volume * 3);
            const y = 130 - (point.pH * 8);
            
            // Animated point
            ctx.fillStyle = index === canvas.curveData.length - 1 ? '#ff6b6b' : 'rgba(255, 255, 255, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, index === canvas.curveData.length - 1 ? 4 : 2, 0, 2 * Math.PI);
            ctx.fill();
            
            if (index === canvas.curveData.length - 1) {
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        });
    }
}

// Helper function to calculate pH based on volume
function calculatePH(volume) {
    // Simplified titration curve calculation
    if (volume === 0) return 7.0;
    if (volume < 10) return Math.max(1, 7 - volume * 0.6);
    if (volume < 20) return Math.min(13, 1 + (volume - 10) * 1.2);
    return Math.min(13, 13 - (volume - 20) * 0.1);
}

// Enhanced data update function with visual effects
function updateExperimentDataWithEffect(parameter, value) {
    updateExperimentData(parameter, value);
    
    // Find the data point and add visual effect
    const dataPoints = document.querySelectorAll('.data-point');
    const latestPoint = dataPoints[dataPoints.length - 1];
    
    if (latestPoint) {
        animationManager.createRippleEffect(latestPoint);
        animationManager.glowElement(latestPoint, 'rgba(0, 212, 255, 0.6)', 800);
    }
}

// Enhanced equipment interaction
function enhanceEquipmentInteractivity() {
    // Add hover effects to all equipment
    document.querySelectorAll('.beaker, .electrode, .half-cell, .burette, .combustion-chamber').forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            animationManager.glowElement(e.target, 'rgba(0, 212, 255, 0.4)', 300);
        });
        
        element.addEventListener('click', (e) => {
            animationManager.createRippleEffect(e.target, 
                (e.offsetX / e.target.offsetWidth), 
                (e.offsetY / e.target.offsetHeight)
            );
            animationManager.pulseElement(e.target, 1.05, 200);
        });
    });
}

// Initialize enhanced interactivity when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    enhanceEquipmentInteractivity();
    
    // Add CSS for particle animations
    if (!document.getElementById('enhancedAnimationStyles')) {
        const style = document.createElement('style');
        style.id = 'enhancedAnimationStyles';
        style.textContent = `
            @keyframes ripple-expand {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(20);
                    opacity: 0;
                }
            }
            
            .animated-particle {
                will-change: transform, opacity;
                transition: none;
            }
            
            .experiment-interface {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
});

// ===== INTERACTIVE CHEMISTRY SANDBOX =====
// Full drag-and-drop chemistry lab simulation

class ChemistrySandbox {
    constructor() {
        this.workbenchSurface = document.getElementById('workbenchSurface');
        this.reactionDisplay = document.getElementById('reactionDisplay');
        this.inventoryItems = document.querySelectorAll('.inventory-item');
        this.workbenchItems = new Map(); // Track items on workbench
        this.activeReactions = [];
        this.draggedItem = null;
        this.dragOffset = { x: 0, y: 0 };
        
        this.initializeEventListeners();
        this.setupWorkbench();
    }    initializeEventListeners() {
        // Re-query inventory items to ensure they exist
        this.inventoryItems = document.querySelectorAll('.inventory-item');
        console.log('🎒 Found inventory items:', this.inventoryItems.length);
        
        // Mouse drag and drop for inventory items
        this.inventoryItems.forEach((item, index) => {
            console.log(`📦 Setting up drag for item ${index}:`, item.dataset.item);
            item.addEventListener('mousedown', this.startDrag.bind(this));
            item.addEventListener('dragstart', e => e.preventDefault()); // Prevent default drag
            
            // Add visual feedback
            item.style.cursor = 'grab';
            item.title = `Drag ${item.dataset.item} to workbench`;
        });

        // Global mouse events for dragging
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.endDrag.bind(this));

        // Touch events for mobile
        this.inventoryItems.forEach(item => {
            item.addEventListener('touchstart', this.startTouchDrag.bind(this), { passive: false });
        });
        document.addEventListener('touchmove', this.touchDrag.bind(this), { passive: false });
        document.addEventListener('touchend', this.endTouchDrag.bind(this));        // Workbench drop zone events
        if (this.workbenchSurface) {
            this.workbenchSurface.addEventListener('dragover', e => e.preventDefault());
            this.workbenchSurface.addEventListener('drop', this.handleDrop.bind(this));
        }
    }

    // Handle drop events for the workbench
    handleDrop(e) {
        e.preventDefault();
        
        // For now, this handles traditional drag/drop events
        // The main drag functionality is handled by mouse events
        const workbenchRect = this.workbenchSurface.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        
        console.log('Drop event at:', x, y);
    }

    setupWorkbench() {
        if (!this.workbenchSurface) return;
        
        // Add visual feedback for drop zones
        this.workbenchSurface.addEventListener('dragenter', () => {
            this.workbenchSurface.classList.add('drag-over');
        });
        
        this.workbenchSurface.addEventListener('dragleave', () => {
            this.workbenchSurface.classList.remove('drag-over');
        });
    }    // Mouse drag events
    startDrag(e) {
        e.preventDefault();
        console.log('🖱️ Starting drag...', e.currentTarget);
        const item = e.currentTarget;
        
        // Create a dragging clone
        this.draggedItem = this.createDragClone(item);
        document.body.appendChild(this.draggedItem);
        
        // Calculate offset from mouse to item center
        const rect = item.getBoundingClientRect();
        this.dragOffset.x = e.clientX - rect.left - rect.width / 2;
        this.dragOffset.y = e.clientY - rect.top - rect.height / 2;
        
        // Position the clone
        this.updateDragPosition(e.clientX, e.clientY);
        
        // Add dragging class for visual feedback
        item.classList.add('dragging');
        document.body.style.cursor = 'grabbing';
        
        console.log('✅ Drag started successfully');
    }

    drag(e) {
        if (!this.draggedItem) return;
        
        this.updateDragPosition(e.clientX, e.clientY);
        this.highlightDropZones(e.clientX, e.clientY);
    }    endDrag(e) {
        console.log('🏁 End drag called:', !!this.draggedItem);
        if (!this.draggedItem) return;
        
        const dropTarget = this.getDropTarget(e.clientX, e.clientY);
        console.log('🎯 Drop target:', dropTarget);
        console.log('📍 Drop coordinates:', e.clientX, e.clientY);
        
        if (dropTarget && dropTarget.classList.contains('workbench-surface')) {
            console.log('✅ Valid drop target found! Adding item to workbench...');
            console.log('📦 Item data:', this.draggedItem.dataset);
            this.addItemToWorkbench(this.draggedItem.dataset, e.clientX, e.clientY);
        } else {
            console.log('❌ Invalid drop target or not workbench surface');
            if (dropTarget) {
                console.log('Drop target classes:', dropTarget.classList.toString());
            }
        }
        
        this.cleanupDrag();
    }

    // Touch drag events for mobile
    startTouchDrag(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.startDrag({ ...touch, currentTarget: e.currentTarget, preventDefault: () => {} });
    }

    touchDrag(e) {
        e.preventDefault();
        const touch = e.touches[0];
        this.drag(touch);
    }    endTouchDrag(e) {
        const touch = e.changedTouches[0];
        this.endDrag(touch);
    }

    handleDrop(e) {
        e.preventDefault();
        
        if (!this.draggedItem) return;
        
        // Get the drop coordinates relative to the workbench
        const workbenchRect = this.workbenchSurface.getBoundingClientRect();
        const dropX = e.clientX;
        const dropY = e.clientY;
        
        // Add the item to the workbench
        this.addItemToWorkbench(this.draggedItem.dataset, dropX, dropY);
        
        // Clean up the drag operation
        this.cleanupDrag();
        
        // Visual feedback
        animationManager.createRippleEffect(this.workbenchSurface, 
            (dropX - workbenchRect.left) / workbenchRect.width, 
            (dropY - workbenchRect.top) / workbenchRect.height
        );
    }

    createDragClone(originalItem) {
        const clone = originalItem.cloneNode(true);
        clone.classList.add('drag-clone');
        clone.style.position = 'fixed';
        clone.style.pointerEvents = 'none';
        clone.style.zIndex = '9999';
        clone.style.transform = 'scale(0.9)';
        clone.style.opacity = '0.8';
        clone.style.transition = 'none';
        
        // Copy data attributes
        clone.dataset.type = originalItem.dataset.type;
        clone.dataset.item = originalItem.dataset.item;
        
        return clone;
    }

    updateDragPosition(x, y) {
        if (this.draggedItem) {
            this.draggedItem.style.left = (x - this.dragOffset.x) + 'px';
            this.draggedItem.style.top = (y - this.dragOffset.y) + 'px';
        }
    }

    highlightDropZones(x, y) {
        const element = document.elementFromPoint(x, y);
        const dropZone = element?.closest('.workbench-surface, .drop-zone');
        
        // Remove previous highlights
        document.querySelectorAll('.drop-zone-active').forEach(zone => {
            zone.classList.remove('drop-zone-active');
        });
        
        // Add highlight to current drop zone
        if (dropZone) {
            dropZone.classList.add('drop-zone-active');
        }
    }

    getDropTarget(x, y) {
        const element = document.elementFromPoint(x, y);
        return element?.closest('.workbench-surface, .drop-zone');
    }    addItemToWorkbench(itemData, x, y) {
        if (!this.workbenchSurface || !itemData.type || !itemData.item) {
            console.log('❌ Cannot add item to workbench - missing data:', {
                workbench: !!this.workbenchSurface,
                type: itemData.type,
                item: itemData.item
            });
            return;
        }
        
        console.log('🎯 Adding item to workbench:', itemData.item, 'at coordinates:', x, y);
        
        // Calculate position relative to workbench
        const workbenchRect = this.workbenchSurface.getBoundingClientRect();
        const relativeX = x - workbenchRect.left;
        const relativeY = y - workbenchRect.top;
        
        console.log('📐 Workbench rect:', workbenchRect);
        console.log('📍 Relative position:', relativeX, relativeY);
        
        // Create workbench item element
        const workbenchItem = this.createWorkbenchItem(itemData, relativeX, relativeY);
        
        // Hide drop message if this is the first item
        const dropMessage = this.workbenchSurface.querySelector('.drop-message');
        if (dropMessage) {
            dropMessage.style.display = 'none';
            console.log('✅ Hidden drop message');
        }
        
        // Add to workbench
        this.workbenchSurface.appendChild(workbenchItem);
        console.log('✅ Appended item to workbench surface');
        
        // Store in tracking map
        const itemId = Date.now() + Math.random();
        this.workbenchItems.set(itemId, {
            element: workbenchItem,
            type: itemData.type,
            item: itemData.item,
            x: relativeX,
            y: relativeY
        });
        
        workbenchItem.dataset.itemId = itemId;
        
        // Check for reactions
        this.checkForReactions();
        
        // Add interaction events
        this.addWorkbenchItemEvents(workbenchItem);
        
        // Dispatch custom event for successful addition
        const event = new CustomEvent('workbench-item-added', {
            detail: {
                itemName: itemData.item
            }
        });
        this.workbenchSurface.dispatchEvent(event);
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showContextMenu(item, e.clientX, e.clientY);
        });
        
        // Double-click for interaction
        item.addEventListener('dblclick', () => {
            this.interactWithItem(item);
        });
          // Drag within workbench
        item.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click
                this.startWorkbenchDrag(item, e);
            }
        });
    }

    interactWithItem(item) {
        const itemData = {
            type: item.dataset.type,
            item: item.dataset.item,
            element: item
        };
        
        // Create interaction based on item type
        if (itemData.type === 'equipment') {
            this.interactWithEquipment(itemData);
        } else if (itemData.type === 'chemical') {
            this.interactWithChemical(itemData);
        }
        
        // Visual feedback
        animationManager.pulseElement(item, 1.1, 300);
        animationManager.glowElement(item, 'rgba(0, 212, 255, 0.6)', 1000);
    }

    interactWithEquipment(itemData) {
        const equipmentInteractions = {
            'beaker': 'Ready for mixing solutions',
            'test-tube': 'Perfect for small-scale reactions',
            'burner': 'Heat source activated',
            'electrode': 'Ready for electrochemical reactions',
            'thermometer': `Current temperature: ${(Math.random() * 30 + 20).toFixed(1)}°C`,
            'pipette': 'Precision liquid transfer tool',
            'scale': `Mass: ${(Math.random() * 10 + 1).toFixed(2)} grams`,
            'microscope': 'Magnification: 400x'
        };
        
        const interaction = equipmentInteractions[itemData.item] || 'Equipment ready for use';
        
        this.showInteractionPanel(itemData.element, `${itemData.item} Interaction`, `
            <div class="equipment-interaction">
                <p>${interaction}</p>
                <div class="equipment-status">
                    <p><strong>Status:</strong> Active</p>
                    <p><strong>Condition:</strong> Excellent</p>
                </div>
            </div>
        `);
        
        this.logReaction(`Used ${itemData.item}`, interaction);
    }

    interactWithChemical(itemData) {
        const chemicalData = this.generateAnalysisData(itemData.item);
        
        this.showInteractionPanel(itemData.element, `${itemData.item} Analysis`, `
            <div class="chemical-interaction">
                ${chemicalData.map(data => 
                    `<p><strong>${data.property}:</strong> ${data.value}</p>`
                ).join('')}
                <div class="safety-info">
                    <p><strong>⚠️ Safety:</strong> Handle with care</p>
                </div>
            </div>
        `);
        
        this.logReaction(`Analyzed ${itemData.item}`, 'Chemical analysis performed');
    }

    startWorkbenchDrag(item, e) {
        e.stopPropagation();
        const rect = item.getBoundingClientRect();
        const workbenchRect = this.workbenchSurface.getBoundingClientRect();
        
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        const handleMouseMove = (moveEvent) => {
            const newX = ((moveEvent.clientX - workbenchRect.left - offsetX) / workbenchRect.width) * 100;
            const newY = ((moveEvent.clientY - workbenchRect.top - offsetY) / workbenchRect.height) * 100;
            
            item.style.left = Math.max(0, Math.min(newX, 90)) + '%';
            item.style.top = Math.max(0, Math.min(newY, 85)) + '%';
        };
        
        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            item.style.cursor = 'grab';
        };
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        item.style.cursor = 'grabbing';
    }

    showContextMenu(item, x, y) {
        // Remove existing context menu
        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        const menu = document.createElement('div');
        menu.classList.add('context-menu');
        menu.style.position = 'fixed';
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.style.zIndex = '10000';
        
        const actions = this.getItemActions(item);
        menu.innerHTML = actions.map(action => 
            `<div class="context-menu-item" data-action="${action.id}">${action.icon} ${action.name}</div>`
        ).join('');
        
        // Add click handlers
        menu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action) {
                this.executeAction(item, action);
                menu.remove();
            }
        });
        
        // Remove menu when clicking elsewhere
        document.addEventListener('click', () => {
            setTimeout(() => menu.remove(), 100);
        }, { once: true });
        
        document.body.appendChild(menu);
    }

    getItemActions(item) {
        const actions = [
            { id: 'measure', name: 'Measure', icon: '📏' },
            { id: 'heat', name: 'Heat', icon: '🔥' },
            { id: 'cool', name: 'Cool', icon: '❄️' },
            { id: 'shake', name: 'Shake', icon: '🌪️' },
            { id: 'remove', name: 'Remove', icon: '🗑️' }
        ];
        
        if (item.dataset.type === 'chemical') {
            actions.unshift({ id: 'analyze', name: 'Analyze', icon: '🔬' });
        }
        
        return actions;
    }

    executeAction(item, actionId) {
        const itemData = {
            type: item.dataset.type,
            item: item.dataset.item,
            element: item
        };
        
        switch (actionId) {
            case 'measure':
                this.measureItem(itemData);
                break;
            case 'heat':
                this.heatItem(itemData);
                break;
            case 'cool':
                this.coolItem(itemData);
                break;
            case 'shake':
                this.shakeItem(itemData);
                break;
            case 'analyze':
                this.analyzeItem(itemData);
                break;
            case 'remove':
                this.removeItem(itemData);
                break;
        }
    }

    measureItem(itemData) {
        this.showInteractionPanel(itemData.element, 'Measurement Results', `
            <div class="measurement-results">
                <p><strong>Volume:</strong> ${(Math.random() * 100 + 50).toFixed(1)} mL</p>
                <p><strong>Mass:</strong> ${(Math.random() * 10 + 5).toFixed(2)} g</p>
                <p><strong>Temperature:</strong> ${(Math.random() * 30 + 20).toFixed(1)}°C</p>
            </div>
        `);
    }

    heatItem(itemData) {
        const element = itemData.element;
        element.classList.add('heating');
        
        // Add visual heating effect
        animationManager.createParticleSystem(element, {
            particleCount: 20,
            particleSize: { min: 2, max: 4 },
            colors: ['#ff6b00', '#ff4500', '#ffaa00'],
            speed: { min: 1, max: 3 },
            lifetime: 2000,
            direction: 'up'
        });
        
        setTimeout(() => {
            element.classList.remove('heating');
        }, 3000);
        
        this.logReaction(`Heated ${itemData.item}`, 'Heating process applied');
    }

    coolItem(itemData) {
        const element = itemData.element;
        element.classList.add('cooling');
        
        // Add visual cooling effect
        animationManager.createParticleSystem(element, {
            particleCount: 15,
            particleSize: { min: 1, max: 3 },
            colors: ['#4ecdc4', '#45b7d1', '#a8e6cf'],
            speed: { min: 0.5, max: 2 },
            lifetime: 2000,
            direction: 'down'
        });
        
        setTimeout(() => {
            element.classList.remove('cooling');
        }, 3000);
        
        this.logReaction(`Cooled ${itemData.item}`, 'Cooling process applied');
    }

    shakeItem(itemData) {
        const element = itemData.element;
        element.style.animation = 'shake 0.5s ease-in-out 3';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 1500);
        
        this.logReaction(`Shook ${itemData.item}`, 'Manual agitation applied');
    }

    analyzeItem(itemData) {
        const analysisResults = this.generateAnalysisData(itemData.item);
        this.showInteractionPanel(itemData.element, 'Chemical Analysis', `
            <div class="analysis-results">
                ${analysisResults.map(result => 
                    `<p><strong>${result.property}:</strong> ${result.value}</p>`
                ).join('')}
            </div>
        `);
    }

    removeItem(itemData) {
        const itemId = itemData.element.dataset.itemId;
        if (itemId && this.workbenchItems.has(parseInt(itemId))) {
            this.workbenchItems.delete(parseInt(itemId));
        }
        
        // Animate removal
        itemData.element.style.transform = 'scale(0)';
        itemData.element.style.opacity = '0';
        
        setTimeout(() => {
            itemData.element.remove();
            
            // Show drop message if workbench is empty
            if (this.workbenchItems.size === 0) {
                const dropMessage = this.workbenchSurface.querySelector('.drop-message');
                if (dropMessage) {
                    dropMessage.style.display = 'block';
                }
            }
        }, 300);
        
        this.logReaction(`Removed ${itemData.item}`, 'Item removed from workbench');
    }

    showInteractionPanel(targetElement, title, content) {
        // Remove existing panels
        document.querySelectorAll('.interaction-panel').forEach(panel => panel.remove());
        
        const panel = document.createElement('div');
        panel.classList.add('interaction-panel');
        
        const rect = targetElement.getBoundingClientRect();
        panel.style.left = (rect.right + 10) + 'px';
        panel.style.top = rect.top + 'px';
        
        panel.innerHTML = `
            <div class="panel-header">
                <h6>${title}</h6>
                <button class="close-panel">×</button>
            </div>
            <div class="panel-content">
                ${content}
            </div>
        `;
        
        panel.querySelector('.close-panel').addEventListener('click', () => {
            panel.remove();
        });
        
        document.body.appendChild(panel);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (panel.parentNode) {
                panel.remove();
            }
        }, 5000);
    }

    generateAnalysisData(itemName) {
        const analyses = {
            'hcl': [
                { property: 'pH', value: '1.2' },
                { property: 'Concentration', value: '0.5 M' },
                { property: 'Conductivity', value: 'High' }
            ],
            'naoh': [
                { property: 'pH', value: '13.8' },
                { property: 'Concentration', value: '0.5 M' },
                { property: 'Conductivity', value: 'High' }
            ],
            'water': [
                { property: 'pH', value: '7.0' },
                { property: 'Purity', value: '99.8%' },
                { property: 'Conductivity', value: 'Low' }
            ],
            'nacl': [
                { property: 'Solubility', value: '36 g/100mL' },
                { property: 'Crystal Structure', value: 'Cubic' },
                { property: 'Purity', value: '99.5%' }
            ]
        };
        
        return analyses[itemName] || [
            { property: 'State', value: 'Solid' },
            { property: 'Color', value: 'Variable' },
            { property: 'Molecular Weight', value: 'Unknown' }
        ];
    }

    checkForReactions() {
        const items = Array.from(this.workbenchItems.values());
        const chemicals = items.filter(item => item.type === 'chemical');
        
        if (chemicals.length >= 2) {
            const reactionType = this.determineReactionType(chemicals);
            if (reactionType) {
                this.triggerReaction(reactionType, chemicals);
            }
        }
    }

    determineReactionType(chemicals) {
        const chemicalNames = chemicals.map(c => c.item);
        
        // Acid-base reactions
        if (chemicalNames.includes('hcl') && chemicalNames.includes('naoh')) {
            return 'acid-base-neutralization';
        }
        
        // Displacement reactions
        if (chemicalNames.includes('cuso4') && chemicalNames.includes('zn')) {
            return 'displacement';
        }
        
        // Solution formation
        if (chemicalNames.includes('nacl') && chemicalNames.includes('water')) {
            return 'dissolution';
        }
        
        return null;
    }

    triggerReaction(reactionType, chemicals) {
        const reactionData = this.getReactionData(reactionType);
        
        // Create visual reaction effect
        this.createReactionEffect(chemicals, reactionData);
        
        // Log the reaction
        this.logReaction(reactionData.name, reactionData.description);
        
        // Update the reaction display
        this.updateReactionDisplay(reactionData);
    }

    getReactionData(reactionType) {
        const reactions = {
            'acid-base-neutralization': {
                name: 'Acid-Base Neutralization',
                equation: 'HCl + NaOH → NaCl + H₂O',
                description: 'Exothermic neutralization reaction producing salt and water',
                energy: 'Releases heat',
                products: ['NaCl', 'H₂O']
            },
            'displacement': {
                name: 'Metal Displacement',
                equation: 'Zn + CuSO₄ → ZnSO₄ + Cu',
                description: 'Zinc displaces copper from copper sulfate solution',
                energy: 'Releases heat',
                products: ['ZnSO₄', 'Cu']
            },
            'dissolution': {
                name: 'Salt Dissolution',
                equation: 'NaCl → Na⁺ + Cl⁻',
                description: 'Ionic compound dissolves in water',
                energy: 'Slightly endothermic',
                products: ['Na⁺(aq)', 'Cl⁻(aq)']
            }
        };
        
        return reactions[reactionType];
    }

    createReactionEffect(chemicals, reactionData) {
        chemicals.forEach(chemical => {
            const element = chemical.element;
            
            // Add reaction glow
            animationManager.glowElement(element, '#00ff88', 2000);
            
            // Create reaction particles
            animationManager.createParticleSystem(element, {
                particleCount: 30,
                particleSize: { min: 2, max: 6 },
                colors: ['#00ff88', '#00d4ff', '#ff6b00'],
                speed: { min: 2, max: 5 },
                lifetime: 3000,
                direction: 'random'
            });
        });
        
        // Create reaction bubble effect
        const workbenchRect = this.workbenchSurface.getBoundingClientRect();
        const centerX = workbenchRect.width / 2;
        const centerY = workbenchRect.height / 2;
        
        this.createBubbleEffect(centerX, centerY);
    }

    createBubbleEffect(x, y) {
        const bubbleContainer = document.createElement('div');
        bubbleContainer.classList.add('bubble-effect-container');
        bubbleContainer.style.position = 'absolute';
        bubbleContainer.style.left = x + 'px';
        bubbleContainer.style.top = y + 'px';
        bubbleContainer.style.pointerEvents = 'none';
        
        this.workbenchSurface.appendChild(bubbleContainer);
        
        for (let i =  0; i < 20; i++) {
            setTimeout(() => {
                this.createBubble(bubbleContainer);
            }, i * 100);
        }
        
        setTimeout(() => {
            bubbleContainer.remove();
        }, 5000);
    }

    createBubble(container) {
        const bubble = document.createElement('div');
        bubble.classList.add('reaction-bubble');
        bubble.style.position = 'absolute';
        bubble.style.width = Math.random() * 10 + 5 + 'px';
        bubble.style.height = bubble.style.width;
        bubble.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        bubble.style.borderRadius = '50%';
        bubble.style.opacity = '0.7';
        
        const startX = (Math.random() - 0.5) * 100;
        const startY = (Math.random() - 0.5) * 100;
        
        bubble.style.transform = `translate(${startX}px, ${startY}px)`;
        container.appendChild(bubble);
        
        // Animate bubble
        bubble.animate([
            { transform: `translate(${startX}px, ${startY}px) scale(0)`, opacity: 0 },
            { transform: `translate(${startX}px, ${startY - 50}px) scale(1)`, opacity: 0.7 },
            { transform: `translate(${startX + (Math.random() - 0.5) * 50}px, ${startY - 100}px) scale(0)`, opacity: 0 }
        ], {
            duration: 2000,
            easing: 'ease-out'
        }).onfinish = () => bubble.remove();
    }

    logReaction(reactionName, description) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            time: timestamp,
            reaction: reactionName,
            description: description
        };
        
        this.activeReactions.push(logEntry);
        this.updateReactionMonitor();
    }

    updateReactionDisplay(reactionData) {
        if (!this.reactionDisplay) return;
        
        const noReactions = this.reactionDisplay.querySelector('.no-reactions');
        if (noReactions) {
            noReactions.style.display = 'none';
        }
        
        const reactionElement = document.createElement('div');
        reactionElement.classList.add('active-reaction');
        reactionElement.innerHTML = `
            <div class="reaction-header">
                <h6>${reactionData.name}</h6>
                <span class="reaction-time">${new Date().toLocaleTimeString()}</span>
            </div>
            <div class="reaction-equation">${reactionData.equation}</div>
            <div class="reaction-description">${reactionData.description}</div>
            <div class="reaction-energy">Energy: ${reactionData.energy}</div>
        `;
        
        this.reactionDisplay.appendChild(reactionElement);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            reactionElement.style.opacity = '0';
            setTimeout(() => reactionElement.remove(), 300);
        }, 10000);
    }

    updateReactionMonitor() {
        // Update the reaction monitor with latest activities
        if (this.activeReactions.length === 0) return;
        
        const latestReaction = this.activeReactions[this.activeReactions.length - 1];
        console.log(`[${latestReaction.time}] ${latestReaction.reaction}: ${latestReaction.description}`);
    }

    cleanupDrag() {
        if (this.draggedItem) {
            this.draggedItem.remove();
            this.draggedItem = null;
        }
        
        // Remove dragging classes
        document.querySelectorAll('.dragging').forEach(item => {
            item.classList.remove('dragging');
        });
        
        // Remove drop zone highlights
        document.querySelectorAll('.drop-zone-active').forEach(zone => {
            zone.classList.remove('drop-zone-active');
        });
        
        document.body.style.cursor = '';
    }
}

// Initialize the chemistry sandbox when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔬 Checking for workbench surface...');
    const workbenchSurface = document.getElementById('workbenchSurface');
    console.log('Workbench surface found:', !!workbenchSurface);
    
    if (workbenchSurface) {
        console.log('🧪 Initializing Chemistry Sandbox...');
        window.chemistrySandbox = new ChemistrySandbox();
        initializeSandboxControls();
        initializeSandboxEnhancements();
        console.log('✅ Chemistry Sandbox initialized successfully');
    } else {
        console.log('❌ Workbench surface not found - sandbox not initialized');
    }
});

// Enhanced sandbox control functions
function initializeSandboxControls() {
    const clearWorkbenchBtn = document.getElementById('clearWorkbench');
    const saveExperimentBtn = document.getElementById('saveExperiment');
    const resetSandboxBtn = document.getElementById('resetSandbox');
    
    if (clearWorkbenchBtn) {
        clearWorkbenchBtn.addEventListener('click', clearWorkbench);
    }
    
    if (saveExperimentBtn) {
        saveExperimentBtn.addEventListener('click', saveCurrentExperiment);
    }
    
    if (resetSandboxBtn) {
        resetSandboxBtn.addEventListener('click', resetSandbox);
    }
}

function clearWorkbench() {
    if (!window.chemistrySandbox) return;
    
    const workbenchItems = document.querySelectorAll('.workbench-item');
    const workbenchSurface = document.getElementById('workbenchSurface');
    const dropMessage = workbenchSurface?.querySelector('.drop-message');
    
    // Animate removal of all items
    workbenchItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.transform = 'scale(0) rotate(180deg)';
            item.style.opacity = '0';
            
            setTimeout(() => {
                item.remove();
            }, 300);
        }, index * 100);
    });
    
    // Clear the workbench items map
    window.chemistrySandbox.workbenchItems.clear();
    
    // Show drop message after clearing
    setTimeout(() => {
        if (dropMessage) {
            dropMessage.style.display = 'block';
        }
    }, workbenchItems.length * 100 + 300);
    
    // Clear reaction display
    const reactionDisplay = document.getElementById('reactionDisplay');
    if (reactionDisplay) {
        reactionDisplay.innerHTML = '<p class="no-reactions">No active reactions</p>';
    }
    
    // Reset active reactions
    window.chemistrySandbox.activeReactions = [];
    
    // Visual feedback
    animationManager.createRippleEffect(workbenchSurface, 0.5, 0.5);
    
    console.log('Workbench cleared successfully');
}

function saveCurrentExperiment() {
    if (!window.chemistrySandbox) return;
    
    const experimentData = {
        timestamp: new Date().toISOString(),
        items: Array.from(window.chemistrySandbox.workbenchItems.values()).map(item => ({
            type: item.type,
            item: item.item,
            x: item.x,
            y: item.y
        })),
        reactions: window.chemistrySandbox.activeReactions.slice()
    };
    
    // Save to localStorage
    const savedExperiments = JSON.parse(localStorage.getItem('himiq_saved_experiments') || '[]');
    savedExperiments.push(experimentData);
    
    // Keep only last 10 experiments
    if (savedExperiments.length > 10) {
        savedExperiments.splice(0, savedExperiments.length - 10);
    }
    
    localStorage.setItem('himiq_saved_experiments', JSON.stringify(savedExperiments));
    
    // Visual feedback
    const saveBtn = document.getElementById('saveExperiment');
    if (saveBtn) {
        const originalText = saveBtn.textContent;
        saveBtn.textContent = 'Saved!';
        saveBtn.style.background = 'rgba(46, 213, 115, 0.2)';
        saveBtn.style.borderColor = '#2ed573';
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.style.background = '';
            saveBtn.style.borderColor = '';
        }, 2000);
    }
    
    console.log('Experiment saved successfully');
}

function resetSandbox() {
    clearWorkbench();
    
    // Reset any experiment states
    if (currentExperiment) {
        currentExperiment = null;
    }
    
    // Reset data collection
    const dataCollection = document.getElementById('dataCollection');
    if (dataCollection) {
        dataCollection.innerHTML = '<p class="no-data-message">No data collected yet</p>';
    }
    
    // Reset workspace title
    const experimentTitle = document.getElementById('experimentTitle');
    if (experimentTitle) {
        experimentTitle.textContent = 'Select an experiment to begin';
    }
    
    // Visual feedback
    const resetBtn = document.getElementById('resetSandbox');
    if (resetBtn) {
        animationManager.pulseElement(resetBtn, 1.1, 300);
    }
    
    console.log('Sandbox reset successfully');
}

// Experiment animation control functions
function startExperimentAnimation(experimentType) {
    isExperimentRunning = true;
    
    // Start the specific animation based on experiment type
    switch (experimentType) {
        case 'combustion-advanced':
            if (typeof runCombustionAnalysis === 'function') {
                runCombustionAnalysis();
            }
            break;
        case 'acid-base':
            if (typeof runAcidBaseTitration === 'function') {
                runAcidBaseTitration();
            }
            break;
        case 'color-change':
            if (typeof runColorChangeReaction === 'function') {
                runColorChangeReaction();
            }
            break;
        case 'electrolysis':
            if (typeof startElectrolysis === 'function') {
                startElectrolysis();
            }
            break;
        case 'galvanic-cell':
            if (typeof connectGalvanicCell === 'function') {
                connectGalvanicCell();
            }
            break;
        case 'polymer-synthesis':
            if (typeof startPolymerization === 'function') {
                startPolymerization();
            }
            break;
        case 'chromatography':
            if (typeof startChromatography === 'function') {
                startChromatography();
            }
            break;
    }
    
    console.log(`✅ Started ${experimentType} animation`);
}

function resetExperimentAnimation(experimentType) {
    isExperimentRunning = false;
    
    // Reset the experiment workspace
    const experimentArea = document.getElementById('experimentArea');
    if (experimentArea) {
        // Clear any existing content and reset to initial state
        experimentArea.innerHTML = `
            <div class="experiment-placeholder">
                <h3>🧪 ${experimentType.replace('-', ' ').toUpperCase()}</h3>
                <p>Click "Start Experiment" to begin the simulation</p>
            </div>
        `;
    }
    
    // Re-setup the experiment workspace
    setupExperimentWorkspace(experimentType);
    
    console.log(`🔄 Reset ${experimentType} experiment`);
}

function pauseExperimentAnimation(experimentType) {
    isExperimentRunning = false;
    
    // Pause any running animations
    const animations = document.querySelectorAll('.animated-element');
    animations.forEach(element => {
        element.style.animationPlayState = 'paused';
    });
    
    console.log(`⏸️ Paused ${experimentType} animation`);
}

// EMERGENCY DEBUG: Force test workbench functionality
function emergencyTestWorkbench() {
    console.log('🚨 EMERGENCY TEST: Testing workbench manually...');
    
    const workbench = document.getElementById('workbenchSurface');
    if (!workbench) {
        console.log('❌ WORKBENCH NOT FOUND!');
        return;
    }
    
    console.log('✅ Workbench found:', workbench);
    console.log('📐 Workbench dimensions:', {
        width: workbench.offsetWidth,
        height: workbench.offsetHeight,
        clientWidth: workbench.clientWidth,
        clientHeight: workbench.clientHeight
    });
    
    // Create a test item manually using the same method as the real code
    const testItem = document.createElement('div');
    testItem.className = 'workbench-item test-item';
    testItem.innerHTML = `
        <span class="item-icon">🧪</span>
        <span class="item-name">TEST BEAKER</span>
    `;
    
    // Use percentage positioning like the real createWorkbenchItem function
    testItem.style.position = 'absolute';
    testItem.style.left = '20%';
    testItem.style.top = '20%';
    testItem.style.zIndex = '10';
    testItem.style.background = 'var(--glass-bg)';
    testItem.style.border = '2px solid var(--accent-primary)';
    testItem.style.padding = '0.8rem';
    testItem.style.borderRadius = '12px';
    testItem.style.cursor = 'grab';
    testItem.style.minWidth = '80px';
    testItem.style.textAlign = 'center';
    testItem.style.color = 'var(--text-primary)';
    testItem.style.boxShadow = '0 4px 15px rgba(0, 212, 255, 0.3)';
    testItem.style.backdropFilter = 'blur(10px)';
    testItem.style.webkitBackdropFilter = 'blur(10px)';
    testItem.style.display = 'flex';
    testItem.style.flexDirection = 'column';
    testItem.style.alignItems = 'center';
    
    // Hide drop message
    const dropMessage = workbench.querySelector('.drop-message');
    if (dropMessage) {
        dropMessage.style.display = 'none';
        console.log('✅ Hidden drop message');
    }
    
    // Add test item to workbench
    workbench.appendChild(testItem);
    console.log('✅ TEST ITEM ADDED TO WORKBENCH!');
    
    // Test if item is visible
    const computedStyle = window.getComputedStyle(testItem);
    console.log('📊 Test item computed style:', {
        display: computedStyle.display,
        visibility: computedStyle.visibility,
        position: computedStyle.position,
        left: computedStyle.left,
        top: computedStyle.top,
        zIndex: computedStyle.zIndex,
        width: computedStyle.width,
        height: computedStyle.height
    });
    
    // Check if workbench has proper positioning context
    const workbenchStyle = window.getComputedStyle(workbench);
    console.log('📊 Workbench computed style:', {
        position: workbenchStyle.position,
        overflow: workbenchStyle.overflow,
        display: workbenchStyle.display
    });
    
    // Force a repaint
    testItem.offsetHeight;
    
    // Check if the item is actually in the DOM
    console.log('🔍 Item in DOM:', document.contains(testItem));
    console.log('🔍 Item parent:', testItem.parentElement);
    console.log('🔍 Workbench children count:', workbench.children.length);
    
    // Add a bright visible style for debugging
    setTimeout(() => {
        testItem.style.background = 'red';
        testItem.style.border = '5px solid yellow';
        testItem.style.transform = 'scale(1.5)';
        console.log('🔴 Applied emergency visible styling to test item');
    }, 1000);
    
    return testItem;
}

// Add to window for console access
window.emergencyTestWorkbench = emergencyTestWorkbench;

// Auto-run test after 2 seconds
setTimeout(() => {
    console.log('🎬 Running emergency workbench test...');
    emergencyTestWorkbench();
}, 2000);

// Simple test to verify drag-and-drop works
function testActualDragDrop() {
    console.log('🧪 Testing actual drag-and-drop functionality...');
    
    // Find the first inventory item
    const firstItem = document.querySelector('.inventory-item');
    if (!firstItem) {
        console.log('❌ No inventory items found');
        return;
    }
    
    console.log('✅ Found inventory item:', firstItem);
    
    // Get workbench
    const workbench = document.getElementById('workbenchSurface');
    if (!workbench) {
        console.log('❌ Workbench not found');
        return;
    }
    
    console.log('✅ Found workbench:', workbench);
    
    // Simulate the addItemToWorkbench function manually
    const itemData = {
        type: firstItem.dataset.type || 'equipment',
        item: firstItem.dataset.item || 'beaker'
    };
    
    // Use the actual ChemistrySandbox if available
    if (window.chemistrySandbox) {
        console.log('✅ ChemistrySandbox found, using addItemToWorkbench...');
        // Simulate drop at center of workbench
        const centerX = workbench.offsetWidth / 2;
        const centerY = workbench.offsetHeight / 2;
        
        window.chemistrySandbox.addItemToWorkbench(itemData, centerX, centerY);
    } else {
        console.log('❌ ChemistrySandbox not found');
    }
}

// Add global function exports and immediate debugging to test workbench functionality
window.testSandbox = testSandboxFunctionality;
window.emergencyTest = emergencyTestWorkbench;
window.testDragDrop = testActualDragDrop;

// Immediate debug logging
console.log('🚀 EXPERIMENTS.JS LOADED! Testing workbench immediately...');
document.addEventListener('DOMContentLoaded', function() {
    console.log('📋 DOM CONTENT LOADED - Starting tests...');
    setTimeout(() => {
        console.log('⏰ Running delayed workbench test...');
        if (window.emergencyTest) {
            window.emergencyTest();
        }
    }, 2000);
});
