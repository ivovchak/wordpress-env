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

## 🔐 Working with Private Repositories

WordPress-ENV supports automatic cloning and installation of plugins and themes from private Git repositories (GitHub, GitLab, Bitbucket).

### Prerequisites

1. **SSH Key Setup:**
   - Generate SSH key if you don't have one:
     ```bash
     ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
     ```
   - Add public key to your Git hosting service (GitHub/GitLab/Bitbucket)
   - SSH keys should be in `~/.ssh/` directory

2. **Configure .env file:**
   ```bash
   # Git Configuration (optional)
   GIT_USER_NAME="Your Name"
   GIT_USER_EMAIL="your@email.com"

   # Private Repositories
   # Comma-separated list of Git repository URLs (SSH format)
   PRIVATE_PLUGIN_REPOS="git@github.com:username/private-plugin.git,git@github.com:username/another-plugin.git"
   PRIVATE_THEME_REPOS="git@github.com:username/private-theme.git"

   # SSH Key Path (optional, defaults to ~/.ssh)
   SSH_KEY_PATH="/home/username/.ssh"
   ```

### Using the Helper Script

The project includes `wp-private-repos.sh` script for managing private repositories:

```bash
# Clone all private repositories specified in .env
./wp-private-repos.sh clone

# Update all private repositories (git pull)
./wp-private-repos.sh update

# List all cloned private repositories
./wp-private-repos.sh list

# Show help
./wp-private-repos.sh help
```

### How It Works

1. **Automatic Cloning:**
   - During `docker compose up`, wp-cli container automatically:
     - Installs git and openssh
     - Configures SSH keys with proper permissions
     - Adds known_hosts for GitHub, GitLab, and Bitbucket
     - Clones specified private repositories into plugins/themes directories

2. **Manual Cloning:**
   - Use `./wp-private-repos.sh clone` to clone repos without restarting containers
   - Repositories are cloned to `./plugins/` and `./themes/` directories

3. **Updates:**
   - Use `./wp-private-repos.sh update` to pull latest changes from all private repos

### Supported Git Hosting Services

- **GitHub:** `git@github.com:username/repo.git`
- **GitLab:** `git@gitlab.com:username/repo.git`
- **Bitbucket:** `git@bitbucket.org:username/repo.git`
- **Custom Git Server:** `git@your-server.com:path/to/repo.git`

### Security Notes

- SSH keys are mounted as read-only volumes
- Never commit your `.env` file with real repository URLs
- Use `.env.development` as template only
- Private repositories are listed in `.gitignore` automatically if in plugins/themes folders

### Troubleshooting

**Issue:** "Permission denied (publickey)"
- Solution: Ensure SSH key is added to your Git hosting service
- Check key permissions: `chmod 600 ~/.ssh/id_rsa`

**Issue:** "Host key verification failed"
- Solution: Add host to known_hosts:
  ```bash
  ssh-keyscan github.com >> ~/.ssh/known_hosts
  ```

**Issue:** Repository not cloning
- Solution: Check repository URL format (should use SSH format: `git@...`)
- Verify you have access to the private repository

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