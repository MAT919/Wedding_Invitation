/**
 * Royal Grace — Romantic Wedding Music Engine (Web Audio API)
 * Generates warm felt-piano/harp arpeggios, lush string pads, and celesta
 * sparkles inside a stereo palace-hall convolution reverb. Works 100% offline.
 */

class WeddingMusicPlayer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.dryGain = null;
    this.wetGain = null;
    this.reverb = null;
    this.isPlaying = false;
    this.schedulerId = null;
    this.stepIndex = 0;
    this.currentTrackIndex = 0;
    this.volume = 0.55;
    this.customAudio = null;
    this.customAudioUrl = null;
    this.onStateChange = null;

    this.tracks = [
      {
        name: "Royal Grace — Canon in D",
        tempoMs: 460,
        chords: [
          { bass: 146.83, notes: [293.66, 369.99, 440.0, 587.33], melody: [739.99, 659.25] }, // D
          { bass: 110.0,  notes: [220.0, 277.18, 329.63, 440.0],  melody: [554.37, 659.25] }, // A
          { bass: 123.47, notes: [246.94, 293.66, 369.99, 493.88], melody: [587.33, 739.99] }, // Bm
          { bass: 92.5,   notes: [185.0, 220.0, 277.18, 369.99],  melody: [554.37, 440.0] },  // F#m
          { bass: 98.0,   notes: [196.0, 246.94, 293.66, 392.0],  melody: [493.88, 587.33] }, // G
          { bass: 146.83, notes: [293.66, 369.99, 440.0, 587.33], melody: [587.33, 659.25] }, // D
          { bass: 98.0,   notes: [196.0, 246.94, 293.66, 392.0],  melody: [493.88, 392.0] },  // G
          { bass: 110.0,  notes: [220.0, 277.18, 329.63, 440.0],  melody: [440.0, 554.37] },  // A
        ],
      },
      {
        name: "Palace Waltz — F Major",
        tempoMs: 520,
        chords: [
          { bass: 174.61, notes: [261.63, 349.23, 440.0, 523.25], melody: [698.46, 659.25] }, // F
          { bass: 130.81, notes: [261.63, 329.63, 392.0, 523.25], melody: [659.25, 587.33] }, // C
          { bass: 146.83, notes: [293.66, 349.23, 440.0, 587.33], melody: [587.33, 523.25] }, // Dm
          { bass: 116.54, notes: [233.08, 293.66, 349.23, 466.16], melody: [587.33, 698.46] }, // Bb
          { bass: 130.81, notes: [261.63, 329.63, 392.0, 523.25], melody: [523.25, 659.25] }, // C
          { bass: 110.0,  notes: [220.0, 261.63, 329.63, 440.0],  melody: [523.25, 440.0] },  // Am
          { bass: 116.54, notes: [233.08, 293.66, 349.23, 466.16], melody: [466.16, 587.33] }, // Bb
          { bass: 130.81, notes: [261.63, 329.63, 392.0, 523.25], melody: [523.25, 659.25] }, // C
        ],
      },
      {
        name: "Eternal Vows — G Major",
        tempoMs: 490,
        chords: [
          { bass: 196.0,  notes: [246.94, 293.66, 392.0, 493.88], melody: [587.33, 783.99] }, // G
          { bass: 146.83, notes: [220.0, 293.66, 369.99, 440.0],  melody: [587.33, 659.25] }, // D
          { bass: 164.81, notes: [246.94, 329.63, 392.0, 493.88], melody: [659.25, 783.99] }, // Em
          { bass: 123.47, notes: [246.94, 293.66, 369.99, 493.88], melody: [739.99, 587.33] }, // Bm
          { bass: 130.81, notes: [261.63, 329.63, 392.0, 523.25], melody: [659.25, 523.25] }, // C
          { bass: 196.0,  notes: [246.94, 293.66, 392.0, 493.88], melody: [493.88, 587.33] }, // G
          { bass: 130.81, notes: [261.63, 329.63, 392.0, 523.25], melody: [523.25, 659.25] }, // C
          { bass: 146.83, notes: [220.0, 293.66, 369.99, 440.0],  melody: [587.33, 739.99] }, // D
        ],
      },
    ];
  }

  initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();

    // Master chain with gentle compressor
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.value = -18;
    compressor.knee.value = 18;
    compressor.ratio.value = 3;
    compressor.attack.value = 0.02;
    compressor.release.value = 0.25;

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0001;

    this.dryGain = this.ctx.createGain();
    this.dryGain.gain.value = 0.58;

    this.wetGain = this.ctx.createGain();
    this.wetGain.gain.value = 0.45;

    this.reverb = this.createPalaceReverb(2.8, 2.4);

    this.dryGain.connect(compressor);
    this.wetGain.connect(this.reverb);
    this.reverb.connect(compressor);
    compressor.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  createPalaceReverb(durationSeconds, decay) {
    const sampleRate = this.ctx.sampleRate;
    const length = Math.floor(sampleRate * durationSeconds);
    const impulse = this.ctx.createBuffer(2, length, sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        const env = Math.pow(1 - i / length, decay);
        data[i] = (Math.random() * 2 - 1) * env * 0.6;
      }
    }
    const convolver = this.ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
  }

  playFeltPianoNote(freq, time, duration = 1.6, velocity = 0.16) {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(freq, time);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq * 2, time);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1450, time);
    filter.frequency.exponentialRampToValueAtTime(420, time + duration);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(velocity, time + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.value = 0.18;

    osc1.connect(filter);
    osc2.connect(osc2Gain);
    osc2Gain.connect(filter);
    filter.connect(gain);
    gain.connect(this.dryGain);
    gain.connect(this.wetGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration + 0.05);
    osc2.stop(time + duration + 0.05);
  }

  playStringPad(freqs, time, duration = 3.2, velocity = 0.055) {
    if (!this.ctx) return;
    freqs.forEach((freq) => {
      [-4, 4].forEach((detune) => {
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, time);
        osc.detune.setValueAtTime(detune, time);

        filter.type = "lowpass";
        filter.frequency.setValueAtTime(680, time);

        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.linearRampToValueAtTime(velocity * 0.45, time + duration * 0.38);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.wetGain);
        gain.connect(this.dryGain);

        osc.start(time);
        osc.stop(time + duration + 0.08);
      });
    });
  }

  playCelestaSparkle(freq, time, duration = 2.0, velocity = 0.05) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(velocity, time + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(gain);
    gain.connect(this.wetGain);
    osc.start(time);
    osc.stop(time + duration + 0.05);
  }

  scheduleNextStep() {
    if (!this.isPlaying || !this.ctx) return;
    const track = this.tracks[this.currentTrackIndex];
    const chordIdx = Math.floor(this.stepIndex / 4) % track.chords.length;
    const beatInBar = this.stepIndex % 4;
    const chord = track.chords[chordIdx];
    const now = this.ctx.currentTime + 0.04;

    // Warm string pad & deep bass at the start of each bar
    if (beatInBar === 0) {
      this.playFeltPianoNote(chord.bass, now, 2.8, 0.17);
      this.playStringPad([chord.notes[0], chord.notes[2]], now, (track.tempoMs * 4) / 1000, 0.055);
    }

    // Flowing harp/piano arpeggio
    const arpNote = chord.notes[beatInBar % chord.notes.length];
    this.playFeltPianoNote(arpNote, now, 1.45, 0.13);

    // Delicate celesta melody on beats 1 and 3
    if (beatInBar === 1) {
      this.playCelestaSparkle(chord.melody[0], now, 2.1, 0.048);
    } else if (beatInBar === 3) {
      this.playCelestaSparkle(chord.melody[1], now, 2.1, 0.042);
    }

    this.stepIndex++;
  }

  async play() {
    if (this.customAudio) {
      try {
        await this.customAudio.play();
        this.isPlaying = true;
        this.emitState();
      } catch (e) {
        console.warn("Audio playback blocked:", e);
      }
      return;
    }

    this.initContext();
    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }
    if (this.isPlaying) return;

    this.isPlaying = true;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume, now + 1.2);

    const track = this.tracks[this.currentTrackIndex];
    this.scheduleNextStep();
    this.schedulerId = setInterval(() => this.scheduleNextStep(), track.tempoMs);
    this.emitState();
  }

  pause() {
    if (this.customAudio) {
      this.customAudio.pause();
      this.isPlaying = false;
      this.emitState();
      return;
    }

    this.isPlaying = false;
    if (this.schedulerId) {
      clearInterval(this.schedulerId);
      this.schedulerId = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.45);
    }
    this.emitState();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  setTrack(index) {
    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio = null;
    }
    this.currentTrackIndex = index % this.tracks.length;
    this.stepIndex = 0;
    if (this.isPlaying) {
      clearInterval(this.schedulerId);
      const track = this.tracks[this.currentTrackIndex];
      this.scheduleNextStep();
      this.schedulerId = setInterval(() => this.scheduleNextStep(), track.tempoMs);
    }
    this.emitState();
  }

  loadCustomFile(file) {
    if (!file) return;
    if (this.customAudioUrl) URL.revokeObjectURL(this.customAudioUrl);
    this.pause();
    this.customAudioUrl = URL.createObjectURL(file);
    this.customAudio = new Audio(this.customAudioUrl);
    this.customAudio.loop = true;
    this.customAudio.volume = this.volume;
    this.play();
  }

  getCurrentTrackName() {
    if (this.customAudio) return "Custom Wedding Track";
    return this.tracks[this.currentTrackIndex].name;
  }

  emitState() {
    if (typeof this.onStateChange === "function") {
      this.onStateChange({
        isPlaying: this.isPlaying,
        trackName: this.getCurrentTrackName(),
        trackIndex: this.currentTrackIndex,
      });
    }
  }
}

window.weddingMusic = new WeddingMusicPlayer();
