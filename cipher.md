---
layout: default
title: Cipher
nav_order: 3
---

<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

# CRYPTOGRAPHIC INTERFACE

**LEVEL:** XOR-256 | **STATUS:** <span id="security-status">SECURE</span>



## 📝 PLAINTEXT_INPUT
<span id="plain-counter">0 chars</span>

<textarea id="plaintext" rows="8" placeholder="Enter your classified message here..." style="width: 100%; font-family: monospace; background: #000; color: #0f0; border: 1px solid #333; padding: 10px;"></textarea>

## 🔑 ENCRYPTION_KEY
<button onclick="generateRandomKey()">GENERATE</button>

<input type="text" id="key" placeholder="Enter encryption key or generate random..." style="width: 100%; font-family: monospace; background: #000; color: #0f0; border: 1px solid #333; padding: 8px;">

**KEY STRENGTH:** <span id="strength-text">WEAK</span>
<div id="key-strength" style="width: 0%; height: 6px; background: linear-gradient(90deg, #f44, #fa0, #0f0);"></div>

## OPERATIONS

<button onclick="encryptText()">🔒 ENCRYPT (CTRL+E)</button>
<button onclick="decryptText()">🔓 DECRYPT (CTRL+D)</button>

<button onclick="clearAll()">🗑️ CLEAR</button>
<button onclick="swapTexts()">🔄 SWAP</button>
<button onclick="copyResult()">📋 COPY</button>

## 🔐 CIPHERTEXT_OUTPUT
<span id="cipher-counter">0 chars</span>

<textarea id="ciphertext" rows="8" placeholder="Encrypted/decrypted text will appear here..." style="width: 100%; font-family: monospace; background: #000; color: #0f0; border: 1px solid #333; padding: 10px;"></textarea>

## CIPHER_SPECIFICATIONS

- **ALGORITHM:** XOR (Exclusive OR)
- **KEY_TYPE:** Variable Length
- **SECURITY:** Symmetric Encryption
- **REVERSIBLE:** Yes (Same Key)

## OPERATION_LOG

<div id="log-output">
[SYSTEM] Cryptographic interface initialized
</div>
