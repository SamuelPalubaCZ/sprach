/**
 * UI Module - Main user interface controller
 * Handles all UI interactions, state management, and module coordination
 */

import { encodeMessage, decodeMessage } from './encoder.js';
import { encryptOTP, decryptOTP, generateOTPKey } from './otp.js';
import { performXOR } from './xor.js';
import { 
    initializeAudio, 
    playTransmission, 
    stopTransmission, 
    playSingleSound,
    getPlaybackStatus,
    getAvailableVoicePacks,
    setMasterVolume,
    resumeAudioContext,
    setPlaybackSpeed,
    setPitchShift
} from './audio.js';
import { 
    initializeMorse,
    transmitMorse,
    stopMorseTransmission,
    sendMorseCharacter,
    getMorseStatus,
    isValidWPM,
    isValidFrequency
} from './morse.js';

// Application state
const state = {
    currentMessage: null,
    isPlaying: false,
    isDarkMode: false,
    audioInitialized: false,
    dialerQueue: [],
    settings: {
        cipher: 'a1z26',
        voiceMode: true,
        voicePack: 'default',
        digitGap: 800,
        groupGap: 1500,
        preludeGap: 2000,
        repeatGroups: false,
        addNoise: false,
        noiseVolume: 0.1,
        masterVolume: 0.8,
        cwFrequency: 800,
        cwWPM: 20,
        cwVolume: 0.7,
        voiceSpeed: 1.0,
        voicePitch: 0
    }
};

// DOM elements cache
const elements = {};

/**
 * Initialize the UI system
 */
export async function initializeUI() {
    try {
        // Cache DOM elements
        cacheElements();
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize audio system
        await initializeAudioSystem();
        
        // Load settings from localStorage
        loadSettings();
        
        // Apply initial theme
        applyTheme();
        
        // Update UI state
        updateUI();
        
        // Load voice packs list
        await updateVoicePacksList();
        
        console.log('UI system initialized successfully');
        return true;
        
    } catch (error) {
        console.error('Failed to initialize UI:', error);
        showError('Failed to initialize application');
        return false;
    }
}

/**
 * Cache frequently used DOM elements
 */
function cacheElements() {
    // Input elements
    elements.messageInput = document.getElementById('messageInput');
    elements.cipherSelect = document.getElementById('cipherSelect');
    elements.checkerboardKey = document.getElementById('checkerboardKey');
    
    // Output elements
    elements.encodedOutput = document.getElementById('encodedOutput');
    elements.groupCount = document.getElementById('groupCount');
    
    // OTP elements
    elements.otpEnabled = document.getElementById('otpEnabled');
    elements.otpKey = document.getElementById('otpKey');
    elements.otpGenerate = document.getElementById('otpGenerate');
    elements.otpOutput = document.getElementById('otpOutput');
    
    // XOR elements
    elements.xorInput = document.getElementById('xorInput');
    elements.xorKey = document.getElementById('xorKey');
    elements.xorMode = document.getElementById('xorMode');
    elements.xorOutput = document.getElementById('xorOutput');
    
    // Voice/CW mode
    elements.voiceMode = document.getElementById('voiceMode');
    elements.cwMode = document.getElementById('cwMode');
    elements.voiceSettings = document.getElementById('voiceSettings');
    elements.cwSettings = document.getElementById('cwSettings');
    
    // Voice settings
    elements.voicePackSelect = document.getElementById('voicePackSelect');
    elements.digitGap = document.getElementById('digitGap');
    elements.groupGap = document.getElementById('groupGap');
    elements.preludeGap = document.getElementById('preludeGap');
    elements.repeatGroups = document.getElementById('repeatGroups');
    elements.addNoise = document.getElementById('addNoise');
    elements.noiseVolume = document.getElementById('noiseVolume');
    elements.masterVolume = document.getElementById('masterVolume');
    
    // CW settings
    elements.cwFrequency = document.getElementById('cwFrequency');
    elements.cwWPM = document.getElementById('cwWPM');
    elements.cwVolume = document.getElementById('cwVolume');
    
    // Transport controls
    elements.playButton = document.getElementById('playButton');
    elements.stopButton = document.getElementById('stopButton');
    elements.statusLED = document.getElementById('statusLED');
    elements.progressBar = document.getElementById('progressBar');
    elements.timeDisplay = document.getElementById('timeDisplay');
    
    // Dialer
    elements.dialerQueue = document.getElementById('dialerQueue');
    elements.dialerClear = document.getElementById('dialerClear');
    
    // Recording
    elements.recordButton = document.getElementById('recordButton');
    elements.exportButton = document.getElementById('exportButton');
    

    
    // Status display
    elements.statusDisplay = document.getElementById('statusDisplay');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Message input and encoding
    elements.messageInput?.addEventListener('input', handleMessageInput);
    elements.cipherSelect?.addEventListener('change', handleCipherChange);
    elements.checkerboardKey?.addEventListener('input', handleCheckerboardKeyChange);
    
    // OTP controls
    elements.otpEnabled?.addEventListener('change', handleOTPToggle);
    elements.otpKey?.addEventListener('input', handleOTPKeyChange);
    elements.otpGenerate?.addEventListener('click', handleOTPGenerate);
    
    // XOR controls
    elements.xorInput?.addEventListener('input', handleXORInput);
    elements.xorKey?.addEventListener('input', handleXORKeyChange);
    elements.xorMode?.addEventListener('change', handleXORModeChange);
    document.getElementById('xorEncrypt')?.addEventListener('click', () => handleXOROperation('encrypt'));
    document.getElementById('xorDecrypt')?.addEventListener('click', () => handleXOROperation('decrypt'));
    
    // Voice/CW mode
    elements.voiceMode?.addEventListener('change', handleVoiceModeChange);
    elements.cwMode?.addEventListener('change', handleCWModeChange);
    
    // Voice settings
    elements.voicePackSelect?.addEventListener('change', handleVoicePackChange);
    elements.digitGap?.addEventListener('input', handleTimingChange);
    elements.groupGap?.addEventListener('input', handleTimingChange);
    elements.preludeGap?.addEventListener('input', handleTimingChange);
    elements.repeatGroups?.addEventListener('change', handleRepeatGroupsChange);
    elements.addNoise?.addEventListener('change', handleNoiseToggle);
    elements.noiseVolume?.addEventListener('input', handleNoiseVolumeChange);
    elements.masterVolume?.addEventListener('input', handleMasterVolumeChange);
    
    // CW settings
    elements.cwFrequency?.addEventListener('input', handleCWFrequencyChange);
    elements.cwWPM?.addEventListener('input', handleCWWPMChange);
    elements.cwVolume?.addEventListener('input', handleCWVolumeChange);
    
    // Transport controls
    elements.playButton?.addEventListener('click', handlePlay);
    elements.stopButton?.addEventListener('click', handleStop);
    
    // Dialer
    setupDialerListeners();
    elements.dialerClear?.addEventListener('click', handleDialerClear);
    
    // Recording
    elements.recordButton?.addEventListener('click', handleRecord);
    elements.exportButton?.addEventListener('click', handleExport);
    
    // Speed and pitch controls
    const voiceSpeed = document.getElementById('voiceSpeed');
    const voicePitch = document.getElementById('voicePitch');
    const voiceSpeedValue = document.getElementById('voiceSpeedValue');
    const voicePitchValue = document.getElementById('voicePitchValue');
    
    if (voiceSpeed && voiceSpeedValue) {
         voiceSpeed.addEventListener('input', (e) => {
             const speed = parseInt(e.target.value) / 100;
             voiceSpeedValue.textContent = `${e.target.value}%`;
             state.settings.voiceSpeed = speed;
             setPlaybackSpeed(speed);
             saveSettings();
         });
     }
     
     if (voicePitch && voicePitchValue) {
         voicePitch.addEventListener('input', (e) => {
             const pitch = parseInt(e.target.value);
             voicePitchValue.textContent = `${pitch} st`;
             state.settings.voicePitch = pitch;
             setPitchShift(pitch);
             saveSettings();
         });
     }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Audio context resume (for autoplay policy)
    document.addEventListener('click', resumeAudioContextOnce, { once: true });
    document.addEventListener('keydown', resumeAudioContextOnce, { once: true });
}

/**
 * Set up dialer button listeners
 */
function setupDialerListeners() {
    // Number buttons
    for (let i = 0; i <= 9; i++) {
        const button = document.getElementById(`dial${i}`);
        button?.addEventListener('click', () => handleDialerInput(i.toString()));
    }
    
    // Special buttons
    document.getElementById('dialAchtung')?.addEventListener('click', () => handleDialerInput('achtung'));
    document.getElementById('dialTrennung')?.addEventListener('click', () => handleDialerInput('trennung'));
    document.getElementById('dialEnde')?.addEventListener('click', () => handleDialerInput('ende'));
}

/**
 * Initialize audio system
 */
async function initializeAudioSystem() {
    try {
        const success = await initializeAudio();
        if (success) {
            // Initialize Morse system with shared audio context
            const audioContext = window.AudioContext || window.webkitAudioContext;
            if (audioContext) {
                // Get audio context from audio module (would need to expose it)
                // For now, Morse will initialize its own context
                state.audioInitialized = true;
                updateStatusDisplay('Audio system ready');
            }
        } else {
            throw new Error('Audio initialization failed');
        }
    } catch (error) {
        console.error('Audio system initialization failed:', error);
        updateStatusDisplay('Audio system unavailable', 'error');
    }
}

/**
 * Resume audio context on first user interaction
 */
async function resumeAudioContextOnce() {
    try {
        await resumeAudioContext();
    } catch (error) {
        console.warn('Failed to resume audio context:', error);
    }
}

/**
 * Handle message input changes
 */
function handleMessageInput() {
    const message = elements.messageInput.value.trim();
    if (message) {
        encodeCurrentMessage();
    } else {
        clearEncodedOutput();
    }
}

/**
 * Handle cipher selection change
 */
function handleCipherChange() {
    state.settings.cipher = elements.cipherSelect.value;
    
    // Show/hide checkerboard key input
    const checkerboardGroup = document.getElementById('checkerboardGroup');
    if (checkerboardGroup) {
        checkerboardGroup.style.display = 
            state.settings.cipher === 'checkerboard' ? 'block' : 'none';
    }
    
    encodeCurrentMessage();
    saveSettings();
}

/**
 * Handle checkerboard key change
 */
function handleCheckerboardKeyChange() {
    encodeCurrentMessage();
}

/**
 * Encode current message
 */
function encodeCurrentMessage() {
    const message = elements.messageInput.value.trim();
    if (!message) {
        clearEncodedOutput();
        return;
    }
    
    try {
        const options = {
            cipher: state.settings.cipher
        };
        
        if (state.settings.cipher === 'checkerboard') {
            options.checkerboardKey = elements.checkerboardKey.value.trim();
        }
        
        const result = encodeMessage(message, options);
        
        if (result.success) {
            state.currentMessage = result;
            elements.encodedOutput.textContent = result.groups.join(' ');
            elements.groupCount.textContent = result.count;
            
            // Apply OTP if enabled
            if (elements.otpEnabled.checked) {
                applyOTPToMessage();
            }
        } else {
            showError(result.error);
            clearEncodedOutput();
        }
        
    } catch (error) {
        console.error('Encoding error:', error);
        showError('Failed to encode message');
        clearEncodedOutput();
    }
}

/**
 * Clear encoded output
 */
function clearEncodedOutput() {
    elements.encodedOutput.textContent = '';
    elements.groupCount.textContent = '0';
    state.currentMessage = null;
}

/**
 * Handle OTP toggle
 */
function handleOTPToggle() {
    const otpControls = document.getElementById('otpControls');
    if (otpControls) {
        otpControls.style.display = elements.otpEnabled.checked ? 'block' : 'none';
    }
    
    if (elements.otpEnabled.checked) {
        applyOTPToMessage();
    } else {
        // Restore original encoded message
        if (state.currentMessage) {
            elements.encodedOutput.textContent = state.currentMessage.groups.join(' ');
        }
        elements.otpOutput.textContent = '';
    }
}

/**
 * Handle OTP key change
 */
function handleOTPKeyChange() {
    if (elements.otpEnabled.checked) {
        applyOTPToMessage();
    }
}

/**
 * Generate OTP key
 */
function handleOTPGenerate() {
    if (state.currentMessage) {
        const totalDigits = state.currentMessage.groups.join('').length;
        const key = generateOTPKey(totalDigits);
        elements.otpKey.value = key;
        applyOTPToMessage();
    }
}

/**
 * Apply OTP to current message
 */
function applyOTPToMessage() {
    if (!state.currentMessage || !elements.otpEnabled.checked) return;
    
    const key = elements.otpKey.value.trim();
    if (!key) {
        elements.otpOutput.textContent = 'Enter OTP key';
        return;
    }
    
    try {
        const plaintext = state.currentMessage.groups.join('');
        const result = encryptOTP(plaintext, key);
        
        if (result.success) {
            // Format as groups
            const groups = [];
            for (let i = 0; i < result.ciphertext.length; i += 5) {
                groups.push(result.ciphertext.substr(i, 5));
            }
            elements.otpOutput.textContent = groups.join(' ');
        } else {
            elements.otpOutput.textContent = `Error: ${result.error}`;
        }
        
    } catch (error) {
        console.error('OTP error:', error);
        elements.otpOutput.textContent = 'OTP operation failed';
    }
}

/**
 * Handle XOR input
 */
function handleXORInput() {
    // Auto-perform XOR if both input and key are present
    if (elements.xorInput.value.trim() && elements.xorKey.value.trim()) {
        handleXOROperation('encrypt');
    }
}

/**
 * Handle XOR key change
 */
function handleXORKeyChange() {
    handleXORInput();
}

/**
 * Handle XOR mode change
 */
function handleXORModeChange() {
    handleXORInput();
}

/**
 * Handle XOR operation
 */
function handleXOROperation(operation) {
    const input = elements.xorInput.value.trim();
    const key = elements.xorKey.value.trim();
    const mode = elements.xorMode.value;
    
    if (!input || !key) {
        elements.xorOutput.textContent = 'Enter input and key';
        return;
    }
    
    try {
        const result = performXOR(input, key, mode, operation);
        
        if (result.success) {
            elements.xorOutput.textContent = result.output;
        } else {
            elements.xorOutput.textContent = `Error: ${result.error}`;
        }
        
    } catch (error) {
        console.error('XOR error:', error);
        elements.xorOutput.textContent = 'XOR operation failed';
    }
}

/**
 * Handle voice mode change
 */
function handleVoiceModeChange() {
    if (elements.voiceMode.checked) {
        state.settings.voiceMode = true;
        elements.voiceSettings.style.display = 'block';
        elements.cwSettings.style.display = 'none';
        saveSettings();
    }
}

/**
 * Handle CW mode change
 */
function handleCWModeChange() {
    if (elements.cwMode.checked) {
        state.settings.voiceMode = false;
        elements.voiceSettings.style.display = 'none';
        elements.cwSettings.style.display = 'block';
        saveSettings();
    }
}

/**
 * Handle voice pack change
 */
function handleVoicePackChange() {
    state.settings.voicePack = elements.voicePackSelect.value;
    saveSettings();
}

/**
 * Handle timing changes
 */
function handleTimingChange(event) {
    const setting = event.target.id;
    const value = parseInt(event.target.value);
    
    state.settings[setting] = value;
    
    // Update display
    const display = document.getElementById(`${setting}Display`);
    if (display) {
        display.textContent = `${value}ms`;
    }
    
    saveSettings();
}

/**
 * Handle repeat groups toggle
 */
function handleRepeatGroupsChange() {
    state.settings.repeatGroups = elements.repeatGroups.checked;
    saveSettings();
}

/**
 * Handle noise toggle
 */
function handleNoiseToggle() {
    state.settings.addNoise = elements.addNoise.checked;
    
    const noiseControls = document.getElementById('noiseControls');
    if (noiseControls) {
        noiseControls.style.display = state.settings.addNoise ? 'block' : 'none';
    }
    
    saveSettings();
}

/**
 * Handle noise volume change
 */
function handleNoiseVolumeChange() {
    state.settings.noiseVolume = parseFloat(elements.noiseVolume.value);
    
    const display = document.getElementById('noiseVolumeDisplay');
    if (display) {
        display.textContent = Math.round(state.settings.noiseVolume * 100) + '%';
    }
    
    saveSettings();
}

/**
 * Handle master volume change
 */
function handleMasterVolumeChange() {
    state.settings.masterVolume = parseFloat(elements.masterVolume.value);
    
    const display = document.getElementById('masterVolumeDisplay');
    if (display) {
        display.textContent = Math.round(state.settings.masterVolume * 100) + '%';
    }
    
    setMasterVolume(state.settings.masterVolume);
    saveSettings();
}

/**
 * Handle CW frequency change
 */
function handleCWFrequencyChange() {
    const frequency = parseInt(elements.cwFrequency.value);
    
    if (isValidFrequency(frequency)) {
        state.settings.cwFrequency = frequency;
        
        const display = document.getElementById('cwFrequencyDisplay');
        if (display) {
            display.textContent = `${frequency}Hz`;
        }
        
        saveSettings();
    }
}

/**
 * Handle CW WPM change
 */
function handleCWWPMChange() {
    const wpm = parseInt(elements.cwWPM.value);
    
    if (isValidWPM(wpm)) {
        state.settings.cwWPM = wpm;
        
        const display = document.getElementById('cwWPMDisplay');
        if (display) {
            display.textContent = `${wpm} WPM`;
        }
        
        saveSettings();
    }
}

/**
 * Handle CW volume change
 */
function handleCWVolumeChange() {
    state.settings.cwVolume = parseFloat(elements.cwVolume.value);
    
    const display = document.getElementById('cwVolumeDisplay');
    if (display) {
        display.textContent = Math.round(state.settings.cwVolume * 100) + '%';
    }
    
    saveSettings();
}

/**
 * Handle play button
 */
async function handlePlay() {
    if (state.isPlaying) return;
    
    if (!state.currentMessage) {
        showError('No message to transmit');
        return;
    }
    
    try {
        state.isPlaying = true;
        updateTransportControls();
        
        let result;
        
        if (state.settings.voiceMode) {
            // Voice transmission
            const settings = {
                voicePack: state.settings.voicePack,
                digitGap: state.settings.digitGap,
                groupGap: state.settings.groupGap,
                preludeGap: state.settings.preludeGap,
                repeatGroups: state.settings.repeatGroups,
                addNoise: state.settings.addNoise,
                noiseVolume: state.settings.noiseVolume
            };
            
            result = await playTransmission(state.currentMessage, settings);
        } else {
            // CW transmission
            const settings = {
                frequency: state.settings.cwFrequency,
                wpm: state.settings.cwWPM,
                volume: state.settings.cwVolume
            };
            
            result = await transmitMorse(state.currentMessage, settings);
        }
        
        if (result.success) {
            updateStatusDisplay(`Transmitting (${result.duration.toFixed(1)}s)`);
            startProgressUpdater();
        } else {
            state.isPlaying = false;
            updateTransportControls();
            showError(result.error);
        }
        
    } catch (error) {
        console.error('Playback error:', error);
        state.isPlaying = false;
        updateTransportControls();
        showError('Transmission failed');
    }
}

/**
 * Handle stop button
 */
function handleStop() {
    if (!state.isPlaying) return;
    
    if (state.settings.voiceMode) {
        stopTransmission();
    } else {
        stopMorseTransmission();
    }
    
    state.isPlaying = false;
    updateTransportControls();
    updateStatusDisplay('Transmission stopped');
}

/**
 * Handle dialer input
 */
async function handleDialerInput(value) {
    state.dialerQueue.push(value);
    updateDialerDisplay();
    
    // Play sound immediately
    if (state.settings.voiceMode) {
        await playSingleSound(value, state.settings.voicePack);
    } else {
        const settings = {
            frequency: state.settings.cwFrequency,
            wpm: state.settings.cwWPM,
            volume: state.settings.cwVolume
        };
        await sendMorseCharacter(value, settings);
    }
}

/**
 * Handle dialer clear
 */
function handleDialerClear() {
    state.dialerQueue = [];
    updateDialerDisplay();
}

/**
 * Handle record button
 */
function handleRecord() {
    // TODO: Implement recording functionality
    showError('Recording not yet implemented');
}

/**
 * Handle export button
 */
function handleExport() {
    // TODO: Implement WAV export functionality
    showError('Export not yet implemented');
}



/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // Dialer shortcuts
    if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
        if (event.key >= '0' && event.key <= '9') {
            event.preventDefault();
            handleDialerInput(event.key);
        } else if (event.key === '*') {
            event.preventDefault();
            handleDialerInput('achtung');
        } else if (event.key === '/') {
            event.preventDefault();
            handleDialerInput('trennung');
        } else if (event.key === '+') {
            event.preventDefault();
            handleDialerInput('ende');
        }
    }
    
    // Global shortcuts
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case ' ':
                event.preventDefault();
                if (state.isPlaying) {
                    handleStop();
                } else {
                    handlePlay();
                }
                break;
        }
    }
}

/**
 * Update transport controls
 */
function updateTransportControls() {
    if (elements.playButton) {
        elements.playButton.disabled = state.isPlaying;
    }
    
    if (elements.stopButton) {
        elements.stopButton.disabled = !state.isPlaying;
    }
    
    if (elements.statusLED) {
        elements.statusLED.className = `led ${state.isPlaying ? 'active' : 'inactive'}`;
    }
}

/**
 * Start progress updater
 */
function startProgressUpdater() {
    const updateProgress = () => {
        if (!state.isPlaying) return;
        
        const status = state.settings.voiceMode ? getPlaybackStatus() : getMorseStatus();
        
        if (elements.progressBar) {
            elements.progressBar.style.width = `${status.progress * 100}%`;
        }
        
        if (elements.timeDisplay) {
            const elapsed = Math.floor(status.elapsed);
            const remaining = Math.floor(status.remainingTime);
            elements.timeDisplay.textContent = `${elapsed}s / ${elapsed + remaining}s`;
        }
        
        if (status.progress < 1) {
            requestAnimationFrame(updateProgress);
        } else {
            // Transmission completed
            state.isPlaying = false;
            updateTransportControls();
            updateStatusDisplay('Transmission completed');
            
            if (elements.progressBar) {
                elements.progressBar.style.width = '0%';
            }
        }
    };
    
    requestAnimationFrame(updateProgress);
}

/**
 * Update dialer display
 */
function updateDialerDisplay() {
    if (elements.dialerQueue) {
        elements.dialerQueue.textContent = state.dialerQueue.join(' ');
    }
}

/**
 * Update voice packs list
 */
async function updateVoicePacksList() {
    if (!elements.voicePackSelect) return;
    
    const packs = getAvailableVoicePacks();
    
    elements.voicePackSelect.innerHTML = '';
    
    for (const pack of packs) {
        const option = document.createElement('option');
        option.value = pack.id;
        option.textContent = pack.name + (pack.loaded ? ' ✓' : '');
        elements.voicePackSelect.appendChild(option);
    }
    
    elements.voicePackSelect.value = state.settings.voicePack;
}

/**
 * Update UI state
 */
function updateUI() {
    // Set form values from state
    if (elements.cipherSelect) {
        elements.cipherSelect.value = state.settings.cipher;
    }
    
    if (elements.voiceMode) {
        elements.voiceMode.checked = state.settings.voiceMode;
    }
    
    if (elements.cwMode) {
        elements.cwMode.checked = !state.settings.voiceMode;
    }
    
    // Show/hide settings panels
    if (elements.voiceSettings) {
        elements.voiceSettings.style.display = state.settings.voiceMode ? 'block' : 'none';
    }
    
    if (elements.cwSettings) {
        elements.cwSettings.style.display = state.settings.voiceMode ? 'none' : 'block';
    }
    
    // Update range inputs and displays
    updateRangeInputs();
    
    // Update transport controls
    updateTransportControls();
}

/**
 * Update range inputs and their displays
 */
function updateRangeInputs() {
    const ranges = [
        { element: elements.digitGap, setting: 'digitGap', suffix: 'ms' },
        { element: elements.groupGap, setting: 'groupGap', suffix: 'ms' },
        { element: elements.preludeGap, setting: 'preludeGap', suffix: 'ms' },
        { element: elements.noiseVolume, setting: 'noiseVolume', suffix: '%', multiplier: 100 },
        { element: elements.masterVolume, setting: 'masterVolume', suffix: '%', multiplier: 100 },
        { element: elements.cwFrequency, setting: 'cwFrequency', suffix: 'Hz' },
        { element: elements.cwWPM, setting: 'cwWPM', suffix: ' WPM' },
        { element: elements.cwVolume, setting: 'cwVolume', suffix: '%', multiplier: 100 }
    ];
    
    for (const range of ranges) {
        if (range.element) {
            range.element.value = state.settings[range.setting];
            
            const display = document.getElementById(`${range.setting}Display`);
            if (display) {
                const value = range.multiplier ? 
                    Math.round(state.settings[range.setting] * range.multiplier) : 
                    state.settings[range.setting];
                display.textContent = value + range.suffix;
            }
        }
    }
}

/**
 * Apply theme
 */
function applyTheme() {
    document.body.className = 'dark-theme';
}

/**
 * Show error message
 */
function showError(message) {
    updateStatusDisplay(message, 'error');
    console.error('UI Error:', message);
}

/**
 * Update status display
 */
function updateStatusDisplay(message, type = 'info') {
    if (elements.statusDisplay) {
        elements.statusDisplay.textContent = message;
        elements.statusDisplay.className = `status ${type}`;
        
        // Clear after 5 seconds for non-error messages
        if (type !== 'error') {
            setTimeout(() => {
                if (elements.statusDisplay.textContent === message) {
                    elements.statusDisplay.textContent = 'Ready';
                    elements.statusDisplay.className = 'status info';
                }
            }, 5000);
        }
    }
}

/**
 * Save settings to localStorage
 */
function saveSettings() {
    try {
        localStorage.setItem('numbersStationSettings', JSON.stringify({
            ...state.settings,
            isDarkMode: state.isDarkMode
        }));
    } catch (error) {
        console.warn('Failed to save settings:', error);
    }
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    try {
        const saved = localStorage.getItem('numbersStationSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            
            // Load speed and pitch settings
            const voiceSpeed = document.getElementById('voiceSpeed');
            const voicePitch = document.getElementById('voicePitch');
            const voiceSpeedValue = document.getElementById('voiceSpeedValue');
            const voicePitchValue = document.getElementById('voicePitchValue');
            
            if (voiceSpeed && settings.voiceSpeed !== undefined) {
                voiceSpeed.value = settings.voiceSpeed * 100;
                if (voiceSpeedValue) voiceSpeedValue.textContent = `${Math.round(settings.voiceSpeed * 100)}%`;
                setPlaybackSpeed(settings.voiceSpeed);
            }
            
            if (voicePitch && settings.voicePitch !== undefined) {
                voicePitch.value = settings.voicePitch;
                if (voicePitchValue) voicePitchValue.textContent = `${settings.voicePitch} st`;
                setPitchShift(settings.voicePitch);
            }
            
            Object.assign(state.settings, settings);
            state.isDarkMode = settings.isDarkMode || false;
        }
    } catch (error) {
        console.warn('Failed to load settings:', error);
    }
}

/**
 * Get current application state (for debugging)
 */
export function getState() {
    return { ...state };
}