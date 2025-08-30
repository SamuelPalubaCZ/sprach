---
layout: default
title: Cipher
nav_order: 3
---

<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

# Encryption Tool

**Algorithm:** XOR | **Status:** <span id="security-status">Ready</span>



## Plaintext Input
<span id="plain-counter">0 chars</span>

<textarea id="plaintext" rows="8" placeholder="Enter your message here..." style="width: 100%; border: 1px solid #ccc; padding: 10px;"></textarea>

## Encryption Key
<button onclick="generateRandomKey()">Generate Key</button>

<input type="text" id="key" placeholder="Enter encryption key or generate random..." style="width: 100%; border: 1px solid #ccc; padding: 8px;">

**Key Strength:** <span id="strength-text">None</span>
<div id="key-strength" style="width: 0%; height: 6px; background: linear-gradient(90deg, #f44, #fa0, #0f0);"></div>

## Operations

<button onclick="encryptText()">Encrypt (Ctrl+E)</button>
<button onclick="decryptText()">Decrypt (Ctrl+D)</button>

<button onclick="clearAll()">Clear</button>
<button onclick="swapTexts()">Swap</button>
<button onclick="copyResult()">Copy</button>

## Ciphertext Output
<span id="cipher-counter">0 chars</span>

<textarea id="ciphertext" rows="8" placeholder="Encrypted/decrypted text will appear here..." style="width: 100%; border: 1px solid #ccc; padding: 10px;"></textarea>

## Cipher Specifications

- **Algorithm:** XOR (Exclusive OR)
- **Key Type:** Variable Length
- **Security:** Symmetric Encryption
- **Reversible:** Yes (Same Key)

## Operation Log

<div id="log-output">
Encryption tool ready
</div>
