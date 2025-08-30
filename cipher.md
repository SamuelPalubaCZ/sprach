---
layout: default
title: Cipher
nav_order: 3
---

<link rel="stylesheet" href="{{ '/assets/css/normal-look.css' | relative_url }}">
<script src="{{ '/assets/js/buffer-loader.js' | relative_url }}"></script>
<script src="{{ '/assets/js/sprach.js' | relative_url }}"></script>

<div class="encryption-section">
    <h2 class="content-subhead">Cipher Tool</h2>
    <form class="pure-form pure-form-stacked" onsubmit="return false;">
        <fieldset>
            <label for="plain-text">Plaintext</label>
            <textarea id="plain-text" rows="4"></textarea>

            <label for="cipher-key">Cipher Key</label>
            <input type="text" id="cipher-key" value="STASI">

            <button id="encrypt-button" class="pure-button">Encrypt</button>
            <button id="decrypt-button" class="pure-button">Decrypt</button>

            <label for="cipher-text">Ciphertext (for decryption)</label>
            <textarea id="cipher-text" rows="4"></textarea>
            <button id="copy-to-body-button" class="pure-button">Copy to Message Body</button>
            <button id="copy-to-clipboard-button" class="pure-button">Copy to Clipboard</button>
        </fieldset>
    </form>
</div>
