---
layout: default
title: Manual Tones
nav_order: 4
---

<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

## // MANUAL TONE GENERATOR

**Status:** <span id="audio-status">READY</span> | **Range:** 300-2000Hz



## 🔢 NUMERIC_KEYPAD
**Last Played:** <span id="last-played">NONE</span>

<button onclick="playSound('1')" data-key="1">1 (697Hz)</button>
<button onclick="playSound('2')" data-key="2">2 (770Hz)</button>
<button onclick="playSound('3')" data-key="3">3 (852Hz)</button>

<button onclick="playSound('4')" data-key="4">4 (941Hz)</button>
<button onclick="playSound('5')" data-key="5">5 (1209Hz)</button>
<button onclick="playSound('6')" data-key="6">6 (1336Hz)</button>

<button onclick="playSound('7')" data-key="7">7 (1477Hz)</button>
<button onclick="playSound('8')" data-key="8">8 (1633Hz)</button>
<button onclick="playSound('9')" data-key="9">9 (1800Hz)</button>

<button onclick="playSound('0')" data-key="0">0 (941Hz)</button>

## 📻 SPECIAL_SIGNALS
**Available:** <span id="signal-count">3 AVAILABLE</span>

<button onclick="playSound('achtung')" data-signal="achtung">⚠️ ACHTUNG (Attention Signal)</button>
<button onclick="playSound('trennung')" data-signal="trennung">✂️ TRENNUNG (Separation Tone)</button>
<button onclick="playSound('ende')" data-signal="ende">🔚 ENDE (End Transmission)</button>

## CONTROLS

**🔊 VOLUME**
<input type="range" id="volume-slider" min="0" max="100" value="75">
<span id="volume-value">75%</span>

**⏱️ DURATION**
<input type="range" id="duration-slider" min="100" max="2000" value="500" step="100">
<span id="duration-value">500ms</span>

## ACTIVITY_MONITOR
<button onclick="clearLog()">CLEAR</button>

<div id="activity-log">
[SYSTEM] Manual tone generator initialized
</div>
