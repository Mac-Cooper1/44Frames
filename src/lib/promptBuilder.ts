import type { Photo, Preset } from "@/lib/types";

export function buildPrompt(photo: Photo, preset: Preset): string {
  const room = photo.room || "room";
  const angle = preset.angle.toLowerCase();
  const shot = preset.shot.toLowerCase();
  const speed = preset.speed.toLowerCase();
  
  const basePrompt = `A cinematic ${angle} angle ${shot} shot of a beautiful ${room} in a modern home, captured with ${speed} motion over ${preset.durationSec} seconds.`;
  
  if (photo.tag === "Interior") {
    return `${basePrompt} The interior features elegant lighting, contemporary furnishings, and architectural details that showcase the space's character.`;
  } else {
    return `${basePrompt} The exterior showcases the home's curb appeal, landscaping, and architectural style with natural lighting.`;
  }
}

export function variation(prompt: string, n: 1 | 2 | 3): string[] {
  const variations = [
    prompt.replace("beautiful", "stunning"),
    prompt.replace("modern", "contemporary"),
    prompt.replace("elegant", "sophisticated"),
  ];
  
  return variations.slice(0, n);
}

export function diffPrompts(a: string, b: string): Array<{added?: string; removed?: string; same?: string}> {
  const wordsA = a.split(" ");
  const wordsB = b.split(" ");
  const result: Array<{added?: string; removed?: string; same?: string}> = [];
  
  let i = 0, j = 0;
  
  while (i < wordsA.length || j < wordsB.length) {
    if (i < wordsA.length && j < wordsB.length && wordsA[i] === wordsB[j]) {
      result.push({ same: wordsA[i] });
      i++;
      j++;
    } else if (i < wordsA.length && (j >= wordsB.length || wordsA[i] !== wordsB[j])) {
      result.push({ removed: wordsA[i] });
      i++;
    } else if (j < wordsB.length && (i >= wordsA.length || wordsA[i] !== wordsB[j])) {
      result.push({ added: wordsB[j] });
      j++;
    }
  }
  
  return result;
}
