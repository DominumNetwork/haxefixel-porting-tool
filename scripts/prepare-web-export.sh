#!/usr/bin/env bash
set -euo pipefail

BIN_DIR="${1:-export/release/html5/bin}"
OUT_ZIP="${2:-web_export.zip}"

if [ ! -d "$BIN_DIR" ]; then
  echo "Missing bin directory: $BIN_DIR"
  exit 1
fi

if [ ! -f "$BIN_DIR/index.html" ]; then
  cat > "$BIN_DIR/index.html" <<'HTML'
<!doctype html>
<html><head><meta charset="utf-8"><title>FNF Web Port</title></head>
<body><script src="index.js"></script></body></html>
HTML
fi

TMP_DIR=$(mktemp -d)
cp -R "$BIN_DIR"/* "$TMP_DIR"/
(
  cd "$TMP_DIR"
  zip -r "$OUT_ZIP" ./*
)
mv "$TMP_DIR/$OUT_ZIP" .
rm -rf "$TMP_DIR"
echo "Created $OUT_ZIP"
