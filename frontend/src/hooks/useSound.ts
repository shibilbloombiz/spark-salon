'use client';

export function useSound() {
  const isPlaying = false;
  const toggle = () => false;
  const playClick = () => {};
  const playChime = () => {};

  return { isPlaying, toggle, playClick, playChime };
}
