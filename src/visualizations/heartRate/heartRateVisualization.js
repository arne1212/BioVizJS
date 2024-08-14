import { Visualization } from "../visualization.js";
// import AudioMixin from './heartRateAudioEffects.js';

const AudioMixin = {
    heartbeatInterval: null,

    playHeartbeatSound(heartRate) {
        // Stoppe das bestehende Intervall, falls vorhanden
        this.stopHeartbeat();

        // Setze ein neues Intervall
        const intervalMs = (60 / heartRate) * 1000;
        this.heartbeatInterval = setInterval(() => {
            this.playSound();
        }, intervalMs);
    },

    stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
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

/**
 * @abstract
 * base class for heart rate visualizations
 */
export class HeartRateVisualization extends Visualization {

    /**
     * 
     * @param {string} containerId - the id of the html element which will contain the heart rate visualization
     */
    constructor(containerId, options = {}) {

        // surpresses the instantiation of abstract class
        if (new.target === HeartRateVisualization) {
            throw new TypeError("Cannot construct Abstract instances directly");
        }

        super(containerId);
        this.valueVisible;
        this.referenceVal;
        this.audio = options.audio;
        this.svgElement;

        if ('referenceValue' in options) {
            if (typeof options.referenceValue !== 'number' || options.referenceValue < 0) {
                throw new Error('referenceValue must be a number that is at least 0');
            }
            this.referenceVal = options.referenceValue;
        } else {
            this.referenceVal = 70; //default value
        }

        this.valueVisible = 'valueVisible' in options ? Boolean(options.valueVisible) : false; 

        // mixin desgin pattern to add audiofunctionality
        Object.assign(this, AudioMixin);
    }

    /**
     * @abstract
     * 
     * draws the heart rate visualization onto the screen
     */
    draw() {
        throw new Error("Abstract method 'draw' can't be executed. Must be overridden in Subclass.");
    }

    /**
     * 
     * @param {number} heartRate - the new heart rate value to visualize
     */
    update(heartRate) {
        throw new Error("Abstract method can't be executed. Must be overridden in Subclass.");
    }
}