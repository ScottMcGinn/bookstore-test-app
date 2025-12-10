# Git Setup Instructions

## Initial Setup (First Time Only)

### 1. Initialize Git Repository

```bash
cd D:\Documents\bookstore-test-app
git init
```

### 2. Add All Files

```bash
git add .
```

### 3. Create Initial Commit

```bash
git commit -m "Initial commit: Bookstore test automation app with React frontend and Express backend"
```

## Create GitHub Repository

### Option A: Using GitHub Website

1. Go to https://github.com/new
2. Repository name: `bookstore-test-app`
3. Description: "Full-stack bookstore application for test automation practice"
4. Choose Public or Private
5. **DO NOT** check "Initialize this repository with a README" (we already have one)
6. Click "Create repository"

### Option B: Using GitHub CLI

```bash
gh repo create bookstore-test-app --public --source=. --remote=origin
```

## Connect to GitHub

After creating the repository on GitHub, run:

```bash
# Replace YOUR-USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR-USERNAME/bookstore-test-app.git

# Verify the remote
git remote -v
```

## Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

## Making Changes and Pushing

After making changes to files:

```bash
# Check what files changed
git status

# Add specific files
git add filename.js

# Or add all changed files
git add .

# Commit with a message
git commit -m "Add new feature"

# Push to GitHub
git push
```

## Useful Git Commands

```bash
# See commit history
git log

# See what changed in files
git diff

# Discard changes to a file
git checkout -- filename.js

# Create a new branch
git checkout -b feature-name

# Switch branches
git checkout main

# Pull latest changes
git pull

# Clone repository (for other testers)
git clone https://github.com/YOUR-USERNAME/bookstore-test-app.git
```

## Git Ignore

The `.gitignore` file is already configured to ignore:
- `node_modules/` (dependencies)
- Build output folders
- Environment files
- IDE settings
- OS files

## For Other Testers to Use Your Repository

Once pushed to GitHub, share this with other testers:

```bash
# Clone the repository
git clone https://github.com/YOUR-USERNAME/bookstore-test-app.git

# Navigate to the folder
cd bookstore-test-app

# Follow SETUP.md for installation instructions
```

## Branch Strategy (Optional)

For team collaboration:

```bash
# Create feature branch
git checkout -b feature/add-cart

# Make changes and commit
git add .
git commit -m "Add shopping cart feature"

# Push feature branch
git push -u origin feature/add-cart

# Create Pull Request on GitHub
# After review, merge to main
```

## Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/bookstore-test-app.git
```

### Authentication Issues

If using HTTPS, you may need a Personal Access Token:
1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token with 'repo' scope
3. Use token as password when pushing

Or set up SSH:
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to GitHub: Settings > SSH and GPG keys > New SSH key
# Copy key from: cat ~/.ssh/id_ed25519.pub

# Use SSH URL instead
git remote set-url origin git@github.com:YOUR-USERNAME/bookstore-test-app.git
```

## Updating README with Your Username

Don't forget to update the clone URL in README.md:

```markdown
git clone https://github.com/YOUR-ACTUAL-USERNAME/bookstore-test-app.git
```

## Tags and Releases

To create releases:

```bash
# Create a tag
git tag -a v1.0.0 -m "Initial release"

# Push tag
git push origin v1.0.0
```

Then create a release on GitHub from the tag.
