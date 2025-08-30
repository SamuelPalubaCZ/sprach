---
layout: default
title: Manual Tones
nav_order: 4
---

<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

## Manual Tone Generator

**Status:** <span id="audio-status">Ready</span> | **Range:** 300-2000Hz



## Numeric Keypad
**Last Played:** <span id="last-played">None</span>

<button onclick="playDigit1()" data-key="1">1 (697Hz)</button>
<button onclick="playDigit2()" data-key="2">2 (770Hz)</button>
<button onclick="playDigit3()" data-key="3">3 (852Hz)</button>

<button onclick="playDigit4()" data-key="4">4 (697Hz)</button>
<button onclick="playDigit5()" data-key="5">5 (770Hz)</button>
<button onclick="playDigit6()" data-key="6">6 (852Hz)</button>

<button onclick="playDigit7()" data-key="7">7 (697Hz)</button>
<button onclick="playDigit8()" data-key="8">8 (770Hz)</button>
<button onclick="playDigit9()" data-key="9">9 (852Hz)</button>

<button onclick="playDigit0()" data-key="0">0 (941Hz)</button>

## Special Signals
**Available:** <span id="signal-count">3 Available</span>

<button onclick="playAchtung()" data-signal="achtung">Achtung (Attention Signal)</button>
<button onclick="playTrennung()" data-signal="trennung">Trennung (Separation Tone)</button>
<button onclick="playEnde()" data-signal="ende">Ende (End Transmission)</button>
