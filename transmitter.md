---
layout: default
title: Transmitter
---

<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

# Audio Transmitter

**Status:** <span id="tx-status">Ready</span>

<form id="speech-form" onsubmit="return false;">

## Call Sign
<input id="call" type="text" value="" placeholder="Enter station identifier..." style="width: 100%; padding: 8px; border: 1px solid #ccc;">
*Station identification code (3-4 digits recommended)*

## Message Content
<textarea rows="8" name="body" id="body" placeholder="Enter numerical message groups..." style="width: 100%; padding: 8px; border: 1px solid #ccc;"></textarea>

**Protocol:** Space = short pause | _ = long pause | Special: * / + #

## Transmission Mode

<label><input id="mode-voice" type="radio" name="mode" value="voice" checked> Voice Synthesis</label>
<label><input id="mode-morse" type="radio" name="mode" value="morse"> Morse Code</label>

<div id="voice-settings">

### Voice Parameters

**Callsign Repetitions:** <input type="number" id="callsign-reps" value="1" min="1" max="10" style="width: 60px; padding: 4px; border: 1px solid #ccc;">

<label><input type="checkbox" id="achtung-signal"> Achtung Signal</label>

<label><input type="checkbox" id="auto-pause"> Auto Pause</label> <input type="number" id="auto-pause-duration" value="0" min="0" step="50" placeholder="ms" style="width: 80px; padding: 4px; border: 1px solid #ccc;">

### Audio Synthesis

**Speed:** <input type="range" id="speed-control" min="0.5" max="2.0" step="0.1" value="0.5"> <span id="speed-value">0.5x</span>

**Pitch:** <input type="range" id="pitch-control" min="0.5" max="2.0" step="0.1" value="0.5"> <span id="pitch-value">0.5x</span>

</div>

<div id="morse-settings" style="display: none;">

### Morse Parameters

**WPM Rate:** <input type="number" id="morse-wpm" min="5" max="100" value="5" step="1" style="width: 80px; padding: 4px; border: 1px solid #ccc;">

**Tone Frequency:** <input type="number" id="morse-frequency" min="300" max="2000" value="300" step="50" style="width: 100px; padding: 4px; border: 1px solid #ccc;">
</div>

<button type="button" id="generate-btn">Generate Audio</button>
<button type="button" id="play-btn" disabled>Play</button>
<button type="button" id="stop-btn" disabled>Stop</button>
<button type="button" id="download-btn" disabled>Download</button>

</form>

<div id="audio-output"></div>
