// First, let's create a TextToSpeech utility class

// Add this to a new file: src/utils/TextToSpeech.js
export class TextToSpeech {
  constructor() {
    this.synth = window.speechSynthesis;
    this.utterance = null;
    this.isPlaying = false;
    this.voiceIndex = 0;
    this.voices = [];
  }

  init() {
    // Load available voices
    this.voices = this.synth.getVoices();
    
    // If voices aren't loaded yet, wait for them
    if (this.voices.length === 0) {
      // This event fires when voices are ready
      window.speechSynthesis.onvoiceschanged = () => {
        this.voices = this.synth.getVoices();
      };
    }
  }

  speak(text, onStart, onEnd) {
    // If already speaking, stop it
    if (this.isPlaying) {
      this.stop();
    }

    // Create a new utterance
    this.utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice (prefer English voices if available)
    if (this.voices.length > 0) {
      // Try to find an English voice
      const englishVoices = this.voices.filter(voice => 
        voice.lang.includes('en-US')
      );
      console.log(englishVoices);
      if (englishVoices.length > 0) {
        this.utterance.voice = englishVoices[0];
      } else {
        // Use the first available voice if no English voice is found
        this.utterance.voice = this.voices[0];
      }
    }

    // Set properties
    this.utterance.rate = 0.8;
    this.utterance.pitch = 0.9;
    
    // Event handlers
    this.utterance.onstart = () => {
      this.isPlaying = true;
      if (onStart) onStart();
    };
    
    this.utterance.onend = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
    };

    this.utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isPlaying = false;
      if (onEnd) onEnd();
    };

    // Start speaking
    this.synth.speak(this.utterance);
  }

  stop() {
    if (this.isPlaying) {
      this.synth.cancel();
      this.isPlaying = false;
    }
  }

  pause() {
    if (this.isPlaying) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  get speaking() {
    return this.isPlaying;
  }
}

// Export a singleton instance
const textToSpeech = new TextToSpeech();
export default textToSpeech;