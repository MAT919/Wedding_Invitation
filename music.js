/**
 * Wedding Soundtrack Controller — YouTube IFrame Player API
 * Plays https://www.youtube.com/shorts/WAy0yTByc1U on seamless loop.
 */

class WeddingMusicPlayer {
  constructor(videoId) {
    this.videoId = videoId;
    this.player = null;
    this.isReady = false;
    this.pendingPlay = false;
    this.isPlaying = false;
    this.onStateChange = null;

    this.loadYouTubeAPI();
  }

  loadYouTubeAPI() {
    if (window.YT && window.YT.Player) {
      this.createPlayer();
      return;
    }

    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevCallback === "function") prevCallback();
      this.createPlayer();
    };

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  }

  createPlayer() {
    const host = document.getElementById("yt-music-player");
    if (!host || this.player) return;

    this.player = new window.YT.Player("yt-music-player", {
      height: "1",
      width: "1",
      videoId: this.videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        loop: 1,
        modestbranding: 1,
        playsinline: 1,
        playlist: this.videoId,
        rel: 0,
      },
      events: {
        onReady: () => {
          this.isReady = true;
          this.player.setVolume(75);
          if (this.pendingPlay) {
            this.pendingPlay = false;
            this.play();
          }
        },
        onStateChange: (event) => {
          const YTState = window.YT.PlayerState;
          if (event.data === YTState.PLAYING) {
            this.isPlaying = true;
            this.emitState();
          } else if (event.data === YTState.PAUSED) {
            this.isPlaying = false;
            this.emitState();
          } else if (event.data === YTState.ENDED) {
            // Ensure continuous loop
            this.player.seekTo(0);
            this.player.playVideo();
          }
        },
      },
    });
  }

  play() {
    if (!this.isReady || !this.player) {
      this.pendingPlay = true;
      return;
    }
    this.player.unMute();
    this.player.setVolume(75);
    this.player.playVideo();
    this.isPlaying = true;
    this.emitState();
  }

  pause() {
    this.pendingPlay = false;
    if (this.isReady && this.player) {
      this.player.pauseVideo();
    }
    this.isPlaying = false;
    this.emitState();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  emitState() {
    if (typeof this.onStateChange === "function") {
      this.onStateChange({ isPlaying: this.isPlaying });
    }
  }
}

window.weddingMusic = new WeddingMusicPlayer("WAy0yTByc1U");
