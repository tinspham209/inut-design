#!/bin/bash

# validate-ai-config.sh
# Checks symlink integrity and directory structure for unified AI strategy.
# Version: 2.0.0
# Author: Inut Design AI Assistant
# Description: Modernized validation script with robust error handling, 
# support for .trae symlinks, and comprehensive reporting.

set -e # Exit on any error

# --- Configuration & Constants ---
RED='\033[0-1;31m'
GREEN='\033[0-1;32m'
YELLOW='\033[0-1;33m'
BLUE='\033[0-1;34m'
NC='\033[0m' # No Color

# Base directory for AI configuration
AI_HUB_DIR=".agents"
EXIT_CODE=0

# --- Helper Functions ---

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

check_directory() {
    local dir=$1
    if [[ -d "$dir" ]]; then
        log_success "Directory exists: $dir"
    else
        log_error "Missing directory: $dir"
        EXIT_CODE=1
    fi
}

check_file() {
    local file=$1
    if [[ -f "$file" ]]; then
        log_success "File exists: $file"
    else
        log_error "Missing file: $file"
        EXIT_CODE=1
    fi
}

check_symlink() {
    local link=$1
    local expected_target=$2

    if [[ -L "$link" ]]; then
        local actual_target
        actual_target=$(readlink "$link")
        
        if [[ -e "$link" ]]; then
            # Target exists, check if it matches the expected path (if provided)
            if [[ -n "$expected_target" && "$actual_target" != "$expected_target" ]]; then
                log_warn "Symlink $link points to $actual_target, but expected $expected_target"
                # We don't necessarily fail here unless the target doesn't exist, 
                # but we warn about potential configuration drift.
            fi
            log_success "Valid symlink: $link -> $actual_target"
        else
            log_error "Broken symlink: $link (points to missing $actual_target)"
            EXIT_CODE=1
        fi
    else
        log_error "Not a symlink: $link"
        EXIT_CODE=1
    fi
}

check_trae_sub_symlinks() {
    local parent_dir=$1
    local source_dir=$2
    log_info "Checking sub-symlinks in $parent_dir..."
    
    if [[ ! -d "$parent_dir" ]]; then
        log_error "$parent_dir is not a directory"
        EXIT_CODE=1
        return
    fi

    # Check each item in the source directory
    for item in "$source_dir"/*; do
        local name
        name=$(basename "$item")
        local link="$parent_dir/$name"
        
        if [[ -L "$link" ]]; then
            if [[ -e "$link" ]]; then
                log_success "  Valid sub-link: $name"
            else
                log_error "  Broken sub-link: $name"
                EXIT_CODE=1
            fi
        elif [[ -d "$link" ]]; then
            log_warn "  $name is a physical directory in $parent_dir (should ideally be a symlink)"
        else
            log_error "  Missing link for $name in $parent_dir"
            EXIT_CODE=1
        fi
    done
}

# --- Main Execution ---

echo -e "${BLUE}==============================================${NC}"
echo -e "${BLUE}   Inut Design AI Architecture Validator v2   ${NC}"
echo -e "${BLUE}==============================================${NC}\n"

# 1. Check AI Hub Structure
log_info "Verifying AI Hub (.agents) structure..."
DIRS=(
    "$AI_HUB_DIR/agents"
    "$AI_HUB_DIR/prompts"
    "$AI_HUB_DIR/skills"
    "$AI_HUB_DIR/workflows"
    "$AI_HUB_DIR/instructions"
)
for dir in "${DIRS[@]}"; do
    check_directory "$dir"
done

# 2. Check Global Rules
log_info "Verifying global baseline..."
check_file "$AI_HUB_DIR/instructions/global-rules.md"

# 3. Check Root Symlinks
log_info "Verifying Root symlinks (Trae/Cursor)..."
check_symlink ".cursorrules" ".agents/instructions/global-rules.md"
check_symlink ".traerules" ".agents/instructions/global-rules.md"

# 4. Check .github Symlinks (Copilot)
log_info "Verifying .github symlinks (GitHub Copilot)..."
GITHUB_TARGETS=(
    ".github/agents:../.agents/agents"
    ".github/prompts:../.agents/prompts"
    ".github/skills:../.agents/skills"
    ".github/instructions:../.agents/instructions"
    ".github/copilot-instructions.md:../.agents/instructions/global-rules.md"
)
for item in "${GITHUB_TARGETS[@]}"; do
    IFS=":" read -r link target <<< "$item"
    check_symlink "$link" "$target"
done

# 5. Check .codex Symlinks (Codex IDE)
log_info "Verifying .codex symlinks (Codex IDE)..."
CODEX_TARGETS=(
    ".codex/agents:../.agents/agents"
    ".codex/prompts:../.agents/prompts"
    ".codex/skills:../.agents/skills"
    ".codex/workflows:../.agents/workflows"
    ".codex/instructions:../.agents/instructions"
)
for item in "${CODEX_TARGETS[@]}"; do
    IFS=":" read -r link target <<< "$item"
    check_symlink "$link" "$target"
done

# 6. Check .trae Symlinks (Trae AI)
log_info "Verifying .trae symlinks (Trae Specific)..."
# In some environments, .trae/prompts and .trae/skills must be physical directories
# containing individual symlinks to the .agents/ content.
if [[ -L ".trae/prompts" ]]; then
    check_symlink ".trae/prompts" "../.agents/prompts"
else
    check_trae_sub_symlinks ".trae/prompts" ".agents/prompts"
fi

if [[ -L ".trae/skills" ]]; then
    check_symlink ".trae/skills" "../.agents/skills"
else
    check_trae_sub_symlinks ".trae/skills" ".agents/skills"
fi

# --- Conclusion ---
echo -e "\n${BLUE}==============================================${NC}"
if [[ "$EXIT_CODE" -eq 0 ]]; then
    log_success "Validation successful! Unified AI architecture is intact."
    exit 0
else
    log_error "Validation failed! Please fix the errors above."
    exit 1
fi
