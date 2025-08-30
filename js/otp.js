/**
 * One-Time Pad (OTP) Module
 * Implements mod-10 arithmetic for encrypting/decrypting numeric messages
 * Formula: C = (P + K) mod 10 for encryption, P = (C - K) mod 10 for decryption
 */

/**
 * Generates a random OTP key of specified length
 * @param {number} length - Length of key to generate
 * @returns {string} - Random numeric key
 */
export function generateOTPKey(length) {
    if (length <= 0) {
        return '';
    }
    
    let key = '';
    for (let i = 0; i < length; i++) {
        key += Math.floor(Math.random() * 10).toString();
    }
    return key;
}

/**
 * Validates OTP key format
 * @param {string} key - OTP key to validate
 * @returns {object} - {valid: boolean, message: string, cleaned: string}
 */
export function validateOTPKey(key) {
    if (!key || typeof key !== 'string') {
        return {
            valid: false,
            message: 'Key cannot be empty',
            cleaned: ''
        };
    }
    
    // Remove non-digit characters
    const cleaned = key.replace(/[^0-9]/g, '');
    
    if (cleaned.length === 0) {
        return {
            valid: false,
            message: 'Key must contain only digits',
            cleaned: ''
        };
    }
    
    if (cleaned.length > 10000) {
        return {
            valid: false,
            message: 'Key is too long (max 10000 digits)',
            cleaned: cleaned.substr(0, 10000)
        };
    }
    
    return {
        valid: true,
        message: 'Key is valid',
        cleaned
    };
}

/**
 * Validates plaintext for OTP operations
 * @param {string} plaintext - Plaintext to validate
 * @returns {object} - {valid: boolean, message: string, cleaned: string}
 */
export function validateOTPPlaintext(plaintext) {
    if (!plaintext || typeof plaintext !== 'string') {
        return {
            valid: false,
            message: 'Plaintext cannot be empty',
            cleaned: ''
        };
    }
    
    // Remove non-digit characters
    const cleaned = plaintext.replace(/[^0-9]/g, '');
    
    if (cleaned.length === 0) {
        return {
            valid: false,
            message: 'Plaintext must contain only digits',
            cleaned: ''
        };
    }
    
    return {
        valid: true,
        message: 'Plaintext is valid',
        cleaned
    };
}

/**
 * Encrypts plaintext using OTP with mod-10 arithmetic
 * @param {string} plaintext - Numeric plaintext string
 * @param {string} key - Numeric key string
 * @returns {object} - Encryption result
 */
export function encryptOTP(plaintext, key) {
    const plaintextValidation = validateOTPPlaintext(plaintext);
    if (!plaintextValidation.valid) {
        return {
            success: false,
            error: `Plaintext error: ${plaintextValidation.message}`,
            ciphertext: '',
            keyUsed: ''
        };
    }
    
    const keyValidation = validateOTPKey(key);
    if (!keyValidation.valid) {
        return {
            success: false,
            error: `Key error: ${keyValidation.message}`,
            ciphertext: '',
            keyUsed: ''
        };
    }
    
    const cleanPlaintext = plaintextValidation.cleaned;
    let cleanKey = keyValidation.cleaned;
    
    // Extend or truncate key to match plaintext length
    if (cleanKey.length < cleanPlaintext.length) {
        // Repeat key if it's shorter
        while (cleanKey.length < cleanPlaintext.length) {
            cleanKey += cleanKey;
        }
    }
    cleanKey = cleanKey.substr(0, cleanPlaintext.length);
    
    let ciphertext = '';
    
    try {
        for (let i = 0; i < cleanPlaintext.length; i++) {
            const p = parseInt(cleanPlaintext[i], 10);
            const k = parseInt(cleanKey[i], 10);
            const c = (p + k) % 10;
            ciphertext += c.toString();
        }
        
        return {
            success: true,
            ciphertext,
            keyUsed: cleanKey,
            plaintext: cleanPlaintext,
            operation: 'encrypt'
        };
        
    } catch (error) {
        return {
            success: false,
            error: `Encryption failed: ${error.message}`,
            ciphertext: '',
            keyUsed: ''
        };
    }
}

/**
 * Decrypts ciphertext using OTP with mod-10 arithmetic
 * @param {string} ciphertext - Numeric ciphertext string
 * @param {string} key - Numeric key string
 * @returns {object} - Decryption result
 */
export function decryptOTP(ciphertext, key) {
    const ciphertextValidation = validateOTPPlaintext(ciphertext); // Same validation as plaintext
    if (!ciphertextValidation.valid) {
        return {
            success: false,
            error: `Ciphertext error: ${ciphertextValidation.message}`,
            plaintext: '',
            keyUsed: ''
        };
    }
    
    const keyValidation = validateOTPKey(key);
    if (!keyValidation.valid) {
        return {
            success: false,
            error: `Key error: ${keyValidation.message}`,
            plaintext: '',
            keyUsed: ''
        };
    }
    
    const cleanCiphertext = ciphertextValidation.cleaned;
    let cleanKey = keyValidation.cleaned;
    
    // Extend or truncate key to match ciphertext length
    if (cleanKey.length < cleanCiphertext.length) {
        // Repeat key if it's shorter
        while (cleanKey.length < cleanCiphertext.length) {
            cleanKey += cleanKey;
        }
    }
    cleanKey = cleanKey.substr(0, cleanCiphertext.length);
    
    let plaintext = '';
    
    try {
        for (let i = 0; i < cleanCiphertext.length; i++) {
            const c = parseInt(cleanCiphertext[i], 10);
            const k = parseInt(cleanKey[i], 10);
            // Mod-10 subtraction: (c - k + 10) % 10 to handle negative results
            const p = (c - k + 10) % 10;
            plaintext += p.toString();
        }
        
        return {
            success: true,
            plaintext,
            keyUsed: cleanKey,
            ciphertext: cleanCiphertext,
            operation: 'decrypt'
        };
        
    } catch (error) {
        return {
            success: false,
            error: `Decryption failed: ${error.message}`,
            plaintext: '',
            keyUsed: ''
        };
    }
}

/**
 * Applies OTP to encoded message groups
 * @param {string[]} groups - Array of 5-digit groups
 * @param {string} key - OTP key
 * @param {boolean} encrypt - True for encrypt, false for decrypt
 * @returns {object} - Operation result
 */
export function applyOTPToGroups(groups, key, encrypt = true) {
    if (!groups || groups.length === 0) {
        return {
            success: false,
            error: 'No groups provided',
            groups: [],
            keyUsed: ''
        };
    }
    
    // Join groups into single string
    const combined = groups.join('');
    
    // Apply OTP
    const result = encrypt ? encryptOTP(combined, key) : decryptOTP(combined, key);
    
    if (!result.success) {
        return result;
    }
    
    // Split result back into 5-digit groups
    const processedText = encrypt ? result.ciphertext : result.plaintext;
    const newGroups = [];
    
    for (let i = 0; i < processedText.length; i += 5) {
        newGroups.push(processedText.substr(i, 5));
    }
    
    return {
        success: true,
        groups: newGroups,
        keyUsed: result.keyUsed,
        operation: encrypt ? 'encrypt' : 'decrypt',
        originalGroups: groups
    };
}

/**
 * Generates a secure random key for a given message length
 * @param {string} message - The message to generate key for
 * @returns {string} - Generated key
 */
export function generateKeyForMessage(message) {
    if (!message) {
        return '';
    }
    
    // Remove non-digit characters to get actual length needed
    const digits = message.replace(/[^0-9]/g, '');
    return generateOTPKey(digits.length);
}

/**
 * Demonstrates OTP encryption/decryption with a test message
 * @param {string} testMessage - Test message (digits only)
 * @returns {object} - Demo result showing encryption and decryption
 */
export function demonstrateOTP(testMessage = '12345') {
    const key = generateKeyForMessage(testMessage);
    
    const encrypted = encryptOTP(testMessage, key);
    if (!encrypted.success) {
        return {
            success: false,
            error: encrypted.error
        };
    }
    
    const decrypted = decryptOTP(encrypted.ciphertext, key);
    if (!decrypted.success) {
        return {
            success: false,
            error: decrypted.error
        };
    }
    
    return {
        success: true,
        original: testMessage,
        key: key,
        encrypted: encrypted.ciphertext,
        decrypted: decrypted.plaintext,
        roundTrip: testMessage === decrypted.plaintext
    };
}

/**
 * Checks if two strings are the same length for OTP operations
 * @param {string} text1 - First string
 * @param {string} text2 - Second string
 * @returns {object} - Length comparison result
 */
export function checkOTPLengths(text1, text2) {
    const len1 = (text1 || '').replace(/[^0-9]/g, '').length;
    const len2 = (text2 || '').replace(/[^0-9]/g, '').length;
    
    return {
        length1: len1,
        length2: len2,
        equal: len1 === len2,
        difference: Math.abs(len1 - len2),
        recommendation: len1 === len2 ? 'Lengths match - ready for OTP' : 
                       len1 < len2 ? 'Key is longer than message' : 'Key is shorter than message (will be repeated)'
    };
}

/**
 * Formats OTP key for display (groups of 5 digits)
 * @param {string} key - OTP key
 * @returns {string} - Formatted key
 */
export function formatOTPKey(key) {
    if (!key) return '';
    
    const cleaned = key.replace(/[^0-9]/g, '');
    const groups = [];
    
    for (let i = 0; i < cleaned.length; i += 5) {
        groups.push(cleaned.substr(i, 5));
    }
    
    return groups.join(' ');
}