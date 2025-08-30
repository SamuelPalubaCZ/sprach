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
window.onload = function () {
	init();
	document.getElementById('speech-form').onsubmit = function (e) {
		e.preventDefault();
		generateAudio();
	};
	document.getElementById("keyboard").onkeypress = function (e) {
		e = e || event;
		key = String.fromCharCode(e.keyCode);
		playSound(key, 0);
	}
	document.getElementById('encrypt-button').addEventListener('click', encryptText);
    document.getElementById('decrypt-button').addEventListener('click', decryptText);
	document.getElementById('copy-to-body-button').addEventListener('click', copyToBody);
	document.getElementById('copy-to-clipboard-button').addEventListener('click', copyToClipboard);
}

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
        alert("No valid characters to generate audio.");
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

    document.getElementById('generate-button').textContent = 'Generating...';
    document.getElementById('generate-button').disabled = true;

    try {
        const renderedBuffer = await offlineContext.startRendering();
        const wavBlob = audioBufferToWav(renderedBuffer);
        const audioUrl = URL.createObjectURL(wavBlob);

        const audioPlayback = document.getElementById('audio-playback');
        const downloadLink = document.getElementById('download-link');
        const audioOutput = document.getElementById('audio-output');

        audioPlayback.src = audioUrl;
        downloadLink.href = audioUrl;
        audioOutput.style.display = 'block';
    } catch (error) {
        console.error('Error rendering audio:', error);
        alert('An error occurred while generating the audio.');
    } finally {
        document.getElementById('generate-button').textContent = 'Generate Audio File';
        document.getElementById('generate-button').disabled = false;
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
        alert('Please enter a cipher key.');
        return;
    }
    const encrypted = xorCipher(plainText, key);
    // To make it "speakable", we convert to char codes
    const speakableEncrypted = encrypted.split('').map(c => c.charCodeAt(0)).join(' ');
    document.getElementById('cipher-text').value = speakableEncrypted;
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
        alert('Please enter a cipher key.');
        return;
    }
    // Convert from char codes back to string
    const encrypted = cipherText.split(' ').filter(c => c).map(c => String.fromCharCode(parseInt(c, 10))).join('');
    const decrypted = xorCipher(encrypted, key);
    document.getElementById('plain-text').value = decrypted;
}
