# 🚀 Release Workflow & Best Practices

This document outlines the recommended workflow for managing releases and development of the Prisoner's Dilemma simulation.

## 🌿 **Branch Strategy**

### **Main Branches**
- **`main`** - Production-ready code, deployed to GitHub Pages
- **`develop`** - Integration branch for features and fixes
- **`gh-pages`** - GitHub Pages deployment (auto-generated)

### **Feature Branches**
- **`feature/feature-name`** - New features
- **`fix/bug-description`** - Bug fixes
- **`hotfix/critical-issue`** - Urgent production fixes

## 🔄 **Development Workflow**

### **1. Starting New Development**
```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create and switch to develop branch
git checkout -b develop
git push -u origin develop
```

### **2. Feature Development**
```bash
# Create feature branch from develop
git checkout develop
git checkout -b feature/amazing-feature

# Make your changes, commit regularly
git add .
git commit -m "feat: add amazing new feature"

# Push feature branch
git push -u origin feature/amazing-feature
```

### **3. Merging Features**
```bash
# Create Pull Request from feature branch to develop
# After review and approval, merge to develop

# Update local develop
git checkout develop
git pull origin develop
```

### **4. Preparing Release**
```bash
# When ready for release, merge develop to main
git checkout main
git merge develop

# Tag the release
git tag -a v2.1.0 -m "Release version 2.1.0"
git push origin v2.1.0
```

## 📦 **Release Process**

### **Pre-Release Checklist**
- [ ] All features merged to `develop`
- [ ] Tests passing (when implemented)
- [ ] Documentation updated
- [ ] Version numbers updated
- [ ] CHANGELOG.md updated

### **Release Steps**
1. **Update Version Numbers**
   ```bash
   # Update package.json version
   npm version patch|minor|major
   ```

2. **Update CHANGELOG.md**
   - Add new version section
   - Document all changes
   - Follow Keep a Changelog format

3. **Create Release Branch**
   ```bash
   git checkout -b release/v2.1.0
   git add .
   git commit -m "chore: prepare release v2.1.0"
   git push origin release/v2.1.0
   ```

4. **Merge to Main**
   ```bash
   git checkout main
   git merge release/v2.1.0
   git tag -a v2.1.0 -m "Release version 2.1.0"
   git push origin main
   git push origin v2.1.0
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

6. **Cleanup**
   ```bash
   git branch -d release/v2.1.0
   git push origin --delete release/v2.1.0
   ```

## 🏷️ **Versioning Strategy**

### **Semantic Versioning (SemVer)**
- **MAJOR** (2.0.0) - Breaking changes, major architecture changes
- **MINOR** (2.1.0) - New features, backward compatible
- **PATCH** (2.1.1) - Bug fixes, backward compatible

### **Version Update Commands**
```bash
npm version patch    # 2.0.0 → 2.0.1
npm version minor    # 2.0.1 → 2.1.0
npm version major    # 2.1.0 → 3.0.0
```

## 📝 **Commit Message Convention**

### **Format**
```
type(scope): description

[optional body]

[optional footer]
```

### **Types**
- **feat** - New feature
- **fix** - Bug fix
- **docs** - Documentation changes
- **style** - Code style changes (formatting, etc.)
- **refactor** - Code refactoring
- **test** - Adding or updating tests
- **chore** - Maintenance tasks

### **Examples**
```bash
git commit -m "feat(simulation): add real-time progress tracking"
git commit -m "fix(ui): resolve sidebar collapse animation issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "chore(deps): update dependencies to latest versions"
```

## 🚀 **Deployment Workflow**

### **Automatic Deployment (Recommended)**
- GitHub Actions automatically deploys `main` branch to GitHub Pages
- No manual deployment needed for production releases

### **Manual Deployment (If Needed)**
```bash
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🔧 **Development Environment**

### **Local Development**
```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests (when implemented)
npm test

# Build for production
npm run build
```

### **Environment Variables**
Create `.env.local` for local development:
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENVIRONMENT=development
```

## 📋 **Quality Assurance**

### **Before Committing**
- [ ] Code follows project style guidelines
- [ ] No console.log statements in production code
- [ ] All TypeScript errors resolved
- [ ] Components are properly typed

### **Before Merging**
- [ ] Code review completed
- [ ] All tests passing
- [ ] No merge conflicts
- [ ] Documentation updated

## 🆘 **Emergency Procedures**

### **Hotfix Process**
```bash
# Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-bug

# Fix the issue
git add .
git commit -m "fix: resolve critical bug"

# Merge to main and develop
git checkout main
git merge hotfix/critical-bug
git tag -a v2.0.1 -m "Hotfix v2.0.1"

git checkout develop
git merge hotfix/critical-bug

# Push changes
git push origin main
git push origin develop
git push origin v2.0.1
```

## 📚 **Additional Resources**

- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Keep a Changelog](https://keepachangelog.com/)

---

**Remember: Always test thoroughly before releasing, and keep your documentation up to date! 🚀**
