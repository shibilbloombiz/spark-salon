// Audio engine disabled - all sound effects removed

class SparkAudioEngine {
  public playEntryChime(): void {}
  public playChime(): void {}
  public playClick(): void {}
  public toggleAmbient(): boolean {
    return false;
  }
  public startAmbient(): void {}
  public stopAmbient(): void {}
  public getIsPlaying(): boolean {
    return false;
  }
}

export const sparkAudio = new SparkAudioEngine();
