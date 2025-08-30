---
layout: default
title: Transmitter
nav_order: 2
---

<link rel="stylesheet" href="{{ '/assets/css/normal-look.css' | relative_url }}">
<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

<div class="program-section">
    <h2 class="content-subhead">Message Transmitter</h2>
    <form id="speech-form" class="pure-form pure-form-stacked" onsubmit="return false;">
        <fieldset>
            <label for="call">Call Sign</label>
            <input id="call" type="text" value="271">

            <label for="body">Message Body (Numbers only)</label>
            <textarea rows="6" name="body" id="body">846 846 20 20 83167 83167 14528 14528 30778 30778 13436 13436 50234 50234 67256 67256 15654 15654 27414 27414 15837 15837 75251 75251 51820 51820 37982 37982 64162 64162 18385 18385 90381 90381 77942 77942 12692 12692 22897 22897 69231 69231 14881 14881 846 846 20 20 00000</textarea>
            <p style="font-size: 0.9em; color: #666;">Use a space for a short pause, and `_` for a long pause. Special characters: `* / + #`.</p>

            <div class="broadcast-options">
                <div class="option-group">
                    <label for="callsign-reps">Callsign Reps:</label>
                    <input type="number" id="callsign-reps" value="2" min="1" max="10">
                </div>
                <div class="option-group">
                    <label for="achtung-signal"><input type="checkbox" id="achtung-signal" checked> Play 'Achtung'</label>
                </div>
                <div class="option-group">
                    <label for="auto-pause"><input type="checkbox" id="auto-pause" checked> Auto-pause</label>
                    <input type="number" id="auto-pause-duration" value="100" min="0" step="50" style="width: 70px; margin-left: 5px;"> ms
                </div>
            </div>

            <div class="audio-controls">
                <div class="control-group">
                    <label for="speed-control">Speed (0.5-2.0):</label>
                    <input type="number" id="speed-control" min="0.5" max="2.0" value="1.0" step="0.1">
                </div>
                <div class="control-group">
                    <label for="pitch-control">Pitch (0.5-2.0):</label>
                    <input type="number" id="pitch-control" min="0.5" max="2.0" value="1.0" step="0.1">
                </div>
            </div>

            <button type="submit" id="generate-button" class="button-xlarge pure-button">Generate Audio File</button>
        </fieldset>
    </form>
    <div id="audio-output" style="display: none; margin-top: 1em;">
        <h3 style="margin-bottom: 0.5em;">Generated Audio:</h3>
        <audio id="audio-playback" controls style="width: 100%;"></audio>
        <a id="download-link" href="#" download="message.wav" class="pure-button" style="margin-top: 0.5em; display: block; text-align: center;">Download WAV file</a>
    </div>
</div>
