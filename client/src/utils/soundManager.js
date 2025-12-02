class SoundManager {
    constructor() {
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.3;
        this.initSounds();
    }

    initSounds() {
        // Create audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Define sound frequencies and patterns
        this.soundPatterns = {
            click: { frequency: 800, duration: 0.05, type: 'sine' },
            hover: { frequency: 600, duration: 0.03, type: 'sine' },
            success: { frequency: 1200, duration: 0.2, type: 'sine' },
            error: { frequency: 300, duration: 0.3, type: 'sawtooth' },
            whoosh: { frequency: 400, duration: 0.4, type: 'sawtooth' },
            notification: { frequency: 1000, duration: 0.15, type: 'square' },
        };
    }

    playSound(soundName) {
        if (!this.enabled || !this.audioContext) return;

        const pattern = this.soundPatterns[soundName];
        if (!pattern) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = pattern.frequency;
        oscillator.type = pattern.type;

        // Envelope for smooth sound
        const now = this.audioContext.currentTime;
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.volume, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + pattern.duration);

        oscillator.start(now);
        oscillator.stop(now + pattern.duration);
    }

    playSequence(sounds, interval = 100) {
        sounds.forEach((sound, index) => {
            setTimeout(() => this.playSound(sound), index * interval);
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;

// React hook for easy usage
export function useSoundEffects() {
    const playClick = () => soundManager.playSound('click');
    const playHover = () => soundManager.playSound('hover');
    const playSuccess = () => soundManager.playSound('success');
    const playError = () => soundManager.playSound('error');
    const playWhoosh = () => soundManager.playSound('whoosh');
    const playNotification = () => soundManager.playSound('notification');

    return {
        playClick,
        playHover,
        playSuccess,
        playError,
        playWhoosh,
        playNotification,
        toggle: () => soundManager.toggle(),
        setVolume: (vol) => soundManager.setVolume(vol),
    };
}
