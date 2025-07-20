# Git Branching Strategy

## Overview

This project follows a **Git Flow** inspired branching model optimized for emergency-critical flood monitoring application development.

## Branch Structure

### 🏠 **Main Branches**

#### `main`
- **Purpose**: Production-ready code
- **Protection**: Branch protection enabled
- **Deployment**: Auto-deploys to production
- **Merge**: Only from `develop` via Pull Request
- **Quality Gates**: All CI checks must pass

#### `develop` 
- **Purpose**: Integration branch for features
- **Protection**: Require PR reviews
- **Testing**: Runs full test suite
- **Merge**: From feature branches via Pull Request

### 🌟 **Supporting Branches**

#### Feature Branches: `feature/description`
```bash
# Example branches
feature/search-implementation
feature/weather-integration  
feature/station-details
feature/offline-capabilities
```

- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming**: `feature/short-kebab-case-description`
- **Lifespan**: Delete after merge

#### Bug Fix Branches: `bugfix/description`
```bash
# Example branches
bugfix/api-timeout-handling
bugfix/mobile-touch-targets
bugfix/accessibility-contrast
```

- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming**: `bugfix/short-kebab-case-description`
- **Priority**: Emergency bugs may go directly to `main`

#### Hotfix Branches: `hotfix/description`
```bash
# Example branches  
hotfix/critical-api-failure
hotfix/security-vulnerability
```

- **Branch from**: `main`
- **Merge to**: `main` AND `develop`
- **Naming**: `hotfix/critical-issue-description`
- **Use**: Production emergencies only

#### Release Branches: `release/version`
```bash
# Example branches
release/v1.1.0
release/v2.0.0-beta
```

- **Branch from**: `develop`
- **Merge to**: `main` AND `develop`
- **Purpose**: Final testing and version preparation
- **Naming**: `release/vX.Y.Z`

## 🔄 **Development Workflow**

### 1. **Feature Development**
```bash
# Start new feature
git checkout develop
git pull origin develop
git checkout -b feature/station-search

# Work on feature
git add .
git commit -m "feat: add station search functionality"

# Push and create PR
git push -u origin feature/station-search
# Create PR: feature/station-search → develop
```

### 2. **Bug Fixes**
```bash
# Start bug fix
git checkout develop
git pull origin develop
git checkout -b bugfix/mobile-layout

# Fix and commit
git add .
git commit -m "fix: resolve mobile layout overflow issue"

# Push and create PR
git push -u origin bugfix/mobile-layout
# Create PR: bugfix/mobile-layout → develop
```

### 3. **Emergency Hotfixes**
```bash
# Critical production issue
git checkout main
git pull origin main
git checkout -b hotfix/api-failure

# Fix critical issue
git add .
git commit -m "fix: resolve Environment Agency API timeout"

# Push and create PR to main
git push -u origin hotfix/api-failure
# Create PR: hotfix/api-failure → main

# After main merge, also merge to develop
git checkout develop
git merge main
git push origin develop
```

### 4. **Release Process**
```bash
# Prepare release
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# Version bump and changelog
npm run release
git push -u origin release/v1.1.0

# Create PR: release/v1.1.0 → main
# After merge, tag is automatically created
```

## 🛡️ **Branch Protection Rules**

### Main Branch Protection
- ✅ Require pull request reviews (2 reviewers)
- ✅ Require status checks to pass
- ✅ Require conversation resolution
- ✅ Restrict pushes to main
- ✅ Include administrators in restrictions

### Develop Branch Protection  
- ✅ Require pull request reviews (1 reviewer)
- ✅ Require status checks to pass
- ✅ Allow force pushes from administrators

## 🏷️ **Commit Message Convention**

Follow **Conventional Commits** specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat:` - New features
- `fix:` - Bug fixes  
- `docs:` - Documentation
- `style:` - Formatting changes
- `refactor:` - Code restructuring
- `perf:` - Performance improvements
- `test:` - Test additions
- `build:` - Build system changes
- `ci:` - CI configuration
- `chore:` - Maintenance tasks

### Examples
```bash
feat: add real-time weather integration
fix: resolve mobile touch target sizing
docs: update API integration guide
perf: optimize station data caching
```

## 🔄 **Code Review Process**

### Pull Request Requirements
- [ ] **Description**: Clear explanation of changes
- [ ] **Testing**: All automated tests pass
- [ ] **Performance**: No significant performance regression
- [ ] **Accessibility**: WCAG 2.1 AA compliance verified
- [ ] **Mobile**: Responsive design tested
- [ ] **Emergency Use**: Crisis scenario considerations

### Review Checklist
- [ ] Code follows style guidelines
- [ ] No sensitive data exposed
- [ ] Error handling appropriate
- [ ] Performance impact acceptable
- [ ] Documentation updated
- [ ] Tests cover new functionality

## 🚀 **Release Management**

### Semantic Versioning
- **MAJOR** (v2.0.0): Breaking changes
- **MINOR** (v1.1.0): New features (backward compatible)
- **PATCH** (v1.0.1): Bug fixes (backward compatible)

### Release Types
- **Production**: Stable releases from `main`
- **Beta**: Pre-release testing from `release/*`
- **Alpha**: Development builds from `develop`

### Automated Releases
- **Trigger**: Push to `main` branch
- **Process**: Automatic version bump, changelog, GitHub release
- **Deployment**: Auto-deploy to Vercel production

## 🚨 **Emergency Procedures**

### Critical Production Issues
1. **Assess**: Determine if hotfix needed
2. **Hotfix Branch**: Create from `main`
3. **Fast Track**: Expedited review process
4. **Deploy**: Emergency deployment pipeline
5. **Post-Mortem**: Document and improve

### Rollback Process
```bash
# Emergency rollback
git checkout main
git revert <problematic-commit>
git push origin main
# Triggers automatic redeployment
```

## 📊 **Branch Naming Examples**

```bash
# Features
feature/google-style-homepage
feature/offline-station-cache
feature/accessibility-improvements
feature/performance-optimization

# Bug fixes  
bugfix/api-error-handling
bugfix/mobile-navigation
bugfix/chart-responsiveness

# Hotfixes
hotfix/critical-memory-leak
hotfix/security-vulnerability

# Releases
release/v1.0.0
release/v1.1.0-beta
release/v2.0.0-emergency-features
```

This branching strategy ensures code quality, emergency responsiveness, and professional development practices for the critical flood monitoring application.