/**
 * Audio Effects Module for Sprach Machine
 * Provides realistic shortwave radio effects and processing
 */

class AudioEffectsProcessor {
    constructor() {
        this.audioContext = null;
        this.effectsChain = [];
        this.noiseBuffers = new Map();
        this.initialized = false;
        
        this.presets = {
            clean: {
                shortwave: false,
                static: false,
                fade: false,
                filter: false
            },
            shortwave: {
                shortwave: true,
                static: true,
                fade: false,
                filter: true,
                filterFreq: 2000,
                filterQ: 5,
                staticLevel: 0.1
            },
            distant: {
                shortwave: true,
                static: true,
                fade: true,
                filter: true,
                filterFreq: 1500,
                filterQ: 8,
                staticLevel: 0.2,
                fadeDepth: 0.3
            },
            interference: {
                shortwave: true,
                static: true,
                fade: true,
                filter: true,
                filterFreq: 1800,
                filterQ: 6,
                staticLevel: 0.3,
                fadeDepth: 0.5,
                heterodyne: true
            }
        };

        this.init();
    }

    async init() {
        if (window.sprachMachine && window.sprachMachine.audioContext) {
            this.audioContext = window.sprachMachine.audioContext;
            await this.generateNoiseBuffers();
            this.initialized = true;
        } else {
            // Retry after a delay
            setTimeout(() => this.init(), 1000);
        }
    }

    async generateNoiseBuffers() {
        // Generate different types of noise buffers
        this.noiseBuffers.set('white', this.generateWhiteNoise(this.audioContext.sampleRate * 2));
        this.noiseBuffers.set('pink', this.generatePinkNoise(this.audioContext.sampleRate * 2));
        this.noiseBuffers.set('atmospheric', this.generateAtmosphericNoise(this.audioContext.sampleRate * 5));
        this.noiseBuffers.set('static', this.generateStaticBursts(this.audioContext.sampleRate * 3));
    }

    generateWhiteNoise(length) {
        const buffer = this.audioContext.createBuffer(1, length, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() - 0.5) * 0.3;
        }
        
        return buffer;
    }

    generatePinkNoise(length) {
        const buffer = this.audioContext.createBuffer(1, length, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        
        for (let i = 0; i < length; i++) {
            const white = Math.random() - 0.5;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            
            data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
            b6 = white * 0.115926;
        }
        
        return buffer;
    }

    generateAtmosphericNoise(length) {
        const buffer = this.audioContext.createBuffer(1, length, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Simulate atmospheric crackling and pops
        let lastValue = 0;
        
        for (let i = 0; i < length; i++) {
            let value = 0;
            
            // Random crackling
            if (Math.random() < 0.001) {
                value = (Math.random() - 0.5) * 0.5 * Math.exp(-Math.random() * 10);
            }
            
            // Low frequency rumble
            if (Math.random() < 0.1) {
                value += Math.sin(i / this.audioContext.sampleRate * Math.PI * 2 * (10 + Math.random() * 50)) * 0.05;
            }
            
            // Smooth transitions to avoid clicks
            value = lastValue * 0.9 + value * 0.1;
            lastValue = value;
            
            data[i] = value;
        }
        
        return buffer;
    }

    generateStaticBursts(length) {
        const buffer = this.audioContext.createBuffer(1, length, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        let burstMode = false;
        let burstLength = 0;
        let burstCounter = 0;
        
        for (let i = 0; i < length; i++) {
            let value = 0;
            
            // Random static bursts
            if (!burstMode && Math.random() < 0.005) {
                burstMode = true;
                burstLength = Math.random() * this.audioContext.sampleRate * 0.2; // Up to 200ms bursts
                burstCounter = 0;
            }
            
            if (burstMode) {
                const intensity = Math.exp(-burstCounter / (this.audioContext.sampleRate * 0.05));
                value = (Math.random() - 0.5) * 0.4 * intensity;
                burstCounter++;
                
                if (burstCounter >= burstLength) {
                    burstMode = false;
                }
            }
            
            // Background hiss
            value += (Math.random() - 0.5) * 0.02;
            
            data[i] = value;
        }
        
        return buffer;
    }

    createEffectsChain(preset = 'clean') {
        if (!this.initialized || !this.audioContext) return null;

        const config = this.presets[preset] || this.presets.clean;
        const chain = [];

        // Input gain node
        const inputGain = this.audioContext.createGain();
        inputGain.gain.value = 1.0;
        chain.push(inputGain);

        let currentNode = inputGain;

        // Band-pass filter for shortwave effect
        if (config.filter) {
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = config.filterFreq || 2000;
            filter.Q.value = config.filterQ || 5;
            
            currentNode.connect(filter);
            currentNode = filter;
            chain.push(filter);
        }

        // Distortion/overdrive for tube radio effect
        if (config.shortwave) {
            const waveshaper = this.audioContext.createWaveShaper();
            waveshaper.curve = this.createDistortionCurve(20, false);
            waveshaper.oversample = '2x';
            
            currentNode.connect(waveshaper);
            currentNode = waveshaper;
            chain.push(waveshaper);
        }

        // Dynamic range compression
        if (config.shortwave) {
            const compressor = this.audioContext.createDynamicsCompressor();
            compressor.threshold.value = -24;
            compressor.knee.value = 30;
            compressor.ratio.value = 12;
            compressor.attack.value = 0.003;
            compressor.release.value = 0.25;
            
            currentNode.connect(compressor);
            currentNode = compressor;
            chain.push(compressor);
        }

        // Static noise mixer
        if (config.static) {
            const mixer = this.audioContext.createGain();
            const signalGain = this.audioContext.createGain();
            const noiseGain = this.audioContext.createGain();
            
            signalGain.gain.value = 1.0 - (config.staticLevel || 0.1);
            noiseGain.gain.value = config.staticLevel || 0.1;
            
            // Connect signal path
            currentNode.connect(signalGain);
            signalGain.connect(mixer);
            
            // Connect noise
            const noiseSource = this.createNoiseSource('atmospheric');
            noiseSource.connect(noiseGain);
            noiseGain.connect(mixer);
            noiseSource.start();
            
            currentNode = mixer;
            chain.push(mixer, signalGain, noiseGain, noiseSource);
        }

        // Fading effect (simulates signal strength variations)
        if (config.fade) {
            const fadeGain = this.audioContext.createGain();
            fadeGain.gain.value = 1.0;
            
            // Create fading pattern
            this.createFadePattern(fadeGain, config.fadeDepth || 0.3);
            
            currentNode.connect(fadeGain);
            currentNode = fadeGain;
            chain.push(fadeGain);
        }

        // Heterodyne interference
        if (config.heterodyne) {
            const interferenceGain = this.audioContext.createGain();
            interferenceGain.gain.value = 0.05;
            
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 1000 + (Math.random() - 0.5) * 200;
            
            // Slowly varying frequency
            oscillator.frequency.setValueAtTime(oscillator.frequency.value, this.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(
                oscillator.frequency.value + (Math.random() - 0.5) * 100,
                this.audioContext.currentTime + 10
            );
            
            const mixer = this.audioContext.createGain();
            
            currentNode.connect(mixer);
            oscillator.connect(interferenceGain);
            interferenceGain.connect(mixer);
            oscillator.start();
            
            currentNode = mixer;
            chain.push(mixer, interferenceGain, oscillator);
        }

        // Output gain
        const outputGain = this.audioContext.createGain();
        outputGain.gain.value = 0.8;
        
        currentNode.connect(outputGain);
        chain.push(outputGain);

        return {
            input: inputGain,
            output: outputGain,
            chain: chain
        };
    }

    createDistortionCurve(amount, symmetric = true) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;
        
        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            let y;
            
            if (symmetric) {
                y = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
            } else {
                y = Math.tanh(x * amount) * 0.7;
            }
            
            curve[i] = y;
        }
        
        return curve;
    }

    createNoiseSource(type = 'white') {
        const buffer = this.noiseBuffers.get(type) || this.noiseBuffers.get('white');
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        return source;
    }

    createFadePattern(gainNode, depth = 0.3) {
        if (!gainNode || !this.audioContext) return;

        const duration = 5 + Math.random() * 10; // 5-15 second cycles
        const minGain = 1.0 - depth;
        const maxGain = 1.0;
        
        // Create smooth fading pattern
        const fadeIn = () => {
            const fadeTime = 2 + Math.random() * 3;
            gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(maxGain, this.audioContext.currentTime + fadeTime);
            
            setTimeout(() => {
                fadeOut();
            }, (fadeTime + 1 + Math.random() * 3) * 1000);
        };
        
        const fadeOut = () => {
            const fadeTime = 1 + Math.random() * 2;
            gainNode.gain.cancelScheduledValues(this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(minGain + Math.random() * 0.2, this.audioContext.currentTime + fadeTime);
            
            setTimeout(() => {
                fadeIn();
            }, (fadeTime + 0.5 + Math.random() * 2) * 1000);
        };
        
        // Start the fading pattern
        setTimeout(fadeOut, Math.random() * 5000);
    }

    applyEffectsToBuffer(audioBuffer, preset = 'clean') {
        return new Promise((resolve, reject) => {
            if (!this.initialized || !audioBuffer) {
                resolve(audioBuffer);
                return;
            }

            try {
                const offlineContext = new OfflineAudioContext(
                    audioBuffer.numberOfChannels,
                    audioBuffer.length,
                    audioBuffer.sampleRate
                );

                const source = offlineContext.createBufferSource();
                source.buffer = audioBuffer;

                const effectsChain = this.createEffectsChainOffline(offlineContext, preset);
                
                if (effectsChain) {
                    source.connect(effectsChain.input);
                    effectsChain.output.connect(offlineContext.destination);
                } else {
                    source.connect(offlineContext.destination);
                }

                source.start();
                
                offlineContext.startRendering().then(renderedBuffer => {
                    resolve(renderedBuffer);
                }).catch(reject);

            } catch (error) {
                console.warn('Audio effects processing failed:', error);
                resolve(audioBuffer); // Return original buffer on error
            }
        });
    }

    createEffectsChainOffline(offlineContext, preset) {
        const config = this.presets[preset] || this.presets.clean;
        
        if (preset === 'clean') return null;

        let currentNode = null;

        // Band-pass filter
        if (config.filter) {
            const filter = offlineContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = config.filterFreq || 2000;
            filter.Q.value = config.filterQ || 5;
            
            if (!currentNode) {
                currentNode = { input: filter, output: filter };
            } else {
                currentNode.output.connect(filter);
                currentNode.output = filter;
            }
        }

        // Waveshaping distortion
        if (config.shortwave) {
            const waveshaper = offlineContext.createWaveShaper();
            waveshaper.curve = this.createDistortionCurve(15, false);
            
            if (!currentNode) {
                currentNode = { input: waveshaper, output: waveshaper };
            } else {
                currentNode.output.connect(waveshaper);
                currentNode.output = waveshaper;
            }
        }

        // Static noise (simplified for offline rendering)
        if (config.static) {
            const mixer = offlineContext.createGain();
            const signalGain = offlineContext.createGain();
            const noiseGain = offlineContext.createGain();
            
            signalGain.gain.value = 1.0 - (config.staticLevel || 0.1);
            noiseGain.gain.value = config.staticLevel || 0.1;
            
            // Create noise buffer for offline context
            const noiseLength = offlineContext.length;
            const noiseBuffer = offlineContext.createBuffer(1, noiseLength, offlineContext.sampleRate);
            const noiseData = noiseBuffer.getChannelData(0);
            
            for (let i = 0; i < noiseLength; i++) {
                noiseData[i] = (Math.random() - 0.5) * 0.2;
            }
            
            const noiseSource = offlineContext.createBufferSource();
            noiseSource.buffer = noiseBuffer;
            noiseSource.connect(noiseGain);
            noiseGain.connect(mixer);
            noiseSource.start();
            
            if (!currentNode) {
                signalGain.connect(mixer);
                currentNode = { input: signalGain, output: mixer };
            } else {
                currentNode.output.connect(signalGain);
                signalGain.connect(mixer);
                currentNode.output = mixer;
            }
        }

        return currentNode;
    }

    // Preset management
    createCustomPreset(name, config) {
        this.presets[name] = { ...config };
    }

    getPresets() {
        return Object.keys(this.presets);
    }

    getPresetConfig(name) {
        return this.presets[name] ? { ...this.presets[name] } : null;
    }

    // Real-time effects for live mode
    setupLiveEffects(inputNode, preset = 'shortwave') {
        if (!this.initialized || !inputNode) return inputNode;

        const effectsChain = this.createEffectsChain(preset);
        
        if (effectsChain) {
            inputNode.connect(effectsChain.input);
            return effectsChain.output;
        }
        
        return inputNode;
    }

    // Cleanup function
    cleanup() {
        this.effectsChain.forEach(node => {
            if (node.disconnect) {
                node.disconnect();
            }
        });
        this.effectsChain = [];
    }
}

// Enhanced Effects UI Integration
class EffectsUI {
    constructor(processor) {
        this.processor = processor;
        this.currentPreset = 'clean';
        this.initializeUI();
    }

    initializeUI() {
        this.createEffectsPanel();
        this.bindEvents();
    }

    createEffectsPanel() {
        const effectsHTML = `
            <div class="effects-panel" id="audio-effects-panel">
                <div class="panel-header">
                    <h3 class="panel-title">Audio Effects</h3>
                </div>
                
                <div class="effects-presets">
                    <label class="form-label">Preset</label>
                    <select id="effects-preset" class="form-select">
                        <option value="clean">Clean (No Effects)</option>
                        <option value="shortwave">Shortwave Radio</option>
                        <option value="distant">Distant Station</option>
                        <option value="interference">Heavy Interference</option>
                    </select>
                </div>

                <div class="effects-controls" id="effects-controls">
                    <div class="form-group">
                        <label for="static-level">
                            <input type="checkbox" id="static-enabled"> Static Noise
                        </label>
                        <input type="range" id="static-level" class="range-input" min="0" max="0.5" value="0.1" step="0.05" disabled>
                        <span class="range-value">0.1</span>
                    </div>

                    <div class="form-group">
                        <label for="filter-enabled">
                            <input type="checkbox" id="filter-enabled"> Band-pass Filter
                        </label>
                        <div class="filter-controls" style="display: none;">
                            <label class="form-label">Frequency (Hz)</label>
                            <input type="range" id="filter-freq" class="range-input" min="500" max="4000" value="2000" step="100">
                            <span class="range-value">2000</span>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="fade-enabled">
                            <input type="checkbox" id="fade-enabled"> Signal Fading
                        </label>
                        <input type="range" id="fade-depth" class="range-input" min="0.1" max="0.8" value="0.3" step="0.1" disabled>
                        <span class="range-value">0.3</span>
                    </div>

                    <div class="form-group">
                        <label for="shortwave-enabled">
                            <input type="checkbox" id="shortwave-enabled"> Shortwave Distortion
                        </label>
                    </div>
                </div>

                <div class="effects-actions">
                    <button id="preview-effects" class="btn">Preview Effects</button>
                    <button id="save-custom-preset" class="btn">Save Custom</button>
                </div>
            </div>
        `;

        // Add to transmitter page if it exists
        const transmitterPage = document.querySelector('#speech-form');
        if (transmitterPage && !document.getElementById('audio-effects-panel')) {
            transmitterPage.insertAdjacentHTML('afterend', effectsHTML);
        }
    }

    bindEvents() {
        const presetSelect = document.getElementById('effects-preset');
        if (presetSelect) {
            presetSelect.addEventListener('change', (e) => {
                this.loadPreset(e.target.value);
            });
        }

        // Range inputs
        const rangeInputs = document.querySelectorAll('#audio-effects-panel .range-input');
        rangeInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const valueDisplay = e.target.nextElementSibling;
                if (valueDisplay && valueDisplay.classList.contains('range-value')) {
                    valueDisplay.textContent = e.target.value;
                }
                this.updateCustomPreset();
            });
        });

        // Checkboxes
        const checkboxes = document.querySelectorAll('#audio-effects-panel input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const relatedRange = document.getElementById(e.target.id.replace('-enabled', '-level') || e.target.id.replace('-enabled', '-depth'));
                if (relatedRange) {
                    relatedRange.disabled = !e.target.checked;
                }

                // Special handling for filter controls
                if (e.target.id === 'filter-enabled') {
                    const filterControls = document.querySelector('.filter-controls');
                    if (filterControls) {
                        filterControls.style.display = e.target.checked ? 'block' : 'none';
                    }
                }

                this.updateCustomPreset();
            });
        });

        // Preview and save buttons
        document.getElementById('preview-effects')?.addEventListener('click', () => this.previewEffects());
        document.getElementById('save-custom-preset')?.addEventListener('click', () => this.saveCustomPreset());
    }

    loadPreset(presetName) {
        this.currentPreset = presetName;
        const config = this.processor.getPresetConfig(presetName);
        
        if (!config) return;

        // Update UI controls
        document.getElementById('static-enabled').checked = config.static || false;
        document.getElementById('filter-enabled').checked = config.filter || false;
        document.getElementById('fade-enabled').checked = config.fade || false;
        document.getElementById('shortwave-enabled').checked = config.shortwave || false;

        document.getElementById('static-level').value = config.staticLevel || 0.1;
        document.getElementById('fade-depth').value = config.fadeDepth || 0.3;
        document.getElementById('filter-freq').value = config.filterFreq || 2000;

        // Update range displays
        document.querySelector('#static-level + .range-value').textContent = document.getElementById('static-level').value;
        document.querySelector('#fade-depth + .range-value').textContent = document.getElementById('fade-depth').value;
        document.querySelector('#filter-freq + .range-value').textContent = document.getElementById('filter-freq').value;

        // Enable/disable controls
        document.getElementById('static-level').disabled = !config.static;
        document.getElementById('fade-depth').disabled = !config.fade;
        
        const filterControls = document.querySelector('.filter-controls');
        if (filterControls) {
            filterControls.style.display = config.filter ? 'block' : 'none';
        }
    }

    updateCustomPreset() {
        const config = {
            static: document.getElementById('static-enabled').checked,
            filter: document.getElementById('filter-enabled').checked,
            fade: document.getElementById('fade-enabled').checked,
            shortwave: document.getElementById('shortwave-enabled').checked,
            staticLevel: parseFloat(document.getElementById('static-level').value),
            fadeDepth: parseFloat(document.getElementById('fade-depth').value),
            filterFreq: parseInt(document.getElementById('filter-freq').value),
            filterQ: 5 // Fixed value for now
        };

        this.processor.createCustomPreset('custom', config);
        this.currentPreset = 'custom';
    }

    async previewEffects() {
        // Generate a test tone and apply effects
        if (!this.processor.initialized) return;

        const testBuffer = this.generateTestTone(1000, 2); // 1kHz, 2 seconds
        const processedBuffer = await this.processor.applyEffectsToBuffer(testBuffer, this.currentPreset);
        
        // Play the processed audio
        const source = this.processor.audioContext.createBufferSource();
        source.buffer = processedBuffer;
        source.connect(this.processor.audioContext.destination);
        source.start();
    }

    generateTestTone(frequency, duration) {
        const sampleRate = this.processor.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.processor.audioContext.createBuffer(1, length, sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < length; i++) {
            data[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3;
            
            // Apply envelope to avoid clicks
            if (i < sampleRate * 0.1) {
                data[i] *= i / (sampleRate * 0.1);
            } else if (i > length - sampleRate * 0.1) {
                data[i] *= (length - i) / (sampleRate * 0.1);
            }
        }

        return buffer;
    }

    saveCustomPreset() {
        const name = prompt('Enter a name for your custom preset:');
        if (name) {
            const config = this.processor.getPresetConfig('custom');
            this.processor.createCustomPreset(name, config);
            
            // Add to preset select
            const presetSelect = document.getElementById('effects-preset');
            if (presetSelect) {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                presetSelect.appendChild(option);
                presetSelect.value = name;
            }

            alert(`Preset "${name}" saved successfully!`);
        }
    }

    getCurrentPreset() {
        return this.currentPreset;
    }
}

// Initialize Audio Effects
window.addEventListener('load', function() {
    setTimeout(() => {
        if (window.sprachMachine) {
            window.audioEffects = new AudioEffectsProcessor();
            window.effectsUI = new EffectsUI(window.audioEffects);
        }
    }, 2000);
});</absolute_file_name>
    </file>