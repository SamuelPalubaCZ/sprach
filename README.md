# 🔊 Sprach Machine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/SamuelPalubaCZ/sprach.svg?style=social&label=Star)](https://github.com/SamuelPalubaCZ/sprach)
[![GitHub forks](https://img.shields.io/github/forks/SamuelPalubaCZ/sprach.svg?style=social&label=Fork)](https://github.com/SamuelPalubaCZ/sprach)

**Pokročilý simulátor number station s funkcemi šifrování a generování audio zpráv**

## 📖 Obsah

- [O projektu](#o-projektu)
- [Funkce](#funkce)
- [Technologie](#technologie)
- [Instalace](#instalace)
- [Použití](#použití)
- [API Reference](#api-reference)
- [Příklady](#příklady)
- [Přispívání](#přispívání)
- [Roadmap](#roadmap)
- [FAQ](#faq)
- [Licence](#licence)

## 🌟 O projektu

Sprach Machine je moderní webová aplikace simulující number station - tajné radio stanice používané pro přenos šifrovaných zpráv. Projekt kombinuje historickou fascinaci s moderními webovými technologiemi a poskytuje uživatelům nástroje pro:

- **Generování audio zpráv** s pokročilými možnostmi nastavení
- **Šifrování a dešifrování** textu pomocí XOR šifry
- **Simulaci radio komunikace** s autentickými zvukovými efekty
- **Vzdělávací účely** v oblasti kryptografie a radio komunikace

### 🎯 Cíle projektu

- Poskytnout realistický simulátor number station
- Demonstrovat principy kryptografie
- Vzdělávat o historii tajných radio komunikací
- Nabídnout moderní, responzivní webové rozhraní

## ✨ Funkce

### 🔐 Šifrovací nástroje
- **XOR šifra** s konfigurovatelnými klíči
- **Automatické generování** číselných kódů
- **Dešifrování** zašifrovaných zpráv
- **Export** zašifrovaných dat

### 🎵 Audio generátor
- **Číselné tóny** (0-9)
- **Speciální signály** (Achtung, Trennung, Ende)
- **Nastavitelná rychlost** a výška tónu
- **Automatické pauzy** mezi čísly
- **Export WAV souborů**

### 🎛️ Pokročilé nastavení
- **Volací znaky** s opakováním
- **Časování pauz** (krátké/longé)
- **Kvalita zvuku** (sample rate, bit depth)
- **Responzivní design** pro všechna zařízení

### 🌐 Moderní webové rozhraní
- **Material Design** inspirovaný UI
- **Dark mode** podpora
- **Přístupnost** (WCAG 2.1)
- **Progressive Web App** funkce

## 🛠️ Technologie

### Frontend
- **HTML5** - Sémantická struktura
- **CSS3** - Moderní styly a animace
- **JavaScript (ES6+)** - Interaktivita
- **Web Audio API** - Generování zvuku

### Audio Processing
- **OfflineAudioContext** - Offline rendering
- **AudioBuffer** - Manipulace s audio daty
- **WAV export** - Standardní audio formát

### Kryptografie
- **XOR cipher** - Symetrická šifra
- **Character encoding** - UTF-8 podpora
- **Key management** - Bezpečné ukládání klíčů

### Build Tools
- **Vanilla JavaScript** - Žádné frameworky
- **CSS Grid & Flexbox** - Moderní layout
- **Responsive Design** - Mobile-first přístup

## 🚀 Instalace

### Požadavky
- Moderní webový prohlížeč (Chrome 66+, Firefox 60+, Safari 11+)
- Web Audio API podpora
- HTTPS nebo localhost (pro audio funkce)

### Rychlá instalace

1. **Klonujte repository:**
```bash
git clone https://github.com/SamuelPalubaCZ/sprach.git
cd sprach
```

2. **Spusťte lokální server:**
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

3. **Otevřete prohlížeč:**
```
http://localhost:8000
```

### Docker instalace

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

```bash
docker build -t sprach-machine .
docker run -p 8000:80 sprach-machine
```

### NPM package (plánováno)

```bash
npm install sprach-machine
```

## 📖 Použití

### Základní použití

1. **Generování audio zprávy:**
   - Zadejte volací znak (např. "271")
   - Napište číselnou zprávu
   - Nastavte parametry (rychlost, výška tónu)
   - Klikněte "Generate Audio File"

2. **Šifrování textu:**
   - Zadejte plaintext do pole "Plaintext"
   - Zadejte šifrovací klíč (např. "STASI")
   - Klikněte "Encrypt"
   - Zkopírujte zašifrovaný text

3. **Dešifrování:**
   - Vložte zašifrovaný text do pole "Ciphertext"
   - Zadejte stejný klíč
   - Klikněte "Decrypt"

### Pokročilé funkce

#### Audio nastavení
```javascript
// Nastavení rychlosti
const speed = 1.5; // 0.5 - 2.0

// Nastavení výšky tónu
const pitch = 1.2; // 0.5 - 2.0

// Automatické pauzy
const autoPause = true;
const pauseDuration = 150; // ms
```

#### Šifrovací klíče
```javascript
// Doporučené klíče
const keys = [
    "STASI",      // Historický
    "ENIGMA",     // Klasický
    "CIPHER",     // Standardní
    "SECRET",     // Bezpečný
    "RADIO"       // Tématický
];
```

### Klávesové zkratky

| Funkce | Klávesa |
|--------|---------|
| Generovat audio | `Ctrl + Enter` |
| Šifrovat | `Ctrl + E` |
| Dešifrovat | `Ctrl + D` |
| Kopírovat | `Ctrl + C` |

## 🔧 API Reference

### Hlavní funkce

#### `generateAudio()`
Generuje audio soubor ze zadané zprávy.

```javascript
async function generateAudio() {
    // Načte všechny ovládací prvky
    const call = document.getElementById("call").value;
    const body = document.getElementById("body").value;
    const pitch = parseFloat(document.getElementById('pitch-control').value);
    const speed = parseFloat(document.getElementById('speed-control').value);
    
    // Generuje audio...
}
```

#### `xorCipher(text, key)`
Implementuje XOR šifru pro text.

```javascript
function xorCipher(text, key) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const keyCode = key.charCodeAt(i % key.length);
        result += String.fromCharCode(charCode ^ keyCode);
    }
    return result;
}
```

#### `playSound(key, time)`
Přehrává zvukový tón.

```javascript
function playSound(key, time) {
    if (!isNaN(key) && key >= 0 && key <= 12) {
        const source = context.createBufferSource();
        source.buffer = window.sounds[key];
        source.connect(context.destination);
        source.start(time);
    }
}
```

### Audio API

#### `audioBufferToWav(buffer)`
Konvertuje AudioBuffer na WAV formát.

```javascript
function audioBufferToWav(buffer) {
    // Vytvoří WAV header
    // Zpracuje PCM data
    // Vrátí Blob s WAV souborem
}
```

### Event Handlers

```javascript
// Šifrování
document.getElementById('encrypt-button').addEventListener('click', encryptText);

// Dešifrování
document.getElementById('decrypt-button').addEventListener('click', decryptText);

// Kopírování
document.getElementById('copy-to-clipboard-button').addEventListener('click', copyToClipboard);
```

## 📝 Příklady

### Základní šifrování

```javascript
// Šifrování textu
const plaintext = "HELLO WORLD";
const key = "STASI";
const encrypted = xorCipher(plaintext, key);

// Výsledek: číselné kódy oddělené mezerami
console.log(encrypted);
```

### Generování audio zprávy

```javascript
// Nastavení parametrů
const message = "123 456 789";
const speed = 1.2;
const pitch = 1.1;

// Generování audio
generateAudio(message, speed, pitch);
```

### Vlastní zvukové efekty

```javascript
// Přehrání speciálních tónů
playSound(10, 0);  // Achtung
playSound(11, 0);  // Trennung
playSound(12, 0);  // Ende
```

## 🤝 Přispívání

Vítáme všechny příspěvky! Prosím, přečtěte si naše pokyny pro přispívání.

### Jak přispět

1. **Fork** repository
2. **Vytvořte feature branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** změny:**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** do branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Otevřete Pull Request**

### Pokyny pro kód

- Používejte **ES6+** syntax
- Dodržujte **ESLint** pravidla
- Pište **JSDoc** komentáře
- Testujte na **všech prohlížečích**
- Dodržujte **accessibility** standardy

### Reportování bugů

Použijte [GitHub Issues](https://github.com/SamuelPalubaCZ/sprach/issues) a zahrňte:

- Popis problému
- Kroky k reprodukci
- Očekávané vs. skutečné chování
- Screenshots (pokud relevantní)
- Informace o prohlížeči a OS

## 🗺️ Roadmap

### Verze 1.1 (Q1 2025)
- [ ] **Více šifrovacích algoritmů** (AES, RSA)
- [ ] **Export do MP3/OGG** formátů
- [ ] **Batch processing** více zpráv
- [ ] **Cloud storage** pro zprávy

### Verze 1.2 (Q2 2025)
- [ ] **Real-time radio simulace**
- [ ] **Multi-language** podpora
- [ ] **Advanced audio effects**
- [ ] **Mobile app** (React Native)

### Verze 2.0 (Q3 2025)
- [ ] **Blockchain** integrace
- [ ] **AI-powered** kryptoanalýza
- [ ] **Social features** (sdílení zpráv)
- [ ] **Enterprise** verze

### Dlouhodobé plány
- [ ] **Quantum cryptography** simulace
- [ ] **Satellite communication** modely
- [ ] **Educational platform** integrace
- [ ] **Open source** ekosystém

## ❓ FAQ

### Q: Co je number station?
A: Number station je tajná radio stanice vysílající šifrované zprávy v podobě čísel nebo kódů. Byly používány během studené války a dodnes existují.

### Q: Je šifrování bezpečné?
A: XOR šifra je základní kryptografický nástroj. Pro produkční použití doporučujeme moderní algoritmy jako AES nebo RSA.

### Q: Jaké prohlížeče podporujete?
A: Podporujeme všechny moderní prohlížeče s Web Audio API: Chrome 66+, Firefox 60+, Safari 11+, Edge 79+.

### Q: Můžu použít vlastní zvuky?
A: Ano! Nahraďte soubory v `/sounds/` složce vlastními WAV soubory.

### Q: Je aplikace open source?
A: Ano, projekt je licencován pod MIT licencí. Můžete ho volně používat, modifikovat a distribuovat.

### Q: Jak přispět k projektu?
A: Fork repository, vytvořte feature branch a otevřete Pull Request. Vítáme všechny příspěvky!

## 📄 Licence

Tento projekt je licencován pod **MIT License** - viz [LICENSE](LICENSE) soubor pro detaily.

```
MIT License

Copyright (c) 2024 SamuelPalubaCZ

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Poděkování

- **Original author**: tom|hetmer|cz (2014)
- **Rebuilt by**: SamuelPalubaCZ (2025)
- **Contributors**: Všichni, kteří přispěli k projektu
- **Community**: Open source komunita

## 📞 Kontakt

- **GitHub**: [@SamuelPalubaCZ](https://github.com/SamuelPalubaCZ)
- **Repository**: [sprach](https://github.com/SamuelPalubaCZ/sprach)
- **Issues**: [GitHub Issues](https://github.com/SamuelPalubaCZ/sprach/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SamuelPalubaCZ/sprach/discussions)

## 🌟 Stargazers

[![Stargazers repo roster for @SamuelPalubaCZ/sprach](https://reporoster.com/stars/SamuelPalubaCZ/sprach)](https://github.com/SamuelPalubaCZ/sprach/stargazers)

---

**Made with ❤️ by SamuelPalubaCZ**

*Pokud se vám projekt líbí, dejte mu hvězdičku na GitHubu!*
