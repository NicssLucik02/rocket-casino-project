import { useCallback, useEffect, useRef } from "react";
import clickSoundSrc from "@/assets/sounds/Click.wav";
import loseSoundSrc from "@/assets/sounds/lose.wav";

type SoundKey = "click" | "lose";

const soundSrcByKey: Record<SoundKey, string> = {
  click: clickSoundSrc,
  lose: loseSoundSrc,
};

export const useGameSounds = (options?: { volume?: number }) => {
  const volume = options?.volume ?? 0.6;

  const audioRefs = useRef<Record<SoundKey, HTMLAudioElement | null>>({
    click: null,
    lose: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    (Object.keys(soundSrcByKey) as SoundKey[]).forEach((key) => {
      const audio = new Audio(soundSrcByKey[key]);
      audio.preload = "auto";
      audio.volume = volume;
      audioRefs.current[key] = audio;
    });

    const currentAudios = audioRefs.current;
    return () => {
      (Object.keys(currentAudios) as SoundKey[]).forEach((key) => {
        const audio = currentAudios[key];
        if (!audio) return;
        audio.pause();
        audio.src = "";
        currentAudios[key] = null;
      });
    };
  }, [volume]);

  const playSound = useCallback((key: SoundKey) => {
    const audio = audioRefs.current[key];
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play().catch(() => {});
  }, []);

  const playClick = useCallback(() => playSound("click"), [playSound]);
  const playLose = useCallback(() => playSound("lose"), [playSound]);

  return {
    playClick,
    playLose,
  };
};
