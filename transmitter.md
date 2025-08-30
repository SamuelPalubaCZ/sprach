---
layout: default
title: Transmitter
nav_order: 2
---

<div class="transmission-overlay" id="transmission-overlay"></div>

<div class="control-panel">
    <div class="panel-header">
        <h2 class="panel-title">Enhanced Message Transmitter</h2>
        <div class="panel-status">
            <span id="transmitter-status">Ready for Transmission</span>
        </div>
    </div>

    <form id="speech-form" onsubmit="return false;">
        <div class="settings-grid">
            <!-- Message Configuration -->
            <div class="settings-section">
                <div class="settings-header">Message Configuration</div>
                
                <div class="form-group">
                    <label class="form-label" for="call">Call Sign</label>
                    <input id="call" type="text" class="form-input" value="271" maxlength="10">
                    <small class="text-secondary">Numeric call sign (e.g., 271, 846)</small>
                </div>

                <div class="form-group">
                    <label class="form-label" for="body">Message Body</label>
                    <textarea rows="6" name="body" id="body" class="form-textarea" placeholder="Enter numbers separated by spaces...">846 846 20 20 83167 83167 14528 14528 30778 30778 13436 13436 50234 50234 67256 67256 15654 15654 27414 27414 15837 15837 75251 75251 51820 51820 37982 37982 64162 64162 18385 18385 90381 90381 77942 77942 12692 12692 22897 22897 69231 69231 14881 14881 846 846 20 20 00000</textarea>
                    <small class="text-secondary">Use spaces for pauses, _ for long pauses. Special: * (Achtung), / (Trennung), + (Ende)</small>
                </div>

                <div class="form-group">
                    <label for="live-mode-toggle">
                        <input type="checkbox" id="live-mode-toggle"> Real-Time Live Mode
                    </label>
                    <small class="text-secondary">Enable live keyboard transmission</small>
                </div>

                <div id="live-mode-instructions" style="display: none;" class="mt-md">
                    <!-- Live mode instructions will be inserted here -->
                </div>
            </div>

            <!-- Transmission Mode -->
            <div class="settings-section">
                <div class="settings-header">Transmission Mode</div>
                
                <div class="mode-selector">
                    <button type="button" class="mode-option active" data-mode="voice">Voice</button>
                    <button type="button" class="mode-option" data-mode="morse">Morse</button>
                    <button type="button" class="mode-option" data-mode="hybrid">Hybrid</button>
                </div>

                <div class="form-group mt-md">
                    <label class="form-label">Message Repeat Count</label>
                    <select id="repeat-count" class="form-select">
                        <option value="1">Single Transmission</option>
                        <option value="2" selected>Repeat Once (Standard)</option>
                        <option value="3">Repeat Twice</option>
                        <option value="5">Repeat 4 Times</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="schedule-transmission">
                        <input type="checkbox" id="schedule-transmission"> Scheduled Transmission
                    </label>
                </div>
            </div>
        </div>

        <!-- Voice Settings -->
        <div id="voice-settings" class="settings-grid mt-xl">
            <div class="settings-section">
                <div class="settings-header">Voice Configuration</div>
                
                <div class="form-group">
                    <label class="form-label">Voice Character</label>
                    <select id="voice-select" class="form-select">
                        <option value="female">Female (Original Stasi Voice)</option>
                        <option value="child">Child Voice (Swedish Rhapsody Style)</option>
                        <option value="male">Male Voice (Synthesized)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">Language Pack</label>
                    <select id="language-select" class="form-select">
                        <option value="german" selected>German (Deutsch)</option>
                        <option value="spanish">Spanish (Español)</option>
                        <option value="english">English</option>
                    </select>
                </div>

                <div class="range-group">
                    <label class="form-label">Speech Speed</label>
                    <input type="range" id="speed-control" class="range-input" min="0.5" max="2.0" value="1.0" step="0.1">
                    <span class="range-value">1.0</span>
                </div>

                <div class="range-group">
                    <label class="form-label">Voice Pitch</label>
                    <input type="range" id="pitch-control" class="range-input" min="0.5" max="2.0" value="1.0" step="0.1">
                    <span class="range-value">1.0</span>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-header">Broadcast Options</div>
                
                <div class="form-group">
                    <label class="form-label">Call Sign Repetitions</label>
                    <input type="number" id="callsign-reps" class="form-input" value="2" min="1" max="10">
                </div>

                <div class="form-group">
                    <label for="achtung-signal">
                        <input type="checkbox" id="achtung-signal" checked> Play 'Achtung' Signal
                    </label>
                </div>

                <div class="form-group">
                    <label for="auto-pause">
                        <input type="checkbox" id="auto-pause" checked> Auto-pause Between Digits
                    </label>
                    <input type="number" id="auto-pause-duration" class="form-input" value="100" min="0" step="50" style="width: 100px; margin-left: 10px;"> ms
                </div>

                <div class="form-group">
                    <label for="authentic-timing">
                        <input type="checkbox" id="authentic-timing" checked> Authentic Cold War Timing
                    </label>
                </div>
            </div>
        </div>

        <!-- Morse Settings -->
        <div id="morse-settings" style="display: none;" class="settings-grid mt-xl">
            <div class="settings-section">
                <div class="settings-header">Morse Configuration</div>
                
                <div class="range-group">
                    <label class="form-label">Speed (WPM)</label>
                    <input type="range" id="morse-wpm" class="range-input" min="5" max="100" value="53" step="1">
                    <span class="range-value">53</span>
                    <small class="text-secondary">Original Stasi default: 53 WPM</small>
                </div>

                <div class="range-group">
                    <label class="form-label">Tone Frequency (Hz)</label>
                    <input type="range" id="morse-frequency" class="range-input" min="300" max="2000" value="1000" step="50">
                    <span class="range-value">1000</span>
                    <small class="text-secondary">Standard frequencies: 800, 1000, 1200 Hz</small>
                </div>

                <div class="form-group">
                    <label for="morse-extra-spacing">
                        <input type="checkbox" id="morse-extra-spacing"> Extra Character Spacing
                    </label>
                </div>

                <div class="form-group">
                    <label for="morse-visual-display">
                        <input type="checkbox" id="morse-visual-display" checked> Show Visual Morse Pattern
                    </label>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-header">Morse Presets</div>
                
                <div class="form-group">
                    <label class="form-label">Historical Presets</label>
                    <select id="morse-presets" class="form-select">
                        <option value="custom">Custom Settings</option>
                        <option value="stasi-europe">Stasi Europe (Voice Region)</option>
                        <option value="stasi-dx">Stasi DX (Long Distance)</option>
                        <option value="cia-standard">CIA Standard</option>
                        <option value="kgb-fast">KGB High Speed</option>
                    </select>
                </div>

                <button type="button" id="test-morse" class="btn">Test Morse Tone</button>
            </div>
        </div>

        <!-- Audio Effects -->
        <div class="settings-grid mt-xl">
            <div class="settings-section">
                <div class="settings-header">Audio Effects</div>
                
                <div class="form-group">
                    <label class="form-label">Effect Preset</label>
                    <select id="effects-preset" class="form-select">
                        <option value="clean">Clean (No Effects)</option>
                        <option value="shortwave">Shortwave Radio</option>
                        <option value="distant">Distant Station</option>
                        <option value="interference">Heavy Interference</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="shortwave-effects">
                        <input type="checkbox" id="shortwave-effects"> Shortwave Radio Effects
                    </label>
                </div>

                <div class="form-group">
                    <label for="static-noise">
                        <input type="checkbox" id="static-noise"> Background Static
                    </label>
                    <input type="range" id="noise-level" class="range-input" min="0" max="0.5" value="0.1" step="0.05" disabled>
                    <span class="range-value">0.1</span>
                </div>

                <div class="form-group">
                    <label for="signal-fading">
                        <input type="checkbox" id="signal-fading"> Signal Fading
                    </label>
                </div>
            </div>

            <div class="settings-section">
                <div class="settings-header">Advanced Audio</div>
                
                <div class="range-group">
                    <label class="form-label">Output Volume</label>
                    <input type="range" id="output-volume" class="range-input" min="0" max="1" value="0.8" step="0.1">
                    <span class="range-value">0.8</span>
                </div>

                <div class="form-group">
                    <label for="normalize-audio">
                        <input type="checkbox" id="normalize-audio" checked> Normalize Audio Levels
                    </label>
                </div>

                <div class="form-group">
                    <label for="stereo-mode">
                        <input type="checkbox" id="stereo-mode"> Stereo Mode (L: Voice, R: Morse)
                    </label>
                </div>
            </div>
        </div>

        <!-- Generation Controls -->
        <div class="mt-xl text-center">
            <button type="submit" id="generate-button" class="btn btn-primary btn-large btn-full">
                Generate Transmission
            </button>
            
            <div class="mt-md">
                <button type="button" id="quick-test" class="btn">Quick Test (10 sec)</button>
                <button type="button" id="save-session" class="btn">Save Session</button>
                <button type="button" id="load-session" class="btn">Load Session</button>
            </div>
        </div>
    </form>
</div>

<!-- Manual Dial Pad -->
<div class="control-panel">
    <div class="panel-header">
        <h3 class="panel-title">Manual Transmission Dial Pad</h3>
        <div class="panel-status">
            <span>Real-time tone generation</span>
        </div>
    </div>

    <div class="dial-pad" id="dial-pad">
        <!-- Dial pad buttons generated by JavaScript -->
    </div>

    <div class="special-functions" id="special-functions">
        <!-- Special function buttons generated by JavaScript -->
    </div>

    <div class="mt-lg text-center">
        <div class="form-group">
            <label for="dial-pad-mode">
                <input type="checkbox" id="dial-pad-mode"> Live Dial Pad Mode
            </label>
            <small class="text-secondary">Click numbers to transmit immediately</small>
        </div>
    </div>
</div>

<!-- Audio Output -->
<div class="audio-output" id="audio-output" style="display: none;">
    <div class="panel-header">
        <h3 class="panel-title">Generated Transmission</h3>
        <div class="panel-status">
            <span id="audio-status">Ready for playback</span>
        </div>
    </div>

    <div class="progress-bar mb-lg">
        <div class="progress-fill" id="generation-progress"></div>
    </div>

    <audio id="audio-playback" controls class="audio-player"></audio>

    <div class="mt-md text-center">
        <a id="download-link" href="#" download="sprach-transmission.wav" class="btn btn-primary">
            Download WAV File
        </a>
        
        <div class="mt-md">
            <button type="button" id="export-session" class="btn">Export Session Data</button>
            <button type="button" id="share-transmission" class="btn">Share Transmission</button>
        </div>
    </div>

    <div id="transmission-analysis" class="mt-lg">
        <div class="panel-header">
            <h4 class="panel-title">Transmission Analysis</h4>
        </div>
        <div id="analysis-data">
            <!-- Analysis data will be populated here -->
        </div>
    </div>
</div>

<style>
.effect-toggle {
    margin-right: 10px;
}

.dial-pad {
    max-width: 300px;
    margin: 0 auto;
}

.transmission-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 255, 65, 0.05);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1000;
}

.transmission-overlay.active {
    opacity: 1;
}

.audio-player {
    filter: hue-rotate(120deg) saturate(1.5);
}

.range-group {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
}

.range-group .form-label {
    min-width: 120px;
    margin-bottom: 0;
}

.text-secondary {
    color: var(--text-secondary);
    font-size: 0.8rem;
    display: block;
    margin-top: 0.25rem;
}
</style></absolute_file_name>
    </file>