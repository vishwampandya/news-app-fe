// src/utils/TextToSpeech.js
export class TextToSpeech {
  constructor() {
    this.isPlaying = false;
    this.isPaused = false;
    this.useWebSpeech = false; // Use ResponsiveVoice by default
    this.currentText = '';
    this.onStartCallback = null;
    this.onEndCallback = null;
    
    // Web Speech API properties (fallback)
    this.synth = null;
    this.utterance = null;
    this.voices = [];
  }

  init() {
    // Check if we're on Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    
    if (!this.useWebSpeech) {
      // Load ResponsiveVoice script if not already loaded
      if (!window.responsiveVoice) {
        this.loadResponsiveVoice();
      }
    } else {
      // Initialize Web Speech API as fallback
      this.initWebSpeechAPI();
      
      // If we're on Android and Web Speech API doesn't work well,
      // switch to ResponsiveVoice automatically
      if (isAndroid && (!window.speechSynthesis || window.speechSynthesis.getVoices().length === 0)) {
        console.log('Android detected with poor Web Speech support, switching to ResponsiveVoice');
        this.useWebSpeech = false;
        this.loadResponsiveVoice();
      }
    }
  }

  loadResponsiveVoice() {
    return new Promise((resolve, reject) => {
      // Check if ResponsiveVoice is already loaded
      if (window.responsiveVoice) {
        console.log('ResponsiveVoice already loaded');
        resolve();
        return;
      }
      
      // Add ResponsiveVoice script to the document
      const script = document.createElement('script');
      script.src = 'https://code.responsivevoice.org/responsivevoice.js?key=r6lmYRPs';
      script.async = true;
      
      script.onload = () => {
        // Initialize ResponsiveVoice once loaded
        if (window.responsiveVoice) {
          window.responsiveVoice.init();
          console.log('ResponsiveVoice loaded successfully');
          resolve();
        } else {
          reject(new Error('ResponsiveVoice failed to initialize'));
        }
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load ResponsiveVoice script'));
        // Fall back to Web Speech API if ResponsiveVoice fails to load
        this.useWebSpeech = true;
        this.initWebSpeechAPI();
      };
      
      document.head.appendChild(script);
    });
  }

  initWebSpeechAPI() {
    // Initialize Web Speech API as fallback
    if (window.speechSynthesis) {
      this.synth = window.speechSynthesis;
      
      // Load available voices
      this.voices = this.synth.getVoices();
      
      // If voices aren't loaded yet, wait for them
      if (this.voices.length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.voices = this.synth.getVoices();
        };
      }
      return true;
    } else {
      console.warn('Web Speech API not supported in this browser');
      return false;
    }
  }

  speak(text, onStart, onEnd) {
    // Store callbacks and text
    this.currentText = text;
    this.onStartCallback = onStart;
    this.onEndCallback = onEnd;
    
    // Stop current speech if playing
    if (this.isPlaying) {
      this.stop();
    }

    if (!this.useWebSpeech && window.responsiveVoice) {
      // Use ResponsiveVoice (better Android compatibility)
      this.speakWithResponsiveVoice();
    } else if (window.speechSynthesis) {
      // Fallback to Web Speech API
      this.speakWithWebSpeechAPI();
    } else {
      console.error('No speech synthesis engine available');
      if (this.onEndCallback) this.onEndCallback();
    }
  }

  speakWithResponsiveVoice() {
    // Use UK English Female for clearer voice on Android
    const defaultVoice = 'UK English Female';
    
    window.responsiveVoice.speak(
      this.currentText, 
      defaultVoice,
      {
        pitch: 1,
        rate: 0.9,
        volume: 1,
        onstart: () => {
          this.isPlaying = true;
          this.isPaused = false;
          if (this.onStartCallback) this.onStartCallback();
        },
        onend: () => {
          this.isPlaying = false;
          this.isPaused = false;
          if (this.onEndCallback) this.onEndCallback();
        },
        onerror: (error) => {
          console.error('ResponsiveVoice error:', error);
          this.isPlaying = false;
          this.isPaused = false;
          if (this.onEndCallback) this.onEndCallback();
        }
      }
    );
  }

  speakWithWebSpeechAPI() {
    // Create a new utterance
    this.utterance = new SpeechSynthesisUtterance(this.currentText);
    
    // Set voice (prefer English voices if available)
    if (this.voices.length > 0) {
      // Try to find an English voice
      const englishVoices = this.voices.filter(voice => 
        voice.lang.includes('en-US') || voice.lang.includes('en-GB')
      );
      if (englishVoices.length > 0) {
        this.utterance.voice = englishVoices[0];
      } else {
        // Use the first available voice if no English voice is found
        this.utterance.voice = this.voices[0];
      }
    }

    // Set properties
    this.utterance.rate = 0.9;
    this.utterance.pitch = 1;
    
    // Fix for Android Chrome bug where utterance doesn't fire events
    const synth = this.synth;
    let timeoutId = null;
    
    // Event handlers
    this.utterance.onstart = () => {
      this.isPlaying = true;
      this.isPaused = false;
      if (this.onStartCallback) this.onStartCallback();
      
      // Clear any previous timeout
      if (timeoutId) clearTimeout(timeoutId);
    };
    
    this.utterance.onend = () => {
      this.isPlaying = false;
      this.isPaused = false;
      if (this.onEndCallback) this.onEndCallback();
      
      // Clear any previous timeout
      if (timeoutId) clearTimeout(timeoutId);
    };

    this.utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isPlaying = false;
      this.isPaused = false;
      if (this.onEndCallback) this.onEndCallback();
      
      // Clear any previous timeout
      if (timeoutId) clearTimeout(timeoutId);
    };

    // Start speaking
    this.synth.speak(this.utterance);
    
    // Android Chrome bug fix - check if speech actually started
    // If not after 3 seconds, try ResponsiveVoice instead
    if (/Android/i.test(navigator.userAgent)) {
      timeoutId = setTimeout(() => {
        if (this.isPlaying && !this.synth.speaking) {
          console.log('Detected Android Chrome issue, switching to ResponsiveVoice');
          this.synth.cancel();
          this.useWebSpeech = false;
          this.loadResponsiveVoice().then(() => {
            this.speak(this.currentText, this.onStartCallback, this.onEndCallback);
          });
        }
      }, 3000);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    
    if (!this.useWebSpeech && window.responsiveVoice) {
      window.responsiveVoice.cancel();
    } else if (this.synth) {
      this.synth.cancel();
    }
    
    this.isPlaying = false;
    this.isPaused = false;
  }

  pause() {
    if (!this.isPlaying || this.isPaused) return;
    
    if (!this.useWebSpeech && window.responsiveVoice) {
      window.responsiveVoice.pause();
    } else if (this.synth) {
      this.synth.pause();
    }
    
    this.isPaused = true;
  }

  resume() {
    if (!this.isPaused) return;
    
    if (!this.useWebSpeech && window.responsiveVoice) {
      window.responsiveVoice.resume();
    } else if (this.synth) {
      this.synth.resume();
    }
    
    this.isPaused = false;
  }

  // Method to change voice
  setVoice(voiceName) {
    if (!this.useWebSpeech && window.responsiveVoice) {
      // Check if the requested voice is available in ResponsiveVoice
      if (window.responsiveVoice.getVoices().some(v => v.name === voiceName)) {
        this.voiceName = voiceName;
        return true;
      }
      return false;
    }
    return false;
  }

  // Get available voices
  getAvailableVoices() {
    if (!this.useWebSpeech && window.responsiveVoice) {
      return window.responsiveVoice.getVoices();
    } else if (this.synth) {
      return this.voices;
    }
    return [];
  }

  get speaking() {
    return this.isPlaying;
  }
  
  get paused() {
    return this.isPaused;
  }
}

// Export a singleton instance
const textToSpeech = new TextToSpeech();
export default textToSpeech;