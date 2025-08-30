---
layout: default
title: Cipher
nav_order: 3
---

<div class="control-panel">
    <div class="panel-header">
        <h2 class="panel-title">Enhanced Cipher System</h2>
        <div class="panel-status">
            <span id="cipher-status">Cryptographic tools ready</span>
        </div>
    </div>

    <div class="settings-grid">
        <!-- Cipher Mode Selection -->
        <div class="settings-section">
            <div class="settings-header">Cipher Method</div>
            
            <div class="mode-selector">
                <button type="button" class="mode-option active" data-mode="xor">XOR Cipher</button>
                <button type="button" class="mode-option" data-mode="otp">One-Time Pad</button>
                <button type="button" class="mode-option" data-mode="book">Message Book</button>
            </div>

            <div class="form-group mt-md">
                <label class="form-label">Security Level</label>
                <select id="security-level" class="form-select">
                    <option value="demonstration">Demonstration (XOR)</option>
                    <option value="training">Training Exercise</option>
                    <option value="operational" selected>Operational Security (OTP)</option>
                    <option value="maximum">Maximum Security</option>
                </select>
            </div>
        </div>

        <!-- Historical Context -->
        <div class="settings-section">
            <div class="settings-header">Historical Context</div>
            
            <div class="form-group">
                <label class="form-label">Agency Profile</label>
                <select id="agency-profile" class="form-select">
                    <option value="stasi">Stasi (East German)</option>
                    <option value="kgb">KGB (Soviet)</option>
                    <option value="cia">CIA (American)</option>
                    <option value="mi6">MI6 (British)</option>
                    <option value="dgse">DGSE (French)</option>
                </select>
            </div>

            <div class="form-group">
                <label for="authentic-format">
                    <input type="checkbox" id="authentic-format" checked> Use Authentic Number Station Format
                </label>
            </div>
        </div>
    </div>

    <form class="mt-xl" onsubmit="return false;">
        <!-- Message Input -->
        <div class="form-group">
            <label class="form-label" for="plain-text">Plaintext Message</label>
            <textarea id="plain-text" rows="4" class="form-textarea" placeholder="Enter your secret message here..."></textarea>
            <small class="text-secondary">Original message to be encrypted</small>
        </div>

        <!-- Key Management -->
        <div class="settings-grid">
            <!-- XOR Controls -->
            <div id="xor-controls" class="settings-section">
                <div class="settings-header">XOR Cipher Key</div>
                
                <div class="form-group">
                    <label class="form-label" for="cipher-key">Cipher Key</label>
                    <input type="text" id="cipher-key" class="form-input" value="STASI" placeholder="Enter encryption key">
                    <small class="text-secondary">Simple key for XOR encryption (demonstration only)</small>
                </div>

                <div class="form-group">
                    <button type="button" id="generate-random-key" class="btn">Generate Random Key</button>
                </div>
            </div>

            <!-- OTP Controls -->
            <div id="otp-controls" style="display: none;" class="settings-section">
                <div class="settings-header">One-Time Pad Management</div>
                
                <div class="form-group">
                    <label class="form-label">Available Pads</label>
                    <select id="pad-selector" class="form-select">
                        <option value="">Select a pad...</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="new-pad-name">New Pad Name</label>
                    <input type="text" id="new-pad-name" class="form-input" placeholder="Enter pad name">
                    <button type="button" id="create-pad-btn" class="btn btn-primary mt-sm">Create New Pad</button>
                </div>

                <div class="form-group">
                    <label class="form-label" for="pad-length">Pad Length (bytes)</label>
                    <input type="number" id="pad-length" class="form-input" value="256" min="64" max="2048">
                    <small class="text-secondary">Larger pads provide more security</small>
                </div>

                <div class="form-group">
                    <label class="form-label" for="pad-offset">Pad Offset</label>
                    <input type="number" id="pad-offset" class="form-input" value="0" min="0">
                    <small class="text-secondary">Starting position in pad (0-based)</small>
                </div>

                <div id="pad-info" class="mt-md">
                    <p class="text-center text-secondary">No pad selected</p>
                </div>
            </div>
        </div>

        <!-- Cipher Operations -->
        <div class="mt-lg text-center">
            <button type="button" id="encrypt-button" class="btn btn-primary btn-large">
                Encrypt Message
            </button>
            
            <button type="button" id="decrypt-button" class="btn btn-large">
                Decrypt Message
            </button>
        </div>

        <!-- Output -->
        <div class="form-group mt-xl">
            <label class="form-label" for="cipher-text">Encrypted Output / Ciphertext</label>
            <textarea id="cipher-text" rows="4" class="form-textarea" placeholder="Encrypted message will appear here..."></textarea>
            <small class="text-secondary">Encrypted message as character codes (ready for transmission)</small>
        </div>

        <!-- Action Buttons -->
        <div class="mt-lg text-center">
            <button type="button" id="copy-to-body-button" class="btn">Copy to Message Body</button>
            <button type="button" id="copy-to-clipboard-button" class="btn">Copy to Clipboard</button>
            
            <div class="mt-md">
                <button type="button" id="generate-message-book" class="btn btn-primary">Generate Message Book Entry</button>
                <button type="button" id="decode-message-book" class="btn">Decode Message Book Entry</button>
            </div>
        </div>
    </form>
</div>

<!-- Message Book Generator -->
<div class="control-panel">
    <div class="panel-header">
        <h3 class="panel-title">Message Book Generator</h3>
        <div class="panel-status">
            <span>Authentic Cold War format</span>
        </div>
    </div>

    <div class="settings-grid">
        <div class="settings-section">
            <div class="settings-header">Message Format</div>
            
            <div class="form-group">
                <label class="form-label" for="msg-call-sign">Call Sign</label>
                <input type="text" id="msg-call-sign" class="form-input" value="271" placeholder="271">
            </div>

            <div class="form-group">
                <label class="form-label" for="group-size">Number Group Size</label>
                <select id="group-size" class="form-select">
                    <option value="4">4-digit groups</option>
                    <option value="5" selected>5-digit groups (standard)</option>
                    <option value="6">6-digit groups</option>
                </select>
            </div>

            <div class="form-group">
                <label for="repeat-groups">
                    <input type="checkbox" id="repeat-groups" checked> Repeat each group twice
                </label>
            </div>

            <div class="form-group">
                <label for="include-null-groups">
                    <input type="checkbox" id="include-null-groups" checked> Include null groups (00000)
                </label>
            </div>
        </div>

        <div class="settings-section">
            <div class="settings-header">Transmission Profile</div>
            
            <div class="form-group">
                <label class="form-label">Station Type</label>
                <select id="station-type" class="form-select">
                    <option value="lincolnshire-poacher">Lincolnshire Poacher (UK)</option>
                    <option value="swedish-rhapsody">Swedish Rhapsody (Poland/Stasi)</option>
                    <option value="cherry-ripe">Cherry Ripe (UK)</option>
                    <option value="cuban-v02">Cuban V02 (Cuba)</option>
                    <option value="russian-man">Russian Man (USSR)</option>
                    <option value="german-lady" selected>German Lady (Stasi)</option>
                </select>
            </div>

            <div class="form-group">
                <label for="add-preamble">
                    <input type="checkbox" id="add-preamble" checked> Add station preamble
                </label>
            </div>

            <div class="form-group">
                <label for="add-postamble">
                    <input type="checkbox" id="add-postamble" checked> Add end-of-message signal
                </label>
            </div>
        </div>
    </div>

    <div class="mt-lg">
        <div class="form-group">
            <label class="form-label">Generated Message Book Entry</label>
            <textarea id="message-book-output" rows="8" class="form-textarea" readonly placeholder="Generated message book entry will appear here..."></textarea>
        </div>

        <div class="text-center mt-md">
            <button type="button" id="export-message-book" class="btn btn-primary">Export Message Book Page</button>
            <button type="button" id="print-message-book" class="btn">Print Message Book</button>
        </div>
    </div>
</div>

<!-- Cryptanalysis Tools -->
<div class="control-panel">
    <div class="panel-header">
        <h3 class="panel-title">Cryptanalysis Tools</h3>
        <div class="panel-status">
            <span>Educational analysis tools</span>
        </div>
    </div>

    <div class="settings-grid">
        <div class="settings-section">
            <div class="settings-header">Frequency Analysis</div>
            
            <div class="form-group">
                <button type="button" id="analyze-frequency" class="btn">Analyze Character Frequency</button>
            </div>

            <div id="frequency-chart" class="mt-md">
                <!-- Frequency analysis results -->
            </div>
        </div>

        <div class="settings-section">
            <div class="settings-header">Pattern Analysis</div>
            
            <div class="form-group">
                <button type="button" id="find-patterns" class="btn">Find Repeating Patterns</button>
            </div>

            <div class="form-group">
                <button type="button" id="calculate-entropy" class="btn">Calculate Message Entropy</button>
            </div>

            <div id="analysis-results" class="mt-md">
                <!-- Analysis results -->
            </div>
        </div>
    </div>

    <div class="form-group">
        <label class="form-label">Analysis Input</label>
        <textarea id="analysis-input" rows="4" class="form-textarea" placeholder="Paste ciphertext or numbers for analysis..."></textarea>
    </div>

    <div id="security-assessment" class="mt-lg">
        <div class="panel-header">
            <h4 class="panel-title">Security Assessment</h4>
        </div>
        <div id="security-results">
            <p class="text-secondary">Perform analysis to see security assessment</p>
        </div>
    </div>
</div>

<!-- Educational Information -->
<div class="control-panel">
    <div class="panel-header">
        <h3 class="panel-title">Historical Information</h3>
        <div class="panel-status">
            <span>Cold War cryptography</span>
        </div>
    </div>

    <div class="settings-grid">
        <div class="settings-section">
            <div class="settings-header">One-Time Pad History</div>
            <div class="historical-content">
                <p><strong>The Unbreakable Cipher:</strong> One-time pads were the gold standard of Cold War espionage. When used correctly, they provide perfect security - mathematically unbreakable.</p>
                
                <p><strong>Stasi Usage:</strong> The East German Stasi used OTP extensively for their numbers stations, including the famous "Swedish Rhapsody" transmissions that used the Sprach-Morse-Generator device.</p>
                
                <p><strong>Key Requirements:</strong></p>
                <ul>
                    <li>Key must be truly random</li>
                    <li>Key must be as long as the message</li>
                    <li>Key must be used only once</li>
                    <li>Key must be kept completely secret</li>
                </ul>
            </div>
        </div>

        <div class="settings-section">
            <div class="settings-header">Numbers Station Operations</div>
            <div class="historical-content">
                <p><strong>Message Format:</strong> Numbers stations typically broadcast in 5-digit groups, repeated twice for reliability. The format usually included:</p>
                
                <ol>
                    <li>Attention signal ("Achtung")</li>
                    <li>Call sign (repeated)</li>
                    <li>Message body in number groups</li>
                    <li>End signal</li>
                </ol>
                
                <p><strong>Cold War Context:</strong> These transmissions were used to communicate with deep-cover agents who had no other secure means of communication. The Stasi Sprach-Morse-Generator could broadcast both voice and Morse transmissions.</p>
            </div>
        </div>
    </div>
</div>

<style>
.historical-content {
    font-size: 0.9rem;
    line-height: 1.6;
}

.historical-content ul, .historical-content ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.historical-content li {
    margin-bottom: 0.25rem;
}

.security-level-indicator {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    font-weight: bold;
    text-transform: uppercase;
}

.security-level-low {
    background: var(--error-red);
    color: white;
}

.security-level-medium {
    background: var(--warning-amber);
    color: var(--bg-dark);
}

.security-level-high {
    background: var(--primary-green);
    color: var(--bg-dark);
}

#frequency-chart, #analysis-results, #security-results {
    min-height: 100px;
    padding: 1rem;
    background: var(--bg-darker);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
}

.cipher-mode-info {
    background: rgba(0, 255, 65, 0.1);
    border: 1px solid var(--primary-green);
    border-radius: var(--radius-md);
    padding: 1rem;
    margin: 1rem 0;
}
</style></absolute_file_name>
    </file>