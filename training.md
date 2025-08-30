---
layout: default
title: Training
nav_order: 5
---

<div id="training-content">
    <!-- Morse Trainer content will be injected here by JavaScript -->
</div>

<!-- Additional Training Modules -->
<div class="control-panel">
    <div class="panel-header">
        <h2 class="panel-title">Numbers Station Training Academy</h2>
        <div class="panel-status">
            <span>Comprehensive training modules</span>
        </div>
    </div>

    <div class="training-modules">
        <div class="settings-grid">
            <div class="settings-section module-card" data-module="operator">
                <div class="settings-header">Radio Operator Training</div>
                <div class="module-description">
                    <p>Learn the skills of a Cold War radio operator. Practice copying number transmissions, handling message books, and operating under realistic conditions.</p>
                    
                    <div class="module-features">
                        <ul>
                            <li>Message copying practice</li>
                            <li>Speed and accuracy challenges</li>
                            <li>Noise and interference simulation</li>
                            <li>Historical scenarios</li>
                        </ul>
                    </div>
                    
                    <button class="btn btn-primary btn-full mt-md" data-action="start-operator-training">
                        Start Operator Training
                    </button>
                </div>
            </div>

            <div class="settings-section module-card" data-module="analyst">
                <div class="settings-header">Cryptanalyst Training</div>
                <div class="module-description">
                    <p>Develop cryptanalysis skills used to break enemy codes. Learn frequency analysis, pattern recognition, and cipher identification techniques.</p>
                    
                    <div class="module-features">
                        <ul>
                            <li>Cipher identification</li>
                            <li>Frequency analysis</li>
                            <li>Pattern recognition</li>
                            <li>Cryptographic attacks</li>
                        </ul>
                    </div>
                    
                    <button class="btn btn-primary btn-full mt-md" data-action="start-analyst-training">
                        Start Analyst Training
                    </button>
                </div>
            </div>

            <div class="settings-section module-card" data-module="agent">
                <div class="settings-header">Field Agent Training</div>
                <div class="module-description">
                    <p>Experience the challenges faced by field agents receiving coded instructions via numbers stations. Practice under pressure with time limits and distractions.</p>
                    
                    <div class="module-features">
                        <ul>
                            <li>Emergency procedures</li>
                            <li>One-time pad usage</li>
                            <li>Message authentication</li>
                            <li>Operational security</li>
                        </ul>
                    </div>
                    
                    <button class="btn btn-primary btn-full mt-md" data-action="start-agent-training">
                        Start Agent Training
                    </button>
                </div>
            </div>

            <div class="settings-section module-card" data-module="historian">
                <div class="settings-header">Historical Research</div>
                <div class="module-description">
                    <p>Explore the fascinating history of numbers stations, from WWII to the Cold War and beyond. Learn about famous stations and their operations.</p>
                    
                    <div class="module-features">
                        <ul>
                            <li>Famous numbers stations</li>
                            <li>Historical recordings</li>
                            <li>Equipment and technology</li>
                            <li>Declassified documents</li>
                        </ul>
                    </div>
                    
                    <button class="btn btn-primary btn-full mt-md" data-action="start-history-module">
                        Explore History
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Active Training Module -->
<div class="control-panel" id="active-training-module" style="display: none;">
    <div class="panel-header">
        <h3 class="panel-title" id="module-title">Training Module</h3>
        <div class="panel-status">
            <button id="exit-module" class="btn">Exit Module</button>
        </div>
    </div>

    <div id="module-content">
        <!-- Module content will be dynamically loaded -->
    </div>

    <div class="module-progress mt-lg">
        <div class="progress-header">
            <span class="progress-label">Module Progress</span>
            <span class="progress-percent" id="module-progress-percent">0%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" id="module-progress-fill"></div>
        </div>
    </div>
</div>

<!-- Operator Training Module -->
<div class="training-module" id="operator-training" style="display: none;">
    <div class="settings-grid">
        <div class="settings-section">
            <div class="settings-header">Scenario Selection</div>
            
            <div class="form-group">
                <label class="form-label">Training Scenario</label>
                <select id="operator-scenario" class="form-select">
                    <option value="basic">Basic Message Copying</option>
                    <option value="speed">Speed Challenge</option>
                    <option value="interference">Heavy Interference</option>
                    <option value="emergency">Emergency Transmission</option>
                    <option value="multi-station">Multi-Station Environment</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Difficulty Level</label>
                <select id="operator-difficulty" class="form-select">
                    <option value="novice">Novice</option>
                    <option value="intermediate" selected>Intermediate</option>
                    <option value="expert">Expert</option>
                    <option value="extreme">Extreme</option>
                </select>
            </div>

            <div class="form-group">
                <label class="form-label">Session Duration</label>
                <select id="operator-duration" class="form-select">
                    <option value="5">5 minutes</option>
                    <option value="10" selected>10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                </select>
            </div>
        </div>

        <div class="settings-section">
            <div class="settings-header">Performance Metrics</div>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value" id="messages-copied">0</div>
                    <div class="stat-label">Messages Copied</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="accuracy-rate">0%</div>
                    <div class="stat-label">Accuracy Rate</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="avg-wpm">0</div>
                    <div class="stat-label">Avg WPM</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="error-rate">0%</div>
                    <div class="stat-label">Error Rate</div>
                </div>
            </div>
        </div>
    </div>

    <div class="operator-workspace mt-lg">
        <div class="workspace-header">
            <h4>Radio Operator Workspace</h4>
            <div class="workspace-controls">
                <button id="start-operator-session" class="btn btn-primary">Start Session</button>
                <button id="pause-operator-session" class="btn" disabled>Pause</button>
                <button id="stop-operator-session" class="btn" disabled>Stop</button>
            </div>
        </div>

        <div class="operator-interface">
            <div class="message-area">
                <div class="received-transmission">
                    <h5>Incoming Transmission</h5>
                    <div id="transmission-display" class="transmission-output">
                        Waiting for transmission...
                    </div>
                    <div class="audio-controls">
                        <button id="replay-transmission" class="btn">Replay</button>
                        <button id="slow-replay" class="btn">Slow Replay</button>
                    </div>
                </div>

                <div class="message-copy">
                    <h5>Message Copy</h5>
                    <textarea id="message-copy-area" class="form-textarea" rows="6" placeholder="Copy the transmitted message here..."></textarea>
                    <div class="copy-controls">
                        <button id="submit-copy" class="btn btn-primary">Submit Copy</button>
                        <button id="clear-copy" class="btn">Clear</button>
                    </div>
                </div>
            </div>

            <div class="session-feedback" id="operator-feedback">
                <!-- Real-time feedback will appear here -->
            </div>
        </div>
    </div>
</div>

<!-- Analyst Training Module -->
<div class="training-module" id="analyst-training" style="display: none;">
    <div class="settings-grid">
        <div class="settings-section">
            <div class="settings-header">Analysis Challenges</div>
            
            <div class="form-group">
                <label class="form-label">Challenge Type</label>
                <select id="analyst-challenge" class="form-select">
                    <option value="frequency">Frequency Analysis</option>
                    <option value="pattern">Pattern Recognition</option>
                    <option value="cipher-id">Cipher Identification</option>
                    <option value="key-recovery">Key Recovery</option>
                    <option value="plaintext-attack">Known Plaintext Attack</option>
                </select>
            </div>

            <div class="form-group">
                <button id="generate-challenge" class="btn btn-primary">Generate Challenge</button>
                <button id="show-hint" class="btn">Show Hint</button>
            </div>
        </div>

        <div class="settings-section">
            <div class="settings-header">Analysis Tools</div>
            
            <div class="tool-buttons">
                <button class="btn tool-btn" data-tool="frequency">Frequency Counter</button>
                <button class="btn tool-btn" data-tool="ngram">N-gram Analysis</button>
                <button class="btn tool-btn" data-tool="entropy">Entropy Calculator</button>
                <button class="btn tool-btn" data-tool="pattern">Pattern Finder</button>
            </div>
        </div>
    </div>

    <div class="analyst-workspace mt-lg">
        <div class="workspace-tabs">
            <button class="tab-btn active" data-tab="challenge">Challenge</button>
            <button class="tab-btn" data-tab="analysis">Analysis</button>
            <button class="tab-btn" data-tab="solution">Solution</button>
        </div>

        <div class="tab-content active" id="challenge-tab">
            <div class="challenge-description">
                <h5>Current Challenge</h5>
                <div id="challenge-text" class="challenge-output">
                    Select a challenge type and click "Generate Challenge"
                </div>
            </div>
            
            <div class="challenge-data">
                <h5>Intercepted Data</h5>
                <textarea id="intercepted-data" class="form-textarea" rows="8" readonly></textarea>
            </div>
        </div>

        <div class="tab-content" id="analysis-tab">
            <div class="analysis-results" id="analysis-results">
                <!-- Analysis tools results -->
            </div>
        </div>

        <div class="tab-content" id="solution-tab">
            <div class="solution-area">
                <h5>Your Solution</h5>
                <textarea id="solution-input" class="form-textarea" rows="4" placeholder="Enter your solution..."></textarea>
                <button id="check-solution" class="btn btn-primary">Check Solution</button>
            </div>
        </div>
    </div>
</div>

<!-- Agent Training Module -->
<div class="training-module" id="agent-training" style="display: none;">
    <div class="agent-briefing">
        <div class="briefing-header">
            <h4>Mission Briefing</h4>
            <div class="clearance-level">CLASSIFIED</div>
        </div>

        <div class="mission-details">
            <p><strong>Agent ID:</strong> <span id="agent-id">NOVEMBER-7-7</span></p>
            <p><strong>Mission:</strong> <span id="mission-name">Operation Mockingbird</span></p>
            <p><strong>Location:</strong> <span id="mission-location">Berlin, East Sector</span></p>
            <p><strong>Date:</strong> <span id="mission-date">March 15, 1962</span></p>
        </div>

        <div class="mission-objectives">
            <h5>Objectives:</h5>
            <ol id="mission-objectives-list">
                <li>Monitor designated frequency for coded transmissions</li>
                <li>Decode messages using provided one-time pad</li>
                <li>Execute instructions within specified time window</li>
                <li>Maintain operational security at all times</li>
            </ol>
        </div>

        <div class="equipment-list">
            <h5>Equipment:</h5>
            <ul>
                <li>Shortwave receiver (simulated)</li>
                <li>One-time pad booklet</li>
                <li>Message authentication codes</li>
                <li>Emergency protocols</li>
            </ul>
        </div>
    </div>

    <div class="agent-workspace">
        <div class="receiver-panel">
            <h5>Shortwave Receiver</h5>
            <div class="frequency-display">
                <span class="frequency-label">Freq:</span>
                <span class="frequency-value" id="receiver-frequency">14.247 MHz</span>
            </div>
            <div class="signal-strength">
                <span class="signal-label">Signal:</span>
                <div class="signal-meter">
                    <div class="signal-level" id="signal-level"></div>
                </div>
            </div>
            <button id="start-monitoring" class="btn btn-primary">Start Monitoring</button>
        </div>

        <div class="message-log">
            <h5>Message Log</h5>
            <div id="agent-message-log" class="log-output">
                No messages received
            </div>
        </div>

        <div class="decryption-area">
            <h5>Message Decryption</h5>
            <input type="text" id="received-message" class="form-input" placeholder="Enter received message...">
            <button id="decrypt-message" class="btn btn-primary">Decrypt</button>
            <div id="decrypted-output" class="decrypt-result">
                <!-- Decrypted message will appear here -->
            </div>
        </div>
    </div>
</div>

<!-- Historical Research Module -->
<div class="training-module" id="history-module" style="display: none;">
    <div class="history-navigation">
        <div class="timeline-nav">
            <button class="timeline-btn" data-era="wwii">WWII Era</button>
            <button class="timeline-btn active" data-era="cold-war">Cold War</button>
            <button class="timeline-btn" data-era="modern">Modern Era</button>
        </div>
    </div>

    <div class="history-content">
        <div class="era-content active" id="cold-war-content">
            <h4>Cold War Numbers Stations (1945-1991)</h4>
            
            <div class="station-gallery">
                <div class="station-card" data-station="swedish-rhapsody">
                    <h5>Swedish Rhapsody</h5>
                    <div class="station-details">
                        <p><strong>Origin:</strong> Poland/East Germany</p>
                        <p><strong>Voice:</strong> Child (modified Stasi generator)</p>
                        <p><strong>Active:</strong> 1970s-1998</p>
                    </div>
                    <button class="btn" data-action="learn-more">Learn More</button>
                </div>

                <div class="station-card" data-station="lincolnshire-poacher">
                    <h5>Lincolnshire Poacher</h5>
                    <div class="station-details">
                        <p><strong>Origin:</strong> United Kingdom</p>
                        <p><strong>Voice:</strong> Female (English accent)</p>
                        <p><strong>Active:</strong> 1970s-2008</p>
                    </div>
                    <button class="btn" data-action="learn-more">Learn More</button>
                </div>

                <div class="station-card" data-station="cuban-v02">
                    <h5>Cuban V02</h5>
                    <div class="station-details">
                        <p><strong>Origin:</strong> Cuba</p>
                        <p><strong>Voice:</strong> Female (Spanish)</p>
                        <p><strong>Active:</strong> 1960s-present</p>
                    </div>
                    <button class="btn" data-action="learn-more">Learn More</button>
                </div>

                <div class="station-card" data-station="stasi-generator">
                    <h5>Stasi Sprach-Generator</h5>
                    <div class="station-details">
                        <p><strong>Origin:</strong> East Germany</p>
                        <p><strong>Device:</strong> Gerät 32620</p>
                        <p><strong>Active:</strong> 1960s-1989</p>
                    </div>
                    <button class="btn" data-action="learn-more">Learn More</button>
                </div>
            </div>
        </div>

        <div class="era-content" id="wwii-content">
            <h4>WWII and Early Numbers Stations</h4>
            <!-- WWII content -->
        </div>

        <div class="era-content" id="modern-content">
            <h4>Modern Numbers Stations (1991-Present)</h4>
            <!-- Modern era content -->
        </div>
    </div>
</div>

<style>
.training-modules {
    margin: var(--spacing-xl) 0;
}

.module-card {
    border: 2px solid var(--border-color);
    transition: all 0.3s ease;
    cursor: pointer;
}

.module-card:hover {
    border-color: var(--primary-green);
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
}

.module-description {
    padding: var(--spacing-md) 0;
}

.module-features ul {
    margin: var(--spacing-md) 0;
    padding-left: var(--spacing-lg);
}

.module-features li {
    margin-bottom: var(--spacing-xs);
    color: var(--text-secondary);
}

.training-module {
    background: var(--panel-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    margin-top: var(--spacing-xl);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

.stat-item {
    text-align: center;
    padding: var(--spacing-md);
    background: var(--bg-darker);
    border-radius: var(--radius-md);
}

.stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-green);
    font-family: var(--font-display);
}

.stat-label {
    font-size: 0.8rem;
    color: var(--text-secondary);
    text-transform: uppercase;
}

.operator-workspace,
.analyst-workspace,
.agent-workspace {
    background: var(--bg-darker);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
}

.workspace-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
}

.workspace-controls {
    display: flex;
    gap: var(--spacing-sm);
}

.operator-interface {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: var(--spacing-lg);
}

.message-area {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.transmission-output,
.challenge-output,
.log-output {
    background: var(--bg-dark);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    min-height: 120px;
    font-family: var(--font-mono);
    color: var(--primary-green);
    line-height: 1.4;
}

.audio-controls,
.copy-controls {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-md);
}

.workspace-tabs {
    display: flex;
    border-bottom: 2px solid var(--border-color);
    margin-bottom: var(--spacing-lg);
}

.tab-btn {
    padding: var(--spacing-md) var(--spacing-lg);
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    font-family: var(--font-mono);
    border-bottom: 2px solid transparent;
    transition: all 0.3s ease;
}

.tab-btn.active,
.tab-btn:hover {
    color: var(--primary-green);
    border-bottom-color: var(--primary-green);
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

.tool-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-sm);
}

.tool-btn {
    padding: var(--spacing-sm);
    font-size: 0.9rem;
}

.agent-briefing {
    background: var(--bg-darker);
    border: 2px solid var(--warning-amber);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

.briefing-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
}

.clearance-level {
    background: var(--error-red);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
    font-weight: 700;
}

.mission-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
    margin: var(--spacing-lg) 0;
}

.mission-objectives,
.equipment-list {
    margin: var(--spacing-lg) 0;
}

.receiver-panel {
    background: var(--panel-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.frequency-display,
.signal-strength {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin: var(--spacing-sm) 0;
}

.frequency-value {
    font-family: var(--font-display);
    color: var(--primary-green);
    font-size: 1.2rem;
}

.signal-meter {
    flex: 1;
    height: 8px;
    background: var(--border-color);
    border-radius: 4px;
    overflow: hidden;
}

.signal-level {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-green), var(--warning-amber), var(--error-red));
    width: 60%;
    transition: width 0.3s ease;
}

.timeline-nav {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
}

.timeline-btn {
    padding: var(--spacing-md) var(--spacing-lg);
    background: var(--panel-bg);
    border: 2px solid var(--border-color);
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all 0.3s ease;
}

.timeline-btn.active,
.timeline-btn:hover {
    border-color: var(--primary-green);
    color: var(--primary-green);
    background: rgba(0, 255, 65, 0.1);
}

.station-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
}

.station-card {
    background: var(--bg-darker);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    transition: all 0.3s ease;
}

.station-card:hover {
    border-color: var(--primary-green);
    box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
}

.station-details {
    margin: var(--spacing-md) 0;
}

.station-details p {
    margin: var(--spacing-xs) 0;
    font-size: 0.9rem;
    color: var(--text-secondary);
}

.era-content {
    display: none;
}

.era-content.active {
    display: block;
}

@media (max-width: 768px) {
    .operator-interface {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .mission-details {
        grid-template-columns: 1fr;
    }
    
    .tool-buttons {
        grid-template-columns: 1fr;
    }
}
</style>

<script>
// Training module initialization
document.addEventListener('DOMContentLoaded', function() {
    // Module card click handlers
    document.querySelectorAll('.module-card').forEach(card => {
        card.addEventListener('click', function() {
            const module = this.dataset.module;
            if (module) {
                activateTrainingModule(module);
            }
        });
    });
    
    // Training module functions will be implemented in enhanced-sprach.js
});

function activateTrainingModule(moduleType) {
    const activeModule = document.getElementById('active-training-module');
    const moduleContent = document.getElementById('module-content');
    const moduleTitle = document.getElementById('module-title');
    
    // Show the active module container
    activeModule.style.display = 'block';
    
    // Update title and load content based on module type
    switch(moduleType) {
        case 'operator':
            moduleTitle.textContent = 'Radio Operator Training';
            loadOperatorModule();
            break;
        case 'analyst':
            moduleTitle.textContent = 'Cryptanalyst Training';
            loadAnalystModule();
            break;
        case 'agent':
            moduleTitle.textContent = 'Field Agent Training';
            loadAgentModule();
            break;
        case 'historian':
            moduleTitle.textContent = 'Historical Research';
            loadHistoryModule();
            break;
    }
    
    // Scroll to module
    activeModule.scrollIntoView({ behavior: 'smooth' });
}

function loadOperatorModule() {
    const operatorTraining = document.getElementById('operator-training');
    const moduleContent = document.getElementById('module-content');
    
    moduleContent.innerHTML = operatorTraining.innerHTML;
    operatorTraining.style.display = 'block';
}

function loadAnalystModule() {
    const analystTraining = document.getElementById('analyst-training');
    const moduleContent = document.getElementById('module-content');
    
    moduleContent.innerHTML = analystTraining.innerHTML;
    analystTraining.style.display = 'block';
}

function loadAgentModule() {
    const agentTraining = document.getElementById('agent-training');
    const moduleContent = document.getElementById('module-content');
    
    moduleContent.innerHTML = agentTraining.innerHTML;
    agentTraining.style.display = 'block';
}

function loadHistoryModule() {
    const historyModule = document.getElementById('history-module');
    const moduleContent = document.getElementById('module-content');
    
    moduleContent.innerHTML = historyModule.innerHTML;
    historyModule.style.display = 'block';
}

// Exit module handler
document.getElementById('exit-module')?.addEventListener('click', function() {
    document.getElementById('active-training-module').style.display = 'none';
});
</script></absolute_file_name>
    </file>