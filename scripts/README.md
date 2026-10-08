# Inut Design Scripts

This directory contains utility scripts for maintaining the Inut Design codebase and AI infrastructure.

## Scripts

### 1. `validate-ai-config.sh`
**Version**: 3.0.0
**Description**: Read-only validator for the skills-only AI architecture. Requires Node
and installed project dependencies; validates seven skill names/YAML metadata,
bundled links, active documentation and the source-to-skill migration manifest.

**Key Features**:
- Requires `.agents/` to contain only `skills/` and exactly the seven retained skills.
- Rejects obsolete mirror paths, including broken symlinks without following them.
- Reports complete validation errors; never repairs links or writes repository files.

**Usage**:
```bash
rtk proxy bash scripts/validate-ai-config.sh
```

## Governance Rules
- All scripts must be executable (`chmod +x`).
- Scripts should follow the "Exit on Error" (`set -e`) principle.
- Color-coded output should be used for better visibility of success/failure.
- Maintain consistency with the centralized AI governance structure defined in `AGENTS.md`.

## Change Log

### [2026-10-08] - v3.0.0
- Migrated to skills-only validation. The v2 notes below are historical, not
	instructions to reconstruct mirrors.

### [2026-03-14] - v2.0.0
- **Modernization**: Refactored `validate-ai-config.sh` to version 2.0.0.
- **Enhanced Logic**: Added support for checking sub-symlinks within `.trae/` (handling environments where `.trae` directories are protected).
- **Error Handling**: Implemented robust logging functions and standard exit codes.
- **Security**: Improved input validation and path handling.
- **Documentation**: Created this README and added inline comments to scripts.
