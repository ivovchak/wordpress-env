#!/usr/bin/env bash

# Script for managing private repositories (plugins and themes)
# Usage: ./wp-private-repos.sh [clone|update|list]

set -e

COMMAND=${1:-help}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Function to display help
show_help() {
    echo "Usage: ./wp-private-repos.sh [command]"
    echo ""
    echo "Commands:"
    echo "  clone   - Clone all private repositories specified in .env"
    echo "  update  - Update all private repositories (git pull)"
    echo "  list    - List all cloned private repositories"
    echo "  help    - Show this help message"
    echo ""
    echo "Environment variables required in .env:"
    echo "  PRIVATE_PLUGIN_REPOS  - Comma-separated list of plugin git URLs"
    echo "  PRIVATE_THEME_REPOS   - Comma-separated list of theme git URLs"
    echo "  SSH_KEY_PATH          - Path to SSH keys directory (default: ~/.ssh)"
    echo ""
}

# Function to clone repositories
clone_repos() {
    echo -e "${GREEN}Cloning private repositories...${NC}"

    # Clone plugins
    if [ ! -z "$PRIVATE_PLUGIN_REPOS" ]; then
        echo -e "${YELLOW}Cloning plugins...${NC}"
        IFS=',' read -ra REPOS <<< "$PRIVATE_PLUGIN_REPOS"
        for repo in "${REPOS[@]}"; do
            repo=$(echo "$repo" | xargs) # trim whitespace
            if [ ! -z "$repo" ]; then
                plugin_name=$(basename "$repo" .git)
                if [ -d "plugins/$plugin_name" ]; then
                    echo -e "${YELLOW}Plugin $plugin_name already exists, skipping...${NC}"
                else
                    echo -e "Cloning $plugin_name..."
                    git clone "$repo" "plugins/$plugin_name" && \
                        echo -e "${GREEN}✓ Successfully cloned $plugin_name${NC}" || \
                        echo -e "${RED}✗ Failed to clone $plugin_name${NC}"
                fi
            fi
        done
    else
        echo -e "${YELLOW}No private plugin repositories specified in PRIVATE_PLUGIN_REPOS${NC}"
    fi

    # Clone themes
    if [ ! -z "$PRIVATE_THEME_REPOS" ]; then
        echo -e "${YELLOW}Cloning themes...${NC}"
        IFS=',' read -ra REPOS <<< "$PRIVATE_THEME_REPOS"
        for repo in "${REPOS[@]}"; do
            repo=$(echo "$repo" | xargs) # trim whitespace
            if [ ! -z "$repo" ]; then
                theme_name=$(basename "$repo" .git)
                if [ -d "themes/$theme_name" ]; then
                    echo -e "${YELLOW}Theme $theme_name already exists, skipping...${NC}"
                else
                    echo -e "Cloning $theme_name..."
                    git clone "$repo" "themes/$theme_name" && \
                        echo -e "${GREEN}✓ Successfully cloned $theme_name${NC}" || \
                        echo -e "${RED}✗ Failed to clone $theme_name${NC}"
                fi
            fi
        done
    else
        echo -e "${YELLOW}No private theme repositories specified in PRIVATE_THEME_REPOS${NC}"
    fi

    echo -e "${GREEN}Done!${NC}"
}

# Function to update repositories
update_repos() {
    echo -e "${GREEN}Updating private repositories...${NC}"

    # Update plugins
    echo -e "${YELLOW}Updating plugins...${NC}"
    for plugin_dir in plugins/*/.git; do
        if [ -d "$plugin_dir" ]; then
            plugin_path=$(dirname "$plugin_dir")
            plugin_name=$(basename "$plugin_path")
            echo -e "Updating $plugin_name..."
            (cd "$plugin_path" && git pull) && \
                echo -e "${GREEN}✓ Successfully updated $plugin_name${NC}" || \
                echo -e "${RED}✗ Failed to update $plugin_name${NC}"
        fi
    done

    # Update themes
    echo -e "${YELLOW}Updating themes...${NC}"
    for theme_dir in themes/*/.git; do
        if [ -d "$theme_dir" ]; then
            theme_path=$(dirname "$theme_dir")
            theme_name=$(basename "$theme_path")
            echo -e "Updating $theme_name..."
            (cd "$theme_path" && git pull) && \
                echo -e "${GREEN}✓ Successfully updated $theme_name${NC}" || \
                echo -e "${RED}✗ Failed to update $theme_name${NC}"
        fi
    done

    echo -e "${GREEN}Done!${NC}"
}

# Function to list repositories
list_repos() {
    echo -e "${GREEN}Private repositories (with git):${NC}"

    echo -e "\n${YELLOW}Plugins:${NC}"
    found_plugins=false
    for plugin_dir in plugins/*/.git; do
        if [ -d "$plugin_dir" ]; then
            found_plugins=true
            plugin_path=$(dirname "$plugin_dir")
            plugin_name=$(basename "$plugin_path")
            remote_url=$(cd "$plugin_path" && git config --get remote.origin.url || echo "Unknown")
            echo "  - $plugin_name ($remote_url)"
        fi
    done
    if [ "$found_plugins" = false ]; then
        echo -e "  ${YELLOW}No git-based plugins found${NC}"
    fi

    echo -e "\n${YELLOW}Themes:${NC}"
    found_themes=false
    for theme_dir in themes/*/.git; do
        if [ -d "$theme_dir" ]; then
            found_themes=true
            theme_path=$(dirname "$theme_dir")
            theme_name=$(basename "$theme_path")
            remote_url=$(cd "$theme_path" && git config --get remote.origin.url || echo "Unknown")
            echo "  - $theme_name ($remote_url)"
        fi
    done
    if [ "$found_themes" = false ]; then
        echo -e "  ${YELLOW}No git-based themes found${NC}"
    fi
}

# Main script logic
case $COMMAND in
    clone)
        clone_repos
        ;;
    update)
        update_repos
        ;;
    list)
        list_repos
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $COMMAND${NC}"
        show_help
        exit 1
        ;;
esac
