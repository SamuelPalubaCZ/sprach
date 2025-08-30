/**
 * Encoder Module - Handles A1Z26 and Straddling Checkerboard ciphers
 * Converts plaintext to numeric strings and formats into 5-digit groups
 */

// Default Straddling Checkerboard (based on VIC cipher)
const DEFAULT_CHECKERBOARD = {
    // Top row (single digits) - most common letters
    'E': '0', 'T': '1', 'A': '2', 'O': '3', 'I': '4', 'N': '5', 'R': '6', 'S': '7', 'H': '8', 'D': '9',
    // Two-digit codes using straddle digits 2 and 7
    'L': '20', 'U': '21', 'C': '22', 'M': '23', 'F': '24', 'W': '25', 'Y': '26', 'P': '27', 'V': '28', 'B': '29',
    'G': '70', 'J': '71', 'K': '72', 'Q': '73', 'X': '74', 'Z': '75',
    // Numbers
    '0': '760', '1': '761', '2': '762', '3': '763', '4': '764', '5': '765', '6': '766', '7': '767', '8': '768', '9': '769',
    // Space (optional)
    ' ': '77'
};

// Reverse lookup for decoding
const REVERSE_CHECKERBOARD = {};
for (const [char, code] of Object.entries(DEFAULT_CHECKERBOARD)) {
    REVERSE_CHECKERBOARD[code] = char;
}

/**
 * Encodes text using A1Z26 cipher (A=1, B=2, ..., Z=26)
 * @param {string} text - Input text (A-Z, 0-9)
 * @returns {string} - Numeric string
 */
export function encodeA1Z26(text) {
    const normalized = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let result = '';
    
    for (const char of normalized) {
        if (char >= 'A' && char <= 'Z') {
            // Convert letter to number (A=01, B=02, etc.)
            const num = char.charCodeAt(0) - 64; // A=1, B=2, ..., Z=26
            result += num.toString().padStart(2, '0');
        } else if (char >= '0' && char <= '9') {
            // Keep digits as-is, but pad to 2 digits
            result += char.padStart(2, '0');
        }
    }
    
    return result;
}

/**
 * Decodes A1Z26 encoded text
 * @param {string} encoded - Numeric string
 * @returns {string} - Decoded text
 */
export function decodeA1Z26(encoded) {
    let result = '';
    
    // Process pairs of digits
    for (let i = 0; i < encoded.length; i += 2) {
        const pair = encoded.substr(i, 2);
        const num = parseInt(pair, 10);
        
        if (num >= 1 && num <= 26) {
            // Convert number to letter
            result += String.fromCharCode(64 + num);
        } else if (num >= 0 && num <= 9) {
            // Single digit (with leading zero)
            result += num.toString();
        }
    }
    
    return result;
}

/**
 * Encodes text using Straddling Checkerboard cipher
 * @param {string} text - Input text
 * @returns {string} - Numeric string
 */
export function encodeCheckerboard(text) {
    const normalized = text.toUpperCase();
    let result = '';
    
    for (const char of normalized) {
        if (DEFAULT_CHECKERBOARD[char]) {
            result += DEFAULT_CHECKERBOARD[char];
        } else if (char >= 'A' && char <= 'Z') {
            // Fallback for unmapped letters - use A1Z26
            const num = char.charCodeAt(0) - 64;
            result += num.toString().padStart(2, '0');
        } else if (char >= '0' && char <= '9') {
            // Map digits using the checkerboard
            result += DEFAULT_CHECKERBOARD[char] || char;
        }
        // Skip other characters
    }
    
    return result;
}

/**
 * Decodes Straddling Checkerboard encoded text
 * @param {string} encoded - Numeric string
 * @returns {string} - Decoded text
 */
export function decodeCheckerboard(encoded) {
    let result = '';
    let i = 0;
    
    while (i < encoded.length) {
        // Try single digit first
        let found = false;
        const singleDigit = encoded[i];
        
        if (REVERSE_CHECKERBOARD[singleDigit]) {
            result += REVERSE_CHECKERBOARD[singleDigit];
            i++;
            found = true;
        } else {
            // Try two digits
            if (i + 1 < encoded.length) {
                const twoDigits = encoded.substr(i, 2);
                if (REVERSE_CHECKERBOARD[twoDigits]) {
                    result += REVERSE_CHECKERBOARD[twoDigits];
                    i += 2;
                    found = true;
                } else {
                    // Try three digits
                    if (i + 2 < encoded.length) {
                        const threeDigits = encoded.substr(i, 3);
                        if (REVERSE_CHECKERBOARD[threeDigits]) {
                            result += REVERSE_CHECKERBOARD[threeDigits];
                            i += 3;
                            found = true;
                        }
                    }
                }
            }
        }
        
        if (!found) {
            // Skip unrecognized character
            i++;
        }
    }
    
    return result;
}

/**
 * Formats numeric string into 5-digit groups with padding
 * @param {string} numericString - Input numeric string
 * @returns {object} - {groups: string[], count: number, padded: string}
 */
export function formatIntoGroups(numericString) {
    if (!numericString) {
        return { groups: [], count: 0, padded: '' };
    }
    
    let padded = numericString;
    
    // Pad to make length divisible by 5
    const remainder = padded.length % 5;
    if (remainder !== 0) {
        const paddingNeeded = 5 - remainder;
        // Add random digits for padding
        for (let i = 0; i < paddingNeeded; i++) {
            padded += Math.floor(Math.random() * 10).toString();
        }
    }
    
    // Split into 5-digit groups
    const groups = [];
    for (let i = 0; i < padded.length; i += 5) {
        groups.push(padded.substr(i, 5));
    }
    
    return {
        groups,
        count: groups.length,
        padded
    };
}

/**
 * Generates a random numeric string for padding or keys
 * @param {number} length - Desired length
 * @returns {string} - Random numeric string
 */
export function generateRandomDigits(length) {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10).toString();
    }
    return result;
}

/**
 * Validates input text for encoding
 * @param {string} text - Input text
 * @returns {object} - {valid: boolean, message: string, cleaned: string}
 */
export function validateInput(text) {
    if (!text || text.trim().length === 0) {
        return {
            valid: false,
            message: 'Input text cannot be empty',
            cleaned: ''
        };
    }
    
    // Clean input - keep only A-Z, 0-9, and spaces
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9 ]/g, '');
    
    if (cleaned.length === 0) {
        return {
            valid: false,
            message: 'Input must contain at least one letter or digit',
            cleaned: ''
        };
    }
    
    if (cleaned.length > 1000) {
        return {
            valid: false,
            message: 'Input text is too long (max 1000 characters)',
            cleaned: cleaned.substr(0, 1000)
        };
    }
    
    return {
        valid: true,
        message: 'Input is valid',
        cleaned
    };
}

/**
 * Main encoding function that handles both cipher types
 * @param {string} text - Input text
 * @param {string} method - 'a1z26' or 'checkerboard'
 * @returns {object} - Encoding result with groups and metadata
 */
export function encodeMessage(text, method = 'a1z26') {
    const validation = validateInput(text);
    if (!validation.valid) {
        return {
            success: false,
            error: validation.message,
            groups: [],
            count: 0,
            encoded: '',
            original: text
        };
    }
    
    let encoded;
    try {
        switch (method.toLowerCase()) {
            case 'a1z26':
                encoded = encodeA1Z26(validation.cleaned);
                break;
            case 'checkerboard':
                encoded = encodeCheckerboard(validation.cleaned);
                break;
            default:
                throw new Error(`Unknown encoding method: ${method}`);
        }
        
        const groupData = formatIntoGroups(encoded);
        
        return {
            success: true,
            groups: groupData.groups,
            count: groupData.count,
            encoded: groupData.padded,
            original: validation.cleaned,
            method,
            unpadded: encoded
        };
        
    } catch (error) {
        return {
            success: false,
            error: `Encoding failed: ${error.message}`,
            groups: [],
            count: 0,
            encoded: '',
            original: text
        };
    }
}

/**
 * Decodes a message given the method and encoded groups
 * @param {string[]} groups - Array of 5-digit groups
 * @param {string} method - 'a1z26' or 'checkerboard'
 * @returns {object} - Decoding result
 */
export function decodeMessage(groups, method = 'a1z26') {
    if (!groups || groups.length === 0) {
        return {
            success: false,
            error: 'No groups provided for decoding',
            decoded: ''
        };
    }
    
    try {
        // Join groups back into numeric string
        const encoded = groups.join('');
        
        let decoded;
        switch (method.toLowerCase()) {
            case 'a1z26':
                decoded = decodeA1Z26(encoded);
                break;
            case 'checkerboard':
                decoded = decodeCheckerboard(encoded);
                break;
            default:
                throw new Error(`Unknown decoding method: ${method}`);
        }
        
        return {
            success: true,
            decoded,
            method,
            groups: groups.length
        };
        
    } catch (error) {
        return {
            success: false,
            error: `Decoding failed: ${error.message}`,
            decoded: ''
        };
    }
}

// Export the checkerboard for reference
export { DEFAULT_CHECKERBOARD, REVERSE_CHECKERBOARD };