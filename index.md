---
layout: default
title: Home
nav_order: 1
---

<div class="terminal-welcome">
  <div class="boot-sequence">
    <p class="boot-line">STASI_SPEECH_MACHINE v2.0 - INITIALIZING...</p>
    <p class="boot-line">Loading encryption modules... <span class="status-ok">[OK]</span></p>
    <p class="boot-line">Establishing secure connection... <span class="status-ok">[OK]</span></p>
    <p class="boot-line">Audio synthesis engine ready... <span class="status-ok">[OK]</span></p>
    <p class="boot-line">System operational. Welcome, Agent.</p>
  </div>
</div>

<div class="system-overview">
  <h2 class="content-subhead">// CLASSIFIED: NUMBER STATION SIMULATOR</h2>
  
  <div class="mission-brief">
    <p><span class="prompt">MISSION:</span> Deploy covert communication system for encrypted message transmission via synthesized audio broadcasts.</p>
    
    <p><span class="prompt">OBJECTIVE:</span> Convert numerical cipher sequences into spoken digit transmissions with downloadable audio output for field operations.</p>
    
    <p><span class="prompt">STATUS:</span> This system represents a complete reconstruction of the original "Stasi Morse-Speech Generator" with enhanced security protocols and modernized interface architecture.</p>
  </div>
</div>

<div class="capabilities-matrix">
  <h2 class="content-subhead">// SYSTEM CAPABILITIES</h2>
  
  <div class="capability-grid">
    <div class="capability-module">
      <h3>🎙️ AUDIO_SYNTHESIS</h3>
      <p><strong>Function:</strong> Generate WAV audio files from numerical call signs and message bodies</p>
      <p><strong>Output:</strong> High-quality spoken digit sequences for broadcast transmission</p>
      <p><strong>Security:</strong> No metadata retention, immediate playback capability</p>
    </div>
    
    <div class="capability-module">
      <h3>🔐 CIPHER_ENGINE</h3>
      <p><strong>Function:</strong> XOR encryption/decryption with custom key support</p>
      <p><strong>Integration:</strong> Seamless workflow from plaintext to encrypted audio</p>
      <p><strong>Protocol:</strong> Character-code conversion for speakable cipher output</p>
    </div>
    
    <div class="capability-module">
      <h3>📡 MANUAL_TRANSMISSION</h3>
      <p><strong>Function:</strong> Individual tone generation via keypad interface</p>
      <p><strong>Sounds:</strong> Digits 0-9, Achtung, Trennung, Ende signals</p>
      <p><strong>Usage:</strong> Real-time audio testing and manual broadcast control</p>
    </div>
    
    <div class="capability-module">
      <h3>⚡ MORSE_PROTOCOL</h3>
      <p><strong>Function:</strong> International Morse Code generation with customizable timing</p>
      <p><strong>Parameters:</strong> Adjustable WPM, frequency, and character spacing</p>
      <p><strong>Export:</strong> WAV file output for traditional radio transmission</p>
    </div>
  </div>
</div>

<div class="operational-notes">
  <h2 class="content-subhead">// OPERATIONAL SECURITY</h2>
  
  <div class="security-notice">
    <p><span class="warning">⚠️ OPSEC WARNING:</span> All audio generation occurs client-side. No data transmitted to external servers.</p>
    <p><span class="info">ℹ️ COMPATIBILITY:</span> Requires modern browser with Web Audio API support for full functionality.</p>
    <p><span class="info">ℹ️ WORKFLOW:</span> Encrypt → Generate → Download → Broadcast via secure channels</p>
  </div>
</div>

<div class="attribution-block">
  <h2 class="content-subhead">// DEVELOPMENT CREDITS</h2>
  
  <div class="credits">
    <p><span class="role">ORIGINAL_ARCHITECT:</span> <code>tom|hetmer|cz</code></p>
    <p><span class="role">SYSTEM_REBUILD:</span> <code>SamuelPalubaCZ</code></p>
    <p><span class="role">CLASSIFICATION:</span> <code>DECLASSIFIED_FOR_EDUCATIONAL_USE</code></p>
  </div>
</div>

<style>
.terminal-welcome {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--primary-green);
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 30px;
  font-family: var(--terminal-font);
}

.boot-sequence {
  font-size: 14px;
  line-height: 1.8;
}

.boot-line {
  color: var(--text-secondary);
  margin-bottom: 5px;
  animation: typewriter 0.5s ease-in-out;
}

.status-ok {
  color: var(--primary-green);
  font-weight: bold;
}

.system-overview {
  margin-bottom: 30px;
}

.mission-brief p {
  margin-bottom: 15px;
  padding-left: 20px;
  border-left: 2px solid var(--secondary-green);
}

.capability-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.capability-module {
  background: rgba(0, 255, 65, 0.05);
  border: 1px solid var(--terminal-border);
  border-radius: 5px;
  padding: 20px;
  transition: all 0.3s ease;
}

.capability-module:hover {
  border-color: var(--primary-green);
  box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
}

.capability-module h3 {
  color: var(--primary-green);
  margin-bottom: 15px;
  font-size: 1.1em;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.capability-module p {
  font-size: 14px;
  margin-bottom: 10px;
}

.security-notice {
  background: rgba(255, 255, 0, 0.1);
  border: 1px solid var(--warning-yellow);
  border-radius: 5px;
  padding: 15px;
  margin-top: 15px;
}

.security-notice p {
  margin-bottom: 10px;
  font-size: 14px;
}

.warning {
  color: var(--warning-yellow);
  font-weight: bold;
}

.info {
  color: var(--secondary-green);
  font-weight: bold;
}

.credits {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--terminal-border);
  border-radius: 5px;
  padding: 15px;
  margin-top: 15px;
}

.credits p {
  margin-bottom: 8px;
  font-family: var(--terminal-font);
}

.role {
  color: var(--primary-green);
  font-weight: bold;
  text-transform: uppercase;
}

@keyframes typewriter {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>
