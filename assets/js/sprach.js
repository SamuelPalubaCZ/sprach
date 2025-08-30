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
    const plainText = document.getElementById('plain-text').value;
    const key = document.getElementById('cipher-key').value;
    
    if (!key) {
        showTerminalMessage('ERROR: CIPHER KEY REQUIRED', 'error');
        logActivity('ENCRYPTION FAILED: No cipher key provided');
        return;
    }
    
    if (!plainText.trim()) {
        showTerminalMessage('ERROR: NO PLAINTEXT TO ENCRYPT', 'error');
        logActivity('ENCRYPTION FAILED: No plaintext provided');
        return;
    }
    
    try {
        const encrypted = xorCipher(plainText, key);
        // To make it "speakable", we convert to char codes
        const speakableEncrypted = encrypted.split('').map(c => c.charCodeAt(0)).join(' ');
        document.getElementById('cipher-text').value = speakableEncrypted;
        
        logActivity(`ENCRYPTED ${plainText.length} CHARACTERS WITH ${key.length}-CHAR KEY`);
    } catch (error) {
        showTerminalMessage('ENCRYPTION ERROR', 'error');
        logActivity(`ENCRYPTION ERROR: ${error.message}`);
    }
}

function copyToBody() {
    const cipherText = document.getElementById('cipher-text').value;
    document.getElementById('body').value = cipherText;
}

function copyToClipboard() {
    const cipherText = document.getElementById('cipher-text').value;
    navigator.clipboard.writeText(cipherText).then(() => {
        // Optional: give user feedback
        // alert('Copied to clipboard');
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}

function decryptText() {
    const cipherText = document.getElementById('cipher-text').value;
    const key = document.getElementById('cipher-key').value;
    
    if (!key) {
        showTerminalMessage('ERROR: CIPHER KEY REQUIRED', 'error');
        logActivity('DECRYPTION FAILED: No cipher key provided');
        return;
    }
    
    if (!cipherText.trim()) {
        showTerminalMessage('ERROR: NO CIPHERTEXT TO DECRYPT', 'error');
        logActivity('DECRYPTION FAILED: No ciphertext provided');
        return;
    }
    
    try {
        // Convert from char codes back to string
        const charCodes = cipherText.split(' ').filter(c => c.trim());
        if (charCodes.length === 0) {
            showTerminalMessage('ERROR: INVALID CIPHERTEXT FORMAT', 'error');
            logActivity('DECRYPTION FAILED: Invalid ciphertext format');
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
        document.getElementById('plain-text').value = decrypted;
        
        logActivity(`DECRYPTED ${charCodes.length} CHARACTERS WITH ${key.length}-CHAR KEY`);
    } catch (error) {
        showTerminalMessage('DECRYPTION ERROR', 'error');
        logActivity(`DECRYPTION ERROR: ${error.message}`);
    }
}
