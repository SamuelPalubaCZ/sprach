# Sprach–Morse Numbers Station Simulator

A static web application that simulates Stasi-style numbers station transmissions using five-digit groups read by prerecorded voices or transmitted as Morse code (CW).

## Features

### Core Functionality
- **Text Encoding**: Convert plaintext (A-Z, 0-9) using A1Z26 or Straddling Checkerboard ciphers
- **Automatic Grouping**: Messages are automatically formatted into 5-digit groups
- **Transmission Protocol**: Follows authentic format: Achtung → [ID] → Trennung → [count] → Trennung → [groups] → Ende

### Encryption Options
- **One-Time Pad (OTP)**: Optional mod-10 encryption for additional security
- **XOR Utility**: Encrypt/decrypt ASCII or HEX data with repeating keys
- **Round-trip Operations**: Full encryption and decryption support

### Audio Transmission
- **Voice Mode**: Prerecorded voice packs with gapless Web Audio API playback
- **Morse Code (CW)**: OscillatorNode-based tone generation with proper timing
- **Multiple Languages**: Support for German, English, and Spanish voice packs
- **Timing Controls**: Adjustable gaps between digits, groups, and sections
- **Background Noise**: Optional static noise for authentic atmosphere

### Manual Dialer
- **Live Input**: Real-time keypad for manual transmission
- **Keyboard Shortcuts**: Number keys (0-9), * (Achtung), / (Trennung), + (Ende)
- **Immediate Playback**: Sounds play instantly as you type

### User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Organized Panels**: Composer, Cipher tools, Audio settings, Dialer, Controls
- **Help Tooltips**: Contextual help for all features

## Quick Start

1. **Open the Application**: Load `index.html` in a modern web browser
2. **Enter Message**: Type your message in the composer panel
3. **Choose Cipher**: Select A1Z26 or Straddling Checkerboard encoding
4. **Select Mode**: Choose Voice or Morse code (CW) transmission
5. **Press Play**: Start the transmission

## Project Structure

```
sprach/
├── index.html              # Main application page
├── styles.css              # Application styles and themes
├── js/                     # JavaScript modules
│   ├── app.js             # Application entry point
│   ├── ui.js              # User interface controller
│   ├── encoder.js         # Text encoding (A1Z26, Checkerboard)
│   ├── otp.js             # One-Time Pad encryption
│   ├── xor.js             # XOR encryption utility
│   ├── audio.js           # Voice playback system
│   └── morse.js           # Morse code generation
├── config/
│   └── voicepacks.json    # Voice pack configuration
├── voices/                 # Voice pack directories
│   ├── de/                # German voice pack
│   ├── en/                # English voice pack
│   └── es/                # Spanish voice pack
└── README.md              # This file
```

## Voice Packs

The application supports multiple voice packs for authentic multilingual transmissions:

### Required Files (per voice pack)
- **Digits**: `0.wav` through `9.wav`
- **Control Words**: `achtung.wav`, `trennung.wav`, `ende.wav`

### Audio Specifications
- Format: WAV (16-bit, 44.1kHz, Mono)
- Duration: Digits ~0.5-1.0s, Control words ~1.0-2.0s
- Style: Clear, consistent robotic voice

### Adding Voice Packs
1. Create directory in `voices/` (e.g., `voices/fr/`)
2. Add required WAV files with exact filenames
3. Update `config/voicepacks.json` if needed
4. Voice pack will appear in selector automatically

## Cipher Systems

### A1Z26 Cipher
- A=01, B=02, C=03, ..., Z=26
- Numbers remain unchanged
- Spaces and punctuation ignored

### Straddling Checkerboard
- Advanced cipher using a 10×3 grid
- Requires a keyword for key generation
- More secure than simple substitution

### One-Time Pad (OTP)
- Mathematically unbreakable when used correctly
- Uses mod-10 arithmetic for numeric data
- **Demo purposes only** - never reuse keys in practice

## Morse Code (CW)

- **Frequency Control**: 300-3000 Hz (default: 800 Hz)
- **Speed Control**: 5-60 WPM (default: 20 WPM)
- **Proper Timing**: Correct dit/dah ratios and spacing
- **Character Support**: Digits 0-9 and control words

## Keyboard Shortcuts

### Dialer (when not in input fields)
- `0-9`: Enter digits
- `*`: Achtung (attention)
- `/`: Trennung (separation)
- `+`: Ende (end)

### Global
- `Ctrl/Cmd + Space`: Play/Stop transmission

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (iOS 13.4+)
- **Requirements**: ES6 modules, Web Audio API, modern CSS

## Technical Details

### Web Audio API
- Gapless playback using scheduled buffer sources
- Precise timing for authentic transmission feel
- Master volume control and noise mixing

### ES6 Modules
- Clean separation of concerns
- No external dependencies or CDNs
- Fully offline-capable

### Responsive Design
- Mobile-first CSS approach
- Touch-friendly controls
- Adaptive layouts for all screen sizes

## Security Notes

- **Educational Purpose**: This simulator is for educational and entertainment use
- **OTP Warning**: Never reuse One-Time Pad keys in real applications
- **No Data Collection**: All processing happens locally in your browser
- **Offline Capable**: No network requests after initial load

## Development

### Local Development
1. Clone or download the project
2. Serve files via HTTP (required for ES6 modules)
3. Use `python -m http.server` or similar local server
4. Open `http://localhost:8000` in browser

### GitHub Pages Deployment
1. Push to GitHub repository
2. Enable GitHub Pages in repository settings
3. Select source branch (usually `main` or `gh-pages`)
4. Application will be available at `https://username.github.io/repository-name`

## Troubleshooting

### Audio Issues
- **No Sound**: Check browser autoplay policy, click page first
- **Choppy Playback**: Ensure stable network for voice pack loading
- **Missing Voices**: Check voice pack files are present and correctly named

### Performance
- **Slow Loading**: Voice packs are loaded on-demand
- **Memory Usage**: Audio files are cached for gapless playback
- **Mobile Performance**: CW mode uses less resources than voice mode

## License

This project is open source. Voice packs and audio content may have separate licensing requirements.

## Contributing

Contributions welcome! Areas of interest:
- Additional voice packs and languages
- New cipher implementations
- UI/UX improvements
- Audio recording and export features
- Performance optimizations

## Acknowledgments

- Inspired by historical numbers stations and Stasi communication methods
- Built with modern web technologies for educational purposes
- Thanks to the amateur radio and cryptography communities