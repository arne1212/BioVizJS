/**
 * Provides methods to be mixed into the visualizations to create an accompaniying sound effect of the heart beat
 */
const AudioMixin = {
    // number of audio outputs depends on the frequency of the hearbeats
    playHeartbeatSound(heartRate) {
        const intervalMs = (60 / heartRate) * 1000;
        this.heartbeatInterval = setInterval(() => {
            this.playSound();
        }, intervalMs);
    },

    playSound() {
        if(!this.isAudioInitialized) {
            this.initAudio();
        }
        const currentTime = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        // base sine soundwave ressembling heartbeats
        osc.type = "sine";
        osc.frequency.setValueAtTime(70, currentTime);
        
        // controls the volume during the "beat"
        gain.gain.setValueAtTime(0, currentTime);
        gain.gain.linearRampToValueAtTime(1, currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(currentTime);
        osc.stop(currentTime + 0.15);
    },

    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
        this.isAudioInitialized = true;
    },  
};

export default AudioMixin;