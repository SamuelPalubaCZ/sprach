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
			'./sounds/0.wav',
			'./sounds/1.wav',
			'./sounds/2.wav',
			'./sounds/3.wav',
			'./sounds/4.wav',
			'./sounds/5.wav',
			'./sounds/6.wav',
			'./sounds/7.wav',
			'./sounds/8.wav',
			'./sounds/9.wav',
			'./sounds/achtung.wav',
			'./sounds/trennung.wav',
			'./sounds/ende.wav',
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

	if (!isNaN(key) && key >= 0 && key <= 12) {
		var source = context.createBufferSource();
		source.buffer = window.sounds[key];
		source.connect(context.destination);
		source.start ? source.start(time) : source.noteOn(time);
	}
}

function finishedLoading(returnedBuffer) {
	window.sounds = returnedBuffer;
}
window.onload = function () {
	init();
	
	// Kontrola existence formuláře
	const speechForm = document.getElementById('speech-form');
	if (speechForm) {
		speechForm.onsubmit = function (e) {
			e.preventDefault();
			generateAudio();
		};
	} else {
		console.error('Speech form not found');
	}
	
	// Kontrola existence tlačítek pro šifrování
	const encryptButton = document.getElementById('encrypt-button');
	const decryptButton = document.getElementById('decrypt-button');
	const copyToBodyButton = document.getElementById('copy-to-body-button');
	const copyToClipboardButton = document.getElementById('copy-to-clipboard-button');
	
	if (encryptButton) {
		encryptButton.addEventListener('click', encryptText);
		console.log('Encrypt button event listener added');
	} else {
		console.error('Encrypt button not found');
	}
	
	if (decryptButton) {
		decryptButton.addEventListener('click', decryptText);
		console.log('Decrypt button event listener added');
	} else {
		console.error('Decrypt button not found');
	}
	
	if (copyToBodyButton) {
		copyToBodyButton.addEventListener('click', copyToBody);
		console.log('Copy to body button event listener added');
	} else {
		console.error('Copy to body button not found');
	}
	
	if (copyToClipboardButton) {
		copyToClipboardButton.addEventListener('click', copyToClipboard);
		console.log('Copy to clipboard button event listener added');
	} else {
		console.error('Copy to clipboard button not found');
	}
	
	// Přidání range slider funkcí
	setupRangeSliders();
	
	// Přidání klávesových zkratek
	setupKeyboardShortcuts();
	
	// Přidání animací a efektů
	setupAnimations();
}

// Nové funkce pro lepší UX
function setupRangeSliders() {
	const speedControl = document.getElementById('speed-control');
	const pitchControl = document.getElementById('pitch-control');
	const speedValue = document.getElementById('speed-value');
	const pitchValue = document.getElementById('pitch-value');
	
	if (speedControl && speedValue) {
		speedControl.addEventListener('input', function() {
			speedValue.textContent = this.value;
		});
	}
	
	if (pitchControl && pitchValue) {
		pitchControl.addEventListener('input', function() {
			pitchValue.textContent = this.value;
		});
	}
}

function setupKeyboardShortcuts() {
	document.addEventListener('keydown', function(e) {
		// Ctrl + Enter pro generování audio
		if (e.ctrlKey && e.key === 'Enter') {
			e.preventDefault();
			generateAudio();
		}
		
		// Ctrl + E pro šifrování
		if (e.ctrlKey && e.key === 'e') {
			e.preventDefault();
			encryptText();
		}
		
		// Ctrl + D pro dešifrování
		if (e.ctrlKey && e.key === 'd') {
			e.preventDefault();
			decryptText();
		}
		
		// Ctrl + C pro kopírování (přesahuje do clipboard)
		if (e.ctrlKey && e.key === 'c') {
			// Standardní funkce prohlížeče
		}
	});
}

function setupAnimations() {
	// Přidání loading stavů
	const generateButton = document.getElementById('generate-button');
	if (generateButton) {
		generateButton.addEventListener('click', function() {
			this.classList.add('loading');
		});
	}
	
	// Přidání hover efektů pro karty
	const cards = document.querySelectorAll('.card');
	cards.forEach(card => {
		card.addEventListener('mouseenter', function() {
			this.style.transform = 'translateY(-5px)';
		});
		
		card.addEventListener('mouseleave', function() {
			this.style.transform = 'translateY(0)';
		});
	});
}

// Vylepšená funkce pro generování audio s lepším UX
async function generateAudio() {
    // Read all controls
    const call = document.getElementById("call").value;
    const body = document.getElementById("body").value;
    const pitch = parseFloat(document.getElementById('pitch-control').value);
    const speed = parseFloat(document.getElementById('speed-control').value);
    const callsignReps = parseInt(document.getElementById('callsign-reps').value, 10);
    const playAchtung = document.getElementById('achtung-signal').checked;
    const autoPause = document.getElementById('auto-pause').checked;
    const autoPauseDuration = parseInt(document.getElementById('auto-pause-duration').value, 10);

    // Validace vstupu
    if (!call || !body) {
        showNotification('Prosím vyplňte volací znak a zprávu.', 'error');
        return;
    }

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
        showNotification("Žádné platné znaky k generování audio.", 'error');
        return;
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

    const generateButton = document.getElementById('generate-button');
    generateButton.textContent = 'Generování...';
    generateButton.disabled = true;
    generateButton.classList.add('loading');

    try {
        showNotification('Generuji audio soubor...', 'info');
        
        const renderedBuffer = await offlineContext.startRendering();
        const wavBlob = audioBufferToWav(renderedBuffer);
        const audioUrl = URL.createObjectURL(wavBlob);

        const audioPlayback = document.getElementById('audio-playback');
        const downloadLink = document.getElementById('download-link');
        const audioOutput = document.getElementById('audio-output');

        audioPlayback.src = audioUrl;
        downloadLink.href = audioUrl;
        audioOutput.style.display = 'block';
        
        showNotification('Audio soubor byl úspěšně vygenerován!', 'success');
        
        // Scroll na audio output
        audioOutput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
    } catch (error) {
        console.error('Error rendering audio:', error);
        showNotification('Chyba při generování audio souboru.', 'error');
    } finally {
        generateButton.textContent = 'Generate Audio File';
        generateButton.disabled = false;
        generateButton.classList.remove('loading');
    }
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
    if (!text || !key) {
        throw new Error('Text a klíč jsou povinné parametry');
    }
    
    if (typeof text !== 'string' || typeof key !== 'string') {
        throw new Error('Text a klíč musí být řetězce');
    }
    
    if (key.length === 0) {
        throw new Error('Klíč nemůže být prázdný');
    }
    
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyCode = key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode ^ keyCode);
    }
    return result;
}

function encryptText() {
    const plainTextElement = document.getElementById('plain-text');
    const keyElement = document.getElementById('cipher-key');
    const cipherTextElement = document.getElementById('cipher-text');
    
    if (!plainTextElement || !keyElement || !cipherTextElement) {
        console.error('Required elements not found');
        return;
    }
    
    const plainText = plainTextElement.value;
    const key = keyElement.value;
    
    if (!key) {
        alert('Prosím zadejte šifrovací klíč.');
        return;
    }
    
    if (!plainText) {
        alert('Prosím zadejte text k zašifrování.');
        return;
    }
    
    try {
        const encrypted = xorCipher(plainText, key);
        // To make it "speakable", we convert to char codes
        const speakableEncrypted = encrypted.split('').map(c => c.charCodeAt(0)).join(' ');
        cipherTextElement.value = speakableEncrypted;
        console.log('Text successfully encrypted');
    } catch (error) {
        console.error('Chyba při šifrování:', error);
        alert('Chyba při šifrování: ' + error.message);
    }
}

function copyToBody() {
    const cipherTextElement = document.getElementById('cipher-text');
    const bodyElement = document.getElementById('body');
    
    if (!cipherTextElement || !bodyElement) {
        console.error('Required elements not found');
        return;
    }
    
    const cipherText = cipherTextElement.value;
    if (!cipherText) {
        alert('Prosím nejdříve zašifrujte nějaký text.');
        return;
    }
    
    bodyElement.value = cipherText;
}

function copyToClipboard() {
    const cipherTextElement = document.getElementById('cipher-text');
    
    if (!cipherTextElement) {
        console.error('Required element not found');
        return;
    }
    
    const cipherText = cipherTextElement.value;
    if (!cipherText) {
        alert('Prosím nejdříve zašifrujte nějaký text.');
        return;
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(cipherText).then(() => {
            // Optional: give user feedback
            // alert('Zkopírováno do schránky');
        }, (err) => {
            console.error('Could not copy text: ', err);
            alert('Nepodařilo se zkopírovat text do schránky.');
        });
    } else {
        // Fallback pro starší prohlížeče
        const textArea = document.createElement('textarea');
        textArea.value = cipherText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            // alert('Zkopírováno do schránky');
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            alert('Nepodařilo se zkopírovat text do schránky.');
        }
        document.body.removeChild(textArea);
    }
}

function decryptText() {
    const cipherTextElement = document.getElementById('cipher-text');
    const keyElement = document.getElementById('cipher-key');
    const plainTextElement = document.getElementById('plain-text');
    
    if (!cipherTextElement || !keyElement || !plainTextElement) {
        console.error('Required elements not found');
        return;
    }
    
    const cipherText = cipherTextElement.value;
    const key = keyElement.value;
    
    if (!key) {
        alert('Prosím zadejte šifrovací klíč.');
        return;
    }
    
    if (!cipherText) {
        alert('Prosím zadejte zašifrovaný text k dešifrování.');
        return;
    }
    
    try {
        // Convert from char codes back to string
        const encrypted = cipherText.split(' ').filter(c => c).map(c => String.fromCharCode(parseInt(c, 10))).join('');
        const decrypted = xorCipher(encrypted, key);
        plainTextElement.value = decrypted;
    } catch (error) {
        console.error('Chyba při dešifrování:', error);
        alert('Chyba při dešifrování. Zkontrolujte formát zašifrovaného textu.');
    }
}

// Funkce pro zobrazování notifikací
function showNotification(message, type = 'info') {
    // Vytvoření notifikačního elementu
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Přidání do DOM
    document.body.appendChild(notification);
    
    // Automatické odstranění po 5 sekundách
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
    
    // Animace
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

function getNotificationIcon(type) {
    const icons = {
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'info': 'ℹ️'
    };
    return icons[type] || icons['info'];
}
