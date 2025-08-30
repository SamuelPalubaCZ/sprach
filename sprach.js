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
	document.forms[0].onsubmit = function (e) {
		e.preventDefault();
		sendMessage()
	};
	document.getElementById("keyboard").onkeypress = function (e) {
		e = e || event;
		key = String.fromCharCode(e.keyCode);
		playSound(key, 0);
	}
	document.getElementById('encrypt-button').addEventListener('click', encryptText);
    document.getElementById('decrypt-button').addEventListener('click', decryptText);
    setupAudioRecording();
}

function sendMessage() {
	var offset = context.currentTime;
	var callRepeat = 4;
	var delay = 4;
	var speed = 0.8;

	call = document.getElementById("call").value;

	for (var i = 0; i < callRepeat; i++) {

		for (var j = 0; j < call.length; j++) {
			playSound(call[j], offset + speed * j + (delay * i));
		}

	}

	playSound(10, offset + delay * callRepeat);

	body = document.getElementById("body").value;

	for (var k = 0; k < body.length; k++) {
		playSound(body[k], offset + speed * k + (delay * callRepeat) + 2);
	}

	playSound(12, offset + speed * body.length + (delay * callRepeat) + 3);
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

function decryptText() {
    const cipherText = document.getElementById('cipher-text').value;
    const key = document.getElementById('cipher-key').value;
    if (!key) {
        alert('Please enter a cipher key.');
        return;
    }
    // Convert from char codes back to string
    const encrypted = cipherText.split(' ').map(c => String.fromCharCode(parseInt(c, 10))).join('');
    const decrypted = xorCipher(encrypted, key);
    document.getElementById('plain-text').value = decrypted;
}

function setupAudioRecording() {
    const startButton = document.getElementById('start-record-button');
    const stopButton = document.getElementById('stop-record-button');
    const audioPlayback = document.getElementById('audio-playback');
    let mediaRecorder;
    let audioChunks = [];

    async function startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                audioPlayback.src = audioUrl;
                audioChunks = [];
            };
            mediaRecorder.start();
            startButton.disabled = true;
            stopButton.disabled = false;
        } catch (err) {
            console.error('Error accessing microphone:', err);
            alert('Could not access microphone. Please ensure you have given permission.');
        }
    }

    function stopRecording() {
        mediaRecorder.stop();
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    startButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
}
