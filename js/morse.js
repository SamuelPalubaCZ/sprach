/**
 * Morse Code (CW) Module - OscillatorNode-based tone generation
 * Handles Morse code transmission of 5-digit groups with proper timing
 */

// Morse code mapping for digits and control words
const MORSE_CODE = {
    '0': '-----',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    'achtung': '.-/-.-./..../-/..-/-.',  // A C H T U N G
    'trennung': '-/.-././-./-./-./-.',    // T R E N N U N G  
    'ende': './-./-../.'                  // E N D E
};

// Audio context and nodes
let audioContext = null;
let masterGainNode = null;

// CW state
let isTransmitting = false;
let scheduledEvents = [];
let transmissionStartTime = 0;
let transmissionDuration = 0;

// Default CW settings
const DEFAULT_SETTINGS = {
    frequency: 800,     // Hz
    wpm: 20,           // Words per minute
    volume: 0.7        // 0-1
};

/**
 * Initialize Morse code system
 * @param {AudioContext} context - Shared audio context
 * @param {GainNode} gainNode - Master gain node
 */
export function initializeMorse(context, gainNode) {
    audioContext = context;
    masterGainNode = gainNode;
}

/**
 * Calculate timing values from WPM
 * @param {number} wpm - Words per minute
 * @returns {object} - Timing values in milliseconds
 */
function calculateTiming(wpm) {
    // Standard: PARIS = 50 units, so 1 WPM = 50 units per minute
    const unitTime = 1200 / wpm; // milliseconds per unit
    
    return {
        dit: unitTime,                    // Dot duration
        dah: unitTime * 3,               // Dash duration  
        elementGap: unitTime,            // Gap between dots/dashes
        letterGap: unitTime * 3,         // Gap between letters
        wordGap: unitTime * 7,           // Gap between words
        groupGap: unitTime * 10          // Gap between groups
    };
}

/**
 * Create a tone burst
 * @param {number} startTime - When to start (audio context time)
 * @param {number} duration - Duration in seconds
 * @param {number} frequency - Frequency in Hz
 * @param {number} volume - Volume (0-1)
 * @returns {object} - Created oscillator and gain nodes
 */
function createToneBurst(startTime, duration, frequency, volume) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Configure oscillator
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startTime);
    
    // Configure envelope (soft attack/release to avoid clicks)
    const attackTime = Math.min(0.005, duration * 0.1);
    const releaseTime = Math.min(0.005, duration * 0.1);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + attackTime);
    gainNode.gain.setValueAtTime(volume, startTime + duration - releaseTime);
    gainNode.gain.linearRampToValueAtTime(0, startTime + duration);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(masterGainNode);
    
    // Schedule start and stop
    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
    
    return { oscillator, gainNode };
}

/**
 * Convert text to Morse code sequence
 * @param {string} text - Text to convert
 * @returns {Array} - Array of Morse elements
 */
function textToMorseSequence(text) {
    const sequence = [];
    const chars = text.toLowerCase().split('');
    
    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];
        const morse = MORSE_CODE[char];
        
        if (morse) {
            // Handle multi-letter words (like 'achtung')
            if (morse.includes('/')) {
                const letters = morse.split('/');
                for (let j = 0; j < letters.length; j++) {
                    const letterMorse = letters[j];
                    for (const element of letterMorse) {
                        sequence.push({
                            type: element === '.' ? 'dit' : 'dah',
                            char: char,
                            letter: j
                        });
                    }
                    if (j < letters.length - 1) {
                        sequence.push({ type: 'letterGap' });
                    }
                }
            } else {
                // Single character
                for (const element of morse) {
                    sequence.push({
                        type: element === '.' ? 'dit' : 'dah',
                        char: char
                    });
                }
            }
            
            // Add gap after character (except last)
            if (i < chars.length - 1) {
                sequence.push({ type: 'letterGap' });
            }
        } else if (char === ' ') {
            sequence.push({ type: 'wordGap' });
        }
    }
    
    return sequence;
}

/**
 * Build complete transmission sequence
 * @param {object} messageData - Encoded message data
 * @param {object} settings - CW settings
 * @returns {Array} - Complete sequence with timing
 */
function buildCWTransmissionSequence(messageData, settings) {
    const timing = calculateTiming(settings.wpm || DEFAULT_SETTINGS.wpm);
    const sequence = [];
    
    // Generate random message ID (5 digits)
    const messageId = Array.from({length: 5}, () => Math.floor(Math.random() * 10).toString()).join('');
    
    // Build transmission parts
    const parts = [
        'achtung',
        messageId,
        'trennung', 
        messageData.count.toString().padStart(2, '0'),
        'trennung',
        ...messageData.groups,
        'ende'
    ];
    
    let currentTime = 0;
    
    for (let partIndex = 0; partIndex < parts.length; partIndex++) {
        const part = parts[partIndex];
        const isGroup = Array.isArray(messageData.groups) && messageData.groups.includes(part);
        
        // Convert part to Morse sequence
        const morseSequence = textToMorseSequence(part);
        
        // Add each Morse element with timing
        for (let i = 0; i < morseSequence.length; i++) {
            const element = morseSequence[i];
            
            if (element.type === 'dit' || element.type === 'dah') {
                const duration = timing[element.type];
                sequence.push({
                    type: 'tone',
                    startTime: currentTime,
                    duration: duration / 1000, // Convert to seconds
                    frequency: settings.frequency || DEFAULT_SETTINGS.frequency,
                    volume: settings.volume || DEFAULT_SETTINGS.volume,
                    char: element.char
                });
                currentTime += duration;
                
                // Add element gap (except after last element in letter)
                if (i < morseSequence.length - 1 && morseSequence[i + 1].type !== 'letterGap' && morseSequence[i + 1].type !== 'wordGap') {
                    currentTime += timing.elementGap;
                }
            } else if (element.type === 'letterGap') {
                currentTime += timing.letterGap;
            } else if (element.type === 'wordGap') {
                currentTime += timing.wordGap;
            }
        }
        
        // Add gap after part
        if (partIndex < parts.length - 1) {
            if (isGroup) {
                currentTime += timing.groupGap;
            } else {
                currentTime += timing.wordGap;
            }
        }
    }
    
    return {
        sequence,
        duration: currentTime / 1000 // Convert to seconds
    };
}

/**
 * Transmit message in Morse code
 * @param {object} messageData - Encoded message data
 * @param {object} settings - CW settings
 * @returns {Promise<object>} - Transmission result
 */
export async function transmitMorse(messageData, settings = {}) {
    if (!audioContext || !masterGainNode) {
        return {
            success: false,
            error: 'Morse system not initialized'
        };
    }
    
    if (isTransmitting) {
        return {
            success: false,
            error: 'Transmission already in progress'
        };
    }
    
    try {
        // Build transmission sequence
        const { sequence, duration } = buildCWTransmissionSequence(messageData, settings);
        
        transmissionStartTime = audioContext.currentTime + 0.1; // Small delay
        transmissionDuration = duration;
        
        // Schedule all tone bursts
        scheduledEvents = [];
        
        for (const event of sequence) {
            if (event.type === 'tone') {
                const startTime = transmissionStartTime + event.startTime;
                const nodes = createToneBurst(
                    startTime,
                    event.duration,
                    event.frequency,
                    event.volume
                );
                
                scheduledEvents.push({
                    ...nodes,
                    startTime,
                    duration: event.duration
                });
            }
        }
        
        isTransmitting = true;
        
        // Set up completion handler
        setTimeout(() => {
            stopMorseTransmission();
        }, duration * 1000 + 500); // Add small buffer
        
        return {
            success: true,
            duration,
            elements: sequence.length,
            wpm: settings.wpm || DEFAULT_SETTINGS.wpm,
            frequency: settings.frequency || DEFAULT_SETTINGS.frequency
        };
        
    } catch (error) {
        return {
            success: false,
            error: `Morse transmission failed: ${error.message}`
        };
    }
}

/**
 * Stop current Morse transmission
 */
export function stopMorseTransmission() {
    if (!isTransmitting) return;
    
    // Stop all scheduled oscillators
    for (const event of scheduledEvents) {
        try {
            if (event.oscillator) {
                event.oscillator.stop();
            }
        } catch (e) {
            // Oscillator may already be stopped
        }
    }
    
    // Clear events
    scheduledEvents = [];
    
    isTransmitting = false;
    transmissionStartTime = 0;
    transmissionDuration = 0;
}

/**
 * Send a single Morse character (for manual dialer)
 * @param {string} char - Character to send
 * @param {object} settings - CW settings
 * @returns {Promise<boolean>} - Success status
 */
export async function sendMorseCharacter(char, settings = {}) {
    if (!audioContext || !masterGainNode) {
        console.warn('Morse system not initialized');
        return false;
    }
    
    const morse = MORSE_CODE[char.toLowerCase()];
    if (!morse) {
        console.warn(`No Morse code for character: ${char}`);
        return false;
    }
    
    try {
        const timing = calculateTiming(settings.wpm || DEFAULT_SETTINGS.wpm);
        const frequency = settings.frequency || DEFAULT_SETTINGS.frequency;
        const volume = settings.volume || DEFAULT_SETTINGS.volume;
        
        let currentTime = audioContext.currentTime + 0.01;
        
        // Handle multi-letter words
        if (morse.includes('/')) {
            const letters = morse.split('/');
            for (let i = 0; i < letters.length; i++) {
                const letterMorse = letters[i];
                for (let j = 0; j < letterMorse.length; j++) {
                    const element = letterMorse[j];
                    const duration = element === '.' ? timing.dit : timing.dah;
                    
                    createToneBurst(
                        currentTime,
                        duration / 1000,
                        frequency,
                        volume
                    );
                    
                    currentTime += duration / 1000;
                    
                    // Add element gap (except after last element in letter)
                    if (j < letterMorse.length - 1) {
                        currentTime += timing.elementGap / 1000;
                    }
                }
                
                // Add letter gap (except after last letter)
                if (i < letters.length - 1) {
                    currentTime += timing.letterGap / 1000;
                }
            }
        } else {
            // Single character
            for (let i = 0; i < morse.length; i++) {
                const element = morse[i];
                const duration = element === '.' ? timing.dit : timing.dah;
                
                createToneBurst(
                    currentTime,
                    duration / 1000,
                    frequency,
                    volume
                );
                
                currentTime += duration / 1000;
                
                // Add element gap (except after last element)
                if (i < morse.length - 1) {
                    currentTime += timing.elementGap / 1000;
                }
            }
        }
        
        return true;
        
    } catch (error) {
        console.error(`Failed to send Morse character ${char}:`, error);
        return false;
    }
}

/**
 * Get Morse transmission status
 * @returns {object} - Current status
 */
export function getMorseStatus() {
    const currentTime = audioContext ? audioContext.currentTime : 0;
    const elapsed = isTransmitting ? currentTime - transmissionStartTime : 0;
    const progress = transmissionDuration > 0 ? Math.min(elapsed / transmissionDuration, 1) : 0;
    
    return {
        isTransmitting,
        elapsed: Math.max(0, elapsed),
        duration: transmissionDuration,
        progress: Math.max(0, progress),
        remainingTime: Math.max(0, transmissionDuration - elapsed)
    };
}

/**
 * Get Morse code for a character (for display)
 * @param {string} char - Character to look up
 * @returns {string|null} - Morse code or null if not found
 */
export function getMorseCode(char) {
    return MORSE_CODE[char.toLowerCase()] || null;
}

/**
 * Validate WPM setting
 * @param {number} wpm - Words per minute
 * @returns {boolean} - Valid status
 */
export function isValidWPM(wpm) {
    return typeof wpm === 'number' && wpm >= 5 && wpm <= 60;
}

/**
 * Validate frequency setting
 * @param {number} frequency - Frequency in Hz
 * @returns {boolean} - Valid status
 */
export function isValidFrequency(frequency) {
    return typeof frequency === 'number' && frequency >= 300 && frequency <= 3000;
}

/**
 * Get default CW settings
 * @returns {object} - Default settings
 */
export function getDefaultCWSettings() {
    return { ...DEFAULT_SETTINGS };
}