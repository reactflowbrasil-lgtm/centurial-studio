/**
 * Sound Utility for Centurial SGPG
 * Provides maximum volume notifications for system events.
 */

const SOUND_URLS = {
    success: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Doorbell / Success
    update: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',  // Bell / Update
    error: 'https://assets.mixkit.co/active_storage/sfx/2353/2353-preview.mp3',   // Alert / Error
};

export type SoundType = keyof typeof SOUND_URLS;

class SoundManager {
    private static instance: SoundManager;
    private audioCache: Map<string, HTMLAudioElement> = new Map();

    private constructor() { }

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    public play(type: SoundType) {
        try {
            let audio = this.audioCache.get(type);

            if (!audio) {
                audio = new Audio(SOUND_URLS[type]);
                this.audioCache.set(type, audio);
            }

            // Force reset to start
            audio.currentTime = 0;
            // Set volume to maximum as requested
            audio.volume = 1.0;

            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('🔇 Sound playback blocked by browser. User interaction needed.', error);
                });
            }
        } catch (err) {
            console.error('Error playing sound:', err);
        }
    }
}

export const playSound = (type: SoundType) => SoundManager.getInstance().play(type);
