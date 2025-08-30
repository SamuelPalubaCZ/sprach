/**
 * Morse Code Trainer for Sprach Machine
 * Educational module for learning Morse code reception
 */

class MorseTrainer {
    constructor() {
        this.isTraining = false;
        this.currentSession = null;
        this.stats = {
            correctChars: 0,
            totalChars: 0,
            sessionsCompleted: 0,
            averageWPM: 0,
            accuracyHistory: []
        };
        
        this.trainingModes = {
            letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            numbers: '0123456789',
            mixed: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            prosigns: 'AR AS K SK BT',
            callsigns: true // Generate random callsigns
        };

        this.morseCode = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
            '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
            '8': '---..', '9': '----.', '/': '-..-.', '+': '.-.-.', 
            'AR': '.-.-.', 'AS': '.-...', 'K': '-.-', 'SK': '...-.-', 'BT': '-...-'
        };

        this.reverseCode = {};
        Object.keys(this.morseCode).forEach(key => {
            this.reverseCode[this.morseCode[key]] = key;
        });

        this.initializeTrainer();
    }

    initializeTrainer() {
        this.createTrainerInterface();
        this.loadStats();
        this.updateStatsDisplay();
    }

    createTrainerInterface() {
        const trainerHTML = `
            <div class="trainer-container" id="morse-trainer">
                <div class="control-panel">
                    <div class="panel-header">
                        <h2 class="panel-title">Morse Code Trainer</h2>
                        <div class="panel-status">
                            <span id="trainer-status">Ready</span>
                        </div>
                    </div>

                    <div class="settings-grid">
                        <div class="settings-section">
                            <div class="settings-header">Training Mode</div>
                            
                            <div class="mode-selector">
                                <button class="mode-option active" data-mode="numbers">Numbers</button>
                                <button class="mode-option" data-mode="letters">Letters</button>
                                <button class="mode-option" data-mode="mixed">Mixed</button>
                                <button class="mode-option" data-mode="prosigns">Pro-signs</button>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Speed (WPM)</label>
                                <input type="range" id="trainer-wpm" class="range-input" min="5" max="40" value="15">
                                <span class="range-value">15</span>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Frequency (Hz)</label>
                                <input type="range" id="trainer-freq" class="range-input" min="400" max="1200" value="800">
                                <span class="range-value">800</span>
                            </div>

                            <div class="form-group">
                                <label class="form-label">Group Length</label>
                                <select id="group-length" class="form-select">
                                    <option value="1">Single Characters</option>
                                    <option value="5" selected>5-Character Groups</option>
                                    <option value="10">10-Character Groups</option>
                                    <option value="callsign">Random Callsigns</option>
                                </select>
                            </div>
                        </div>

                        <div class="settings-section">
                            <div class="settings-header">Session Settings</div>
                            
                            <div class="form-group">
                                <label class="form-label">Session Length</label>
                                <select id="session-length" class="form-select">
                                    <option value="10">10 Groups</option>
                                    <option value="20" selected>20 Groups</option>
                                    <option value="50">50 Groups</option>
                                    <option value="100">100 Groups</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="extra-spacing">
                                    <input type="checkbox" id="extra-spacing"> Extra Character Spacing
                                </label>
                            </div>

                            <div class="form-group">
                                <label for="noise-enabled">
                                    <input type="checkbox" id="noise-enabled"> Add Background Noise
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="trainer-controls">
                        <button id="start-training" class="btn btn-primary btn-large">Start Training Session</button>
                        <button id="stop-training" class="btn" disabled>Stop Session</button>
                        <button id="repeat-last" class="btn" disabled>Repeat Last</button>
                        <button id="show-answer" class="btn">Show Answer</button>
                    </div>
                </div>

                <div class="training-area" id="training-area" style="display: none;">
                    <div class="morse-display">
                        <div class="morse-visual" id="morse-visual">
                            <div class="morse-dots-dashes" id="morse-pattern"></div>
                            <div class="morse-character" id="morse-character"></div>
                        </div>
                        
                        <div class="progress-indicator">
                            <div class="progress-bar">
                                <div class="progress-fill" id="training-progress"></div>
                            </div>
                            <span id="progress-text">0 / 20</span>
                        </div>
                    </div>

                    <div class="input-area">
                        <div class="form-group">
                            <label class="form-label">Your Answer</label>
                            <input type="text" id="morse-answer" class="form-input" placeholder="Type what you heard..." autocomplete="off">
                        </div>
                        
                        <div class="answer-feedback" id="answer-feedback"></div>
                        
                        <div class="trainer-actions">
                            <button id="submit-answer" class="btn btn-primary">Submit Answer</button>
                            <button id="next-group" class="btn" disabled>Next Group</button>
                            <button id="skip-group" class="btn">Skip</button>
                        </div>
                    </div>
                </div>

                <div class="stats-panel">
                    <div class="panel-header">
                        <h3 class="panel-title">Training Statistics</h3>
                    </div>
                    
                    <div class="stats-grid" id="stats-display">
                        <div class="stat-item">
                            <div class="stat-value" id="current-accuracy">0%</div>
                            <div class="stat-label">Current Accuracy</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="current-wpm">0</div>
                            <div class="stat-label">Effective WPM</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="total-sessions">0</div>
                            <div class="stat-label">Sessions Completed</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="average-accuracy">0%</div>
                            <div class="stat-label">Average Accuracy</div>
                        </div>
                    </div>
                </div>

                <div class="morse-reference" id="morse-reference">
                    <div class="panel-header">
                        <h3 class="panel-title">Morse Code Reference</h3>
                        <button id="toggle-reference" class="btn">Show/Hide</button>
                    </div>
                    <div class="reference-content" id="reference-content" style="display: none;">
                        <div class="reference-grid" id="reference-grid">
                            <!-- Generated dynamically -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insert trainer into page if training page exists
        const trainingPage = document.getElementById('training-content');
        if (trainingPage) {
            trainingPage.innerHTML = trainerHTML;
            this.bindTrainerEvents();
            this.generateReference();
        }
    }

    bindTrainerEvents() {
        // Mode selection
        const modeButtons = document.querySelectorAll('#morse-trainer .mode-option');
        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Range inputs
        const wpmRange = document.getElementById('trainer-wpm');
        const freqRange = document.getElementById('trainer-freq');
        
        if (wpmRange) {
            wpmRange.addEventListener('input', (e) => {
                const value = e.target.nextElementSibling;
                if (value) value.textContent = e.target.value;
            });
        }

        if (freqRange) {
            freqRange.addEventListener('input', (e) => {
                const value = e.target.nextElementSibling;
                if (value) value.textContent = e.target.value;
            });
        }

        // Training controls
        document.getElementById('start-training')?.addEventListener('click', () => this.startTrainingSession());
        document.getElementById('stop-training')?.addEventListener('click', () => this.stopTrainingSession());
        document.getElementById('repeat-last')?.addEventListener('click', () => this.repeatLast());
        document.getElementById('show-answer')?.addEventListener('click', () => this.showAnswer());
        document.getElementById('submit-answer')?.addEventListener('click', () => this.submitAnswer());
        document.getElementById('next-group')?.addEventListener('click', () => this.nextGroup());
        document.getElementById('skip-group')?.addEventListener('click', () => this.skipGroup());

        // Answer input
        const answerInput = document.getElementById('morse-answer');
        if (answerInput) {
            answerInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.submitAnswer();
                }
            });
        }

        // Reference toggle
        document.getElementById('toggle-reference')?.addEventListener('click', () => {
            const content = document.getElementById('reference-content');
            if (content) {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
            }
        });
    }

    generateReference() {
        const referenceGrid = document.getElementById('reference-grid');
        if (!referenceGrid) return;

        let html = '';
        Object.keys(this.morseCode).forEach(char => {
            if (char.length === 1) { // Single characters only
                html += `
                    <div class="reference-item">
                        <span class="ref-char">${char}</span>
                        <span class="ref-morse">${this.morseCode[char]}</span>
                        <button class="ref-play" data-char="${char}">♪</button>
                    </div>
                `;
            }
        });

        referenceGrid.innerHTML = html;

        // Add play buttons
        referenceGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('ref-play')) {
                const char = e.target.dataset.char;
                this.playMorseCharacter(char);
            }
        });
    }

    async startTrainingSession() {
        const mode = document.querySelector('#morse-trainer .mode-option.active')?.dataset.mode || 'numbers';
        const wpm = parseInt(document.getElementById('trainer-wpm')?.value || 15);
        const frequency = parseInt(document.getElementById('trainer-freq')?.value || 800);
        const groupLength = document.getElementById('group-length')?.value || '5';
        const sessionLength = parseInt(document.getElementById('session-length')?.value || 20);
        const extraSpacing = document.getElementById('extra-spacing')?.checked || false;
        const noiseEnabled = document.getElementById('noise-enabled')?.checked || false;

        this.currentSession = {
            mode,
            wpm,
            frequency,
            groupLength,
            sessionLength,
            extraSpacing,
            noiseEnabled,
            currentGroup: 0,
            correctAnswers: 0,
            groups: [],
            startTime: Date.now(),
            answers: []
        };

        // Generate training groups
        for (let i = 0; i < sessionLength; i++) {
            this.currentSession.groups.push(this.generateTrainingGroup(mode, groupLength));
        }

        this.isTraining = true;
        this.updateTrainingUI();
        this.nextGroup();
    }

    generateTrainingGroup(mode, length) {
        let characters;
        
        switch (mode) {
            case 'letters':
                characters = this.trainingModes.letters;
                break;
            case 'numbers':
                characters = this.trainingModes.numbers;
                break;
            case 'mixed':
                characters = this.trainingModes.mixed;
                break;
            case 'prosigns':
                return this.generateProsignGroup();
            default:
                characters = this.trainingModes.numbers;
        }

        if (length === 'callsign') {
            return this.generateCallsign();
        }

        let group = '';
        const groupLength = parseInt(length);
        
        for (let i = 0; i < groupLength; i++) {
            group += characters[Math.floor(Math.random() * characters.length)];
        }

        return group;
    }

    generateCallsign() {
        // Generate realistic callsigns
        const prefixes = ['W', 'K', 'N', 'A', 'VK', 'G', 'DL', 'JA', 'VE'];
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        
        let suffix = '';
        const length = Math.random() < 0.5 ? 3 : 4; // 3 or 4 character suffix
        
        for (let i = 0; i < length; i++) {
            if (i < 2) {
                // First two are usually numbers
                suffix += Math.floor(Math.random() * 10);
            } else {
                // Last characters are letters
                suffix += String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }

        return prefix + suffix;
    }

    generateProsignGroup() {
        const prosigns = ['AR', 'AS', 'K', 'SK', 'BT'];
        return prosigns[Math.floor(Math.random() * prosigns.length)];
    }

    async nextGroup() {
        if (!this.isTraining || !this.currentSession) return;

        const session = this.currentSession;
        if (session.currentGroup >= session.groups.length) {
            this.completeSession();
            return;
        }

        const currentGroup = session.groups[session.currentGroup];
        session.currentAnswer = currentGroup;

        // Update UI
        this.updateProgressDisplay();
        this.clearAnswer();

        // Play the morse code
        await this.playMorseGroup(currentGroup);
        
        // Enable answer input
        const answerInput = document.getElementById('morse-answer');
        if (answerInput) {
            answerInput.disabled = false;
            answerInput.focus();
        }
    }

    async playMorseGroup(group) {
        const session = this.currentSession;
        if (!session) return;

        // Show visual feedback
        this.showMorseVisual(group);

        // Play audio
        await this.playMorseString(group, session.wpm, session.frequency, session.extraSpacing);
    }

    async playMorseString(text, wpm, frequency, extraSpacing = false) {
        const dotDuration = 1.2 / wpm;
        const spacingMultiplier = extraSpacing ? 2 : 1;
        
        const timings = {
            dot: dotDuration,
            dash: dotDuration * 3,
            intraChar: dotDuration * spacingMultiplier,
            interChar: dotDuration * 3 * spacingMultiplier,
            word: dotDuration * 7 * spacingMultiplier
        };

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (this.morseCode[char]) {
                await this.playMorseCharacter(char, frequency, timings);
                if (i < text.length - 1) {
                    await this.delay(timings.interChar * 1000);
                }
            }
        }
    }

    async playMorseCharacter(char, frequency = 800, timings = null) {
        if (!timings) {
            const dotDuration = 1.2 / 20; // Default 20 WPM
            timings = {
                dot: dotDuration,
                dash: dotDuration * 3,
                intraChar: dotDuration
            };
        }

        const morse = this.morseCode[char];
        if (!morse) return;

        for (let i = 0; i < morse.length; i++) {
            const symbol = morse[i];
            const duration = symbol === '.' ? timings.dot : timings.dash;
            
            await this.playTone(frequency, duration);
            
            if (i < morse.length - 1) {
                await this.delay(timings.intraChar * 1000);
            }
        }
    }

    async playTone(frequency, duration) {
        if (!window.sprachMachine || !window.sprachMachine.audioContext) return;

        const audioContext = window.sprachMachine.audioContext;
        const gainNode = audioContext.createGain();
        const oscillator = audioContext.createOscillator();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        // Envelope for clean keying
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.005);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + duration - 0.005);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);

        await this.delay(duration * 1000);
    }

    showMorseVisual(group) {
        const patternDiv = document.getElementById('morse-pattern');
        const charDiv = document.getElementById('morse-character');
        
        if (patternDiv && charDiv) {
            let pattern = '';
            for (const char of group) {
                if (this.morseCode[char]) {
                    pattern += this.morseCode[char] + ' ';
                }
            }
            
            patternDiv.textContent = pattern.trim();
            charDiv.textContent = ''; // Hide the answer initially
        }
    }

    submitAnswer() {
        if (!this.isTraining || !this.currentSession) return;

        const answerInput = document.getElementById('morse-answer');
        if (!answerInput) return;

        const userAnswer = answerInput.value.toUpperCase().trim();
        const correctAnswer = this.currentSession.currentAnswer;
        const isCorrect = userAnswer === correctAnswer;

        // Record the answer
        this.currentSession.answers.push({
            correct: correctAnswer,
            user: userAnswer,
            isCorrect: isCorrect,
            timestamp: Date.now()
        });

        if (isCorrect) {
            this.currentSession.correctAnswers++;
            this.stats.correctChars += correctAnswer.length;
        }
        this.stats.totalChars += correctAnswer.length;

        // Show feedback
        this.showAnswerFeedback(isCorrect, correctAnswer, userAnswer);

        // Move to next group
        this.currentSession.currentGroup++;
        
        // Update controls
        const submitBtn = document.getElementById('submit-answer');
        const nextBtn = document.getElementById('next-group');
        
        if (submitBtn) submitBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = false;
        
        answerInput.disabled = true;
    }

    showAnswerFeedback(isCorrect, correct, user) {
        const feedbackDiv = document.getElementById('answer-feedback');
        if (!feedbackDiv) return;

        const className = isCorrect ? 'correct' : 'incorrect';
        let message = isCorrect ? '✓ Correct!' : '✗ Incorrect';
        
        if (!isCorrect) {
            message += `<br>Correct: <strong>${correct}</strong><br>Your answer: <strong>${user}</strong>`;
        }

        feedbackDiv.innerHTML = `<div class="feedback ${className}">${message}</div>`;

        // Show the answer in the visual display
        const charDiv = document.getElementById('morse-character');
        if (charDiv) {
            charDiv.textContent = correct;
        }
    }

    repeatLast() {
        if (!this.currentSession || this.currentSession.currentGroup === 0) return;

        const lastGroup = this.currentSession.groups[this.currentSession.currentGroup - 1];
        if (lastGroup) {
            this.playMorseGroup(lastGroup);
        }
    }

    showAnswer() {
        if (!this.currentSession) return;

        const correctAnswer = this.currentSession.currentAnswer;
        const answerInput = document.getElementById('morse-answer');
        
        if (answerInput && correctAnswer) {
            answerInput.value = correctAnswer;
        }

        const charDiv = document.getElementById('morse-character');
        if (charDiv) {
            charDiv.textContent = correctAnswer;
        }
    }

    skipGroup() {
        if (!this.isTraining || !this.currentSession) return;

        // Record as incorrect
        this.currentSession.answers.push({
            correct: this.currentSession.currentAnswer,
            user: '',
            isCorrect: false,
            skipped: true,
            timestamp: Date.now()
        });

        this.currentSession.currentGroup++;
        this.nextGroup();
    }

    completeSession() {
        if (!this.currentSession) return;

        const session = this.currentSession;
        const accuracy = (session.correctAnswers / session.groups.length) * 100;
        const duration = (Date.now() - session.startTime) / 1000;
        const effectiveWPM = (this.stats.totalChars / 5) / (duration / 60);

        // Update stats
        this.stats.sessionsCompleted++;
        this.stats.accuracyHistory.push(accuracy);
        this.stats.averageWPM = effectiveWPM;

        // Show results
        this.showSessionResults(accuracy, effectiveWPM, duration);

        // Clean up
        this.isTraining = false;
        this.currentSession = null;
        this.updateTrainingUI();
        this.saveStats();
    }

    showSessionResults(accuracy, wpm, duration) {
        const results = `
            <div class="session-results">
                <h3>Session Complete!</h3>
                <p><strong>Accuracy:</strong> ${accuracy.toFixed(1)}%</p>
                <p><strong>Effective WPM:</strong> ${wpm.toFixed(1)}</p>
                <p><strong>Duration:</strong> ${Math.floor(duration / 60)}:${(duration % 60).toFixed(0).padStart(2, '0')}</p>
                <p><strong>Correct Answers:</strong> ${this.currentSession.correctAnswers} / ${this.currentSession.groups.length}</p>
            </div>
        `;

        const feedbackDiv = document.getElementById('answer-feedback');
        if (feedbackDiv) {
            feedbackDiv.innerHTML = results;
        }

        this.updateStatsDisplay();
    }

    stopTrainingSession() {
        if (!this.isTraining) return;

        this.isTraining = false;
        this.currentSession = null;
        this.updateTrainingUI();
    }

    updateTrainingUI() {
        const trainingArea = document.getElementById('training-area');
        const startBtn = document.getElementById('start-training');
        const stopBtn = document.getElementById('stop-training');

        if (this.isTraining) {
            if (trainingArea) trainingArea.style.display = 'block';
            if (startBtn) startBtn.disabled = true;
            if (stopBtn) stopBtn.disabled = false;
        } else {
            if (trainingArea) trainingArea.style.display = 'none';
            if (startBtn) startBtn.disabled = false;
            if (stopBtn) stopBtn.disabled = true;
        }
    }

    updateProgressDisplay() {
        if (!this.currentSession) return;

        const progressFill = document.getElementById('training-progress');
        const progressText = document.getElementById('progress-text');

        if (progressFill) {
            const progress = (this.currentSession.currentGroup / this.currentSession.groups.length) * 100;
            progressFill.style.width = `${progress}%`;
        }

        if (progressText) {
            progressText.textContent = `${this.currentSession.currentGroup} / ${this.currentSession.groups.length}`;
        }
    }

    clearAnswer() {
        const answerInput = document.getElementById('morse-answer');
        const feedbackDiv = document.getElementById('answer-feedback');
        const submitBtn = document.getElementById('submit-answer');
        const nextBtn = document.getElementById('next-group');

        if (answerInput) {
            answerInput.value = '';
            answerInput.disabled = false;
        }
        if (feedbackDiv) feedbackDiv.innerHTML = '';
        if (submitBtn) submitBtn.disabled = false;
        if (nextBtn) nextBtn.disabled = true;
    }

    updateStatsDisplay() {
        const currentAccuracy = document.getElementById('current-accuracy');
        const currentWPM = document.getElementById('current-wpm');
        const totalSessions = document.getElementById('total-sessions');
        const averageAccuracy = document.getElementById('average-accuracy');

        if (currentAccuracy) {
            const accuracy = this.stats.totalChars > 0 ? 
                (this.stats.correctChars / this.stats.totalChars * 100) : 0;
            currentAccuracy.textContent = `${accuracy.toFixed(1)}%`;
        }

        if (currentWPM) {
            currentWPM.textContent = this.stats.averageWPM.toFixed(1);
        }

        if (totalSessions) {
            totalSessions.textContent = this.stats.sessionsCompleted;
        }

        if (averageAccuracy) {
            const avgAccuracy = this.stats.accuracyHistory.length > 0 ?
                this.stats.accuracyHistory.reduce((a, b) => a + b, 0) / this.stats.accuracyHistory.length : 0;
            averageAccuracy.textContent = `${avgAccuracy.toFixed(1)}%`;
        }
    }

    saveStats() {
        try {
            localStorage.setItem('sprachTrainerStats', JSON.stringify(this.stats));
        } catch (e) {
            console.warn('Could not save trainer stats to localStorage');
        }
    }

    loadStats() {
        try {
            const saved = localStorage.getItem('sprachTrainerStats');
            if (saved) {
                this.stats = { ...this.stats, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('Could not load trainer stats from localStorage');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize Morse Trainer
window.addEventListener('load', function() {
    setTimeout(() => {
        window.morseTrainer = new MorseTrainer();
    }, 1000);
});</absolute_file_name>
    </file>