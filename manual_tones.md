---
layout: default
title: Manual Tones
nav_order: 4
---

<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

<div class="tone-generator-console">
    <div class="console-header">
        <h2 class="content-subhead">// MANUAL TONE GENERATOR</h2>
        <div class="generator-status">
            <span class="audio-status" id="audio-status">READY</span>
            <span class="frequency-range">RANGE: 300-2000Hz</span>
        </div>
 </div>

 <style>
 .tone-generator-console {
     background: rgba(0, 20, 0, 0.95);
     border: 2px solid #00ff00;
     border-radius: 10px;
     padding: 25px;
     margin: 20px 0;
     box-shadow: 0 0 30px rgba(0, 255, 0, 0.4);
 }

 .console-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 25px;
     padding-bottom: 15px;
     border-bottom: 2px solid #00ff00;
 }

 .console-header h2 {
     color: #00ff00;
     font-family: 'Fira Code', monospace;
     font-size: 1.6em;
     margin: 0;
     text-shadow: 0 0 15px rgba(0, 255, 0, 0.6);
     letter-spacing: 2px;
 }

 .generator-status {
     display: flex;
     gap: 20px;
     align-items: center;
 }

 .audio-status {
     background: #00ff00;
     color: #000;
     padding: 6px 12px;
     border-radius: 4px;
     font-family: 'Fira Code', monospace;
     font-size: 0.85em;
     font-weight: bold;
     animation: statusPulse 2s infinite;
 }

 @keyframes statusPulse {
     0%, 100% { box-shadow: 0 0 5px rgba(0, 255, 0, 0.5); }
     50% { box-shadow: 0 0 20px rgba(0, 255, 0, 0.8); }
 }

 .frequency-range {
     color: #00ffff;
     font-family: 'Fira Code', monospace;
     font-size: 0.9em;
     border: 1px solid #00ffff;
     padding: 4px 8px;
     border-radius: 4px;
 }

 .tone-interface {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 30px;
     margin-bottom: 25px;
 }

 .keypad-terminal, .special-controls {
     display: flex;
     flex-direction: column;
     gap: 20px;
 }

 .terminal-section {
     background: rgba(0, 0, 0, 0.7);
     border: 1px solid #444;
     border-radius: 8px;
     padding: 20px;
 }

 .section-header {
     display: flex;
     align-items: center;
     justify-content: space-between;
     margin-bottom: 15px;
     padding-bottom: 10px;
     border-bottom: 1px solid #333;
 }

 .section-icon {
     font-size: 1.3em;
 }

 .section-title {
     color: #00ffff;
     font-family: 'Fira Code', monospace;
     font-size: 1em;
     font-weight: bold;
     flex: 1;
     margin-left: 10px;
 }

 .last-played, .signal-count {
     color: #888;
     font-family: 'Fira Code', monospace;
     font-size: 0.8em;
 }

 .keypad-grid {
     display: grid;
     grid-template-columns: repeat(3, 1fr);
     gap: 12px;
     margin-bottom: 10px;
 }

 .keypad-btn {
     background: rgba(0, 0, 0, 0.8);
     border: 2px solid #00ff00;
     color: #00ff00;
     font-family: 'Fira Code', monospace;
     padding: 20px;
     border-radius: 8px;
     cursor: pointer;
     display: flex;
     flex-direction: column;
     align-items: center;
     gap: 6px;
     transition: all 0.3s;
     position: relative;
     overflow: hidden;
 }

 .keypad-btn:hover {
     background: rgba(0, 255, 0, 0.1);
     box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
     transform: translateY(-2px);
 }

 .keypad-btn:active {
     transform: translateY(0);
     box-shadow: 0 0 30px rgba(0, 255, 0, 0.6);
 }

 .keypad-btn.zero {
     grid-column: 2;
 }

 .key-number {
     font-size: 1.8em;
     font-weight: bold;
 }

 .key-freq {
     font-size: 0.7em;
     color: #888;
 }

 .special-grid {
     display: flex;
     flex-direction: column;
     gap: 15px;
 }

 .special-btn {
     background: rgba(0, 0, 0, 0.8);
     border: 2px solid #ff6b6b;
     color: #ff6b6b;
     font-family: 'Fira Code', monospace;
     padding: 15px 20px;
     border-radius: 8px;
     cursor: pointer;
     display: flex;
     align-items: center;
     gap: 15px;
     transition: all 0.3s;
     position: relative;
 }

 .special-btn:hover {
     background: rgba(255, 107, 107, 0.1);
     box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
     transform: translateX(5px);
 }

 .special-btn.trennung {
     border-color: #ffa500;
     color: #ffa500;
 }

 .special-btn.trennung:hover {
     background: rgba(255, 165, 0, 0.1);
     box-shadow: 0 0 20px rgba(255, 165, 0, 0.4);
 }

 .special-btn.ende {
     border-color: #4ecdc4;
     color: #4ecdc4;
 }

 .special-btn.ende:hover {
     background: rgba(78, 205, 196, 0.1);
     box-shadow: 0 0 20px rgba(78, 205, 196, 0.4);
 }

 .signal-icon {
     font-size: 1.5em;
 }

 .signal-name {
     font-size: 1em;
     font-weight: bold;
     flex: 1;
 }

 .signal-desc {
     font-size: 0.8em;
     color: #888;
 }

 .control-panel {
     background: rgba(0, 0, 0, 0.5);
     border: 1px solid #333;
     border-radius: 8px;
     padding: 20px;
     display: flex;
     flex-direction: column;
     gap: 20px;
 }

 .volume-control, .tone-duration {
     display: flex;
     flex-direction: column;
     gap: 10px;
 }

 .control-label {
     color: #00ffff;
     font-family: 'Fira Code', monospace;
     font-size: 0.9em;
     font-weight: bold;
     display: flex;
     align-items: center;
     gap: 8px;
 }

 .control-icon {
     font-size: 1.1em;
 }

 .slider-container {
     display: flex;
     align-items: center;
     gap: 15px;
 }

 .control-slider {
     flex: 1;
     height: 6px;
     background: rgba(0, 0, 0, 0.8);
     border-radius: 3px;
     outline: none;
     -webkit-appearance: none;
 }

 .control-slider::-webkit-slider-thumb {
     -webkit-appearance: none;
     width: 18px;
     height: 18px;
     background: #00ff00;
     border-radius: 50%;
     cursor: pointer;
     box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
 }

 .slider-value {
     color: #00ff00;
     font-family: 'Fira Code', monospace;
     font-size: 0.9em;
     min-width: 50px;
     text-align: center;
 }

 .activity-monitor {
     background: rgba(0, 0, 0, 0.7);
     border: 1px solid #444;
     border-radius: 8px;
     padding: 20px;
 }

 .monitor-header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 15px;
     padding-bottom: 10px;
     border-bottom: 1px solid #333;
 }

 .monitor-title {
     color: #00ffff;
     font-family: 'Fira Code', monospace;
     font-size: 1em;
     margin: 0;
     text-transform: uppercase;
 }

 .clear-btn {
     background: rgba(255, 0, 0, 0.2);
     border: 1px solid #ff4444;
     color: #ff4444;
     font-family: 'Fira Code', monospace;
     padding: 4px 8px;
     border-radius: 4px;
     cursor: pointer;
     font-size: 0.8em;
     transition: all 0.3s;
 }

 .clear-btn:hover {
     background: rgba(255, 0, 0, 0.3);
     box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
 }

 .activity-content {
     max-height: 150px;
     overflow-y: auto;
     font-family: 'Fira Code', monospace;
     font-size: 0.85em;
 }

 .log-entry {
     display: flex;
     gap: 10px;
     padding: 6px 0;
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

 /* Button press animation */
 @keyframes buttonPress {
     0% { transform: scale(1); }
     50% { transform: scale(0.95); }
     100% { transform: scale(1); }
 }

 .keypad-btn:active, .special-btn:active {
     animation: buttonPress 0.1s;
 }

 /* Responsive design */
 @media (max-width: 1024px) {
     .tone-interface {
         grid-template-columns: 1fr;
         gap: 20px;
     }
 }

 @media (max-width: 768px) {
     .tone-generator-console {
         padding: 15px;
         margin: 10px 0;
     }
     
     .console-header {
         flex-direction: column;
         gap: 15px;
         align-items: flex-start;
     }
     
     .generator-status {
         flex-direction: column;
         gap: 10px;
         align-items: flex-start;
     }
     
     .keypad-grid {
         grid-template-columns: repeat(2, 1fr);
     }
     
     .keypad-btn.zero {
         grid-column: span 2;
     }
 }
 </style>

    <div class="tone-interface">
        <div class="keypad-terminal">
            <div class="terminal-section">
                <div class="section-header">
                    <span class="section-icon">🔢</span>
                    <span class="section-title">NUMERIC_KEYPAD</span>
                    <span class="last-played" id="last-played">NONE</span>
                </div>
                
                <div class="keypad-grid">
                    <button onclick="playSound('1')" class="keypad-btn" data-key="1">
                        <span class="key-number">1</span>
                        <span class="key-freq">697Hz</span>
                    </button>
                    <button onclick="playSound('2')" class="keypad-btn" data-key="2">
                        <span class="key-number">2</span>
                        <span class="key-freq">770Hz</span>
                    </button>
                    <button onclick="playSound('3')" class="keypad-btn" data-key="3">
                        <span class="key-number">3</span>
                        <span class="key-freq">852Hz</span>
                    </button>
                    <button onclick="playSound('4')" class="keypad-btn" data-key="4">
                        <span class="key-number">4</span>
                        <span class="key-freq">941Hz</span>
                    </button>
                    <button onclick="playSound('5')" class="keypad-btn" data-key="5">
                        <span class="key-number">5</span>
                        <span class="key-freq">1209Hz</span>
                    </button>
                    <button onclick="playSound('6')" class="keypad-btn" data-key="6">
                        <span class="key-number">6</span>
                        <span class="key-freq">1336Hz</span>
                    </button>
                    <button onclick="playSound('7')" class="keypad-btn" data-key="7">
                        <span class="key-number">7</span>
                        <span class="key-freq">1477Hz</span>
                    </button>
                    <button onclick="playSound('8')" class="keypad-btn" data-key="8">
                        <span class="key-number">8</span>
                        <span class="key-freq">1633Hz</span>
                    </button>
                    <button onclick="playSound('9')" class="keypad-btn" data-key="9">
                        <span class="key-number">9</span>
                        <span class="key-freq">1800Hz</span>
                    </button>
                    <button onclick="playSound('0')" class="keypad-btn zero" data-key="0">
                        <span class="key-number">0</span>
                        <span class="key-freq">941Hz</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="special-controls">
            <div class="terminal-section">
                <div class="section-header">
                    <span class="section-icon">📻</span>
                    <span class="section-title">SPECIAL_SIGNALS</span>
                    <span class="signal-count" id="signal-count">3 AVAILABLE</span>
                </div>
                
                <div class="special-grid">
                    <button onclick="playSound('achtung')" class="special-btn achtung" data-signal="achtung">
                        <span class="signal-icon">⚠️</span>
                        <span class="signal-name">ACHTUNG</span>
                        <span class="signal-desc">Attention Signal</span>
                    </button>
                    
                    <button onclick="playSound('trennung')" class="special-btn trennung" data-signal="trennung">
                        <span class="signal-icon">✂️</span>
                        <span class="signal-name">TRENNUNG</span>
                        <span class="signal-desc">Separation Tone</span>
                    </button>
                    
                    <button onclick="playSound('ende')" class="special-btn ende" data-signal="ende">
                        <span class="signal-icon">🔚</span>
                        <span class="signal-name">ENDE</span>
                        <span class="signal-desc">End Transmission</span>
                    </button>
                </div>
            </div>
            
            <div class="control-panel">
                <div class="volume-control">
                    <label class="control-label">
                        <span class="control-icon">🔊</span>
                        VOLUME
                    </label>
                    <div class="slider-container">
                        <input type="range" id="volume-slider" min="0" max="100" value="75" class="control-slider">
                        <span id="volume-value" class="slider-value">75%</span>
                    </div>
                </div>
                
                <div class="tone-duration">
                    <label class="control-label">
                        <span class="control-icon">⏱️</span>
                        DURATION
                    </label>
                    <div class="slider-container">
                        <input type="range" id="duration-slider" min="100" max="2000" value="500" step="100" class="control-slider">
                        <span id="duration-value" class="slider-value">500ms</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="activity-monitor">
        <div class="monitor-header">
            <h3 class="monitor-title">ACTIVITY_MONITOR</h3>
            <button onclick="clearLog()" class="clear-btn">CLEAR</button>
        </div>
        <div id="activity-log" class="activity-content">
            <div class="log-entry">
                <span class="log-time">[SYSTEM]</span>
                <span class="log-message">Manual tone generator initialized</span>
            </div>
        </div>
    </div>
</div>
