#!/bin/bash
# Read-only skills-only validator. No link repair or repository writes.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
exec node "$ROOT/.agents/skills/inut-design-workflow/scripts/validate-ai-config.mjs" "$ROOT"
