/**
 * Audio Module - Web Audio API implementation for Numbers Station playback
 * Handles voice pack loading, preloading, scheduling, and transmission sequencing
 */

// Audio context and nodes
let audioContext = null;
let masterGainNode = null;
let noiseBuffer = null;
let noiseSource = null;

// Voice pack storage
const voicePacks = new Map();
const audioBuffers = new Map();

// Playback state
let isPlaying = false;
let scheduledSources = [];
let transmissionStartTime = 0;
let transmissionDuration = 0;
let playbackSpeed = 1.0;
let pitchShift = 0; // in semitones

// Default voice pack configuration
const VOICE_PACK_CONFIG = {
    'default': {
        name: 'Default Voice Pack',
        path: 'assets/sounds/',
        files: ['0.wav', '1.wav', '2.wav', '3.wav', '4.wav', '5.wav', '6.wav', '7.wav', '8.wav', '9.wav', 'achtung.wav', 'trennung.wav', 'ende.wav']
    }
};

/**
 * Initialize audio context and master gain node
 * @returns {Promise<boolean>} - Success status
 */
export async function initializeAudio() {
    try {
        // Create audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create master gain node for volume control and stopping
        masterGainNode = audioContext.createGain();
        masterGainNode.connect(audioContext.destination);
        
        // Resume context if suspended (browser autoplay policy)
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        // Generate noise buffer for static
        await generateNoiseBuffer();
        
        console.log('Audio system initialized successfully');
        return true;
        
    } catch (error) {
        console.error('Failed to initialize audio:', error);
        return false;
    }
}

/**
 * Generate white noise buffer for static effect
 */
async function generateNoiseBuffer() {
    const bufferSize = audioContext.sampleRate * 2; // 2 seconds of noise
    noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1; // White noise
    }
}

/**
 * Load audio file and decode to AudioBuffer
 * @param {string} url - Audio file URL
 * @returns {Promise<AudioBuffer>} - Decoded audio buffer
 */
async function loadAudioFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        return audioBuffer;
        
    } catch (error) {
        console.warn(`Failed to load audio file ${url}:`, error);
        return null;
    }
}

/**
 * Load a complete voice pack
 * @param {string} packId - Voice pack identifier
 * @returns {Promise<object>} - Load result
 */
export async function loadVoicePack(packId) {
    if (!audioContext) {
        await initializeAudio();
    }
    
    const config = VOICE_PACK_CONFIG[packId];
    if (!config) {
        return {
            success: false,
            error: `Unknown voice pack: ${packId}`,
            loaded: 0,
            total: 0
        };
    }
    
    const packBuffers = new Map();
    let loadedCount = 0;
    const totalFiles = config.files.length;
    
    // Load all audio files
    for (const filename of config.files) {
        const url = `${config.path}${filename}`;
        const buffer = await loadAudioFile(url);
        
        if (buffer) {
            const key = filename.replace('.wav', '');
            packBuffers.set(key, buffer);
            loadedCount++;
        } else {
            // Try fallback to default pack if available
            if (packId !== 'de' && VOICE_PACK_CONFIG['de']) {
                const fallbackUrl = `${VOICE_PACK_CONFIG['de'].path}${filename}`;
                const fallbackBuffer = await loadAudioFile(fallbackUrl);
                if (fallbackBuffer) {
                    const key = filename.replace('.wav', '');
                    packBuffers.set(key, fallbackBuffer);
                    console.warn(`Using fallback for ${filename} in pack ${packId}`);
                }
            }
        }
    }
    
    // Store the loaded pack
    voicePacks.set(packId, {
        config,
        buffers: packBuffers,
        loadedCount,
        totalFiles
    });
    
    return {
        success: loadedCount > 0,
        error: loadedCount === 0 ? 'No audio files could be loaded' : null,
        loaded: loadedCount,
        total: totalFiles,
        packId,
        packName: config.name
    };
}

/**
 * Get audio buffer for a specific sound
 * @param {string} sound - Sound identifier (0-9, achtung, trennung, ende)
 * @param {string} packId - Voice pack ID
 * @returns {AudioBuffer|null} - Audio buffer or null if not found
 */
function getAudioBuffer(sound, packId = 'default') {
    const pack = voicePacks.get(packId);
    if (!pack) {
        // Try default pack
        const defaultPack = voicePacks.get('default');
        return defaultPack ? defaultPack.buffers.get(sound) : null;
    }
    
    return pack.buffers.get(sound);
}

/**
 * Create and schedule an audio source
 * @param {AudioBuffer} buffer - Audio buffer to play
 * @param {number} startTime - When to start playing (in audio context time)
 * @param {number} gain - Volume level (0-1)
 * @returns {AudioBufferSourceNode} - Created source node
 */
function scheduleAudioSource(buffer, startTime, gain = 1.0) {
    const source = audioContext.createBufferSource();
    const gainNode = audioContext.createGain();
    
    // Apply speed and pitch modifications
    source.playbackRate.setValueAtTime(playbackSpeed * Math.pow(2, pitchShift / 12), startTime);
    
    source.buffer = buffer;
    gainNode.gain.value = gain;
    
    source.connect(gainNode);
    gainNode.connect(masterGainNode);
    
    source.start(startTime);
    scheduledSources.push(source);
    
    return source;
}

/**
 * Build transmission sequence from message data
 * @param {object} messageData - Encoded message with groups
 * @param {object} settings - Playback settings
 * @returns {Array} - Sequence of audio events
 */
function buildTransmissionSequence(messageData, settings) {
    const sequence = [];
    const {
        digitGap = 800,
        groupGap = 1500,
        preludeGap = 2000,
        repeatGroups = false,
        voicePack = 'de'
    } = settings;
    
    // Generate random message ID (5 digits)
    const messageId = Array.from({length: 5}, () => Math.floor(Math.random() * 10).toString());
    
    // Prelude: Achtung
    sequence.push({ type: 'word', sound: 'achtung', gap: preludeGap });
    
    // Message ID
    for (const digit of messageId) {
        sequence.push({ type: 'digit', sound: digit, gap: digitGap });
    }
    
    // Trennung
    sequence.push({ type: 'word', sound: 'trennung', gap: preludeGap });
    
    // Group count (2 digits)
    const groupCount = messageData.count.toString().padStart(2, '0');
    for (const digit of groupCount) {
        sequence.push({ type: 'digit', sound: digit, gap: digitGap });
    }
    
    // Trennung
    sequence.push({ type: 'word', sound: 'trennung', gap: preludeGap });
    
    // Message groups
    for (let i = 0; i < messageData.groups.length; i++) {
        const group = messageData.groups[i];
        
        // Add each digit in the group
        for (let j = 0; j < group.length; j++) {
            const digit = group[j];
            const gap = (j === group.length - 1) ? groupGap : digitGap;
            sequence.push({ type: 'digit', sound: digit, gap });
        }
        
        // Repeat group if enabled
        if (repeatGroups) {
            for (let j = 0; j < group.length; j++) {
                const digit = group[j];
                const gap = (j === group.length - 1) ? groupGap : digitGap;
                sequence.push({ type: 'digit', sound: digit, gap });
            }
        }
    }
    
    // Ende
    sequence.push({ type: 'word', sound: 'ende', gap: 0 });
    
    return sequence;
}

/**
 * Calculate total transmission duration
 * @param {Array} sequence - Transmission sequence
 * @param {string} packId - Voice pack ID
 * @returns {number} - Duration in seconds
 */
function calculateTransmissionDuration(sequence, packId) {
    let totalDuration = 0;
    
    for (const event of sequence) {
        const buffer = getAudioBuffer(event.sound, packId);
        if (buffer) {
            totalDuration += buffer.duration;
        }
        totalDuration += event.gap / 1000; // Convert ms to seconds
    }
    
    return totalDuration;
}

/**
 * Play transmission sequence
 * @param {object} messageData - Encoded message data
 * @param {object} settings - Playback settings
 * @returns {Promise<object>} - Playback result
 */
export async function playTransmission(messageData, settings = {}) {
    if (!audioContext) {
        await initializeAudio();
    }
    
    if (isPlaying) {
        return {
            success: false,
            error: 'Transmission already in progress'
        };
    }
    
    const packId = settings.voicePack || 'de';
    
    // Ensure voice pack is loaded
    if (!voicePacks.has(packId)) {
        const loadResult = await loadVoicePack(packId);
        if (!loadResult.success) {
            return {
                success: false,
                error: `Failed to load voice pack: ${loadResult.error}`
            };
        }
    }
    
    try {
        // Build transmission sequence
        const sequence = buildTransmissionSequence(messageData, settings);
        
        // Calculate timing
        transmissionDuration = calculateTransmissionDuration(sequence, packId);
        transmissionStartTime = audioContext.currentTime + 0.1; // Small delay
        
        // Schedule all audio events
        let currentTime = transmissionStartTime;
        
        for (const event of sequence) {
            const buffer = getAudioBuffer(event.sound, packId);
            if (buffer) {
                scheduleAudioSource(buffer, currentTime);
                currentTime += buffer.duration;
            }
            currentTime += event.gap / 1000; // Add gap
        }
        
        // Start noise if enabled
        if (settings.addNoise && noiseBuffer) {
            startNoise(settings.noiseVolume || 0.1);
        }
        
        isPlaying = true;
        
        // Set up completion handler
        setTimeout(() => {
            stopTransmission();
        }, transmissionDuration * 1000 + 500); // Add small buffer
        
        return {
            success: true,
            duration: transmissionDuration,
            sequence: sequence.length,
            packId
        };
        
    } catch (error) {
        return {
            success: false,
            error: `Playback failed: ${error.message}`
        };
    }
}

/**
 * Stop current transmission
 */
export function stopTransmission() {
    if (!isPlaying) return;
    
    // Stop all scheduled sources
    for (const source of scheduledSources) {
        try {
            source.stop();
        } catch (e) {
            // Source may already be stopped
        }
    }
    
    // Stop noise
    stopNoise();
    
    // Clear arrays
    scheduledSources.length = 0;
    
    isPlaying = false;
    transmissionStartTime = 0;
    transmissionDuration = 0;
}

/**
 * Start background noise
 * @param {number} volume - Noise volume (0-1)
 */
function startNoise(volume = 0.1) {
    if (!noiseBuffer || noiseSource) return;
    
    noiseSource = audioContext.createBufferSource();
    const noiseGain = audioContext.createGain();
    
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseGain.gain.value = volume;
    
    noiseSource.connect(noiseGain);
    noiseGain.connect(masterGainNode);
    
    noiseSource.start();
}

/**
 * Stop background noise
 */
function stopNoise() {
    if (noiseSource) {
        try {
            noiseSource.stop();
        } catch (e) {
            // May already be stopped
        }
        noiseSource = null;
    }
}

/**
 * Play a single sound (for manual dialer)
 * @param {string} sound - Sound to play (0-9, achtung, trennung, ende)
 * @param {string} packId - Voice pack ID
 * @returns {Promise<boolean>} - Success status
 */
export async function playSingleSound(sound, packId = 'default') {
    if (!audioContext) {
        await initializeAudio();
    }
    
    // Ensure voice pack is loaded
    if (!voicePacks.has(packId)) {
        const loadResult = await loadVoicePack(packId);
        if (!loadResult.success) {
            console.warn(`Failed to load voice pack for single sound: ${loadResult.error}`);
            return false;
        }
    }
    
    const buffer = getAudioBuffer(sound, packId);
    if (!buffer) {
        console.warn(`Audio buffer not found for sound: ${sound}`);
        return false;
    }
    
    try {
        scheduleAudioSource(buffer, audioContext.currentTime);
        return true;
    } catch (error) {
        console.error(`Failed to play sound ${sound}:`, error);
        return false;
    }
}

/**
 * Get playback status
 * @returns {object} - Current status
 */
export function getPlaybackStatus() {
    const currentTime = audioContext ? audioContext.currentTime : 0;
    const elapsed = isPlaying ? currentTime - transmissionStartTime : 0;
    const progress = transmissionDuration > 0 ? Math.min(elapsed / transmissionDuration, 1) : 0;
    
    return {
        isPlaying,
        elapsed: Math.max(0, elapsed),
        duration: transmissionDuration,
        progress: Math.max(0, progress),
        remainingTime: Math.max(0, transmissionDuration - elapsed)
    };
}

/**
 * Get available voice packs
 * @returns {Array} - List of available voice packs
 */
export function getAvailableVoicePacks() {
    return Object.entries(VOICE_PACK_CONFIG).map(([id, config]) => ({
        id,
        name: config.name,
        loaded: voicePacks.has(id)
    }));
}

/**
 * Initialize audio system (alias for initializeAudio)
 */
export const initAudio = initializeAudio;

/**
 * Resume audio context (alias)
 */
export const resumeAudio = resumeAudioContext;

/**
 * Set master volume
 * @param {number} volume - Volume level (0-1)
 */
export function setMasterVolume(volume) {
    if (masterGainNode) {
        masterGainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
}

/**
 * Set playback speed
 * @param {number} speed - Speed multiplier (0.5 to 2.0)
 */
export function setPlaybackSpeed(speed) {
    playbackSpeed = Math.max(0.5, Math.min(2.0, speed));
}

/**
 * Set pitch shift in semitones
 * @param {number} semitones - Pitch shift (-12 to +12)
 */
export function setPitchShift(semitones) {
    pitchShift = Math.max(-12, Math.min(12, semitones));
}

/**
 * Get current audio settings
 * @returns {object} - Current audio settings
 */
export function getAudioSettings() {
    return {
        speed: playbackSpeed,
        pitch: pitchShift
    };
}

/**
 * Check if audio system is ready
 * @returns {boolean} - Ready status
 */
export function isAudioReady() {
    return audioContext && audioContext.state === 'running';
}

/**
 * Resume audio context (for user gesture requirement)
 */
export async function resumeAudioContext() {
    if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
    }
}