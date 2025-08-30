// toto 2014
// ripped off from http://www.html5rocks.com/en/tutorials/webaudio/intro/

var context;
var bufferLoader;

function init() {
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		context = new AudioContext();
	} catch (e) {
		alert('Web Audio API is not supported in this browser');
	}
	bufferLoader = new BufferLoader(
		context, [
			'assets/sounds/0.wav',
			'assets/sounds/1.wav',
			'assets/sounds/2.wav',
			'assets/sounds/3.wav',
			'assets/sounds/4.wav',
			'assets/sounds/5.wav',
			'assets/sounds/6.wav',
			'assets/sounds/7.wav',
			'assets/sounds/8.wav',
			'assets/sounds/9.wav',
			'assets/sounds/achtung.wav',
			'assets/sounds/trennung.wav',
			'assets/sounds/ende.wav',
		],
		finishedLoading
	);
	bufferLoader.load();
}

function playSound(key, time) {
	if (key === ' ') key = 'BADBEEF';

	if (isNaN(key)) {
		if (key == '*') key = 10;
		if (key == '/') key = 11;
		if (key == '+') key = 12;
	}

	if (!isNaN(key)) {
		var source = context.createBufferSource();
		source.buffer = window.sounds[key];
		source.connect(context.destination);
		source.start ? source.start(time) : source.noteOn(time);
	}
}

function finishedLoading(returnedBuffer) {
	window.sounds = returnedBuffer;
}
const MORSE_CODE = {
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
    'A': '.-',    'B': '-...',  'C': '-.-.', 'D': '-..',
    'E': '.',     'F': '..-.',  'G': '--.',  'H': '....',
    'I': '..',    'J': '.---',  'K': '-.-',  'L': '.-..',
    'M': '--',    'N': '-.',    'O': '---',  'P': '.--.',
    'Q': '--.-',  'R': '.-.',   'S': '...',  'T': '-',
    'U': '..-',   'V': '...-',  'W': '.--',  'X': '-..-',
    'Y': '-.--',  'Z': '--..'
};

async function generateMorseAudio(message, wpm, frequency) {
    const dotDuration = 1.2 / wpm;
    const timings = {
        dot: dotDuration,
        dash: dotDuration * 3,
        intraChar: dotDuration,      // Pause between dots and dashes of a character
        interChar: dotDuration * 3,      // Pause between characters
        word: dotDuration * 7,         // Pause between words
    };

    const clips = [];
    const words = message.trim().toUpperCase().split(/ +/); // Split by one or more spaces

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const chars = word.split('');
        for (let j = 0; j < chars.length; j++) {
            const char = chars[j];
            if (MORSE_CODE[char]) {
                const morse = MORSE_CODE[char];
                for (let k = 0; k < morse.length; k++) {
                    const m = morse[k];
                    if (m === '.') clips.push({ isPause: false, duration: timings.dot });
                    if (m === '-') clips.push({ isPause: false, duration: timings.dash });

                    if (k < morse.length - 1) {
                        clips.push({ isPause: true, duration: timings.intraChar });
                    }
                }
            }
            if (j < chars.length - 1) {
                clips.push({ isPause: true, duration: timings.interChar });
            }
        }
        if (i < words.length - 1) {
            clips.push({ isPause: true, duration: timings.word });
        }
    }

    const totalDuration = clips.reduce((sum, clip) => sum + clip.duration, 0);
    if (totalDuration === 0) {
        return null;
    }

    const offlineContext = new OfflineAudioContext(1, Math.ceil(context.sampleRate * totalDuration), context.sampleRate);
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

// Hacker-themed UI enhancements
function showTerminalMessage(message, type = 'info') {
    const statusElements = document.querySelectorAll('.transmission-status, .crypto-status, .generator-status');
    statusElements.forEach(element => {
        if (element) {
            element.textContent = message;
            element.className = element.className.replace(/\b(info|success|error|warning)\b/g, '');
            element.classList.add(type);
            
            // Add glitch effect for errors
            if (type === 'error') {
                element.style.animation = 'glitch 0.5s ease-in-out';
                setTimeout(() => element.style.animation = '', 500);
            }
        }
    });
}

function typewriterEffect(element, text, speed = 50) {
    if (!element) return;
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

function addMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-bg';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = '01';
    const drops = [];
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00ff00';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
}

function updateKeyStrength(key) {
    const strengthElement = document.querySelector('.key-strength');
    if (!strengthElement) return;
    
    let strength = 'WEAK';
    let color = '#ff4444';
    
    if (key.length >= 8) {
        strength = 'MODERATE';
        color = '#ffa500';
    }
    if (key.length >= 12 && /[A-Z]/.test(key) && /[0-9]/.test(key)) {
        strength = 'STRONG';
        color = '#00ff00';
    }
    if (key.length >= 16 && /[A-Z]/.test(key) && /[0-9]/.test(key) && /[^A-Za-z0-9]/.test(key)) {
        strength = 'MILITARY';
        color = '#00ffff';
    }
    
    strengthElement.textContent = `KEY STRENGTH: ${strength}`;
    strengthElement.style.color = color;
}

function logActivity(message) {
    const logContent = document.querySelector('.activity-content');
    if (!logContent) return;
    
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerHTML = `
        <span class="log-time">${timestamp}</span>
        <span class="log-message">${message}</span>
    `;
    
    logContent.appendChild(logEntry);
    logContent.scrollTop = logContent.scrollHeight;
    
    // Keep only last 50 entries
    while (logContent.children.length > 50) {
        logContent.removeChild(logContent.firstChild);
    }
}

window.addEventListener('load', function () {
	init();
	addMatrixRain();
	
	// Enhanced form submission with terminal feedback
	const speechForm = document.getElementById('speech-form');
	if (speechForm) {
		speechForm.onsubmit = function (e) {
			e.preventDefault();
			showTerminalMessage('INITIALIZING AUDIO SYNTHESIS...', 'info');
			generateAudio();
		};
	}
	
	// Enhanced keypress with visual feedback
	document.body.onkeypress = function (e) {
		e = e || event;
		key = String.fromCharCode(e.keyCode);
		playSound(key, 0);
		logActivity(`TONE GENERATED: ${key}`);
	}
	
	// Enhanced cipher controls
	const encryptBtn = document.getElementById('encrypt-button');
	if (encryptBtn) {
		encryptBtn.addEventListener('click', function() {
			showTerminalMessage('ENCRYPTING DATA...', 'info');
			setTimeout(() => {
				encryptText();
				showTerminalMessage('ENCRYPTION COMPLETE', 'success');
				logActivity('TEXT ENCRYPTED SUCCESSFULLY');
			}, 500);
		});
	}
	
	const decryptBtn = document.getElementById('decrypt-button');
	if (decryptBtn) {
		decryptBtn.addEventListener('click', function() {
			showTerminalMessage('DECRYPTING DATA...', 'info');
			setTimeout(() => {
				decryptText();
				showTerminalMessage('DECRYPTION COMPLETE', 'success');
				logActivity('TEXT DECRYPTED SUCCESSFULLY');
			}, 500);
		});
	}
	
	const copyBodyBtn = document.getElementById('copy-to-body-button');
	if (copyBodyBtn) {
		copyBodyBtn.addEventListener('click', function() {
			copyToBody();
			showTerminalMessage('DATA TRANSFERRED', 'success');
			logActivity('CIPHER TEXT COPIED TO TRANSMISSION BODY');
		});
	}
	
	const copyClipBtn = document.getElementById('copy-to-clipboard-button');
	if (copyClipBtn) {
		copyClipBtn.addEventListener('click', function() {
			copyToClipboard();
			showTerminalMessage('COPIED TO SYSTEM BUFFER', 'success');
			logActivity('CIPHER TEXT COPIED TO CLIPBOARD');
		});
	}
	
	// Key strength monitoring
	const cipherKey = document.getElementById('cipher-key');
	if (cipherKey) {
		cipherKey.addEventListener('input', function() {
			updateKeyStrength(this.value);
		});
	}
	
	// Clear activity log
	const clearBtn = document.querySelector('.clear-btn');
	if (clearBtn) {
		clearBtn.addEventListener('click', function() {
			const logContent = document.querySelector('.activity-content');
			if (logContent) {
				logContent.innerHTML = '';
				showTerminalMessage('ACTIVITY LOG CLEARED', 'info');
			}
		});
	}
	
	// Enhanced slider interactions
	const sliders = document.querySelectorAll('.control-slider');
	sliders.forEach(slider => {
		const valueDisplay = slider.parentElement.querySelector('.slider-value');
		if (valueDisplay) {
			slider.addEventListener('input', function() {
				valueDisplay.textContent = this.value;
				logActivity(`PARAMETER ADJUSTED: ${this.id} = ${this.value}`);
			});
		}
	});

    // --- UI Mode Toggling ---
    const modeVoice = document.getElementById('mode-voice');
    const modeMorse = document.getElementById('mode-morse');
    const voiceSettings = document.getElementById('voice-settings');
    const morseSettings = document.getElementById('morse-settings');

    function toggleModeView() {
        if (modeMorse.checked) {
            voiceSettings.style.display = 'none';
            morseSettings.style.display = 'block';
        } else {
            voiceSettings.style.display = 'block';
            morseSettings.style.display = 'none';
        }
    }

    modeVoice.addEventListener('change', toggleModeView);
    modeMorse.addEventListener('change', toggleModeView);
    
    // Character counter updates
    const plaintext = document.getElementById('plaintext');
    const ciphertext = document.getElementById('ciphertext');
    
    if (plaintext) {
        plaintext.addEventListener('input', updateCharCounters);
    }
    if (ciphertext) {
        ciphertext.addEventListener('input', updateCharCounters);
    }
    
    // Key strength monitoring for cipher page
    const key = document.getElementById('key');
    if (key) {
        key.addEventListener('input', function() {
            updateKeyStrength(this.value);
        });
    }
    
    // Manual tone generator controls
    const volumeSlider = document.getElementById('volume-slider');
    const durationSlider = document.getElementById('duration-slider');
    const volumeValue = document.getElementById('volume-value');
    const durationValue = document.getElementById('duration-value');
    
    if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', function() {
            volumeValue.textContent = this.value + '%';
        });
    }
    
    if (durationSlider && durationValue) {
        durationSlider.addEventListener('input', function() {
            durationValue.textContent = this.value + 'ms';
        });
    }
    
    // Speed and pitch controls for transmitter
    const speedControl = document.getElementById('speed-control');
    const pitchControl = document.getElementById('pitch-control');
    const speedValue = document.getElementById('speed-value');
    const pitchValue = document.getElementById('pitch-value');
    
    if (speedControl && speedValue) {
        speedControl.addEventListener('input', function() {
            speedValue.textContent = this.value + 'x';
        });
    }
    
    if (pitchControl && pitchValue) {
        pitchControl.addEventListener('input', function() {
            pitchValue.textContent = this.value + 'x';
        });
    }
    
    // Initialize character counters
    updateCharCounters();
    
    // Transmitter button event listeners
    const generateBtn = document.getElementById('generate-btn');
    const playBtn = document.getElementById('play-btn');
    const stopBtn = document.getElementById('stop-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', generateAudio);
    }
    if (playBtn) {
        playBtn.addEventListener('click', playAudio);
    }
    if (stopBtn) {
        stopBtn.addEventListener('click', stopAudio);
    }
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadAudio);
    }
});

async function generateAudio() {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const body = document.getElementById("body").value;

    let renderedBuffer = null;

    const generateButton = document.getElementById('generate-button');
    const originalText = generateButton.textContent;
    generateButton.textContent = 'PROCESSING...';
    generateButton.disabled = true;
    
    showTerminalMessage(`GENERATING ${mode.toUpperCase()} AUDIO...`, 'info');
    logActivity(`AUDIO GENERATION STARTED: ${mode.toUpperCase()} MODE`);

    try {
        if (mode === 'voice') {
            showTerminalMessage('SYNTHESIZING VOICE TRANSMISSION...', 'info');
            renderedBuffer = await generateVoiceAudio();
        } else {
            const wpm = parseInt(document.getElementById('morse-wpm').value, 10);
            const frequency = parseInt(document.getElementById('morse-frequency').value, 10);
            showTerminalMessage(`ENCODING MORSE: ${wpm}WPM @ ${frequency}Hz`, 'info');
            renderedBuffer = await generateMorseAudio(body, wpm, frequency);
        }

        if (renderedBuffer) {
            showTerminalMessage('CONVERTING TO WAV FORMAT...', 'info');
            const wavBlob = audioBufferToWav(renderedBuffer);
            const audioUrl = URL.createObjectURL(wavBlob);

            const audioPlayback = document.getElementById('audio-playback');
            const downloadLink = document.getElementById('download-link');
            const audioOutput = document.getElementById('audio-output');

            audioPlayback.src = audioUrl;
            downloadLink.href = audioUrl;
            audioOutput.style.display = 'block';
            
            showTerminalMessage('AUDIO SYNTHESIS COMPLETE', 'success');
            logActivity(`AUDIO FILE GENERATED: ${Math.round(renderedBuffer.duration * 1000)}ms duration`);
            
            // Add glowing effect to download section
            if (audioOutput) {
                audioOutput.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
                setTimeout(() => {
                    audioOutput.style.boxShadow = '';
                }, 2000);
            }
        } else {
            showTerminalMessage('SYNTHESIS FAILED: INVALID INPUT', 'error');
            logActivity('ERROR: Audio generation failed - no valid characters');
        }

    } catch (error) {
        console.error('Error rendering audio:', error);
        showTerminalMessage('CRITICAL ERROR: SYNTHESIS FAILURE', 'error');
        logActivity(`ERROR: ${error.message}`);
    } finally {
        generateButton.textContent = originalText;
        generateButton.disabled = false;
    }
}

async function generateVoiceAudio() {
    // Read all controls
    const call = document.getElementById("call").value;
    const body = document.getElementById("body").value;
    const pitch = parseFloat(document.getElementById('pitch-control').value);
    const speed = parseFloat(document.getElementById('speed-control').value);
    const callsignReps = parseInt(document.getElementById('callsign-reps').value, 10);
    const playAchtung = document.getElementById('achtung-signal').checked;
    const autoPause = document.getElementById('auto-pause').checked;
    const autoPauseDuration = parseInt(document.getElementById('auto-pause-duration').value, 10);

    const shortPause = (autoPauseDuration / 1000) / speed;
    const longPause = 0.5 / speed;

    const soundClips = [];

    const getSound = (char) => {
        let soundIndex = -1;
        if (!isNaN(char)) soundIndex = parseInt(char, 10);
        else if (char === '*' || char === '#') soundIndex = 10; // Achtung
        else if (char === '/') soundIndex = 11; // Trennung
        else if (char === '+') soundIndex = 12; // Ende

        if (soundIndex !== -1 && window.sounds[soundIndex]) {
            const buffer = window.sounds[soundIndex];
            const duration = buffer.duration / pitch;
            return { isPause: false, buffer, duration };
        }
        return null;
    };

    // 1. Attention Signal
    if (playAchtung) {
        soundClips.push(getSound('*'));
        soundClips.push({ isPause: true, duration: longPause });
    }

    // 2. Callsign
    for (let i = 0; i < callsignReps; i++) {
        for (const char of call) {
            const sound = getSound(char);
            if (sound) {
                soundClips.push(sound);
                if (autoPause) soundClips.push({ isPause: true, duration: shortPause });
            }
        }
        soundClips.push({ isPause: true, duration: longPause });
    }

    // 3. Separator
    soundClips.push(getSound('/'));
    soundClips.push({ isPause: true, duration: longPause });

    // 4. Message Body
    for (const char of body) {
        if (char === ' ') {
            soundClips.push({ isPause: true, duration: shortPause });
            continue;
        }
        if (char === '_') {
            soundClips.push({ isPause: true, duration: longPause });
            continue;
        }
        const sound = getSound(char);
        if (sound) {
            soundClips.push(sound);
            if (autoPause) soundClips.push({ isPause: true, duration: shortPause });
        }
    }

    // 5. End Signal
    soundClips.push(getSound('+'));

    const validClips = soundClips.filter(c => c !== null);
    if (validClips.length === 0) {
        return null;
    }

    const totalDuration = validClips.reduce((sum, clip) => sum + clip.duration, 0);
    const offlineContext = new OfflineAudioContext(1, Math.ceil(context.sampleRate * totalDuration), context.sampleRate);
    let offset = 0;

    for (const clip of validClips) {
        if (clip.isPause) {
            offset += clip.duration;
        } else {
            const source = offlineContext.createBufferSource();
            source.buffer = clip.buffer;
            source.playbackRate.value = pitch;
            source.connect(offlineContext.destination);
            source.start(offset);
            offset += clip.duration;
        }
    }

    return await offlineContext.startRendering();
}

function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels = [];
    let i, sample;
    let offset = 0;
    let pos = 0;

    // Helper function
    const setUint16 = (data) => {
        view.setUint16(pos, data, true);
        pos += 2;
    }
    const setUint32 = (data) => {
        view.setUint32(pos, data, true);
        pos += 4;
    }

    // RIFF header
    setUint32(0x46464952); // "RIFF"
    setUint32(length - 8); // file length - 8
    setUint32(0x45564157); // "WAVE"

    // "fmt " subchunk
    setUint32(0x20746d66); // "fmt "
    setUint32(16); // chunk size
    setUint16(1); // PCM
    setUint16(numOfChan);
    setUint32(buffer.sampleRate);
    setUint32(buffer.sampleRate * 2 * numOfChan); // byte rate
    setUint16(numOfChan * 2); // block align
    setUint16(16); // bits per sample

    // "data" subchunk
    setUint32(0x61746164); // "data"
    setUint32(length - pos - 4);

    // Write the PCM samples
    for (i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
            sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF); // scale to 16-bit
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([view], { type: 'audio/wav' });
}

function xorCipher(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
}

function encryptText() {
    const plainText = document.getElementById('plaintext').value;
    const key = document.getElementById('key').value;
    
    if (!key) {
        logActivity('Encryption failed: No cipher key provided');
        return;
    }
    
    if (!plainText.trim()) {
        logActivity('Encryption failed: No plaintext provided');
        return;
    }
    
    try {
        const encrypted = xorCipher(plainText, key);
        // To make it "speakable", we convert to char codes
        const speakableEncrypted = encrypted.split('').map(c => c.charCodeAt(0)).join(' ');
        document.getElementById('ciphertext').value = speakableEncrypted;
        
        logActivity(`Encrypted ${plainText.length} characters with ${key.length}-character key`);
        updateCharCounters();
    } catch (error) {
        logActivity(`Encryption error: ${error.message}`);
    }
}

function copyToBody() {
    const cipherText = document.getElementById('ciphertext').value;
    document.getElementById('body').value = cipherText;
}

function copyResult() {
    const cipherText = document.getElementById('ciphertext').value;
    navigator.clipboard.writeText(cipherText).then(() => {
        logActivity('Copied to clipboard');
    }, (err) => {
        console.error('Could not copy text: ', err);
        logActivity('Copy failed');
    });
}

function decryptText() {
    const cipherText = document.getElementById('ciphertext').value;
    const key = document.getElementById('key').value;
    
    if (!key) {
        logActivity('Decryption failed: No cipher key provided');
        return;
    }
    
    if (!cipherText.trim()) {
        logActivity('Decryption failed: No ciphertext provided');
        return;
    }
    
    try {
        // Convert from char codes back to string
        const charCodes = cipherText.split(' ').filter(c => c.trim());
        if (charCodes.length === 0) {
            logActivity('Decryption failed: Invalid ciphertext format');
            return;
        }
        
        const encrypted = charCodes.map(c => {
            const code = parseInt(c, 10);
            if (isNaN(code) || code < 0 || code > 65535) {
                throw new Error(`Invalid character code: ${c}`);
            }
            return String.fromCharCode(code);
        }).join('');
        
        const decrypted = xorCipher(encrypted, key);
        document.getElementById('plaintext').value = decrypted;
        
        logActivity(`Decrypted ${charCodes.length} characters with ${key.length}-character key`);
        updateCharCounters();
    } catch (error) {
        logActivity(`Decryption error: ${error.message}`);
    }
}

// Generate a random encryption key
function generateRandomKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    for (let i = 0; i < 16; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('key').value = key;
    updateKeyStrength(key);
    logActivity('Random encryption key generated');
}

// Clear all text fields
function clearAll() {
    document.getElementById('plaintext').value = '';
    document.getElementById('ciphertext').value = '';
    document.getElementById('key').value = '';
    updateCharCounters();
    updateKeyStrength('');
    logActivity('All fields cleared');
}

// Swap plaintext and ciphertext
function swapTexts() {
    const plaintext = document.getElementById('plaintext');
    const ciphertext = document.getElementById('ciphertext');
    const temp = plaintext.value;
    plaintext.value = ciphertext.value;
    ciphertext.value = temp;
    updateCharCounters();
    logActivity('Text fields swapped');
}

// Update character counters
function updateCharCounters() {
    const plainCounter = document.getElementById('plain-counter');
    const cipherCounter = document.getElementById('cipher-counter');
    const plaintext = document.getElementById('plaintext');
    const ciphertext = document.getElementById('ciphertext');
    
    if (plainCounter && plaintext) {
        plainCounter.textContent = `${plaintext.value.length} chars`;
    }
    if (cipherCounter && ciphertext) {
        cipherCounter.textContent = `${ciphertext.value.length} chars`;
    }
}

// Clear activity log
function clearLog() {
    const logOutput = document.getElementById('log-output');
    const activityLog = document.getElementById('activity-log');
    
    if (logOutput) {
        logOutput.innerHTML = 'Encryption tool ready';
    }
    if (activityLog) {
        activityLog.innerHTML = 'Tone generator ready';
    }
    
    logActivity('Activity log cleared');
}

// Manual tone generation functions
function playTone(frequency) {
    if (!audioContext) {
        logActivity('Audio context not initialized');
        return;
    }
    
    const volumeSlider = document.getElementById('volume-slider');
    const durationSlider = document.getElementById('duration-slider');
    const volume = volumeSlider ? parseFloat(volumeSlider.value) / 100 : 0.5;
    const duration = durationSlider ? parseInt(durationSlider.value) : 200;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
        
        logActivity(`Generated ${frequency}Hz tone for ${duration}ms at ${Math.round(volume * 100)}% volume`);
    } catch (error) {
        logActivity(`Tone generation error: ${error.message}`);
    }
}

// Numeric keypad functions
function playDigit0() { playTone(941); }
function playDigit1() { playTone(697); }
function playDigit2() { playTone(770); }
function playDigit3() { playTone(852); }
function playDigit4() { playTone(697); }
function playDigit5() { playTone(770); }
function playDigit6() { playTone(852); }
function playDigit7() { playTone(697); }
function playDigit8() { playTone(770); }
function playDigit9() { playTone(852); }

// Special signal functions
function playAchtung() {
    playSound('achtung');
}

function playTrennung() {
    playSound('trennung');
}

function playEnde() {
    playSound('ende');
}

function playCustomTone() {
    const frequency = prompt('Enter frequency (Hz):', '440');
    if (frequency && !isNaN(frequency)) {
        playTone(parseFloat(frequency));
    }
}

// Transmitter audio generation functions
let currentAudioBuffer = null;
let currentAudioSource = null;

function generateAudio() {
    const callSign = document.getElementById('call').value;
    const message = document.getElementById('body').value;
    const mode = document.querySelector('input[name="mode"]:checked').value;
    
    if (!callSign.trim() && !message.trim()) {
        logActivity('Generation failed: No call sign or message provided');
        return;
    }
    
    if (mode === 'voice') {
        generateVoiceAudio(callSign, message);
    } else if (mode === 'morse') {
        generateMorseAudioTransmitter(callSign, message);
    }
}

function generateVoiceAudio(callSign, message) {
    if (!audioContext) {
        logActivity('Audio context not initialized');
        return;
    }
    
    try {
        const callsignReps = parseInt(document.getElementById('callsign-reps').value) || 2;
        const achtungSignal = document.getElementById('achtung-signal').checked;
        const autoPause = document.getElementById('auto-pause').checked;
        const pauseDuration = parseInt(document.getElementById('auto-pause-duration').value) || 100;
        
        let audioSequence = [];
        
        // Add achtung signal if enabled
        if (achtungSignal) {
            audioSequence.push('achtung');
        }
        
        // Add call sign repetitions
        for (let i = 0; i < callsignReps; i++) {
            if (callSign.trim()) {
                audioSequence.push(callSign.trim());
            }
        }
        
        // Add message content
        if (message.trim()) {
            const messageGroups = message.trim().split(/\s+/);
            audioSequence = audioSequence.concat(messageGroups);
        }
        
        // Generate audio for sequence
        playAudioSequence(audioSequence, autoPause ? pauseDuration : 0);
        
        logActivity(`Generated voice audio: ${audioSequence.length} elements`);
        
        // Enable play button
        document.getElementById('play-btn').disabled = false;
        document.getElementById('download-btn').disabled = false;
        
    } catch (error) {
        logActivity(`Voice generation error: ${error.message}`);
    }
}

function generateMorseAudioTransmitter(callSign, message) {
    if (!audioContext) {
        logActivity('Audio context not initialized');
        return;
    }
    
    try {
        const wpm = parseInt(document.getElementById('morse-wpm').value) || 20;
        const frequency = parseInt(document.getElementById('morse-frequency').value) || 800;
        
        const fullText = (callSign + ' ' + message).trim();
        if (!fullText) {
            logActivity('Morse generation failed: No text provided');
            return;
        }
        
        generateMorseAudio(fullText, wpm, frequency);
        logActivity(`Generated Morse code: ${fullText.length} characters at ${wpm} WPM`);
        
        // Enable play button
        document.getElementById('play-btn').disabled = false;
        document.getElementById('download-btn').disabled = false;
        
    } catch (error) {
        logActivity(`Morse generation error: ${error.message}`);
    }
}

function playAudioSequence(sequence, pauseDuration) {
    let currentTime = audioContext.currentTime;
    
    sequence.forEach((item, index) => {
        if (item === 'achtung' || item === 'trennung' || item === 'ende') {
            // Play special sounds
            playSound(item, currentTime);
            currentTime += 2; // Approximate duration
        } else {
            // Play individual digits/characters
            for (let char of item) {
                if (/\d/.test(char)) {
                    playDigitAtTime(char, currentTime);
                    currentTime += 0.8; // Duration per digit
                }
            }
        }
        
        if (pauseDuration > 0 && index < sequence.length - 1) {
            currentTime += pauseDuration / 1000;
        }
    });
}

function playDigitAtTime(digit, startTime) {
    const frequencies = {
        '0': 941, '1': 697, '2': 770, '3': 852, '4': 697,
        '5': 770, '6': 852, '7': 697, '8': 770, '9': 852
    };
    
    const frequency = frequencies[digit] || 440;
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.7);
    
    oscillator.start(startTime);
    oscillator.stop(startTime + 0.8);
}

function playAudio() {
    if (currentAudioBuffer && audioContext) {
        stopAudio();
        
        currentAudioSource = audioContext.createBufferSource();
        currentAudioSource.buffer = currentAudioBuffer;
        currentAudioSource.connect(audioContext.destination);
        currentAudioSource.start();
        
        document.getElementById('play-btn').disabled = true;
        document.getElementById('stop-btn').disabled = false;
        
        currentAudioSource.onended = function() {
            document.getElementById('play-btn').disabled = false;
            document.getElementById('stop-btn').disabled = true;
        };
        
        logActivity('Audio playback started');
    }
}

function stopAudio() {
    if (currentAudioSource) {
        currentAudioSource.stop();
        currentAudioSource = null;
        
        document.getElementById('play-btn').disabled = false;
        document.getElementById('stop-btn').disabled = true;
        
        logActivity('Audio playback stopped');
    }
}

function downloadAudio() {
    if (currentAudioBuffer) {
        // Create a simple WAV file download
        const audioData = currentAudioBuffer.getChannelData(0);
        const wavBuffer = createWAVFile(audioData, currentAudioBuffer.sampleRate);
        
        const blob = new Blob([wavBuffer], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transmission.wav';
        a.click();
        
        URL.revokeObjectURL(url);
        logActivity('Audio file downloaded');
    }
}

function createWAVFile(audioData, sampleRate) {
    const length = audioData.length;
    const buffer = new ArrayBuffer(44 + length * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * 2, true);
    
    // Convert audio data
    let offset = 44;
    for (let i = 0; i < length; i++) {
        const sample = Math.max(-1, Math.min(1, audioData[i]));
        view.setInt16(offset, sample * 0x7FFF, true);
        offset += 2;
    }
    
    return buffer;
}
