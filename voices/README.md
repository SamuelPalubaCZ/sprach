# Voice Packs for Numbers Station Simulator

This directory contains voice packs for the Numbers Station Simulator. Each voice pack provides audio files for digits (0-9) and control words (Achtung, Trennung, Ende).

## Directory Structure

```
voices/
├── de/          # German voice pack (default)
├── en/          # English voice pack
├── es/          # Spanish voice pack
└── README.md    # This file
```

## Voice Pack Requirements

Each voice pack directory must contain the following WAV files:

### Digit Files
- `0.wav` - Zero
- `1.wav` - One
- `2.wav` - Two
- `3.wav` - Three
- `4.wav` - Four
- `5.wav` - Five
- `6.wav` - Six
- `7.wav` - Seven
- `8.wav` - Eight
- `9.wav` - Nine

### Control Word Files
- `achtung.wav` - Attention signal (start of transmission)
- `trennung.wav` - Separation signal (between sections)
- `ende.wav` - End signal (end of transmission)

## Audio Specifications

- **Format**: WAV (uncompressed)
- **Sample Rate**: 44.1 kHz recommended
- **Bit Depth**: 16-bit recommended
- **Channels**: Mono (1 channel)
- **Duration**: Keep files short and consistent
  - Digits: ~0.5-1.0 seconds
  - Control words: ~1.0-2.0 seconds

## Creating Voice Packs

1. Create a new directory with a language code (e.g., `fr/` for French)
2. Record or generate the required audio files
3. Ensure consistent volume levels across all files
4. Test with the simulator to verify proper playback

## Fallback Behavior

If a voice pack is missing files, the simulator will:
1. Try to use the German (`de/`) voice pack as fallback
2. Skip missing audio if no fallback is available
3. Continue transmission with available files

## Adding New Voice Packs

To add support for a new voice pack:
1. Create the voice pack directory with required files
2. Update `config/voicepacks.json` with the new pack configuration
3. The pack will automatically appear in the voice pack selector

## Notes

- Voice packs are loaded on-demand when selected
- The German voice pack is loaded by default
- All audio files are cached in memory for gapless playback
- Missing voice pack directories will not cause errors