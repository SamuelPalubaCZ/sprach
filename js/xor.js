/**
 * XOR Utility Module
 * Implements XOR encryption/decryption for both ASCII text and HEX data
 * Supports repeating keys and bidirectional operations
 */

/**
 * Validates ASCII input text
 * @param {string} text - Text to validate
 * @returns {object} - {valid: boolean, message: string, cleaned: string}
 */
export function validateASCIIInput(text) {
    if (text === null || text === undefined) {
        return {
            valid: false,
            message: 'Input cannot be null or undefined',
            cleaned: ''
        };
    }
    
    if (typeof text !== 'string') {
        text = text.toString();
    }
    
    // Check for valid ASCII characters (0-127)
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        if (charCode > 127) {
            return {
                valid: false,
                message: `Non-ASCII character found at position ${i}: '${text[i]}'`,
                cleaned: text.replace(/[^\x00-\x7F]/g, '')
            };
        }
    }
    
    return {
        valid: true,
        message: 'Valid ASCII input',
        cleaned: text
    };
}

/**
 * Validates HEX input string
 * @param {string} hex - HEX string to validate
 * @returns {object} - {valid: boolean, message: string, cleaned: string}
 */
export function validateHEXInput(hex) {
    if (!hex || typeof hex !== 'string') {
        return {
            valid: false,
            message: 'HEX input cannot be empty',
            cleaned: ''
        };
    }
    
    // Remove spaces and convert to uppercase
    const cleaned = hex.replace(/\s/g, '').toUpperCase();
    
    // Check if it's valid hex (only 0-9, A-F)
    if (!/^[0-9A-F]*$/.test(cleaned)) {
        return {
            valid: false,
            message: 'Invalid HEX characters found. Only 0-9 and A-F are allowed.',
            cleaned: cleaned.replace(/[^0-9A-F]/g, '')
        };
    }
    
    // Check if length is even (pairs of hex digits)
    if (cleaned.length % 2 !== 0) {
        return {
            valid: false,
            message: 'HEX string must have even length (pairs of digits)',
            cleaned: cleaned + '0' // Pad with zero
        };
    }
    
    return {
        valid: true,
        message: 'Valid HEX input',
        cleaned
    };
}

/**
 * Converts ASCII string to HEX string
 * @param {string} ascii - ASCII string
 * @returns {string} - HEX representation
 */
export function asciiToHex(ascii) {
    let hex = '';
    for (let i = 0; i < ascii.length; i++) {
        const charCode = ascii.charCodeAt(i);
        hex += charCode.toString(16).padStart(2, '0').toUpperCase();
    }
    return hex;
}

/**
 * Converts HEX string to ASCII string
 * @param {string} hex - HEX string
 * @returns {string} - ASCII representation
 */
export function hexToAscii(hex) {
    let ascii = '';
    for (let i = 0; i < hex.length; i += 2) {
        const hexPair = hex.substr(i, 2);
        const charCode = parseInt(hexPair, 16);
        ascii += String.fromCharCode(charCode);
    }
    return ascii;
}

/**
 * XOR operation on two byte arrays
 * @param {Uint8Array} data - Data bytes
 * @param {Uint8Array} key - Key bytes
 * @returns {Uint8Array} - XOR result
 */
function xorBytes(data, key) {
    const result = new Uint8Array(data.length);
    
    for (let i = 0; i < data.length; i++) {
        const keyIndex = i % key.length; // Repeat key if shorter
        result[i] = data[i] ^ key[keyIndex];
    }
    
    return result;
}

/**
 * XOR encrypt/decrypt ASCII text with ASCII key
 * @param {string} text - Input text
 * @param {string} key - Key string
 * @returns {object} - Operation result
 */
export function xorASCII(text, key) {
    const textValidation = validateASCIIInput(text);
    if (!textValidation.valid) {
        return {
            success: false,
            error: `Text error: ${textValidation.message}`,
            result: '',
            resultHex: ''
        };
    }
    
    const keyValidation = validateASCIIInput(key);
    if (!keyValidation.valid) {
        return {
            success: false,
            error: `Key error: ${keyValidation.message}`,
            result: '',
            resultHex: ''
        };
    }
    
    if (keyValidation.cleaned.length === 0) {
        return {
            success: false,
            error: 'Key cannot be empty',
            result: '',
            resultHex: ''
        };
    }
    
    try {
        // Convert strings to byte arrays
        const textBytes = new Uint8Array(textValidation.cleaned.length);
        const keyBytes = new Uint8Array(keyValidation.cleaned.length);
        
        for (let i = 0; i < textValidation.cleaned.length; i++) {
            textBytes[i] = textValidation.cleaned.charCodeAt(i);
        }
        
        for (let i = 0; i < keyValidation.cleaned.length; i++) {
            keyBytes[i] = keyValidation.cleaned.charCodeAt(i);
        }
        
        // Perform XOR
        const resultBytes = xorBytes(textBytes, keyBytes);
        
        // Convert result back to string and hex
        let resultString = '';
        let resultHex = '';
        
        for (let i = 0; i < resultBytes.length; i++) {
            resultString += String.fromCharCode(resultBytes[i]);
            resultHex += resultBytes[i].toString(16).padStart(2, '0').toUpperCase();
        }
        
        return {
            success: true,
            result: resultString,
            resultHex,
            originalText: textValidation.cleaned,
            keyUsed: keyValidation.cleaned,
            mode: 'ASCII'
        };
        
    } catch (error) {
        return {
            success: false,
            error: `XOR operation failed: ${error.message}`,
            result: '',
            resultHex: ''
        };
    }
}

/**
 * XOR encrypt/decrypt HEX data with HEX key
 * @param {string} hexData - Input HEX string
 * @param {string} hexKey - Key HEX string
 * @returns {object} - Operation result
 */
export function xorHEX(hexData, hexKey) {
    const dataValidation = validateHEXInput(hexData);
    if (!dataValidation.valid) {
        return {
            success: false,
            error: `Data error: ${dataValidation.message}`,
            result: '',
            resultASCII: ''
        };
    }
    
    const keyValidation = validateHEXInput(hexKey);
    if (!keyValidation.valid) {
        return {
            success: false,
            error: `Key error: ${keyValidation.message}`,
            result: '',
            resultASCII: ''
        };
    }
    
    if (keyValidation.cleaned.length === 0) {
        return {
            success: false,
            error: 'Key cannot be empty',
            result: '',
            resultASCII: ''
        };
    }
    
    try {
        // Convert HEX strings to byte arrays
        const dataBytes = new Uint8Array(dataValidation.cleaned.length / 2);
        const keyBytes = new Uint8Array(keyValidation.cleaned.length / 2);
        
        for (let i = 0; i < dataValidation.cleaned.length; i += 2) {
            dataBytes[i / 2] = parseInt(dataValidation.cleaned.substr(i, 2), 16);
        }
        
        for (let i = 0; i < keyValidation.cleaned.length; i += 2) {
            keyBytes[i / 2] = parseInt(keyValidation.cleaned.substr(i, 2), 16);
        }
        
        // Perform XOR
        const resultBytes = xorBytes(dataBytes, keyBytes);
        
        // Convert result to HEX and ASCII
        let resultHex = '';
        let resultASCII = '';
        
        for (let i = 0; i < resultBytes.length; i++) {
            resultHex += resultBytes[i].toString(16).padStart(2, '0').toUpperCase();
            // Only add to ASCII if it's a printable character
            const char = String.fromCharCode(resultBytes[i]);
            resultASCII += (resultBytes[i] >= 32 && resultBytes[i] <= 126) ? char : '.';
        }
        
        return {
            success: true,
            result: resultHex,
            resultASCII,
            originalData: dataValidation.cleaned,
            keyUsed: keyValidation.cleaned,
            mode: 'HEX'
        };
        
    } catch (error) {
        return {
            success: false,
            error: `XOR operation failed: ${error.message}`,
            result: '',
            resultASCII: ''
        };
    }
}

/**
 * Main XOR function that handles both ASCII and HEX modes
 * @param {string} input - Input data
 * @param {string} key - Key data
 * @param {string} mode - 'ascii' or 'hex'
 * @returns {object} - Operation result
 */
export function performXOR(input, key, mode = 'ascii') {
    if (!input || !key) {
        return {
            success: false,
            error: 'Both input and key are required',
            result: '',
            mode
        };
    }
    
    switch (mode.toLowerCase()) {
        case 'ascii':
            return xorASCII(input, key);
        case 'hex':
            return xorHEX(input, key);
        default:
            return {
                success: false,
                error: `Unknown mode: ${mode}. Use 'ascii' or 'hex'`,
                result: '',
                mode
            };
    }
}

/**
 * Demonstrates XOR encryption/decryption with test data
 * @param {string} mode - 'ascii' or 'hex'
 * @returns {object} - Demo result
 */
export function demonstrateXOR(mode = 'ascii') {
    let testData, testKey;
    
    if (mode.toLowerCase() === 'ascii') {
        testData = 'Hello, World!';
        testKey = 'SECRET';
    } else {
        testData = '48656C6C6F2C20576F726C6421'; // "Hello, World!" in hex
        testKey = '534543524554'; // "SECRET" in hex
    }
    
    // Encrypt
    const encrypted = performXOR(testData, testKey, mode);
    if (!encrypted.success) {
        return {
            success: false,
            error: `Encryption failed: ${encrypted.error}`
        };
    }
    
    // Decrypt (XOR is its own inverse)
    const decrypted = performXOR(encrypted.result, testKey, mode);
    if (!decrypted.success) {
        return {
            success: false,
            error: `Decryption failed: ${decrypted.error}`
        };
    }
    
    return {
        success: true,
        mode,
        original: testData,
        key: testKey,
        encrypted: encrypted.result,
        decrypted: decrypted.result,
        roundTrip: testData === decrypted.result
    };
}

/**
 * Generates a random key for XOR operations
 * @param {number} length - Key length
 * @param {string} mode - 'ascii' or 'hex'
 * @returns {string} - Generated key
 */
export function generateXORKey(length, mode = 'ascii') {
    if (length <= 0) {
        return '';
    }
    
    if (mode.toLowerCase() === 'hex') {
        // Generate random hex string (even length)
        const hexLength = Math.max(2, Math.floor(length / 2) * 2);
        let key = '';
        for (let i = 0; i < hexLength; i++) {
            key += Math.floor(Math.random() * 16).toString(16).toUpperCase();
        }
        return key;
    } else {
        // Generate random ASCII string (printable characters 33-126)
        let key = '';
        for (let i = 0; i < length; i++) {
            const charCode = Math.floor(Math.random() * 94) + 33; // Printable ASCII range
            key += String.fromCharCode(charCode);
        }
        return key;
    }
}

/**
 * Formats data for display (adds spaces every 2 characters for hex)
 * @param {string} data - Data to format
 * @param {string} mode - 'ascii' or 'hex'
 * @returns {string} - Formatted data
 */
export function formatForDisplay(data, mode = 'ascii') {
    if (!data) return '';
    
    if (mode.toLowerCase() === 'hex') {
        // Add spaces every 2 characters
        return data.replace(/(..)/g, '$1 ').trim();
    }
    
    return data;
}

/**
 * Analyzes XOR result for patterns or information
 * @param {string} original - Original data
 * @param {string} key - Key used
 * @param {string} result - XOR result
 * @param {string} mode - Operation mode
 * @returns {object} - Analysis result
 */
export function analyzeXORResult(original, key, result, mode) {
    const analysis = {
        originalLength: original ? original.length : 0,
        keyLength: key ? key.length : 0,
        resultLength: result ? result.length : 0,
        keyRepeats: 0,
        mode
    };
    
    if (original && key) {
        analysis.keyRepeats = Math.ceil(original.length / key.length);
    }
    
    // Check for null bytes in result (potential issue)
    if (mode === 'ascii' && result) {
        analysis.nullBytes = (result.match(/\x00/g) || []).length;
        analysis.hasNullBytes = analysis.nullBytes > 0;
    }
    
    return analysis;
}