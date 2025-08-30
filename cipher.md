---
layout: default
title: Cipher
nav_order: 3
---

<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

<div class="crypto-terminal">
    <div class="terminal-header">
        <h2 class="content-subhead">// CRYPTOGRAPHIC INTERFACE</h2>
        <div class="crypto-status">
            <span class="encryption-level">LEVEL: XOR-256</span>
            <span class="security-indicator" id="security-status">SECURE</span>
        </div>
 </div>

 <style>
 .crypto-terminal {
     background: rgba(0, 20, 0, 0.95);
     border: 2px solid #00ff00;
     border-radius: 10px;
     padding: 25px;
     margin: 20px 0;
     box-shadow: 0 0 30px rgba(0, 255, 0, 0.4);
     position: relative;
 }

 .crypto-terminal::before {
     content: '';
     position: absolute;
     top: -2px;
     left: -2px;
     right: -2px;
     bottom: -2px;
     background: linear-gradient(45deg, #00ff00, #00ffff, #00ff00);
     border-radius: 10px;
     z-index: -1;
     animation: borderGlow 3s ease-in-out infinite alternate;
 }

 @keyframes borderGlow {
     0% { opacity: 0.5; }
     100% { opacity: 1; }
 }

 .terminal-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 25px;
     padding-bottom: 15px;
     border-bottom: 2px solid #00ff00;
 }

 .terminal-header h2 {
     color: #00ff00;
     font-family: 'Fira Code', monospace;
     font-size: 1.6em;
     margin: 0;
     text-shadow: 0 0 15px rgba(0, 255, 0, 0.6);
     letter-spacing: 2px;
 }

 .crypto-status {
     display: flex;
     gap: 20px;
     align-items: center;
 }

 .encryption-level {
     background: rgba(0, 255, 255, 0.2);
     color: #00ffff;
     padding: 6px 12px;
     border-radius: 4px;
     font-family: 'Fira Code', monospace;
     font-size: 0.85em;
     font-weight: bold;
     border: 1px solid #00ffff;
 }

 .security-indicator {
     background: #00ff00;
     color: #000;
     padding: 6px 12px;
     border-radius: 4px;
     font-family: 'Fira Code', monospace;
     font-size: 0.85em;
     font-weight: bold;
     animation: securityPulse 2s infinite;
 }

 @keyframes securityPulse {
     0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5); }
     50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.8); }
 }

 .crypto-workspace {
     display: grid;
     grid-template-columns: 1fr auto 1fr;
     gap: 25px;
     margin-bottom: 25px;
 }

 .input-terminal, .output-terminal {
     display: flex;
     flex-direction: column;
     gap: 20px;
 }

 .terminal-section {
     background: rgba(0, 0, 0, 0.7);
     border: 1px solid #444;
     border-radius: 8px;
     padding: 15px;
 }

 .section-header {
     display: flex;
     align-items: center;
     justify-content: space-between;
     margin-bottom: 12px;
     padding-bottom: 8px;
     border-bottom: 1px solid #333;
 }

 .section-icon {
     font-size: 1.2em;
 }

 .section-title {
     color: #00ffff;
     font-family: 'Fira Code', monospace;
     font-size: 0.9em;
     font-weight: bold;
     flex: 1;
     margin-left: 10px;
 }

 .char-counter {
     color: #888;
     font-family: 'Fira Code', monospace;
     font-size: 0.8em;
 }

 .crypto-textarea {
     width: 100%;
     background: rgba(0, 0, 0, 0.9);
     border: 1px solid #00ff00;
     color: #00ff00;
     font-family: 'Fira Code', monospace;
     padding: 15px;
     border-radius: 6px;
     font-size: 0.9em;
     line-height: 1.4;
     resize: vertical;
     min-height: 120px;
 }

 .crypto-textarea:focus {
     outline: none;
     border-color: #00ffff;
     box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
 }

 .key-section {
     background: rgba(0, 0, 0, 0.7);
     border: 1px solid #444;
     border-radius: 8px;
     padding: 15px;
 }

 .key-generator {
     background: rgba(255, 165, 0, 0.2);
     border: 1px solid #ffa500;
     color: #ffa500;
     font-family: 'Fira Code', monospace;
     padding: 4px 8px;
     border-radius: 4px;
     cursor: pointer;
     font-size: 0.75em;
     font-weight: bold;
     transition: all 0.3s;
 }

 .key-generator:hover {
     background: rgba(255, 165, 0, 0.3);
     box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
 }

 .crypto-input {
     width: 100%;
     background: rgba(0, 0, 0, 0.9);
     border: 1px solid #00ff00;
     color: #00ff00;
     font-family: 'Fira Code', monospace;
     padding: 12px;
     border-radius: 6px;
     font-size: 0.9em;
     margin-bottom: 15px;
 }

 .crypto-input:focus {
     outline: none;
     border-color: #00ffff;
     box-shadow: 0 0 15px rgba(0, 255, 255, 0.4);
 }

 .key-strength {
     display: flex;
     align-items: center;
     gap: 10px;
 }

 .strength-label {
     color: #888;
     font-family: 'Fira Code', monospace;
     font-size: 0.8em;
     min-width: 100px;
 }

 .strength-bar {
     flex: 1;
     height: 6px;
     background: rgba(0, 0, 0, 0.8);
     border-radius: 3px;
     overflow: hidden;
 }

 .strength-fill {
     height: 100%;
     background: linear-gradient(90deg, #ff4444, #ffaa00, #00ff00);
     width: 0%;
     transition: width 0.3s;
 }

 .strength-text {
     color: #ff4444;
     font-family: 'Fira Code', monospace;
     font-size: 0.8em;
     font-weight: bold;
     min-width: 60px;
 }

 .crypto-controls {
     display: flex;
     flex-direction: column;
     gap: 20px;
     align-items: center;
     justify-content: center;
     padding: 20px;
 }

 .operation-panel {
     display: flex;
     flex-direction: column;
     gap: 15px;
     align-items: center;
 }

 .crypto-btn {
     background: rgba(0, 0, 0, 0.8);
     border: 2px solid #00ff00;
     color: #00ff00;
     font-family: 'Fira Code', monospace;
     padding: 15px 25px;
     border-radius: 8px;
     cursor: pointer;
     display: flex;
     flex-direction: column;
     align-items: center;
     gap: 8px;
     font-size: 0.9em;
     font-weight: bold;
     transition: all 0.3s;
     text-transform: uppercase;
     min-width: 140px;
 }

 .crypto-btn:hover {
     background: rgba(0, 255, 0, 0.1);
     box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
     transform: translateY(-3px);
 }

 .encrypt-btn {
     border-color: #ff6b6b;
     color: #ff6b6b;
 }

 .encrypt-btn:hover {
     background: rgba(255, 107, 107, 0.1);
     box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
 }

 .decrypt-btn {
     border-color: #4ecdc4;
     color: #4ecdc4;
 }

 .decrypt-btn:hover {
     background: rgba(78, 205, 196, 0.1);
     box-shadow: 0 0 20px rgba(78, 205, 196, 0.4);
 }

 .btn-icon {
     font-size: 1.5em;
 }

 .btn-text {
     font-size: 0.9em;
 }

 .btn-shortcut {
     font-size: 0.7em;
     color: #888;
 }

 .operation-divider {
     width: 2px;
     height: 40px;
     background: linear-gradient(to bottom, transparent, #00ff00, transparent);
     margin: 10px 0;
 }

 .utility-panel {
     display: flex;
     gap: 10px;
 }

 .utility-btn {
     background: rgba(0, 0, 0, 0.6);
     border: 1px solid #666;
     color: #888;
     font-family: 'Fira Code', monospace;
     padding: 8px 12px;
     border-radius: 4px;
     cursor: pointer;
     display: flex;
     align-items: center;
     gap: 6px;
     font-size: 0.8em;
     transition: all 0.3s;
 }

 .utility-btn:hover {
     border-color: #00ff00;
     color: #00ff00;
     background: rgba(0, 255, 0, 0.1);
 }

 .crypto-info {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 25px;
     margin-top: 25px;
     padding-top: 25px;
     border-top: 1px solid #333;
 }

 .info-panel, .operation-log {
     background: rgba(0, 0, 0, 0.5);
     border: 1px solid #333;
     border-radius: 8px;
     padding: 20px;
 }

 .info-title {
     color: #00ffff;
     font-family: 'Fira Code', monospace;
     font-size: 1em;
     margin: 0 0 15px 0;
     text-transform: uppercase;
     border-bottom: 1px solid #333;
     padding-bottom: 8px;
 }

 .spec-grid {
     display: grid;
     gap: 12px;
 }

 .spec-item {
     display: flex;
     justify-content: space-between;
     align-items: center;
     padding: 8px 0;
     border-bottom: 1px solid #222;
 }

 .spec-label {
     color: #888;
     font-family: 'Fira Code', monospace;
     font-size: 0.85em;
 }

 .spec-value {
     color: #00ff00;
     font-family: 'Fira Code', monospace;
     font-size: 0.85em;
     font-weight: bold;
 }

 .log-content {
     max-height: 200px;
     overflow-y: auto;
     font-family: 'Fira Code', monospace;
     font-size: 0.8em;
 }

 .log-entry {
     display: flex;
     gap: 10px;
     padding: 4px 0;
     border-bottom: 1px solid #222;
 }

 .log-time {
     color: #666;
     min-width: 80px;
 }

 .log-message {
     color: #00ff00;
     flex: 1;
 }

 /* Responsive design */
 @media (max-width: 1024px) {
     .crypto-workspace {
         grid-template-columns: 1fr;
         gap: 20px;
     }
     
     .crypto-controls {
         order: 2;
     }
     
     .crypto-info {
         grid-template-columns: 1fr;
     }
 }

 @media (max-width: 768px) {
     .crypto-terminal {
         padding: 15px;
         margin: 10px 0;
     }
     
     .terminal-header {
         flex-direction: column;
         gap: 15px;
         align-items: flex-start;
     }
     
     .crypto-status {
         flex-direction: column;
         gap: 10px;
         align-items: flex-start;
     }
     
     .utility-panel {
         flex-wrap: wrap;
         justify-content: center;
     }
 }
 </style>

    <div class="crypto-workspace">
        <div class="input-terminal">
            <div class="terminal-section">
                <div class="section-header">
                    <span class="section-icon">📝</span>
                    <span class="section-title">PLAINTEXT_INPUT</span>
                    <span class="char-counter" id="plain-counter">0 chars</span>
                </div>
                <textarea id="plaintext" class="crypto-textarea" rows="8" placeholder="> Enter your classified message here...
> Use any characters, symbols, or numbers
> Message will be encrypted using XOR cipher"></textarea>
            </div>

            <div class="key-section">
                <div class="section-header">
                    <span class="section-icon">🔑</span>
                    <span class="section-title">ENCRYPTION_KEY</span>
                    <button class="key-generator" onclick="generateRandomKey()">GENERATE</button>
                </div>
                <input type="text" id="key" class="crypto-input" placeholder="Enter encryption key or generate random...">
                <div class="key-strength">
                    <span class="strength-label">KEY STRENGTH:</span>
                    <div class="strength-bar">
                        <div class="strength-fill" id="key-strength"></div>
                    </div>
                    <span class="strength-text" id="strength-text">WEAK</span>
                </div>
            </div>
        </div>

        <div class="crypto-controls">
            <div class="operation-panel">
                <button onclick="encryptText()" class="crypto-btn encrypt-btn">
                    <span class="btn-icon">🔒</span>
                    <span class="btn-text">ENCRYPT</span>
                    <span class="btn-shortcut">CTRL+E</span>
                </button>
                
                <div class="operation-divider"></div>
                
                <button onclick="decryptText()" class="crypto-btn decrypt-btn">
                    <span class="btn-icon">🔓</span>
                    <span class="btn-text">DECRYPT</span>
                    <span class="btn-shortcut">CTRL+D</span>
                </button>
            </div>
            
            <div class="utility-panel">
                <button onclick="clearAll()" class="utility-btn">
                    <span class="btn-icon">🗑️</span>
                    CLEAR
                </button>
                <button onclick="swapTexts()" class="utility-btn">
                    <span class="btn-icon">🔄</span>
                    SWAP
                </button>
                <button onclick="copyResult()" class="utility-btn">
                    <span class="btn-icon">📋</span>
                    COPY
                </button>
            </div>
        </div>

        <div class="output-terminal">
            <div class="terminal-section">
                <div class="section-header">
                    <span class="section-icon">🔐</span>
                    <span class="section-title">CIPHERTEXT_OUTPUT</span>
                    <span class="char-counter" id="cipher-counter">0 chars</span>
                </div>
                <textarea id="ciphertext" class="crypto-textarea" rows="8" placeholder="> Encrypted/decrypted text will appear here...
> Copy the result or use SWAP to reverse operation
> All operations are performed locally"></textarea>
            </div>
        </div>
    </div>

    <div class="crypto-info">
        <div class="info-panel">
            <h3 class="info-title">CIPHER_SPECIFICATIONS</h3>
            <div class="spec-grid">
                <div class="spec-item">
                    <span class="spec-label">ALGORITHM:</span>
                    <span class="spec-value">XOR (Exclusive OR)</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">KEY_TYPE:</span>
                    <span class="spec-value">Variable Length</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">SECURITY:</span>
                    <span class="spec-value">Symmetric Encryption</span>
                </div>
                <div class="spec-item">
                    <span class="spec-label">REVERSIBLE:</span>
                    <span class="spec-value">Yes (Same Key)</span>
                </div>
            </div>
        </div>
        
        <div class="operation-log">
            <h3 class="info-title">OPERATION_LOG</h3>
            <div id="log-output" class="log-content">
                <div class="log-entry">
                    <span class="log-time">[SYSTEM]</span>
                    <span class="log-message">Cryptographic interface initialized</span>
                </div>
            </div>
        </div>
    </div>
</div>
