# Sprach Machine - Stasi Speech Generator v2.0

An experimental javascript simulation of the old Stasi Morse-Speech Generator, rebuilt and enhanced with new features.

This project is a web-based application that simulates a number station, allowing you to convert text into a sequence of spoken numbers, reminiscent of cold-war era spy broadcasts. It has been updated with a modern look, new features, and bug fixes.

## Features

*   **Stasi-Speech-Generator Simulation**: The core feature of the application. Enter a "call sign" and a "message" consisting of numbers, and the application will "read" it out using a synthesized voice constructed from individual number recordings.
*   **Text Encryption Tool**: A built-in cipher tool allows you to encrypt and decrypt messages using a simple XOR cipher. You can encrypt your message before transmitting it for an extra layer of authenticity.
*   **Audio Recorder**: Record your own audio messages directly in the browser. You can record your voice and play it back.
*   **Modern User Interface**: The application has been rebuilt with a new, responsive, retro-themed user interface for a better user experience.
*   **Bug Fixes**: The original bug requiring a page reload after each transmission has been fixed.

## How to Use

1.  **Speech Generator**:
    *   Enter a numeric call sign in the "Call Sign" field.
    *   Enter a message consisting of space-separated numbers in the "Message Body" field.
    *   Click the "Transmit Message" button to hear the message being read out.
    *   You can also click the individual number buttons or use your keyboard for manual input.

2.  **Text Encryption**:
    *   Type your plaintext message in the "Plaintext" field.
    *   Enter a secret key in the "Cipher Key" field.
    *   Click the "Encrypt" button. The encrypted message (as a series of character codes) will appear in the "Ciphertext" field.
    *   You can copy this ciphertext into the "Message Body" of the speech generator to transmit it.
    *   To decrypt, paste the ciphertext into the "Ciphertext" field, enter the correct key, and click "Decrypt".

3.  **Audio Recorder**:
    *   Click the "Start Recording" button to begin recording audio from your microphone. You may need to grant permission for the browser to access your microphone.
    *   Click the "Stop Recording" button to end the recording.
    *   The recorded audio will be available for playback in the audio player.

## Credits

*   Original concept and code by **tom|hetmer|cz** (2014).
*   Rebuilt, redesigned, and enhanced by **Jules** (2025).
