/**
 * Enhanced Sprach Machine - Complete JavaScript Overhaul
 * Cold War Numbers Station Simulator with Advanced Features
 */

class EnhancedSprachMachine {
    constructor() {
        this.audioContext = null;
        this.bufferLoader = null;
        this.sounds = null;
        this.isTransmitting = false;
        this.currentMode = 'voice';
        this.liveMode = false;
        this.transmissionQueue = [];
        
        // Enhanced settings
        this.settings = {
            voice: {
                speed: 1.0,
                pitch: 1.0,
                voice: 'female', // female, child, male
                language: 'german', // german, spanish, english
                callsignReps: 2,
                playAchtung: true,
                autoPause: true,
                autoPauseDuration: 100,
                noiseLevel: 0.1,
                filterEnabled: true
            },
            morse: {
                wpm: 53,
                frequency: 1000,
                noiseLevel: 0.05,
                filterEnabled: true
            },
            effects: {
                shortwave: false,
                static: false,
                fade: false
            }
        };
        
        this.init();
    }

    async init() {
        try {
            // Initialize Web Audio API
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Load audio buffers
            await this.loadAudioBuffers();
            
            // Initialize UI
            this.initializeUI();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Update status
            this.updateStatus('READY');
            
            console.log('Enhanced Sprach Machine initialized successfully');
        } catch (error) {
            console.error('Initialization failed:', error);
            alert('Web Audio API is not supported in this browser');
        }
    }

    async loadAudioBuffers() {
        const audioFiles = [
            'assets/sounds/0.wav', 'assets/sounds/1.wav', 'assets/sounds/2.wav',
            'assets/sounds/3.wav', 'assets/sounds/4.wav', 'assets/sounds/5.wav',
            'assets/sounds/6.wav', 'assets/sounds/7.wav', 'assets/sounds/8.wav',
            'assets/sounds/9.wav', 'assets/sounds/achtung.wav', 
            'assets/sounds/trennung.wav', 'assets/sounds/ende.wav'
        ];

        return new Promise((resolve, reject) => {
            this.bufferLoader = new BufferLoader(
                this.audioContext, 
                audioFiles, 
                (bufferList) => {
                    this.sounds = bufferList;
                    resolve();
                }
            );
            this.bufferLoader.load();
        });
    }

    initializeUI() {
        // Initialize mode selector
        this.updateModeDisplay();
        
        // Initialize dial pad
        this.createDialPad();
        
        // Initialize settings displays
        this.updateSettingsDisplay();
        
        // Initialize visual indicators
        this.updateLEDs();
    }

    setupEventListeners() {
        // Main form submission
        const speechForm = document.getElementById('speech-form');
        if (speechForm) {
            speechForm.onsubmit = (e) => {
                e.preventDefault();
                this.generateAudio();
            };
        }

        // Mode selection
        const modeButtons = document.querySelectorAll('.mode-option');
        modeButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchMode(button.dataset.mode);
            });
        });

        // Live mode toggle
        const liveModeToggle = document.getElementById('live-mode-toggle');
        if (liveModeToggle) {
            liveModeToggle.addEventListener('change', () => {
                this.toggleLiveMode(liveModeToggle.checked);
            });
        }

        // Keyboard input for live mode
        document.addEventListener('keypress', (e) => {
            if (this.liveMode && !this.isTransmitting) {
                this.handleKeyInput(e.key);
            }
        });

        // Settings controls
        this.setupSettingsControls();

        // Cipher controls
        this.setupCipherControls();

        // Window focus for audio context
        document.addEventListener('click', () => {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }
        });
    }

    createDialPad() {
        const dialPadContainer = document.getElementById('dial-pad');
        if (!dialPadContainer) return;

        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
        const specialFunctions = [
            { key: '*', label: 'ACHTUNG', class: 'special' },
            { key: '/', label: 'TRENNUNG', class: 'special' },
            { key: '+', label: 'ENDE', class: 'special' }
        ];

        // Create number pad
        dialPadContainer.innerHTML = '';
        numbers.forEach(num => {
            const button = document.createElement('button');
            button.className = `dial-btn ${(num === '*' || num === '#') ? 'special' : ''}`;
            button.textContent = num;
            button.addEventListener('click', () => this.playTone(num));
            button.addEventListener('mousedown', () => button.classList.add('active'));
            button.addEventListener('mouseup', () => button.classList.remove('active'));
            dialPadContainer.appendChild(button);
        });

        // Create special functions
        const specialContainer = document.getElementById('special-functions');
        if (specialContainer) {
            specialContainer.innerHTML = '';
            specialFunctions.forEach(func => {
                const button = document.createElement('button');
                button.className = `btn btn-primary ${func.class}`;
                button.textContent = func.label;
                button.addEventListener('click', () => this.playTone(func.key));
                specialContainer.appendChild(button);
            });
        }
    }

    setupSettingsControls() {
        // Voice settings
        const speedControl = document.getElementById('speed-control');
        const pitchControl = document.getElementById('pitch-control');
        const noiseControl = document.getElementById('noise-level');
        const voiceSelect = document.getElementById('voice-select');

        if (speedControl) {
            speedControl.addEventListener('input', (e) => {
                this.settings.voice.speed = parseFloat(e.target.value);
                this.updateSettingsDisplay();
            });
        }

        if (pitchControl) {
            pitchControl.addEventListener('input', (e) => {
                this.settings.voice.pitch = parseFloat(e.target.value);
                this.updateSettingsDisplay();
            });
        }

        if (noiseControl) {
            noiseControl.addEventListener('input', (e) => {
                this.settings.voice.noiseLevel = parseFloat(e.target.value);
                this.updateSettingsDisplay();
            });
        }

        if (voiceSelect) {
            voiceSelect.addEventListener('change', (e) => {
                this.settings.voice.voice = e.target.value;
                this.updateSettingsDisplay();
            });
        }

        // Morse settings
        const morseWPM = document.getElementById('morse-wpm');
        const morseFreq = document.getElementById('morse-frequency');

        if (morseWPM) {
            morseWPM.addEventListener('input', (e) => {
                this.settings.morse.wpm = parseInt(e.target.value);
                this.updateSettingsDisplay();
            });
        }

        if (morseFreq) {
            morseFreq.addEventListener('input', (e) => {
                this.settings.morse.frequency = parseInt(e.target.value);
                this.updateSettingsDisplay();
            });
        }

        // Effects toggles
        const effectsToggles = document.querySelectorAll('.effect-toggle');
        effectsToggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const effect = e.target.dataset.effect;
                this.settings.effects[effect] = e.target.checked;
                this.updateSettingsDisplay();
            });
        });
    }

    setupCipherControls() {
        // Enhanced cipher with OTP support
        const encryptBtn = document.getElementById('encrypt-button');
        const decryptBtn = document.getElementById('decrypt-button');
        const generateOTPBtn = document.getElementById('generate-otp');
        const cipherModeSelect = document.getElementById('cipher-mode');

        if (encryptBtn) {
            encryptBtn.addEventListener('click', () => this.encryptMessage());
        }

        if (decryptBtn) {
            decryptBtn.addEventListener('click', () => this.decryptMessage());
        }

        if (generateOTPBtn) {
            generateOTPBtn.addEventListener('click', () => this.generateOTP());
        }

        if (cipherModeSelect) {
            cipherModeSelect.addEventListener('change', (e) => {
                this.switchCipherMode(e.target.value);
            });
        }
    }

    switchMode(mode) {
        this.currentMode = mode;
        this.updateModeDisplay();
        this.updateStatus(`MODE: ${mode.toUpperCase()}`);

        // Update UI visibility
        const voiceSettings = document.getElementById('voice-settings');
        const morseSettings = document.getElementById('morse-settings');

        if (voiceSettings && morseSettings) {
            if (mode === 'voice') {
                voiceSettings.style.display = 'block';
                morseSettings.style.display = 'none';
            } else {
                voiceSettings.style.display = 'none';
                morseSettings.style.display = 'block';
            }
        }

        // Update mode buttons
        document.querySelectorAll('.mode-option').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });
    }

    toggleLiveMode(enabled) {
        this.liveMode = enabled;
        this.updateStatus(enabled ? 'LIVE MODE ACTIVE' : 'READY');
        
        if (enabled) {
            this.showLiveModeInstructions();
        }
    }

    showLiveModeInstructions() {
        const instructions = document.getElementById('live-mode-instructions');
        if (instructions) {
            instructions.style.display = 'block';
            instructions.innerHTML = `
                <div class="alert alert-info">
                    <strong>Live Mode Active</strong><br>
                    Press number keys (0-9) to transmit digits immediately<br>
                    Press * for Achtung, / for Trennung, + for Ende<br>
                    Press Escape to exit live mode
                </div>
            `;
        }
    }

    handleKeyInput(key) {
        if (!this.liveMode) return;

        // Map keyboard to transmission
        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '*': '*', '/': '/', '+': '+',
            'Escape': 'EXIT'
        };

        const mappedKey = keyMap[key];
        if (mappedKey) {
            if (mappedKey === 'EXIT') {
                this.toggleLiveMode(false);
                return;
            }
            
            this.playTone(mappedKey);
        }
    }

    async playTone(key) {
        if (!this.sounds) return;

        // Visual feedback
        this.showTransmissionFeedback();

        // Map key to sound index
        let soundIndex = -1;
        if (!isNaN(key)) {
            soundIndex = parseInt(key, 10);
        } else if (key === '*' || key === '#') {
            soundIndex = 10; // Achtung
        } else if (key === '/') {
            soundIndex = 11; // Trennung  
        } else if (key === '+') {
            soundIndex = 12; // Ende
        }

        if (soundIndex !== -1 && this.sounds[soundIndex]) {
            const buffer = this.sounds[soundIndex];
            await this.playAudioBuffer(buffer);
        }
    }

    async playAudioBuffer(buffer, startTime = 0) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;

        // Apply voice effects
        let finalNode = source;

        if (this.currentMode === 'voice') {
            // Apply pitch and speed modifications
            source.playbackRate.value = this.settings.voice.pitch;
            
            // Apply voice character modifications
            if (this.settings.voice.voice === 'child') {
                source.playbackRate.value *= 1.4; // Higher pitch for child voice
            }
        }

        // Apply audio effects
        if (this.settings.effects.shortwave) {
            finalNode = this.applyShortWaveEffects(finalNode);
        }

        if (this.settings.effects.static) {
            finalNode = this.addStaticNoise(finalNode);
        }

        finalNode.connect(this.audioContext.destination);
        source.start(this.audioContext.currentTime + startTime);

        return new Promise(resolve => {
            source.onended = resolve;
        });
    }

    applyShortWaveEffects(audioNode) {
        // Band-pass filter to simulate shortwave radio
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2000;
        filter.Q.value = 5;

        // Light distortion
        const waveshaper = this.audioContext.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
            const x = (i - 128) / 128;
            curve[i] = Math.tanh(x * 2) * 0.8;
        }
        waveshaper.curve = curve;

        audioNode.connect(filter);
        filter.connect(waveshaper);
        return waveshaper;
    }

    addStaticNoise(audioNode) {
        const gainNode = this.audioContext.createGain();
        const noiseLevel = this.currentMode === 'voice' 
            ? this.settings.voice.noiseLevel 
            : this.settings.morse.noiseLevel;
        
        gainNode.gain.value = 1 - noiseLevel;

        // Create noise buffer
        const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.1, this.audioContext.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        
        for (let i = 0; i < noiseBuffer.length; i++) {
            noiseData[i] = (Math.random() - 0.5) * noiseLevel;
        }

        const noiseSource = this.audioContext.createBufferSource();
        noiseSource.buffer = noiseBuffer;
        noiseSource.loop = true;
        noiseSource.start();

        const merger = this.audioContext.createChannelMerger(2);
        audioNode.connect(gainNode);
        gainNode.connect(merger, 0, 0);
        noiseSource.connect(merger, 0, 1);

        return merger;
    }

    async generateAudio() {
        if (this.isTransmitting) return;

        const generateButton = document.getElementById('generate-button');
        if (generateButton) {
            generateButton.textContent = 'GENERATING...';
            generateButton.disabled = true;
        }

        try {
            this.isTransmitting = true;
            this.updateTransmissionStatus(true);

            let renderedBuffer = null;
            
            if (this.currentMode === 'voice') {
                renderedBuffer = await this.generateVoiceAudio();
            } else {
                renderedBuffer = await this.generateMorseAudio();
            }

            if (renderedBuffer) {
                await this.processGeneratedAudio(renderedBuffer);
            } else {
                alert('Audio generation failed. The message may contain no valid characters.');
            }

        } catch (error) {
            console.error('Error generating audio:', error);
            alert('An error occurred while generating the audio.');
        } finally {
            this.isTransmitting = false;
            this.updateTransmissionStatus(false);
            
            if (generateButton) {
                generateButton.textContent = 'GENERATE AUDIO FILE';
                generateButton.disabled = false;
            }
        }
    }

    async generateVoiceAudio() {
        const call = document.getElementById("call")?.value || '';
        const body = document.getElementById("body")?.value || '';
        
        const soundClips = [];
        const shortPause = (this.settings.voice.autoPauseDuration / 1000) / this.settings.voice.speed;
        const longPause = 0.5 / this.settings.voice.speed;

        // Build audio sequence
        // 1. Attention signal
        if (this.settings.voice.playAchtung) {
            soundClips.push({ type: 'sound', index: 10, duration: this.sounds[10].duration });
            soundClips.push({ type: 'pause', duration: longPause });
        }

        // 2. Call sign (repeated)
        for (let rep = 0; rep < this.settings.voice.callsignReps; rep++) {
            for (const char of call) {
                const soundIndex = this.getCharSoundIndex(char);
                if (soundIndex !== -1) {
                    soundClips.push({ 
                        type: 'sound', 
                        index: soundIndex, 
                        duration: this.sounds[soundIndex].duration / this.settings.voice.pitch 
                    });
                    if (this.settings.voice.autoPause) {
                        soundClips.push({ type: 'pause', duration: shortPause });
                    }
                }
            }
            soundClips.push({ type: 'pause', duration: longPause });
        }

        // 3. Separator
        soundClips.push({ type: 'sound', index: 11, duration: this.sounds[11].duration });
        soundClips.push({ type: 'pause', duration: longPause });

        // 4. Message body
        for (const char of body) {
            if (char === ' ') {
                soundClips.push({ type: 'pause', duration: shortPause });
                continue;
            }
            if (char === '_') {
                soundClips.push({ type: 'pause', duration: longPause });
                continue;
            }
            
            const soundIndex = this.getCharSoundIndex(char);
            if (soundIndex !== -1) {
                soundClips.push({ 
                    type: 'sound', 
                    index: soundIndex, 
                    duration: this.sounds[soundIndex].duration / this.settings.voice.pitch 
                });
                if (this.settings.voice.autoPause) {
                    soundClips.push({ type: 'pause', duration: shortPause });
                }
            }
        }

        // 5. End signal
        soundClips.push({ type: 'sound', index: 12, duration: this.sounds[12].duration });

        // Render audio
        return await this.renderAudioSequence(soundClips);
    }

    async generateMorseAudio() {
        const body = document.getElementById("body")?.value || '';
        const call = document.getElementById("call")?.value || '';
        const message = `${call} / ${body} +`;
        
        return await this.generateMorseFromText(message, this.settings.morse.wpm, this.settings.morse.frequency);
    }

    getCharSoundIndex(char) {
        if (!isNaN(char)) return parseInt(char, 10);
        if (char === '*' || char === '#') return 10;
        if (char === '/') return 11;
        if (char === '+') return 12;
        return -1;
    }

    async renderAudioSequence(soundClips) {
        const totalDuration = soundClips.reduce((sum, clip) => sum + clip.duration, 0);
        if (totalDuration === 0) return null;

        const offlineContext = new OfflineAudioContext(1, Math.ceil(this.audioContext.sampleRate * totalDuration), this.audioContext.sampleRate);
        let offset = 0;

        for (const clip of soundClips) {
            if (clip.type === 'pause') {
                offset += clip.duration;
            } else {
                const source = offlineContext.createBufferSource();
                source.buffer = this.sounds[clip.index];
                source.playbackRate.value = this.settings.voice.pitch;
                
                // Apply voice character
                if (this.settings.voice.voice === 'child') {
                    source.playbackRate.value *= 1.4;
                }
                
                source.connect(offlineContext.destination);
                source.start(offset);
                offset += clip.duration;
            }
        }

        return await offlineContext.startRendering();
    }

    async processGeneratedAudio(renderedBuffer) {
        // Apply post-processing effects if enabled
        let finalBuffer = renderedBuffer;

        if (this.settings.effects.shortwave || this.settings.effects.static) {
            finalBuffer = await this.applyPostProcessingEffects(renderedBuffer);
        }

        // Convert to WAV and setup playback
        const wavBlob = this.audioBufferToWav(finalBuffer);
        const audioUrl = URL.createObjectURL(wavBlob);

        const audioPlayback = document.getElementById('audio-playback');
        const downloadLink = document.getElementById('download-link');
        const audioOutput = document.getElementById('audio-output');

        if (audioPlayback && downloadLink && audioOutput) {
            audioPlayback.src = audioUrl;
            downloadLink.href = audioUrl;
            audioOutput.style.display = 'block';
        }

        this.updateStatus('AUDIO GENERATED');
    }

    // Enhanced Morse Code Generation
    async generateMorseFromText(message, wpm, frequency) {
        const MORSE_CODE = {
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
            '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '/': '-..-.', '+': '.-.-.'
        };

        const dotDuration = 1.2 / wpm;
        const timings = {
            dot: dotDuration,
            dash: dotDuration * 3,
            intraChar: dotDuration,
            interChar: dotDuration * 3,
            word: dotDuration * 7
        };

        const clips = [];
        const words = message.trim().toUpperCase().split(/ +/);

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            for (let j = 0; j < word.length; j++) {
                const char = word[j];
                if (MORSE_CODE[char]) {
                    const morse = MORSE_CODE[char];
                    for (let k = 0; k < morse.length; k++) {
                        const symbol = morse[k];
                        if (symbol === '.') clips.push({ isPause: false, duration: timings.dot });
                        if (symbol === '-') clips.push({ isPause: false, duration: timings.dash });
                        
                        if (k < morse.length - 1) {
                            clips.push({ isPause: true, duration: timings.intraChar });
                        }
                    }
                }
                if (j < word.length - 1) {
                    clips.push({ isPause: true, duration: timings.interChar });
                }
            }
            if (i < words.length - 1) {
                clips.push({ isPause: true, duration: timings.word });
            }
        }

        const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);
        if (totalDuration === 0) return null;

        const offlineContext = new OfflineAudioContext(1, Math.ceil(this.audioContext.sampleRate * totalDuration), this.audioContext.sampleRate);
        let offset = 0;

        for (const clip of clips) {
            if (clip.isPause) {
                offset += clip.duration;
            } else {
                const gainNode = offlineContext.createGain();
                gainNode.connect(offlineContext.destination);

                const attackTime = 0.005;
                const releaseTime = 0.005;
                gainNode.gain.setValueAtTime(0, offset);
                gainNode.gain.linearRampToValueAtTime(0.8, offset + attackTime);
                gainNode.gain.setValueAtTime(0.8, offset + clip.duration - releaseTime);
                gainNode.gain.linearRampToValueAtTime(0, offset + clip.duration);

                const oscillator = offlineContext.createOscillator();
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(frequency, offset);
                oscillator.connect(gainNode);

                oscillator.start(offset);
                oscillator.stop(offset + clip.duration);
                offset += clip.duration;
            }
        }

        return await offlineContext.startRendering();
    }

    // Enhanced Cipher System with OTP Support
    encryptMessage() {
        const plainText = document.getElementById('plain-text')?.value || '';
        const key = document.getElementById('cipher-key')?.value || '';
        const mode = document.getElementById('cipher-mode')?.value || 'xor';

        if (!key) {
            alert('Please enter a cipher key.');
            return;
        }

        let encrypted;
        if (mode === 'otp') {
            encrypted = this.otpEncrypt(plainText, key);
        } else {
            encrypted = this.xorCipher(plainText, key);
        }

        const speakableEncrypted = encrypted.split('').map(c => c.charCodeAt(0)).join(' ');
        const cipherTextElement = document.getElementById('cipher-text');
        if (cipherTextElement) {
            cipherTextElement.value = speakableEncrypted;
        }
    }

    decryptMessage() {
        const cipherText = document.getElementById('cipher-text')?.value || '';
        const key = document.getElementById('cipher-key')?.value || '';
        const mode = document.getElementById('cipher-mode')?.value || 'xor';

        if (!key) {
            alert('Please enter a cipher key.');
            return;
        }

        const encrypted = cipherText.split(' ').filter(c => c).map(c => String.fromCharCode(parseInt(c, 10))).join('');
        
        let decrypted;
        if (mode === 'otp') {
            decrypted = this.otpDecrypt(encrypted, key);
        } else {
            decrypted = this.xorCipher(encrypted, key);
        }

        const plainTextElement = document.getElementById('plain-text');
        if (plainTextElement) {
            plainTextElement.value = decrypted;
        }
    }

    xorCipher(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    otpEncrypt(plainText, key) {
        if (key.length < plainText.length) {
            alert('OTP key must be at least as long as the message for true security');
        }
        
        let result = '';
        for (let i = 0; i < plainText.length; i++) {
            const plainChar = plainText.charCodeAt(i);
            const keyChar = key.charCodeAt(i % key.length);
            result += String.fromCharCode(plainChar ^ keyChar);
        }
        return result;
    }

    otpDecrypt(cipherText, key) {
        // OTP decryption is the same as encryption (XOR property)
        return this.otpEncrypt(cipherText, key);
    }

    generateOTP() {
        const length = parseInt(document.getElementById('otp-length')?.value) || 256;
        let otp = '';
        
        // Generate cryptographically secure random key
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        
        for (let i = 0; i < length; i++) {
            otp += String.fromCharCode(array[i]);
        }
        
        const keyElement = document.getElementById('cipher-key');
        if (keyElement) {
            keyElement.value = btoa(otp); // Base64 encode for display
        }
        
        this.updateStatus('OTP GENERATED');
    }

    // Audio utility functions
    audioBufferToWav(buffer) {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2 + 44;
        const bufferArray = new ArrayBuffer(length);
        const view = new DataView(bufferArray);
        const channels = [];
        let offset = 0;
        let pos = 0;

        const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
        const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };

        setUint32(0x46464952); // "RIFF"
        setUint32(length - 8);
        setUint32(0x45564157); // "WAVE"
        setUint32(0x20746d66); // "fmt "
        setUint32(16);
        setUint16(1);
        setUint16(numOfChan);
        setUint32(buffer.sampleRate);
        setUint32(buffer.sampleRate * 2 * numOfChan);
        setUint16(numOfChan * 2);
        setUint16(16);
        setUint32(0x61746164); // "data"
        setUint32(length - pos - 4);

        for (let i = 0; i < buffer.numberOfChannels; i++) {
            channels.push(buffer.getChannelData(i));
        }

        while (pos < length) {
            for (let i = 0; i < numOfChan; i++) {
                let sample = Math.max(-1, Math.min(1, channels[i][offset]));
                sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
                view.setInt16(pos, sample, true);
                pos += 2;
            }
            offset++;
        }

        return new Blob([view], { type: 'audio/wav' });
    }

    // UI Update Functions
    updateModeDisplay() {
        const modeDisplay = document.getElementById('current-mode');
        if (modeDisplay) {
            modeDisplay.textContent = this.currentMode.toUpperCase();
        }
    }

    updateStatus(status) {
        const statusDisplay = document.getElementById('system-status');
        if (statusDisplay) {
            statusDisplay.textContent = status;
        }
        console.log(`Status: ${status}`);
    }

    updateSettingsDisplay() {
        // Update frequency display
        const freqDisplay = document.getElementById('current-freq');
        if (freqDisplay) {
            freqDisplay.textContent = `${this.settings.morse.frequency} Hz`;
        }

        // Update WPM display
        const wpmDisplay = document.getElementById('current-wpm');
        if (wpmDisplay) {
            wpmDisplay.textContent = this.settings.morse.wpm;
        }

        // Update range displays
        const rangeValues = document.querySelectorAll('.range-value');
        rangeValues.forEach(element => {
            const input = element.previousElementSibling;
            if (input && input.type === 'range') {
                element.textContent = input.value;
            }
        });
    }

    updateLEDs() {
        const powerLED = document.getElementById('power-led');
        const txLED = document.getElementById('tx-led');
        const readyLED = document.getElementById('ready-led');

        if (powerLED) powerLED.classList.add('active');
        if (readyLED) readyLED.classList.add('active');
        if (txLED) txLED.classList.remove('active');
    }

    updateTransmissionStatus(transmitting) {
        const txLED = document.getElementById('tx-led');
        const overlay = document.querySelector('.transmission-overlay');

        if (transmitting) {
            if (txLED) txLED.classList.add('active');
            if (overlay) overlay.classList.add('active');
            this.updateStatus('TRANSMITTING');
        } else {
            if (txLED) txLED.classList.remove('active');
            if (overlay) overlay.classList.remove('active');
            this.updateStatus('READY');
        }
    }

    showTransmissionFeedback() {
        const txLED = document.getElementById('tx-led');
        if (txLED) {
            txLED.classList.add('active');
            setTimeout(() => txLED.classList.remove('active'), 200);
        }
    }

    switchCipherMode(mode) {
        const otpControls = document.getElementById('otp-controls');
        const xorControls = document.getElementById('xor-controls');

        if (mode === 'otp') {
            if (otpControls) otpControls.style.display = 'block';
            if (xorControls) xorControls.style.display = 'none';
        } else {
            if (otpControls) otpControls.style.display = 'none';
            if (xorControls) xorControls.style.display = 'block';
        }
    }
}

// Initialize the enhanced machine when the page loads
let sprachMachine;

window.addEventListener('load', function() {
    sprachMachine = new EnhancedSprachMachine();
});

// Legacy function support for backwards compatibility
function playSound(key, time) {
    if (sprachMachine) {
        sprachMachine.playTone(key);
    }
}</absolute_file_name>
    </file>