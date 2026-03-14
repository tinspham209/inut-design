#!/bin/bash

# validate-ai-config.sh
# Checks symlink integrity and directory structure for unified AI strategy.

RED='\033[0-1;31m'
GREEN='\033[0-1;32m'
NC='\033[0m' # No Color

echo "Checking AI Hub (.agents) structure..."
DIRS=(".agents/agents" ".agents/prompts" ".agents/skills" ".agents/workflows" ".agents/instructions")
for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo -e "${GREEN}✓${NC} $dir exists"
    else
        echo -e "${RED}✗${NC} $dir is missing"
        EXIT_CODE=1
    fi
done

echo -e "\nChecking Global Rules..."
if [ -f ".agents/instructions/global-rules.md" ]; then
    echo -e "${GREEN}✓${NC} global-rules.md exists"
else
    echo -e "${RED}✗${NC} global-rules.md is missing"
    EXIT_CODE=1
fi

echo -e "\nChecking Root Symlinks (Trae/Cursor)..."
ROOT_SYMLINKS=(".cursorrules" ".traerules")
for link in "${ROOT_SYMLINKS[@]}"; do
    if [ -L "$link" ]; then
        echo -e "${GREEN}✓${NC} $link is a symlink"
        if [ -e "$link" ]; then
            echo -e "  ${GREEN}✓${NC} target exists"
        else
            echo -e "  ${RED}✗${NC} target is broken"
            EXIT_CODE=1
        fi
    else
        echo -e "${RED}✗${NC} $link is not a symlink"
        EXIT_CODE=1
    fi
done

echo -e "\nChecking .github Symlinks..."
GITHUB_SYMLINKS=(".github/agents" ".github/prompts" ".github/skills" ".github/instructions" ".github/copilot-instructions.md")
for link in "${GITHUB_SYMLINKS[@]}"; do
    if [ -L "$link" ]; then
        echo -e "${GREEN}✓${NC} $link is a symlink"
        if [ -e "$link" ]; then
            echo -e "  ${GREEN}✓${NC} target exists"
        else
            echo -e "  ${RED}✗${NC} target is broken"
            EXIT_CODE=1
        fi
    else
        echo -e "${RED}✗${NC} $link is not a symlink"
        EXIT_CODE=1
    fi
done

echo -e "\nChecking .codex Symlinks..."
CODEX_SYMLINKS=(".codex/agents" ".codex/prompts" ".codex/skills" ".codex/workflows" ".codex/instructions")
for link in "${CODEX_SYMLINKS[@]}"; do
    if [ -L "$link" ]; then
        echo -e "${GREEN}✓${NC} $link is a symlink"
        if [ -e "$link" ]; then
            echo -e "  ${GREEN}✓${NC} target exists"
        else
            echo -e "  ${RED}✗${NC} target is broken"
            EXIT_CODE=1
        fi
    else
        echo -e "${RED}✗${NC} $link is not a symlink"
        EXIT_CODE=1
    fi
done

if [ "$EXIT_CODE" == "1" ]; then
    echo -e "\n${RED}Validation failed!${NC}"
    exit 1
else
    echo -e "\n${GREEN}Validation successful! Unified AI architecture is intact.${NC}"
    exit 0
fi
