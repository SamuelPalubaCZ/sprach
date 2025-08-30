# Sprach Machine - Number Station Simulator

A web-based application that simulates a number station. It can convert a message of numbers into a sequence of spoken digits, and generate a downloadable audio file of the message.

This is a complete rebuild of the original "Stasi Morse-Speech Generator" experiment, with a modern design and new features based on user feedback.

## Features

*   **Speech Audio Generation**: Enter a call sign and a message body of numbers. The application will generate a single `.wav` audio file of the message being spoken.
*   **Audio Playback and Download**: The generated audio file can be played directly on the page or downloaded for later use.
*   **Text Encryption Tool**: A built-in cipher tool allows you to encrypt and decrypt messages using a simple XOR cipher.
*   **Streamlined Workflow**: The "Encrypt" button automatically copies the resulting ciphertext into the main message body, ready for audio generation.
*   **Manual Tones**: You can play individual number and word sounds using the keypad buttons.
*   **Modern UI**: The application has a clean, simple, and responsive user interface.

## How to Use

1.  **Generate Audio from a Message**:
    *   Enter a numeric call sign in the "Call Sign" field.
    *   Enter a message consisting of space-separated numbers in the "Message Body" field.
    *   Click the "Generate Audio File" button.
    *   The generated audio will appear below the button, where you can play it or download it.

2.  **Use the Cipher Tool**:
    *   Type your plaintext message in the "Plaintext" field.
    *   Enter a secret key in the "Cipher Key" field.
    *   Click "Encrypt & Copy to Message". The encrypted message (as a series of character codes) will be automatically placed in the "Message Body" field.
    *   To decrypt a message, paste the numeric ciphertext into the "Ciphertext" field, enter the correct key, and click "Decrypt".

## Credits

*   Original concept and code by **tom|hetmer|cz**.
*   Rebuilt and redesigned by **SamuelPalubaCZ**.
