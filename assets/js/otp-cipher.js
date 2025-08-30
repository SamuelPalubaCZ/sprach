/**
 * One-Time Pad Cipher Implementation
 * Cryptographically secure implementation for Sprach Machine
 */

class OTPCipher {
    constructor() {
        this.pads = new Map();
        this.usedKeys = new Set();
    }

    /**
     * Generate a cryptographically secure one-time pad
     * @param {number} length - Length of the pad in bytes
     * @returns {string} Base64 encoded pad
     */
    generateSecurePad(length = 256) {
        const array = new Uint8Array(length);
        crypto.getRandomValues(array);
        return btoa(String.fromCharCode.apply(null, array));
    }

    /**
     * Create a pad from user input or generate one
     * @param {string} name - Name/ID for the pad
     * @param {string} keyData - Optional existing key data
     * @returns {string} The pad ID
     */
    createPad(name, keyData = null) {
        const padId = `pad_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const pad = {
            id: padId,
            name: name,
            created: new Date().toISOString(),
            data: keyData || this.generateSecurePad(512),
            used: 0,
            maxLength: keyData ? atob(keyData).length : 512
        };

        this.pads.set(padId, pad);
        return padId;
    }

    /**
     * Encrypt message using OTP
     * @param {string} plaintext - Message to encrypt
     * @param {string} padId - ID of the pad to use
     * @param {number} offset - Starting position in pad
     * @returns {object} Encryption result with ciphertext and metadata
     */
    encrypt(plaintext, padId, offset = 0) {
        const pad = this.pads.get(padId);
        if (!pad) {
            throw new Error('Pad not found');
        }

        if (offset + plaintext.length > pad.maxLength) {
            throw new Error('Not enough key material remaining in pad');
        }

        // Check if this section of the pad has been used
        const keySection = `${padId}:${offset}:${offset + plaintext.length}`;
        if (this.usedKeys.has(keySection)) {
            console.warn('WARNING: Reusing section of one-time pad compromises security!');
        }

        const keyData = atob(pad.data);
        let ciphertext = '';
        
        for (let i = 0; i < plaintext.length; i++) {
            const plainByte = plaintext.charCodeAt(i);
            const keyByte = keyData.charCodeAt(offset + i);
            const cipherByte = plainByte ^ keyByte;
            ciphertext += String.fromCharCode(cipherByte);
        }

        // Mark this key section as used
        this.usedKeys.add(keySection);
        pad.used = Math.max(pad.used, offset + plaintext.length);

        return {
            ciphertext: ciphertext,
            padId: padId,
            offset: offset,
            length: plaintext.length,
            timestamp: new Date().toISOString(),
            integrity: this.calculateChecksum(ciphertext)
        };
    }

    /**
     * Decrypt message using OTP
     * @param {string} ciphertext - Encrypted message
     * @param {string} padId - ID of the pad used for encryption
     * @param {number} offset - Starting position in pad
     * @returns {string} Decrypted plaintext
     */
    decrypt(ciphertext, padId, offset = 0) {
        const pad = this.pads.get(padId);
        if (!pad) {
            throw new Error('Pad not found');
        }

        const keyData = atob(pad.data);
        let plaintext = '';
        
        for (let i = 0; i < ciphertext.length; i++) {
            const cipherByte = ciphertext.charCodeAt(i);
            const keyByte = keyData.charCodeAt(offset + i);
            const plainByte = cipherByte ^ keyByte;
            plaintext += String.fromCharCode(plainByte);
        }

        return plaintext;
    }

    /**
     * Calculate checksum for integrity verification
     * @param {string} data - Data to checksum
     * @returns {string} Hex checksum
     */
    calculateChecksum(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    /**
     * Get pad information
     * @param {string} padId - Pad ID
     * @returns {object} Pad information
     */
    getPadInfo(padId) {
        const pad = this.pads.get(padId);
        if (!pad) {
            return null;
        }

        return {
            id: pad.id,
            name: pad.name,
            created: pad.created,
            maxLength: pad.maxLength,
            used: pad.used,
            remaining: pad.maxLength - pad.used,
            usagePercentage: (pad.used / pad.maxLength * 100).toFixed(1)
        };
    }

    /**
     * List all available pads
     * @returns {array} Array of pad information
     */
    listPads() {
        return Array.from(this.pads.keys()).map(id => this.getPadInfo(id));
    }

    /**
     * Delete a pad (security operation)
     * @param {string} padId - Pad ID to delete
     * @returns {boolean} Success status
     */
    destroyPad(padId) {
        const pad = this.pads.get(padId);
        if (!pad) {
            return false;
        }

        // Securely overwrite the key data (as much as possible in JavaScript)
        pad.data = '';
        for (let i = 0; i < 10; i++) {
            pad.data = this.generateSecurePad(pad.maxLength);
        }
        pad.data = '';

        this.pads.delete(padId);
        
        // Remove used key sections
        for (const usedKey of this.usedKeys) {
            if (usedKey.startsWith(`${padId}:`)) {
                this.usedKeys.delete(usedKey);
            }
        }

        return true;
    }

    /**
     * Export pad for sharing (with security warnings)
     * @param {string} padId - Pad ID
     * @param {boolean} includeUsage - Include usage information
     * @returns {string} JSON export string
     */
    exportPad(padId, includeUsage = false) {
        const pad = this.pads.get(padId);
        if (!pad) {
            throw new Error('Pad not found');
        }

        const exportData = {
            name: pad.name,
            created: pad.created,
            data: pad.data,
            maxLength: pad.maxLength
        };

        if (includeUsage) {
            exportData.used = pad.used;
            exportData.usedSections = Array.from(this.usedKeys)
                .filter(key => key.startsWith(`${padId}:`));
        }

        return JSON.stringify(exportData);
    }

    /**
     * Import pad from JSON
     * @param {string} jsonData - JSON pad data
     * @param {string} name - Name for imported pad
     * @returns {string} New pad ID
     */
    importPad(jsonData, name = null) {
        const padData = JSON.parse(jsonData);
        const newName = name || padData.name || `Imported_${Date.now()}`;
        
        return this.createPad(newName, padData.data);
    }

    /**
     * Convert message to number groups (for numbers station format)
     * @param {string} message - Text message
     * @returns {string} Message as space-separated numbers
     */
    messageToNumbers(message) {
        return message.split('').map(char => {
            const code = char.charCodeAt(0);
            return code.toString().padStart(3, '0');
        }).join(' ');
    }

    /**
     * Convert number groups back to message
     * @param {string} numbers - Space-separated numbers
     * @returns {string} Reconstructed message
     */
    numbersToMessage(numbers) {
        const codes = numbers.trim().split(/\s+/);
        return codes.map(code => {
            const num = parseInt(code, 10);
            return isNaN(num) ? '' : String.fromCharCode(num);
        }).join('');
    }

    /**
     * Generate a message book entry (authentic format)
     * @param {string} plaintext - Message to encode
     * @param {string} padId - Pad to use
     * @param {object} options - Formatting options
     * @returns {object} Complete message book entry
     */
    generateMessageBookEntry(plaintext, padId, options = {}) {
        const {
            callSign = '271',
            groupSize = 5,
            includeHeader = true,
            repeatGroups = true
        } = options;

        // Encrypt the message
        const encryption = this.encrypt(plaintext, padId);
        
        // Convert to numbers
        const numberSequence = this.messageToNumbers(encryption.ciphertext);
        const numbers = numberSequence.split(' ');
        
        // Group numbers
        const groups = [];
        for (let i = 0; i < numbers.length; i += groupSize) {
            const group = numbers.slice(i, i + groupSize);
            while (group.length < groupSize) {
                group.push('000'); // Padding
            }
            groups.push(group.join(''));
        }

        // Create message body with repetition if requested
        let messageBody = groups.join(' ');
        if (repeatGroups) {
            messageBody = groups.map(group => `${group} ${group}`).join(' ');
        }

        // Add null group at end
        messageBody += ' 00000';

        return {
            callSign: callSign,
            messageBody: messageBody,
            groupCount: groups.length,
            encryption: {
                padId: encryption.padId,
                offset: encryption.offset,
                length: encryption.length,
                timestamp: encryption.timestamp,
                integrity: encryption.integrity
            },
            transmissionFormat: `${callSign} ${callSign} / ${messageBody} +`,
            originalMessage: plaintext
        };
    }

    /**
     * Decode a message book entry
     * @param {string} messageBody - The number groups from transmission
     * @param {string} padId - Pad used for encryption
     * @param {number} offset - Offset in pad
     * @param {object} options - Decoding options
     * @returns {string} Decoded message
     */
    decodeMessageBookEntry(messageBody, padId, offset, options = {}) {
        const { 
            groupSize = 5,
            removeRepeats = true,
            ignoreNullGroups = true 
        } = options;

        // Clean up the message body
        let numbers = messageBody.trim().split(/\s+/);
        
        // Remove null groups if requested
        if (ignoreNullGroups) {
            numbers = numbers.filter(num => num !== '00000');
        }

        // Remove repeated groups if they exist
        if (removeRepeats && numbers.length % 2 === 0) {
            const deduped = [];
            for (let i = 0; i < numbers.length; i += 2) {
                if (numbers[i] === numbers[i + 1]) {
                    deduped.push(numbers[i]);
                } else {
                    // If they don't match, keep both (might not be repeated format)
                    deduped.push(numbers[i], numbers[i + 1]);
                }
            }
            numbers = deduped;
        }

        // Convert back to individual character codes
        const charCodes = [];
        for (const group of numbers) {
            for (let i = 0; i < group.length; i += 3) {
                const code = group.substr(i, 3);
                if (code && code !== '000') {
                    charCodes.push(parseInt(code, 10));
                }
            }
        }

        // Reconstruct ciphertext
        const ciphertext = String.fromCharCode(...charCodes);
        
        // Decrypt
        return this.decrypt(ciphertext, padId, offset);
    }
}

// Global OTP instance
window.otpCipher = new OTPCipher();

// Enhanced cipher integration for Sprach Machine
class EnhancedCipherInterface {
    constructor(otpCipher) {
        this.otp = otpCipher;
        this.currentPadId = null;
        this.initializeInterface();
    }

    initializeInterface() {
        // Add OTP-specific UI elements
        this.createOTPInterface();
        this.updatePadList();
    }

    createOTPInterface() {
        const cipherSection = document.querySelector('.encryption-section');
        if (!cipherSection) return;

        const otpHTML = `
            <div id="otp-controls" style="display: none;">
                <div class="settings-grid">
                    <div class="settings-section">
                        <div class="settings-header">OTP Management</div>
                        
                        <div class="form-group">
                            <label class="form-label">Available Pads</label>
                            <select id="pad-selector" class="form-select">
                                <option value="">Select a pad...</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">New Pad Name</label>
                            <input type="text" id="new-pad-name" class="form-input" placeholder="Enter pad name">
                            <button id="create-pad-btn" class="btn btn-primary mt-sm">Create New Pad</button>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Pad Length (bytes)</label>
                            <input type="number" id="pad-length" class="form-input" value="256" min="64" max="2048">
                        </div>
                    </div>

                    <div class="settings-section">
                        <div class="settings-header">Pad Information</div>
                        <div id="pad-info" class="text-center">
                            <p>No pad selected</p>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Pad Offset</label>
                    <input type="number" id="pad-offset" class="form-input" value="0" min="0">
                    <small class="text-secondary">Starting position in pad (0-based)</small>
                </div>

                <div class="form-group">
                    <button id="generate-message-book" class="btn btn-primary">Generate Message Book Entry</button>
                    <button id="decode-message-book" class="btn">Decode Message Book Entry</button>
                </div>
            </div>
        `;

        const cipherModeSelect = document.getElementById('cipher-mode');
        if (cipherModeSelect && !document.getElementById('otp-controls')) {
            cipherSection.insertAdjacentHTML('beforeend', otpHTML);
            this.bindOTPEvents();
        }
    }

    bindOTPEvents() {
        // Create pad button
        const createPadBtn = document.getElementById('create-pad-btn');
        if (createPadBtn) {
            createPadBtn.addEventListener('click', () => this.createNewPad());
        }

        // Pad selector
        const padSelector = document.getElementById('pad-selector');
        if (padSelector) {
            padSelector.addEventListener('change', (e) => this.selectPad(e.target.value));
        }

        // Message book functions
        const generateBtn = document.getElementById('generate-message-book');
        const decodeBtn = document.getElementById('decode-message-book');

        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateMessageBook());
        }

        if (decodeBtn) {
            decodeBtn.addEventListener('click', () => this.decodeMessageBook());
        }
    }

    createNewPad() {
        const nameInput = document.getElementById('new-pad-name');
        const lengthInput = document.getElementById('pad-length');
        
        if (!nameInput || !lengthInput) return;

        const name = nameInput.value.trim();
        const length = parseInt(lengthInput.value);

        if (!name) {
            alert('Please enter a pad name');
            return;
        }

        if (length < 64 || length > 2048) {
            alert('Pad length must be between 64 and 2048 bytes');
            return;
        }

        const padId = this.otp.createPad(name, this.otp.generateSecurePad(length));
        this.updatePadList();
        
        // Select the new pad
        const padSelector = document.getElementById('pad-selector');
        if (padSelector) {
            padSelector.value = padId;
            this.selectPad(padId);
        }

        nameInput.value = '';
        alert(`Pad "${name}" created successfully`);
    }

    updatePadList() {
        const padSelector = document.getElementById('pad-selector');
        if (!padSelector) return;

        const pads = this.otp.listPads();
        
        // Clear existing options (except the first one)
        while (padSelector.children.length > 1) {
            padSelector.removeChild(padSelector.lastChild);
        }

        // Add pad options
        pads.forEach(pad => {
            const option = document.createElement('option');
            option.value = pad.id;
            option.textContent = `${pad.name} (${pad.remaining}/${pad.maxLength} bytes remaining)`;
            padSelector.appendChild(option);
        });
    }

    selectPad(padId) {
        this.currentPadId = padId;
        this.updatePadInfo(padId);
    }

    updatePadInfo(padId) {
        const padInfo = document.getElementById('pad-info');
        if (!padInfo) return;

        if (!padId) {
            padInfo.innerHTML = '<p>No pad selected</p>';
            return;
        }

        const info = this.otp.getPadInfo(padId);
        if (!info) {
            padInfo.innerHTML = '<p>Invalid pad</p>';
            return;
        }

        padInfo.innerHTML = `
            <div class="pad-stats">
                <h4>${info.name}</h4>
                <p><strong>Created:</strong> ${new Date(info.created).toLocaleString()}</p>
                <p><strong>Total Size:</strong> ${info.maxLength} bytes</p>
                <p><strong>Used:</strong> ${info.used} bytes (${info.usagePercentage}%)</p>
                <p><strong>Remaining:</strong> ${info.remaining} bytes</p>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${info.usagePercentage}%"></div>
                </div>
            </div>
        `;
    }

    generateMessageBook() {
        if (!this.currentPadId) {
            alert('Please select a pad first');
            return;
        }

        const plainText = document.getElementById('plain-text')?.value;
        const callSign = document.getElementById('call')?.value || '271';
        const offset = parseInt(document.getElementById('pad-offset')?.value || 0);

        if (!plainText) {
            alert('Please enter a message to encrypt');
            return;
        }

        try {
            const entry = this.otp.generateMessageBookEntry(plainText, this.currentPadId, {
                callSign: callSign,
                offset: offset
            });

            // Update the message body field
            const bodyField = document.getElementById('body');
            if (bodyField) {
                bodyField.value = entry.messageBody;
            }

            // Update cipher text field with metadata
            const cipherField = document.getElementById('cipher-text');
            if (cipherField) {
                cipherField.value = JSON.stringify({
                    padId: entry.encryption.padId,
                    offset: entry.encryption.offset,
                    messageBody: entry.messageBody,
                    integrity: entry.encryption.integrity
                }, null, 2);
            }

            // Update pad info
            this.updatePadInfo(this.currentPadId);

            alert('Message book entry generated successfully!');

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    decodeMessageBook() {
        const cipherText = document.getElementById('cipher-text')?.value;
        
        if (!cipherText) {
            alert('Please enter cipher metadata to decode');
            return;
        }

        try {
            const metadata = JSON.parse(cipherText);
            const decoded = this.otp.decodeMessageBookEntry(
                metadata.messageBody,
                metadata.padId,
                metadata.offset
            );

            const plainField = document.getElementById('plain-text');
            if (plainField) {
                plainField.value = decoded;
            }

            alert('Message decoded successfully!');

        } catch (error) {
            alert(`Decoding error: ${error.message}`);
        }
    }
}

// Initialize enhanced cipher interface when loaded
window.addEventListener('load', function() {
    setTimeout(() => {
        if (window.otpCipher) {
            window.enhancedCipher = new EnhancedCipherInterface(window.otpCipher);
        }
    }, 1000);
});</absolute_file_name>
    </file>