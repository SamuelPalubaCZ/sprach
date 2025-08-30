---
layout: default
title: Transmitter
---

<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

# SECURE TRANSMISSION CONSOLE

**STATUS:** <span id="tx-status">STANDBY</span> | **FREQ:** 4625.0 kHz

<form id="speech-form" onsubmit="return false;">

## 📡 CALL_SIGN
<input id="call" type="text" value="271" placeholder="Enter station identifier..." style="width: 100%; padding: 8px; font-family: monospace; background: #000; color: #0f0; border: 1px solid #333;">
*Station identification code (3-4 digits recommended)*

## 🔢 MESSAGE_PAYLOAD
<textarea rows="8" name="body" id="body" placeholder="Enter numerical message groups..." style="width: 100%; padding: 8px; font-family: monospace; background: #000; color: #0f0; border: 1px solid #333;">846 846 20 20 83167 83167 14528 14528 30778 30778 13436 13436 50234 50234 67256 67256 15654 15654 27414 27414 15837 15837 75251 75251 51820 51820 37982 37982 64162 64162 18385 18385 90381 90381 77942 77942 12692 12692 22897 22897 69231 69231 14881 14881 846 846 20 20 00000</textarea>

**PROTOCOL:** Space = short pause | _ = long pause | Special: * / + #

## TRANSMISSION_MODE

<label><input id="mode-voice" type="radio" name="mode" value="voice" checked> VOICE_SYNTHESIS</label>
<label><input id="mode-morse" type="radio" name="mode" value="morse"> MORSE_CODE</label>

<div id="voice-settings">

### VOICE_PARAMETERS

**CALLSIGN_REPETITIONS:** <input type="number" id="callsign-reps" value="2" min="1" max="10" style="width: 60px; padding: 4px; font-family: monospace; background: #000; color: #0f0; border: 1px solid #333;">

<label><input type="checkbox" id="achtung-signal" checked> ACHTUNG_SIGNAL</label>

<label><input type="checkbox" id="auto-pause" checked> AUTO_PAUSE</label> <input type="number" id="auto-pause-duration" value="100" min="0" step="50" placeholder="ms" style="width: 80px; padding: 4px; font-family: monospace; background: #000; color: #0f0; border: 1px solid #333;">

### AUDIO_SYNTHESIS

**⚡ SPEED_MULTIPLIER:** <input type="range" id="speed-control" min="0.5" max="2.0" step="0.1" value="1.0"> <span id="speed-value">1.0x</span>

**🎵 PITCH_MODULATION:** <input type="range" id="pitch-control" min="0.5" max="2.0" step="0.1" value="1.0"> <span id="pitch-value">1.0x</span>

</div>

<div id="morse-settings" style="display: none;">

### MORSE_PARAMETERS

**WPM_RATE:** <input type="number" id="morse-wpm" min="5" max="100" value="20" step="1" style="width: 80px; padding: 4px; font-family: monospace; background: #000; color: #0f0; border: 1px solid #333;">

**TONE_FREQ:** <input type="number" id="morse-frequency" min="300" max="2000" value="800" step="50" style="width: 100px; padding: 4px; font-family: monospace; background: #000; color: #0f0; border: 1px solid #333;">
</div>

<button type="button" id="generate-btn">🔧 GENERATE_AUDIO</button>
<button type="button" id="play-btn" disabled>▶️ TRANSMIT</button>
<button type="button" id="stop-btn" disabled>⏹️ ABORT</button>
<button type="button" id="download-btn" disabled>💾 EXPORT</button>

</form>

<div id="audio-output"></div>
