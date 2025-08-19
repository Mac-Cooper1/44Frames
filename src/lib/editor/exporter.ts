"use client";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
import type { Clip, TimelineClip, MusicTrack, EditorExportSettings } from "@/lib/types";

let ffmpegInstance: FFmpeg | null = null;

async function getFFmpeg(): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist";
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, "text/javascript"),
  } as any);
  ffmpegInstance = ffmpeg;
  return ffmpeg;
}

export type ExportProgress = {
  phase: "init" | "trim" | "concat" | "mix" | "finalize";
  percent: number;
  message?: string;
};

export async function exportTimeline(
  clips: Clip[],
  timeline: TimelineClip[],
  music: MusicTrack | undefined,
  settings: EditorExportSettings,
  onProgress?: (p: ExportProgress) => void,
  signal?: AbortSignal
): Promise<Uint8Array> {
  const ffmpeg = await getFFmpeg();

  function progress(phase: ExportProgress["phase"], percent: number, message?: string) {
    onProgress?.({ phase, percent, message });
  }

  // Abort support
  if (signal) {
    if (signal.aborted) throw new Error("Export aborted");
    signal.addEventListener("abort", () => {
      try {
        ffmpeg.terminate();
      } catch {}
    }, { once: true });
  }

  // Clean FS
  try { await ffmpeg.deleteFile("concat_list.txt"); } catch {}
  try { await ffmpeg.deleteFile("video_concat.mp4"); } catch {}
  try { await ffmpeg.deleteFile("output.mp4"); } catch {}

  // Write and trim each clip to tmp files
  progress("trim", 0, "Preparing clips");
  const ordered = timeline.map(t => clips.find(c => c.id === t.id)!).filter(Boolean);
  for (let i = 0; i < ordered.length; i++) {
    const clip = ordered[i]!;
    const inputName = `in_${i}.mp4`;
    const tmpName = `tmp_${i}.mp4`;
    const data = await fetchFile(clip.src);
    await ffmpeg.writeFile(inputName, data);
    const inSec = clip.in;
    const dur = Math.max(0, clip.out - clip.in);

    // Try stream copy first
    let copied = true;
    try {
      await ffmpeg.exec([
        "-ss", `${inSec}`,
        "-i", inputName,
        "-t", `${dur}`,
        "-c", "copy",
        tmpName,
      ]);
    } catch {
      copied = false;
    }
    if (!copied) {
      // Re-encode fallback
      await ffmpeg.exec([
        "-ss", `${inSec}`,
        "-i", inputName,
        "-t", `${dur}`,
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "21",
        "-pix_fmt", "yuv420p",
        "-an",
        tmpName,
      ]);
    }
    progress("trim", Math.round(((i + 1) / ordered.length) * 100));
  }

  // Concat using demuxer
  progress("concat", 0, "Concatenating");
  const concatList = timeline.map((_, i) => `file tmp_${i}.mp4`).join("\n");
  await ffmpeg.writeFile("concat_list.txt", new TextEncoder().encode(concatList));
  await ffmpeg.exec([
    "-f", "concat", "-safe", "0",
    "-i", "concat_list.txt",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "video_concat.mp4",
  ]);

  // Mix music if present
  if (music?.src) {
    progress("mix", 10, "Mixing audio");
    const musicData = await fetchFile(music.src);
    const musicName = music.src.split("/").pop() || "music.mp3";
    await ffmpeg.writeFile(musicName, musicData);
    const offsetMs = Math.max(0, Math.round((music.offset || 0) * 1000));
    const gain = Math.max(0, Math.min(2, music.gain ?? 1));

    const adelay = `${offsetMs}|${offsetMs}`;
    const filter = `[1:a]adelay=${adelay},volume=${gain}[bgm];[0:a][bgm]amix=inputs=2:dropout_transition=0:normalize=0[aout]`;

    await ffmpeg.exec([
      "-i", "video_concat.mp4",
      "-i", musicName,
      "-filter_complex", filter,
      "-map", "0:v",
      "-map", "[aout]",
      "-c:v", "copy",
      "-c:a", "aac",
      "-b:a", "192k",
      "output.mp4",
    ]);
  } else {
    await ffmpeg.exec([
      "-i", "video_concat.mp4",
      "-c:v", "copy",
      "-an",
      "output.mp4",
    ]);
  }

  progress("finalize", 100, "Finalizing");
  const out = await ffmpeg.readFile("output.mp4");
  return out as Uint8Array;
}

