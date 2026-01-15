export interface YouTubePlayer {
  /* Playback */
  playVideo(): void;
  pauseVideo(): void;

  /* Audio */
  mute(): void;
  unMute(): void;

  /* Time */
  getCurrentTime(): number;
  seekTo(seconds: number, allowSeekAhead: boolean): void;

  /* Playback speed */
  setPlaybackRate(rate: number): void;
  getAvailablePlaybackRates(): number[];

  /* Cleanup */
  destroy(): void;
}
