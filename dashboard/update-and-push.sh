#!/bin/bash
# Auto-update dashboard: regenerate HTML from ideas.md
# Runs via macOS LaunchAgent every morning
# Dashboard is local-only (no git push)

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Regenerate JSON + HTML
/usr/bin/python3 "$SCRIPT_DIR/generate-data.py"
