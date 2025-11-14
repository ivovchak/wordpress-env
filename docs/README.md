# WordPress-ENV Project Documentation

## 📚 Core Information

This documentation contains all the necessary information for working with the WordPress-ENV project.

### About the Project
WordPress-ENV is an environment for rapid, clean, and easy deployment of WordPress sites with installed plugins and corresponding data, without the need for SQL dumps. Instead, it uses simple XML and CSV files for data management.

## 📖 Documentation

### Main Files
- [README.md](../README.md) - main installation and launch instructions
- This file - detailed documentation for developers and AI assistants

### AI Assistants Configuration
The project is configured to work with popular AI tools:
- [.claude/claude.md](../.claude/claude.md) - settings for Claude Code
- [.cursorrules](../.cursorrules) - settings for Cursor AI
- [.github/copilot-instructions.md](../.github/copilot-instructions.md) - settings for GitHub Copilot

## 🛠️ Technology Stack

- **Docker & Docker Compose** - containerization
- **WordPress** (latest) - CMS system
- **MariaDB** 11.5 - database
- **Bash** - automation scripts
- **WP-CLI** - WordPress command-line tool

## 📁 Project Structure

```
wordpress-env/
├── .claude/                      # Claude Code settings
│   └── claude.md
├── .github/                      # GitHub configuration
│   └── copilot-instructions.md
├── docs/                         # Documentation
│   └── README.md                 # This file
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

## 🚀 Quick Start

### Requirements
- Docker Desktop installed and running
- Git for cloning repository
- Minimum 2GB free RAM

### Installation

1. **Clone repository:**
   ```bash
   git clone git@github.com:ivovchak/wordpress-env.git
   cd wordpress-env
   ```

2. **Setup environment:**
   ```bash
   cp .env.development .env
   ```

3. **Create alias (optional, but recommended):**
   ```bash
   alias dc="docker compose"
   ```

4. **Launch:**
   ```bash
   dc up
   ```

5. **Access site:**
   Open http://localhost:8000

## 🎯 Development Guidelines

### Git Commit Messages
**IMPORTANT:** All commit messages are written in Ukrainian!

Format: `<type>: <description>`

**Types:**
- `feat` - new functionality
- `fix` - bug fix
- `docs` - documentation changes
- `style` - code formatting
- `refactor` - refactoring
- `test` - adding tests
- `chore` - technical changes

**Examples:**
```
feat: додано підтримку імпорту JSON файлів
fix: виправлено помилку ініціалізації бази даних
docs: оновлено інструкцію встановлення
refactor: покращено структуру wp-install.sh скрипту
```

### Code Style

#### Principles
- Functional programming has priority
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- SOLID principles

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
database_host="mysql_host"
```

## 🔒 Security

### What to NEVER do:
- ❌ Commit `.env` files with passwords and secrets
- ❌ Hardcode credentials in code
- ❌ Store API keys in repository
- ❌ Commit SQL dumps with real user data

### What to ALWAYS do:
- ✅ Use environment variables for secrets
- ✅ Check that `.env` is in `.gitignore`
- ✅ Create `.env.example` files as templates
- ✅ Validate all input data

## 🐳 Working with Docker

### Useful Commands

```bash
# Start in background mode
dc up -d

# View logs
dc logs -f wordpress
dc logs -f mariadb

# Restart services
dc restart wordpress

# Stop
dc down

# Stop with volumes removal
dc down -v

# Complete cleanup
./wp-uninstall.sh
```

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

## 📦 Data Management

### XML Files
Use for exporting/importing WordPress content:
- Posts
- Pages
- Custom Post Types
- Taxonomies
- Media files

### CSV Files
Use for tabular data:
- Users
- Products
- Custom data

## 🧪 Testing

Before each commit:
1. ✅ Run `dc up` and verify the environment starts
2. ✅ Check logs for errors: `dc logs`
3. ✅ Verify WordPress is accessible at http://localhost:8000
4. ✅ Test new functionality
5. ✅ Make sure existing functionality works

## 🤝 Contribution Guidelines

1. **Read documentation** - this file and README.md
2. **Create branch** for your feature:
   ```bash
   git checkout -b feat/feature-name
   ```
3. **Make changes** following code style
4. **Test** locally
5. **Create commit** in Ukrainian:
   ```bash
   git commit -m "feat: опис нової функції"
   ```
6. **Push and create Pull Request**

## 📝 Additional Resources

### WordPress
- [WordPress Developer Resources](https://developer.wordpress.org/)
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/)
- [WP-CLI Documentation](https://wp-cli.org/)

### Docker
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## ❓ FAQ

**Q: How to change WordPress port?**
A: Edit `WORDPRESS_PORT` in `.env` file

**Q: How to add a new plugin?**
A: Use `./wp-cli.sh plugin install plugin-name --activate`

**Q: Where is WordPress data stored?**
A: In Docker volumes, list can be viewed via `dc volume ls`

**Q: How to make a backup?**
A: Use WP-CLI to export data to XML/CSV

## 🎯 Roadmap

- [ ] JSON format support for data
- [ ] YAML format support for configuration
- [ ] Automatic backups
- [ ] CI/CD integration
- [ ] Multi-site support

## 📞 Support

If you have questions or issues:
1. Check this documentation
2. Review Issues on GitHub
3. Create new Issue with detailed problem description

---

**Happy working with WordPress-ENV!** 🚀