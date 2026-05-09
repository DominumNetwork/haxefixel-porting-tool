#!/usr/bin/env bash
set -euo pipefail

MOD_DIR="${1:-mods}"
MODE="${2:-disable}"

find "$MOD_DIR" -type f -iname '*.mp4' | while read -r file; do
  if [ "$MODE" = "convert" ]; then
    ffmpeg -y -i "$file" -c:v libvpx-vp9 -c:a libopus "${file%.mp4}.webm"
  else
    mv "$file" "${file}.disabled"
  fi
done
