# Skills-only deployment and rollback

## Deployment

1. Inspect Git changes and preserve user edits before changing skill content.
2. Edit `.agents/skills/<name>/SKILL.md` and bundled references/assets/scripts.
   Keep root `AGENTS.md` minimal and preserve its OpenWiki section.
3. Run `rtk proxy bash scripts/validate-ai-config.sh` (read-only), inspect the
   diff, and run scoped safe examples. No app build is needed for customization.
4. Commit only reviewed task files when requested. Do not create mirrors.

## Recovery

For bad skill content, inspect the diff and selectively restore the affected
canonical file from a known-good skills-only Git revision or the external backup.
Preserve unrelated/untracked user work. Do not blindly reset the repository.
Restore bundled resources together when their contracts changed, then validate.

If a client misses a skill, explicitly supply its `SKILL.md` path; restart/check
client discovery separately. Rebuilding symlinks is not a recovery step.
If an obsolete mirror reappears, inspect its actual file type and content first,
back up unique changes, migrate useful material into skills, then remove only
the confirmed obsolete entry without following its target.

## Migration backup

The 2026-10-08 migration's exact source-to-skill map, hashes and removal allowlist
live in `docs/ai/SKILLS_MIGRATION_MANIFEST.json`. The external backup includes
regular and untracked originals plus symlink metadata, not `.git`/`node_modules`.
Backup availability is local and temporary; Git history is the durable recovery
source after commit. Do not reconstruct the retired architecture from that backup.
