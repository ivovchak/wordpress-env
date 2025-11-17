# CLAUDE.md - AI Assistant Guide for WordPress-ENV

> **Purpose:** This file provides comprehensive guidance for Claude Code and other AI assistants working with the WordPress-ENV project.

## 📋 Table of Contents

1. [Quick Start for AI Assistants](#quick-start-for-ai-assistants)
2. [Project Architecture](#project-architecture)
3. [Critical Rules & Conventions](#critical-rules--conventions)
4. [Development Workflows](#development-workflows)
5. [File Structure & Purpose](#file-structure--purpose)
6. [Common Tasks & Commands](#common-tasks--commands)
7. [Security Guidelines](#security-guidelines)
8. [Testing Procedures](#testing-procedures)
9. [Git Workflow](#git-workflow)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start for AI Assistants

### Essential Reading Order
1. **This file (CLAUDE.md)** - Start here for AI-specific instructions
2. [docs/AI-instructions.md](/docs/AI-instructions.md) - Comprehensive AI guidelines
3. [README.md](/README.md) - User-facing setup instructions
4. [docs/README.md](/docs/README.md) - Technical documentation

### Project Summary
**WordPress-ENV** is a Docker-based development environment for WordPress that uses XML/CSV files for data management instead of traditional SQL dumps. This approach enables clean, version-controllable data imports and rapid deployment.

### Technology Stack
```
Docker Compose (orchestration)
├── WordPress (latest) - Port 8000
├── MariaDB 11.5 - Port 3306
├── phpMyAdmin - Port 3000
└── WP-CLI (automation)
```

---

## Project Architecture

### Container Architecture

```
wordpress-env/
├── db (MariaDB 11.5)
│   ├── Port: 3306
│   ├── Volume: db_data
│   └── Platform: linux/x86_64 (M1/M2 compatibility)
│
├── phpmyadmin
│   ├── Port: 3000
│   ├── Depends on: db
│   └── Config: configuration/apache2.conf
│
├── wordpress (latest)
│   ├── Port: 8000
│   ├── Volumes:
│   │   ├── wp_data:/var/www/html
│   │   ├── ./plugins:/var/www/html/wp-content/plugins
│   │   └── ./themes:/var/www/html/wp-content/themes
│   └── Depends on: db
│
└── wp-cli (automation)
    ├── Auto-installs WordPress on startup
    ├── Installs/activates plugins and themes
    └── Volume: ./data:/data
```

### Data Flow

```
1. docker compose up
   ↓
2. MariaDB initializes (db_data volume)
   ↓
3. WordPress container starts
   ↓
4. WP-CLI container executes:
   - Core installation
   - Theme installation/activation
   - Plugin installation/activation
   - Permalink structure setup
   ↓
5. Ready at http://localhost:8000
```

---

## Critical Rules & Conventions

### 🚨 ABSOLUTE REQUIREMENTS

#### 1. Commit Messages - UKRAINIAN ONLY
```bash
# ✅ CORRECT
git commit -m "feat: додано підтримку імпорту JSON файлів"
git commit -m "fix: виправлено помилку ініціалізації бази даних"
git commit -m "docs: оновлено інструкцію встановлення"
git commit -m "refactor: покращено структуру wp-install.sh скрипту"

# ❌ INCORRECT - Never use English in commits
git commit -m "feat: added JSON import support"
git commit -m "fix: fixed database initialization error"
```

**Commit Types:**
- `feat` - нова функціональність (new feature)
- `fix` - виправлення помилки (bug fix)
- `docs` - зміни в документації (documentation)
- `style` - форматування коду (formatting)
- `refactor` - рефакторинг (refactoring)
- `test` - додавання тестів (tests)
- `chore` - технічні зміни (maintenance)

#### 2. Security - NEVER Commit Secrets
```bash
# ❌ NEVER commit
.env                    # Contains actual secrets

# ✅ SAFE to commit
.env.development        # Template with placeholder values
.env.example            # Template showing required variables
```

#### 3. Data Management - No SQL Dumps
```bash
# ✅ USE THESE
- XML files (WordPress export format)
- CSV files (tabular data)
- JSON files (future support planned)
- YAML files (future support planned)

# ❌ NEVER USE
- SQL dumps
- Database backups with user data
```

### Code Style Principles

#### Functional Programming Priority
```bash
# ✅ GOOD - Functional approach
setup_wordpress() {
    local site_url=$1
    local admin_user=$2
    local admin_email=$3

    wp core install \
        --url="$site_url" \
        --title="WordPress Site" \
        --admin_user="$admin_user" \
        --admin_email="$admin_email"
}

# ❌ AVOID - Procedural with global state
SITE_URL=""
ADMIN_USER=""

setup_wordpress() {
    wp core install --url="$SITE_URL" ...
}
```

#### Design Principles
- **DRY** (Don't Repeat Yourself) - Extract reusable functions
- **KISS** (Keep It Simple, Stupid) - Prefer clarity over cleverness
- **SOLID** - Single responsibility, proper abstractions
- **Error Handling** - Always check for failures

```bash
# ✅ GOOD - Proper error handling
if [ ! -f ".env" ]; then
    echo "Error: .env file not found"
    echo "Run: cp .env.development .env"
    exit 1
fi

# ❌ BAD - No error checking
source .env
```

---

## Development Workflows

### Initial Setup Workflow

```bash
# 1. Clone repository
git clone git@github.com:ivovchak/wordpress-env.git
cd wordpress-env

# 2. Create environment file
cp .env.development .env

# 3. (Optional but recommended) Create alias
alias dc="docker compose"

# 4. Start environment
dc up

# 5. Wait for automatic setup (30-60 seconds)
# - WordPress downloads and installs
# - Plugins install and activate
# - Themes install and activate
# - Database initializes

# 6. Access WordPress
# - Site: http://localhost:8000
# - Admin: http://localhost:8000/wp-admin
# - phpMyAdmin: http://localhost:3000
# - Credentials: admin/admin (from .env)
```

### Development Workflow

```bash
# Start environment (foreground with logs)
dc up

# Start in background (detached mode)
dc up -d

# View logs in real-time
dc logs -f wordpress
dc logs -f db
dc logs -f wp-cli

# Restart specific service
dc restart wordpress

# Stop environment (preserves data)
dc down

# Stop and remove volumes (clean slate)
dc down -v

# Complete cleanup (removes images too)
./wp-uninstall.sh --images --volumes
```

### Plugin Development Workflow

```bash
# 1. Create plugin directory
mkdir -p plugins/my-custom-plugin

# 2. Create plugin main file
cat > plugins/my-custom-plugin/my-custom-plugin.php << 'EOF'
<?php
/**
 * Plugin Name: My Custom Plugin
 * Description: Custom functionality
 * Version: 1.0.0
 * Author: Your Name
 */

// Plugin code here
EOF

# 3. Activate plugin via WP-CLI
./wp-cli.sh "plugin activate my-custom-plugin"

# 4. Verify activation
./wp-cli.sh "plugin list"

# 5. Test functionality
# Access http://localhost:8000 and test

# 6. Commit changes (in Ukrainian!)
git add plugins/my-custom-plugin/
git commit -m "feat: додано новий плагін my-custom-plugin"
git push
```

### Theme Development Workflow

```bash
# 1. Create theme directory
mkdir -p themes/my-custom-theme

# 2. Create style.css (required)
cat > themes/my-custom-theme/style.css << 'EOF'
/*
Theme Name: My Custom Theme
Description: Custom WordPress theme
Version: 1.0.0
Author: Your Name
*/
EOF

# 3. Create index.php (required)
cat > themes/my-custom-theme/index.php << 'EOF'
<?php get_header(); ?>
<!-- Theme template code -->
<?php get_footer(); ?>
EOF

# 4. Activate theme
./wp-cli.sh "theme activate my-custom-theme"

# 5. Verify activation
./wp-cli.sh "theme list"

# 6. Commit changes
git add themes/my-custom-theme/
git commit -m "feat: додано нову тему my-custom-theme"
git push
```

### Data Import/Export Workflow

```bash
# Export WordPress content to XML
./wp-cli.sh "export --dir=/data --user=admin"

# Import WordPress content from XML
./wp-cli.sh "import /data/export.xml --authors=create"

# Export specific post types
./wp-cli.sh "export --dir=/data --post_type=page"

# Export to CSV (using plugins or custom scripts)
./wp-cli.sh "plugin install wp-csv-exporter --activate"

# List all posts (for inspection)
./wp-cli.sh "post list --format=table"

# List all users (for inspection)
./wp-cli.sh "user list --format=table"
```

---

## File Structure & Purpose

### Root Directory Structure

```
wordpress-env/
│
├── .claude/                          # Claude Code configuration
│   └── claude.md                     # Claude-specific instructions (brief)
│
├── .github/                          # GitHub configuration
│   └── copilot-instructions.md       # GitHub Copilot instructions (brief)
│
├── configuration/                    # Server configuration
│   └── apache2.conf                  # Apache config for WordPress & phpMyAdmin
│
├── docs/                             # Documentation
│   ├── AI-instructions.md            # Comprehensive AI guidelines (MAIN)
│   └── README.md                     # Technical documentation
│
├── plugins/                          # WordPress plugins
│   └── index.php                     # Security placeholder
│   # Custom plugins go here as subdirectories
│
├── themes/                           # WordPress themes
│   └── index.php                     # Security placeholder
│   # Custom themes go here as subdirectories
│
├── .cursorrules                      # Cursor AI configuration (brief)
├── .editorconfig                     # Editor configuration (spaces, LF, UTF-8)
├── .env.development                  # Environment template (SAFE to commit)
├── .env                              # Actual environment (NEVER commit)
├── .gitignore                        # Git exclusions
│
├── docker-compose.yml                # Docker orchestration (MAIN CONFIG)
├── LICENSE                           # MIT License
├── README.md                         # User-facing documentation
│
├── wp-cli.sh                         # WP-CLI wrapper script
├── wp-init.sh                        # Initialization script (legacy)
├── wp-install.sh                     # WordPress installation (legacy)
└── wp-uninstall.sh                   # Complete environment cleanup
```

### Key File Details

#### docker-compose.yml
**Location:** `/docker-compose.yml`
**Purpose:** Main orchestration file defining all services
**Services:**
- `db` - MariaDB 11.5 database
- `phpmyadmin` - Database management UI
- `wordpress` - WordPress CMS
- `wp-cli` - CLI automation (runs on startup)

**Key configuration:**
- Volume mounts for persistence
- Environment variable injection
- Network configuration
- Service dependencies

#### .env.development
**Location:** `/.env.development`
**Purpose:** Template for environment configuration
**Status:** ✅ Safe to commit (contains placeholders only)

**Variables:**
```bash
# Host Configuration
WORDPRESS_PROTOCOL=http
WORDPRESS_HOST=localhost
WORDPRESS_PORT=8000
PHPMYADMIN_PORT=3000

# Database Configuration
DB_DATABASE=wordpress
DB_PORT=3306
DB_USER=wordpress
DB_PASSWORD=wordpress          # Change in production!
DB_ROOT_PASSWORD=wordpress     # Change in production!
WORDPRESS_TABLE_PREFIX=wp_

# WordPress Admin Credentials
WORDPRESS_ADMIN_USER=admin
WORDPRESS_ADMIN_PASSWORD=admin # Change in production!
WORDPRESS_ADMIN_EMAIL=admin@wordpress.lan

# Development Settings
WORDPRESS_DEBUG=true
WORDPRESS_CLI_CACHE_DIR=/tmp

# Installation Settings
WORDPRESS_TITLE="Volunteer project"
WORDPRESS_PERMALINK_STRUCTURE=/%postname%/
WORDPRESS_THEMES_TO_INSTALL="understrap"
WORDPRESS_THEME_TO_ACTIVATE="currentTheme"
WORDPRESS_PLUGINS_TO_INSTALL="query-monitor elementor folders metronet-profile-picture advanced-custom-fields"
```

#### wp-cli.sh
**Location:** `/wp-cli.sh`
**Purpose:** Wrapper script for executing WP-CLI commands
**Usage:**
```bash
./wp-cli.sh "plugin list"
./wp-cli.sh "theme activate mytheme"
./wp-cli.sh "user create john john@example.com --role=editor"
```

#### wp-uninstall.sh
**Location:** `/wp-uninstall.sh`
**Purpose:** Complete environment cleanup
**Options:**
```bash
./wp-uninstall.sh              # Stop containers only
./wp-uninstall.sh --volumes    # Stop + remove volumes (data loss!)
./wp-uninstall.sh --images     # Stop + remove images
./wp-uninstall.sh -v -i        # Stop + remove volumes + images (complete cleanup)
```

---

## Common Tasks & Commands

### Docker Operations

```bash
# Start all services
docker compose up

# Start in background
docker compose up -d

# Stop all services
docker compose down

# View all containers
docker compose ps

# View logs (all services)
docker compose logs

# View logs (specific service)
docker compose logs wordpress
docker compose logs db
docker compose logs wp-cli

# Follow logs in real-time
docker compose logs -f wordpress

# Restart service
docker compose restart wordpress

# Rebuild containers (after config changes)
docker compose up --build

# Remove volumes (WARNING: data loss!)
docker compose down -v
```

### WP-CLI Operations

```bash
# Plugin Management
./wp-cli.sh "plugin list"
./wp-cli.sh "plugin install plugin-name"
./wp-cli.sh "plugin activate plugin-name"
./wp-cli.sh "plugin deactivate plugin-name"
./wp-cli.sh "plugin uninstall plugin-name"
./wp-cli.sh "plugin update --all"

# Theme Management
./wp-cli.sh "theme list"
./wp-cli.sh "theme install theme-name"
./wp-cli.sh "theme activate theme-name"
./wp-cli.sh "theme delete theme-name"

# User Management
./wp-cli.sh "user list"
./wp-cli.sh "user create username email@example.com --role=editor"
./wp-cli.sh "user update 1 --user_pass=newpassword"

# Post Management
./wp-cli.sh "post list"
./wp-cli.sh "post create --post_type=page --post_title='About' --post_status=publish"
./wp-cli.sh "post delete 123"

# Database Operations
./wp-cli.sh "db query 'SELECT * FROM wp_posts LIMIT 5'"
./wp-cli.sh "db export /data/backup.sql"
./wp-cli.sh "db import /data/backup.sql"

# Cache Operations
./wp-cli.sh "cache flush"
./wp-cli.sh "rewrite flush"

# Site Information
./wp-cli.sh "core version"
./wp-cli.sh "option get siteurl"
./wp-cli.sh "option update siteurl 'http://localhost:8000'"
```

### Environment Variable Management

```bash
# View current environment variables
cat .env

# Edit environment variables
nano .env
# or
vim .env

# After editing .env, restart containers
docker compose down
docker compose up

# Validate .env file exists
test -f .env && echo "✅ .env exists" || echo "❌ .env missing"

# Compare with template
diff .env.development .env
```

---

## Security Guidelines

### Secret Management

#### ❌ NEVER Do This
```bash
# Never commit .env with real secrets
git add .env                              # DANGEROUS!

# Never hardcode credentials
DB_PASSWORD="supersecret123"              # DANGEROUS!

# Never expose API keys
GOOGLE_API_KEY="AIza..."                  # DANGEROUS!

# Never commit SQL dumps with real data
git add backup.sql                        # DANGEROUS!
```

#### ✅ ALWAYS Do This
```bash
# Use environment variables
DB_PASSWORD=${DB_PASSWORD}                # SAFE

# Commit templates only
git add .env.development                  # SAFE (template)
git add .env.example                      # SAFE (template)

# Keep .env in .gitignore
echo ".env" >> .gitignore                 # REQUIRED

# Use WordPress export (no sensitive data)
git add data/export.xml                   # SAFE (content only)
```

### Input Validation

```bash
# ✅ Validate input exists
if [ -z "$1" ]; then
    echo "Error: Missing required argument"
    exit 1
fi

# ✅ Validate file exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found"
    exit 1
fi

# ✅ Validate directory exists
if [ ! -d "plugins" ]; then
    echo "Error: plugins directory not found"
    exit 1
fi
```

### WordPress Security Best Practices

```bash
# Use strong passwords in production
WORDPRESS_ADMIN_PASSWORD=$(openssl rand -base64 32)

# Disable debug mode in production
WORDPRESS_DEBUG=false

# Use HTTPS in production
WORDPRESS_PROTOCOL=https

# Limit login attempts (via plugin)
./wp-cli.sh "plugin install limit-login-attempts-reloaded --activate"

# Regular updates
./wp-cli.sh "plugin update --all"
./wp-cli.sh "theme update --all"
./wp-cli.sh "core update"
```

---

## Testing Procedures

### Pre-Commit Testing Checklist

Before committing ANY changes, verify:

```bash
# 1. Environment starts successfully
docker compose up
# Expected: All containers start without errors
# Wait 30-60 seconds for complete initialization

# 2. WordPress is accessible
curl -f http://localhost:8000 > /dev/null
# Expected: HTTP 200 OK response

# 3. Admin panel works
curl -f http://localhost:8000/wp-admin > /dev/null
# Expected: HTTP 200 OK response

# 4. Database is accessible
docker compose exec db mysql -u wordpress -pwordpress -e "SHOW DATABASES;"
# Expected: Lists wordpress database

# 5. No errors in logs
docker compose logs | grep -i error
# Expected: No critical errors (some PHP notices OK)

# 6. Plugins are active
./wp-cli.sh "plugin list --status=active"
# Expected: List of active plugins

# 7. Theme is active
./wp-cli.sh "theme list --status=active"
# Expected: Active theme shown

# 8. Stop environment cleanly
docker compose down
# Expected: Clean shutdown
```

### Testing New Plugins

```bash
# 1. Install plugin
./wp-cli.sh "plugin install my-plugin --activate"

# 2. Verify activation
./wp-cli.sh "plugin list --name=my-plugin"

# 3. Check for PHP errors
docker compose logs wordpress | grep -i "my-plugin"

# 4. Test plugin functionality
# - Access WordPress admin
# - Navigate to plugin settings
# - Test plugin features
# - Check frontend functionality

# 5. Test plugin deactivation
./wp-cli.sh "plugin deactivate my-plugin"

# 6. Test plugin reactivation
./wp-cli.sh "plugin activate my-plugin"

# 7. Document any issues found
```

### Testing New Themes

```bash
# 1. Install theme
./wp-cli.sh "theme install my-theme"

# 2. Activate theme
./wp-cli.sh "theme activate my-theme"

# 3. Check for PHP errors
docker compose logs wordpress | grep -i "my-theme"

# 4. Test theme functionality
# - Visit homepage
# - Check single post
# - Check archive pages
# - Test responsive design
# - Verify all template parts load

# 5. Switch back to previous theme
./wp-cli.sh "theme activate twentytwentythree"

# 6. Test theme again
./wp-cli.sh "theme activate my-theme"
```

---

## Git Workflow

### Branch Naming Convention

```bash
# Feature branches
git checkout -b feat/назва-функції
git checkout -b feat/json-import-support

# Bug fix branches
git checkout -b fix/назва-проблеми
git checkout -b fix/database-connection-error

# Documentation branches
git checkout -b docs/назва-документу
git checkout -b docs/update-readme

# Refactoring branches
git checkout -b refactor/назва-компонента
git checkout -b refactor/wp-cli-scripts
```

### Commit Workflow

```bash
# 1. Check current status
git status

# 2. Review changes
git diff

# 3. Stage changes
git add file1.php file2.sh

# 4. Commit with Ukrainian message
git commit -m "feat: додано підтримку імпорту JSON файлів"

# 5. Push to remote
git push origin feat/json-import-support

# 6. Create Pull Request on GitHub
```

### Commit Message Examples

```bash
# New features
git commit -m "feat: додано підтримку імпорту JSON файлів"
git commit -m "feat: додано новий плагін для аналітики"
git commit -m "feat: інтегровано WooCommerce"

# Bug fixes
git commit -m "fix: виправлено помилку при ініціалізації бази даних"
git commit -m "fix: виправлено проблему з кодуванням UTF-8"
git commit -m "fix: виправлено помилку активації плагіну"

# Documentation
git commit -m "docs: оновлено інструкцію встановлення"
git commit -m "docs: додано приклади використання WP-CLI"
git commit -m "docs: оновлено README з новими командами"

# Refactoring
git commit -m "refactor: покращено структуру wp-install.sh скрипту"
git commit -m "refactor: оптимізовано docker-compose.yml"
git commit -m "refactor: винесено функції в окремі файли"

# Code style
git commit -m "style: форматування коду згідно EditorConfig"
git commit -m "style: виправлено відступи в bash скриптах"

# Tests
git commit -m "test: додано тести для імпорту даних"
git commit -m "test: додано перевірку валідації форм"

# Chore (maintenance)
git commit -m "chore: оновлено версію MariaDB до 11.5"
git commit -m "chore: додано .gitignore правила"
git commit -m "chore: оновлено залежності Docker"
```

### Checking Commit History

```bash
# View recent commits
git log --oneline -10

# View commits with details
git log -5

# View commits by author
git log --author="username"

# View commits for specific file
git log -- docker-compose.yml

# Search commits by message
git log --grep="JSON"
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: Port Already in Use

```bash
# Symptoms
Error: Bind for 0.0.0.0:8000 failed: port is already allocated

# Solution 1: Find and kill process using port
lsof -ti:8000 | xargs kill -9

# Solution 2: Change port in .env
nano .env
# Change: WORDPRESS_PORT=8001
docker compose up
```

#### Issue: Database Connection Failed

```bash
# Symptoms
Error establishing a database connection

# Solution 1: Wait longer (30-60 seconds after startup)
docker compose logs db
# Look for: "ready for connections"

# Solution 2: Restart database
docker compose restart db

# Solution 3: Reset database
docker compose down -v
docker compose up
# WARNING: This deletes all data!
```

#### Issue: WordPress Not Installing

```bash
# Symptoms
WP-CLI container exits immediately

# Solution 1: Check logs
docker compose logs wp-cli

# Solution 2: Verify .env file exists
test -f .env || cp .env.development .env

# Solution 3: Verify database is ready
docker compose logs db | grep "ready for connections"

# Solution 4: Manually run WP-CLI
docker compose run --rm wp-cli wp core install \
    --path="/var/www/html" \
    --url="http://localhost:8000" \
    --title="WordPress" \
    --admin_user="admin" \
    --admin_password="admin" \
    --admin_email="admin@example.com"
```

#### Issue: Plugin Won't Activate

```bash
# Symptoms
Plugin activation fails

# Solution 1: Check plugin syntax
docker compose exec wordpress php -l /var/www/html/wp-content/plugins/my-plugin/my-plugin.php

# Solution 2: Check WordPress logs
docker compose logs wordpress | tail -50

# Solution 3: Enable debug mode
# Edit .env: WORDPRESS_DEBUG=true
docker compose restart wordpress
docker compose logs wordpress

# Solution 4: Check plugin directory structure
docker compose exec wordpress ls -la /var/www/html/wp-content/plugins/my-plugin/

# Solution 5: Check file permissions
docker compose exec wordpress chmod -R 755 /var/www/html/wp-content/plugins/my-plugin/
```

#### Issue: Permission Denied Errors

```bash
# Symptoms
Permission denied when accessing files

# Solution 1: Fix file permissions
docker compose exec wordpress chown -R www-data:www-data /var/www/html/wp-content/

# Solution 2: Fix directory permissions
docker compose exec wordpress chmod -R 755 /var/www/html/wp-content/plugins/
docker compose exec wordpress chmod -R 755 /var/www/html/wp-content/themes/
```

#### Issue: Docker Compose Command Not Found

```bash
# Symptoms
docker-compose: command not found

# Solution: Use 'docker compose' (without hyphen)
docker compose up
# Modern Docker includes compose as a subcommand
```

#### Issue: Changes Not Reflecting

```bash
# Symptoms
Code changes don't appear in WordPress

# Solution 1: Clear WordPress cache
./wp-cli.sh "cache flush"
./wp-cli.sh "rewrite flush"

# Solution 2: Restart WordPress container
docker compose restart wordpress

# Solution 3: Check volume mounts
docker compose config | grep volumes -A 5

# Solution 4: Verify file is in correct location
ls -la plugins/my-plugin/
ls -la themes/my-theme/
```

---

## AI Assistant Specific Notes

### When Working on This Project

1. **Always Check Documentation First**
   - Read `docs/AI-instructions.md` for comprehensive guidelines
   - Reference this file (CLAUDE.md) for quick lookups
   - Check existing code before implementing new features

2. **Commit Message Language**
   - ALWAYS write commit messages in Ukrainian
   - Use the conventional commit format
   - Reference the examples in this document

3. **Testing Before Suggesting**
   - Verify commands work in the Docker environment
   - Test plugin/theme code for PHP syntax errors
   - Ensure changes don't break existing functionality

4. **Security Consciousness**
   - Never suggest committing `.env` files
   - Always recommend environment variables for secrets
   - Warn about sensitive data in SQL dumps

5. **Code Style Consistency**
   - Follow functional programming principles
   - Use descriptive variable names (English)
   - Add comments in Ukrainian or English
   - Follow EditorConfig settings (spaces, LF, UTF-8)

6. **Docker-First Approach**
   - All commands should work inside containers
   - Use `docker compose exec` for container commands
   - Use `./wp-cli.sh` wrapper for WP-CLI commands

7. **Data Management Philosophy**
   - Prefer XML/CSV over SQL dumps
   - Use WP-CLI export/import features
   - Document data format changes

### Helpful Patterns for AI Assistants

#### Pattern: Adding a New Feature

```bash
# 1. Understand requirements
# 2. Check existing code
git grep "similar_feature"

# 3. Create feature branch
git checkout -b feat/нова-функція

# 4. Implement feature
# (code changes)

# 5. Test locally
docker compose up
# Verify functionality works

# 6. Commit in Ukrainian
git commit -m "feat: додано нову функцію X"

# 7. Push and create PR
git push origin feat/нова-функція
```

#### Pattern: Debugging an Issue

```bash
# 1. Reproduce the issue
docker compose up

# 2. Check logs
docker compose logs wordpress | grep -i error
docker compose logs db | grep -i error

# 3. Enable debug mode if needed
# Edit .env: WORDPRESS_DEBUG=true
docker compose restart wordpress

# 4. Investigate error
docker compose logs wordpress | tail -100

# 5. Fix issue
# (code changes)

# 6. Test fix
docker compose restart wordpress
# Verify issue is resolved

# 7. Commit fix in Ukrainian
git commit -m "fix: виправлено проблему з X"
```

#### Pattern: Answering User Questions

```markdown
1. Check if answer exists in documentation:
   - CLAUDE.md (this file)
   - docs/AI-instructions.md
   - docs/README.md
   - README.md

2. If answer not found, investigate:
   - Check relevant source files
   - Test in Docker environment
   - Verify with WP-CLI commands

3. Provide answer with:
   - Clear explanation
   - Code examples if applicable
   - References to documentation
   - Testing steps if needed
```

---

## Quick Reference

### Essential URLs
- **WordPress Site:** http://localhost:8000
- **WordPress Admin:** http://localhost:8000/wp-admin
- **phpMyAdmin:** http://localhost:3000

### Default Credentials
- **Admin User:** admin
- **Admin Password:** admin
- **Database User:** wordpress
- **Database Password:** wordpress
- **Database Name:** wordpress

### Key Commands Cheatsheet

```bash
# Start environment
docker compose up

# Stop environment
docker compose down

# View logs
docker compose logs -f wordpress

# WP-CLI wrapper
./wp-cli.sh "plugin list"

# Complete cleanup
./wp-uninstall.sh -v -i

# Create environment from template
cp .env.development .env

# Test WordPress is running
curl -f http://localhost:8000
```

### File Locations Inside Containers

```bash
# WordPress files
/var/www/html/

# Plugins directory
/var/www/html/wp-content/plugins/

# Themes directory
/var/www/html/wp-content/themes/

# Data directory (for imports/exports)
/data/

# Apache configuration
/etc/apache2/apache2.conf
```

---

## Project Roadmap

Planned features (reference for AI assistants):

- [ ] **JSON format support** - Data import/export in JSON format
- [ ] **YAML format support** - Configuration in YAML format
- [ ] **Automatic backup system** - Scheduled backups via WP-CLI
- [ ] **CI/CD integration** - GitHub Actions for testing
- [ ] **Multi-site support** - WordPress multisite configuration

---

## Additional Resources

### Official Documentation
- [WordPress Developer Resources](https://developer.wordpress.org/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WP-CLI Documentation](https://wp-cli.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MariaDB Documentation](https://mariadb.org/documentation/)

### Project-Specific Documentation
- [Main README](/README.md) - Setup instructions
- [AI Instructions](/docs/AI-instructions.md) - Comprehensive AI guidelines
- [Technical Docs](/docs/README.md) - Detailed technical documentation

---

## License

MIT License - Copyright (c) 2023 Ihor Vovchak

See [LICENSE](/LICENSE) for full text.

---

**Last Updated:** 2025-11-17
**Maintained By:** Project contributors and AI assistants
**Version:** 1.0.0

---

## Summary for AI Assistants

**Key Takeaways:**
1. ✅ Commits MUST be in Ukrainian using conventional commit format
2. ❌ NEVER commit `.env` files with secrets
3. ✅ Use XML/CSV for data, not SQL dumps
4. ✅ Test everything before committing
5. ✅ Follow functional programming principles
6. ✅ Use `docker compose` (not `docker-compose`)
7. ✅ Use `./wp-cli.sh` wrapper for WP-CLI commands
8. ✅ Read `docs/AI-instructions.md` for comprehensive guidelines

**When in Doubt:**
- Check this file (CLAUDE.md) first
- Reference docs/AI-instructions.md for details
- Test in Docker environment before suggesting
- Ask user to clarify requirements if unclear
