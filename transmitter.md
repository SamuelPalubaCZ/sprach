---
layout: default
title: Transmitter
nav_order: 2
---

<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

<div class="transmission-console">
    <div class="console-header">
        <h2 class="content-subhead">// SECURE TRANSMISSION CONSOLE</h2>
        <div class="transmission-status">
            <span class="status-indicator" id="tx-status">STANDBY</span>
            <span class="frequency-display">FREQ: 4625.0 kHz</span>
        </div>
    </div>

    <form id="speech-form" class="transmission-form" onsubmit="return false;">
        <div class="control-panel">
            <div class="input-section">
                <div class="field-group">
                    <label for="call" class="field-label">
                        <span class="label-icon">📡</span>
                        CALL_SIGN
                    </label>
                    <input id="call" type="text" value="271" class="terminal-input" placeholder="Enter station identifier...">
                    <div class="field-hint">Station identification code (3-4 digits recommended)</div>
                </div>

                <div class="field-group">
                    <label for="body" class="field-label">
                        <span class="label-icon">🔢</span>
                        MESSAGE_PAYLOAD
                    </label>
                    <textarea rows="8" name="body" id="body" class="terminal-textarea" placeholder="Enter numerical message groups...">846 846 20 20 83167 83167 14528 14528 30778 30778 13436 13436 50234 50234 67256 67256 15654 15654 27414 27414 15837 15837 75251 75251 51820 51820 37982 37982 64162 64162 18385 18385 90381 90381 77942 77942 12692 12692 22897 22897 69231 69231 14881 14881 846 846 20 20 00000</textarea>
                    <div class="field-hint">
                        <strong>PROTOCOL:</strong> Space = short pause | _ = long pause | Special: * / + #
                    </div>
                </div>
            </div>

            <div class="transmission-config">
                <div class="config-section">
                    <h3 class="config-title">TRANSMISSION_MODE</h3>
                    <div class="mode-selector">
                        <label class="radio-option active">
                            <input id="mode-voice" type="radio" name="mode" value="voice" checked>
                            <span class="radio-custom"></span>
                            <span class="radio-label">VOICE_SYNTHESIS</span>
                        </label>
                        <label class="radio-option">
                            <input id="mode-morse" type="radio" name="mode" value="morse">
                            <span class="radio-custom"></span>
                            <span class="radio-label">MORSE_CODE</span>
                        </label>
                    </div>
                </div>

                <div id="voice-settings" class="config-section">
                    <h3 class="config-title">VOICE_PARAMETERS</h3>
                    <div class="parameter-grid">
                        <div class="param-group">
                            <label for="callsign-reps" class="param-label">CALLSIGN_REPETITIONS</label>
                            <input type="number" id="callsign-reps" value="2" min="1" max="10" class="param-input">
                        </div>
                        
                        <div class="param-group">
                            <label class="param-label checkbox-label">
                                <input type="checkbox" id="achtung-signal" checked class="param-checkbox">
                                <span class="checkbox-custom"></span>
                                ACHTUNG_SIGNAL
                            </label>
                        </div>
                        
                        <div class="param-group">
                            <label class="param-label checkbox-label">
                                <input type="checkbox" id="auto-pause" checked class="param-checkbox">
                                <span class="checkbox-custom"></span>
                                AUTO_PAUSE
                            </label>
                            <input type="number" id="auto-pause-duration" value="100" min="0" step="50" class="param-input inline" placeholder="ms">
                        </div>
                    </div>
                </div>

                <div class="audio-synthesis-panel">
                    <h3 class="config-title">AUDIO_SYNTHESIS</h3>
                    <div class="synthesis-controls">
                        <div class="control-group">
                            <label for="speed-control" class="control-label">
                                <span class="control-icon">⚡</span>
                                SPEED_MULTIPLIER
                            </label>
                            <div class="slider-container">
                                <input type="range" id="speed-control" min="0.5" max="2.0" step="0.1" value="1.0" class="control-slider">
                                <span id="speed-value" class="slider-value">1.0x</span>
                            </div>
                        </div>
                        
                        <div class="control-group">
                            <label for="pitch-control" class="control-label">
                                <span class="control-icon">🎵</span>
                                PITCH_MODULATION
                            </label>
                            <div class="slider-container">
                                <input type="range" id="pitch-control" min="0.5" max="2.0" step="0.1" value="1.0" class="control-slider">
                                <span id="pitch-value" class="slider-value">1.0x</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="morse-settings" class="config-section" style="display: none;">
                <h3 class="config-title">MORSE_PARAMETERS</h3>
                <div class="parameter-grid">
                    <div class="param-group">
                        <label for="morse-wpm" class="param-label">WPM_RATE</label>
                        <input type="number" id="morse-wpm" min="5" max="100" value="20" step="1" class="param-input">
                    </div>
                    <div class="param-group">
                        <label for="morse-frequency" class="param-label">TONE_FREQ</label>
                        <input type="number" id="morse-frequency" min="300" max="2000" value="800" step="50" class="param-input">
                    </div>
                </div>
            </div>

            <div class="transmission-controls">
                <button type="button" id="generate-btn" class="control-btn primary">
                    <span class="btn-icon">🔧</span>
                    GENERATE_AUDIO
                </button>
                <button type="button" id="play-btn" class="control-btn" disabled>
                    <span class="btn-icon">▶️</span>
                    TRANSMIT
                </button>
                <button type="button" id="stop-btn" class="control-btn" disabled>
                    <span class="btn-icon">⏹️</span>
                    ABORT
                </button>
                <button type="button" id="download-btn" class="control-btn" disabled>
                    <span class="btn-icon">💾</span>
                    EXPORT
                </button>
            </div>
        </div>
    </form>

    <div id="audio-output" class="output-terminal"></div>
</div>

<style>
.transmission-console {
    background: rgba(0, 20, 0, 0.9);
    border: 2px solid #00ff00;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
}

.console-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #00ff00;
}

.console-header h2 {
    color: #00ff00;
    font-family: 'Fira Code', monospace;
    font-size: 1.4em;
    margin: 0;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.transmission-status {
    display: flex;
    gap: 20px;
    align-items: center;
}

.status-indicator {
    background: #ff4444;
    color: white;
    padding: 4px 12px;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
    font-weight: bold;
    animation: pulse 2s infinite;
}

.frequency-display {
    color: #00ff00;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
}

.control-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    margin-bottom: 20px;
}

.input-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.field-label {
    color: #00ff00;
    font-family: 'Fira Code', monospace;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
}

.label-icon {
    font-size: 1.2em;
}

.terminal-input, .terminal-textarea {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #00ff00;
    color: #00ff00;
    font-family: 'Fira Code', monospace;
    padding: 12px;
    border-radius: 4px;
    font-size: 0.9em;
}

.terminal-input:focus, .terminal-textarea:focus {
    outline: none;
    border-color: #00ffff;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.field-hint {
    color: #888;
    font-size: 0.8em;
    font-family: 'Fira Code', monospace;
}

.transmission-config {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.config-section {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid #444;
    border-radius: 6px;
    padding: 15px;
}

.config-title {
    color: #00ffff;
    font-family: 'Fira Code', monospace;
    font-size: 1em;
    margin: 0 0 15px 0;
    text-transform: uppercase;
    border-bottom: 1px solid #444;
    padding-bottom: 8px;
}

.mode-selector {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.radio-option:hover {
    background: rgba(0, 255, 0, 0.1);
}

.radio-option.active {
    background: rgba(0, 255, 0, 0.2);
}

.radio-custom {
    width: 16px;
    height: 16px;
    border: 2px solid #00ff00;
    border-radius: 50%;
    position: relative;
}

.radio-option input[type="radio"]:checked + .radio-custom::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    width: 8px;
    height: 8px;
    background: #00ff00;
    border-radius: 50%;
}

.radio-label {
    color: #00ff00;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
}

.parameter-grid {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.param-group {
    display: flex;
    align-items: center;
    gap: 10px;
}

.param-label {
    color: #00ff00;
    font-family: 'Fira Code', monospace;
    font-size: 0.85em;
    min-width: 120px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.checkbox-custom {
    width: 16px;
    height: 16px;
    border: 2px solid #00ff00;
    border-radius: 2px;
    position: relative;
}

.param-checkbox:checked + .checkbox-custom::after {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 1px;
    color: #00ff00;
    font-size: 12px;
    font-weight: bold;
}

.param-input {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #00ff00;
    color: #00ff00;
    font-family: 'Fira Code', monospace;
    padding: 6px 10px;
    border-radius: 4px;
    width: 80px;
}

.param-input.inline {
    width: 60px;
    margin-left: 10px;
}

.synthesis-controls {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.control-label {
    color: #00ffff;
    font-family: 'Fira Code', monospace;
    font-size: 0.85em;
    display: flex;
    align-items: center;
    gap: 8px;
}

.control-icon {
    font-size: 1.1em;
}

.slider-container {
    display: flex;
    align-items: center;
    gap: 15px;
}

.control-slider {
    flex: 1;
    height: 6px;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 3px;
    outline: none;
    -webkit-appearance: none;
}

.control-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    background: #00ff00;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.slider-value {
    color: #00ff00;
    font-family: 'Fira Code', monospace;
    font-size: 0.9em;
    min-width: 40px;
    text-align: center;
}

.transmission-controls {
    display: flex;
    gap: 15px;
    justify-content: center;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #444;
}

.control-btn {
    background: rgba(0, 0, 0, 0.8);
    border: 2px solid #00ff00;
    color: #00ff00;
    font-family: 'Fira Code', monospace;
    padding: 12px 20px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.9em;
    font-weight: bold;
    transition: all 0.3s;
    text-transform: uppercase;
}

.control-btn:hover:not(:disabled) {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
    transform: translateY(-2px);
}

.control-btn.primary {
    border-color: #00ffff;
    color: #00ffff;
}

.control-btn.primary:hover:not(:disabled) {
    background: rgba(0, 255, 255, 0.1);
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
}

.control-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #666;
    color: #666;
}

.btn-icon {
    font-size: 1.1em;
}

.output-terminal {
    background: rgba(0, 0, 0, 0.9);
    border: 1px solid #00ff00;
    border-radius: 6px;
    padding: 15px;
    margin-top: 20px;
    min-height: 60px;
    font-family: 'Fira Code', monospace;
    color: #00ff00;
    font-size: 0.9em;
}

/* Hide default radio buttons and checkboxes */
.radio-option input[type="radio"],
.param-checkbox {
    display: none;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Responsive design */
@media (max-width: 768px) {
    .control-panel {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .transmission-controls {
        flex-wrap: wrap;
        gap: 10px;
    }
    
    .control-btn {
        flex: 1;
        min-width: 120px;
    }
}
</style>
