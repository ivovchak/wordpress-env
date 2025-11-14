# GitHub Copilot Instructions for WordPress-ENV

## 📚 Essential Documentation

**READ THESE FILES IN ORDER:**
1. **[docs/AI-instructions.md](../docs/AI-instructions.md)** ← **START HERE**
2. [README.md](../README.md) - Setup and installation
3. [docs/README.md](../docs/README.md) - Project documentation

## 🎯 Quick Reference

### Project Overview
WordPress-ENV is an environment for rapid deployment of WordPress sites with plugins and data using XML/CSV files instead of SQL dumps.

### Technology Stack
- **Docker** and Docker Compose
- **WordPress** (latest)
- **MariaDB** 11.5
- **Bash** scripts
- **WP-CLI**

### Essential Commands
```bash
alias dc="docker compose"      # Create alias
dc up                           # Start environment
dc down                         # Stop environment
dc logs -f wordpress            # View logs
./wp-cli.sh plugin list         # WP-CLI commands
```

### Core Guidelines
- ✅ **Commits in Ukrainian** - Format: `<type>: <опис>`
- ✅ Test before committing
- ✅ Functional programming style
- ✅ Use environment variables for secrets
- ❌ Never commit `.env` with passwords (`.env.development` template is OK)
- ❌ No SQL dumps (use XML/CSV)

## 📖 Complete Instructions

For comprehensive information including:
- **Coding standards** - Style guide and best practices
- **Security guidelines** - What to do and what to avoid
- **Git commit conventions** - Ukrainian format and examples
- **Docker commands** - Full command reference
- **WP-CLI usage** - WordPress automation
- **Testing procedures** - Pre-commit checklist
- **Contribution workflow** - Step-by-step guide
- **Data management** - XML/CSV format guidelines

**See the complete guide:** [docs/AI-instructions.md](../docs/AI-instructions.md)

## 🔗 Resources
- [WordPress Developer Resources](https://developer.wordpress.org/)
- [WP-CLI Documentation](https://wp-cli.org/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Remember:** Always read [docs/AI-instructions.md](../docs/AI-instructions.md) before starting work!
