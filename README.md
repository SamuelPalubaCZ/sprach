# Stasi Speech Machine

A comprehensive web-based number station simulator and cryptographic toolkit. This application provides professional-grade audio generation, encryption capabilities, and manual tone control for secure communications simulation.

## 🎯 Core Features

### 📡 Audio Transmitter
- **Voice Synthesis**: Generate spoken audio from call signs and messages
- **Morse Code Generation**: Convert text to authentic Morse code audio
- **Configurable Parameters**: Adjust speed, pitch, WPM rate, and tone frequency
- **Professional Audio Output**: High-quality WAV file generation and download
- **Real-time Playback**: Instant audio preview and control

### 🔐 Cipher Operations
- **XOR Encryption/Decryption**: Military-grade cipher implementation
- **Key Strength Analysis**: Real-time security assessment
- **Seamless Workflow**: Direct integration with audio transmitter
- **Character Counter**: Track message length and cipher complexity
- **Activity Logging**: Complete operation history

### 🎹 Manual Tone Generator
- **Numeric Keypad**: Individual digit audio playback (0-9)
- **Special Signals**: Achtung, Trennung, and Ende commands
- **Custom Tone Generation**: Adjustable frequency and duration
- **Real-time Controls**: Volume and timing adjustment

### 🎨 Professional Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Clean UI**: Intuitive navigation and controls
- **Real-time Feedback**: Status indicators and progress tracking
- **Accessibility**: Keyboard shortcuts and screen reader support

## 🚀 Quick Start

### Audio Transmission
1. Navigate to the **Transmitter** page
2. Enter your call sign (station identification)
3. Input your message content
4. Select transmission mode (Voice Synthesis or Morse Code)
5. Adjust audio parameters as needed
6. Click **Generate Audio** to create your transmission
7. Use **Play**, **Stop**, or **Download** controls

### Message Encryption
1. Go to the **Cipher** page
2. Enter your plaintext message
3. Generate or input a cipher key
4. Click **Encrypt** to secure your message
5. Copy the encrypted output to the transmitter
6. Use **Decrypt** to recover original messages

### Manual Operations
1. Access the **Manual Tones** page
2. Use the numeric keypad for individual digits
3. Trigger special signals (Achtung, Trennung, Ende)
4. Adjust volume and duration controls
5. Generate custom frequency tones

## 🛠️ Technical Specifications

### Audio Engine
- **Web Audio API**: Modern browser-based audio processing
- **Sample Rate**: 44.1kHz professional quality
- **Format**: Uncompressed WAV output
- **Latency**: Real-time generation and playback

### Encryption
- **Algorithm**: XOR cipher with variable key length
- **Character Encoding**: UTF-8 with numeric representation
- **Key Generation**: Cryptographically secure random keys
- **Security**: Suitable for educational and simulation purposes

### Browser Compatibility
- **Modern Browsers**: Chrome 66+, Firefox 60+, Safari 11.1+, Edge 79+
- **Mobile Support**: iOS Safari, Chrome Mobile, Samsung Internet
- **Requirements**: Web Audio API, ES6 support

## 🌐 Deployment

### GitHub Pages
This application is deployed using GitHub Pages with Jekyll:
- **Live Site**: [https://paluba.me/sprach/](https://paluba.me/sprach/)
- **Automatic Deployment**: Push to main branch triggers rebuild
- **Custom Domain**: Configured with CNAME

### Local Development
```bash
# Clone the repository
git clone https://github.com/username/sprach.git
cd sprach

# Install Jekyll dependencies
bundle install

# Serve locally
bundle exec jekyll serve
# OR use Python for simple serving
python3 -m http.server 4000

# Access at http://localhost:4000
```

### File Structure
```
sprach/
├── _layouts/default.html    # Main page template
├── assets/
│   ├── js/
│   │   ├── sprach.js        # Core functionality
│   │   └── buffer-loader.js # Audio file loader
│   ├── sounds/              # Audio samples (0-9, signals)
│   └── css/                 # Styling and themes
├── index.md                 # Home page
├── transmitter.md           # Audio generation
├── cipher.md                # Encryption tools
├── manual_tones.md          # Manual controls
└── _config.yml              # Jekyll configuration
```

## 🔧 Configuration

### Audio Settings
- **Default WPM**: 5-50 words per minute for Morse code
- **Frequency Range**: 300-2000Hz for tone generation
- **Volume Control**: 0-100% with fade in/out
- **Buffer Size**: Optimized for real-time processing

### Cipher Settings
- **Key Length**: 1-256 characters recommended
- **Character Set**: Full UTF-8 support
- **Output Format**: Space-separated numeric codes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Test all audio functionality across browsers
- Ensure mobile responsiveness
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **Original Concept**: tom|hetmer|cz
- **Rebuild & Design**: SamuelPalubaCZ
- **Audio Samples**: Custom generated for educational use
- **Inspiration**: Historical number stations and cryptographic systems

## 🔗 Links

- **Live Demo**: [https://paluba.me/sprach/](https://paluba.me/sprach/)
- **GitHub Repository**: [https://github.com/username/sprach](https://github.com/username/sprach)
- **Issues & Feedback**: [GitHub Issues](https://github.com/username/sprach/issues)

---

*Built with ❤️ for educational and historical simulation purposes*
