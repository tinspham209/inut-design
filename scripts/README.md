# Inut Design Scripts

This directory contains utility scripts for maintaining the Inut Design codebase and AI infrastructure.

## Scripts

### 1. `validate-ai-config.sh`
**Version**: 2.0.0
**Description**: Checks the integrity of the unified AI context architecture. It verifies that all directories, global rules, and symbolic links required for multi-IDE compatibility (Trae, Copilot, Codex, Antigravity) are correctly configured.

**Key Features**:
- Verifies `.agents/` directory structure.
- Checks root symlinks (`.cursorrules`, `.traerules`).
- Validates IDE-specific symlinks in `.github/`, `.codex/`, and `.trae/`.
- Robust error handling and color-coded reporting.

**Usage**:
```bash
./scripts/validate-ai-config.sh
```

## Governance Rules
- All scripts must be executable (`chmod +x`).
- Scripts should follow the "Exit on Error" (`set -e`) principle.
- Color-coded output should be used for better visibility of success/failure.
- Maintain consistency with the centralized AI governance structure defined in `AGENTS.md`.

## Change Log

### [2026-03-14] - v2.0.0
- **Modernization**: Refactored `validate-ai-config.sh` to version 2.0.0.
- **Enhanced Logic**: Added support for checking sub-symlinks within `.trae/` (handling environments where `.trae` directories are protected).
- **Error Handling**: Implemented robust logging functions and standard exit codes.
- **Security**: Improved input validation and path handling.
- **Documentation**: Created this README and added inline comments to scripts.
