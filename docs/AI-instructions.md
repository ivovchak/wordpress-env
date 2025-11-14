# AI Assistants Instructions

This file contains comprehensive instructions for AI assistants (Claude Code, Cursor AI, GitHub Copilot) working with the WordPress-ENV project.

## 📚 Essential Reading

**ALWAYS start by reading:**
1. [Main README](../README.md) - installation and setup instructions
2. [Project Documentation](README.md) - detailed technical documentation

## 📋 Project Overview

WordPress-ENV is an environment for rapid, clean, and easy deployment of WordPress sites with installed plugins and corresponding data, without SQL dumps. Instead, it uses simple XML and CSV files for data management.

### Technology Stack
- **Docker & Docker Compose** - containerization
- **WordPress** (latest) - CMS system
- **MariaDB** 11.5 - database
- **Bash** - automation scripts
- **WP-CLI** - WordPress command-line tool

## 🎯 Coding Guidelines

### Language Conventions
- **Commit messages:** Ukrainian only
- **Code comments:** Ukrainian or English
- **Documentation:** English (for broader accessibility)
- **Variable/function names:** English (camelCase, snake_case)

### Git Commit Convention

Format: `<type>: <short description in Ukrainian>`

**Commit types:**
- `feat` - new functionality
- `fix` - bug fix
- `docs` - documentation changes
- `style` - formatting, missing semicolons, etc.
- `refactor` - code refactoring
- `test` - adding tests
- `chore` - build updates, auxiliary tools

**Examples:**
```
feat: додано підтримку імпорту JSON файлів
fix: виправлено помилку при ініціалізації бази даних
docs: оновлено інструкцію встановлення
refactor: покращено структуру wp-install.sh скрипту
```

### Code Style Principles

#### General Principles
- **Functional programming** has priority
- **DRY** (Don't Repeat Yourself)
- **KISS** (Keep It Simple, Stupid)
- **SOLID** principles

#### Bash Scripts
```bash
# Use functions to organize code
setup_wordpress() {
    local site_url=$1
    local admin_user=$2
    # your code here
}

# Always check for errors
if [ ! -f ".env" ]; then
    echo "Error: .env file not found"
    exit 1
fi

# Use descriptive variable names
wordpress_container_name="wordpress_container"
database_host="mariadb_host"
```

#### Docker Compose
```yaml
# Use environment variables
environment:
  - WORDPRESS_DB_HOST=${DB_HOST}
  - WORDPRESS_DB_NAME=${DB_NAME}
```

## 🔒 Security Guidelines

### What to NEVER do:
- ❌ Commit `.env` files with passwords and secrets
- ❌ Hardcode credentials in code
- ❌ Store API keys in repository
- ❌ Commit SQL dumps with real user data

### What to ALWAYS do:
- ✅ Use environment variables for secrets
- ✅ Ensure `.env` is in `.gitignore`
- ✅ Commit `.env.development` or `.env.example` as templates (without secrets)
- ✅ Validate all input data

### Environment Files Best Practices
- `.env` - **NEVER commit** (contains actual secrets, in `.gitignore`)
- `.env.development` - **CAN commit** (template with placeholder values)
- `.env.example` - **CAN commit** (template showing required variables)

## 🐳 Docker Commands

### Setup
```bash
# Create alias for convenience
alias dc="docker compose"
```

### Common Operations
```bash
# Start environment
dc up

# Start in background mode
dc up -d

# Stop environment
dc down

# Stop with volumes removal
dc down -v

# View logs
dc logs -f wordpress
dc logs -f mariadb

# Restart services
dc restart wordpress

# Complete cleanup
./wp-uninstall.sh
```

## 📦 WordPress & WP-CLI

### WP-CLI Commands
```bash
# List plugins
./wp-cli.sh plugin list

# Activate plugin
./wp-cli.sh plugin activate plugin-name

# List themes
./wp-cli.sh theme list

# Export content
./wp-cli.sh export

# Import content
./wp-cli.sh import file.xml
```

### Data Management

**XML Files** - Use for WordPress content:
- Posts
- Pages
- Custom Post Types
- Taxonomies
- Media files

**CSV Files** - Use for tabular data:
- Users
- Products
- Custom data

## 🧪 Testing Guidelines

Before each commit:
1. ✅ Run `dc up` and verify the environment starts
2. ✅ Check logs for errors: `dc logs`
3. ✅ Verify WordPress is accessible at http://localhost:8000
4. ✅ Test new functionality
5. ✅ Make sure existing functionality works

## 📁 Project Structure

```
wordpress-env/
├── .claude/                      # Claude Code settings
│   └── claude.md
├── .github/                      # GitHub configuration
│   └── copilot-instructions.md
├── docs/                         # Documentation
│   ├── README.md                 # Project documentation
│   └── AI-instructions.md        # This file
├── .cursorrules                  # Cursor AI settings
├── .env.development              # Environment variables template
├── .gitignore
├── docker-compose.yml            # Docker configuration
├── LICENSE
├── README.md                     # Main instructions
├── wp-cli.sh                     # WP-CLI wrapper script
├── wp-init.sh                    # Initialization script
├── wp-install.sh                 # WordPress installation script
└── wp-uninstall.sh              # Environment removal script
```

## 🤝 Contribution Workflow

1. **Read documentation** - this file, README.md, and docs/README.md
2. **Create branch** for your feature:
   ```bash
   git checkout -b feat/feature-name
   ```
3. **Make changes** following code style guidelines
4. **Test locally** before committing
5. **Create commit** in Ukrainian:
   ```bash
   git commit -m "feat: опис нової функції"
   ```
6. **Push and create Pull Request**

## 🎨 WordPress Development

### Best Practices
- Use WP-CLI for automation
- Follow [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- Check compatibility with latest WordPress version
- Document plugin dependencies
- Store configuration in XML/CSV files
- Avoid WordPress core modifications

### Data Format
- Use WordPress Import/Export tools
- XML for complex content structures
- CSV for simple tabular data
- Document custom data formats in README

## 📝 Additional Resources

### Documentation
- [WordPress Developer Resources](https://developer.wordpress.org/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WP-CLI Documentation](https://wp-cli.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

### Quick Reference
- Main port: http://localhost:8000
- Database: MariaDB 11.5
- WP-CLI: Available via `./wp-cli.sh`

## ❓ Common Tasks

**Change WordPress port:**
- Edit `WORDPRESS_PORT` in `.env` file

**Add new plugin:**
- Use `./wp-cli.sh plugin install plugin-name --activate`

**Add private plugin/theme from Git:**
- Add repository URL to `PRIVATE_PLUGIN_REPOS` or `PRIVATE_THEME_REPOS` in `.env`
- Use `./wp-private-repos.sh clone` or restart containers with `dc up`

**Update private repositories:**
- Use `./wp-private-repos.sh update` to pull latest changes

**View data storage:**
- Run `dc volume ls` to see Docker volumes

**Create backup:**
- Use WP-CLI to export data to XML/CSV

## 🎯 Project Roadmap

- [ ] JSON format support for data import/export
- [ ] YAML format support for configuration
- [ ] Automatic backup system
- [ ] CI/CD integration
- [ ] Multi-site support

---

**Remember:** Always start by reading the documentation and testing your changes locally before committing!