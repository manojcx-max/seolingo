"use client";

/**
 * 🦁 RoarRank Audio System
 * Manages game sounds with fallback to generated tones.
 */

class SoundManager {
    private static instance: SoundManager;
    private audioContext: AudioContext | null = null;
    private isInitialized = false;

    private constructor() {
        // Hidden initialization until first user interaction
    }

    static getInstance() {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    private initContext() {
        if (typeof window === "undefined") return;
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.audioContext.state === "suspended") {
            this.audioContext.resume();
        }
        this.isInitialized = true;
    }

    /**
     * Play a sound file with oscillator fallback
     */
    async play(type: "success" | "error" | "roar" | "step") {
        this.initContext();
        if (!this.audioContext) return;

        try {
            // Preferred: Play files from /public/sounds/
            const filePaths = {
                success: "/sounds/correct.mp3",
                error: "/sounds/wrong.mp3",
                roar: "/sounds/roar.mp3",
                step: "/sounds/step.mp3",
            };

            const path = filePaths[type];
            const audio = new Audio(path);
            audio.volume = type === "roar" ? 0.6 : 0.4;

            try {
                await audio.play();
            } catch (fileError) {
                // Fallback to generated tones if file missing or blocked
                console.warn(`Sound file ${path} not found or blocked. Using fallback synth.`);
                if (type === "success") this.synthSuccess();
                if (type === "error") this.synthError();
                if (type === "roar") this.synthRoarFallback();
            }
        } catch (e) {
            console.error("Audio playback failed", e);
        }
    }

    private synthSuccess() {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc2.type = "sine";

        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.1); // G5
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc2.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6

        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
    }

    private synthError() {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    }

    private synthRoarFallback() {
        if (!this.audioContext) return;
        const ctx = this.audioContext;
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.5);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start();
        noise.stop(ctx.currentTime + 0.5);
    }
}

export const playSound = (type: "success" | "error" | "roar" | "step") => {
    SoundManager.getInstance().play(type);
};
