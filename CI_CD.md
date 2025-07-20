# CI/CD Pipeline Documentation

## Overview
Our river monitoring app uses a comprehensive CI/CD pipeline with **2 main workflows** and **pre-commit hooks** to ensure code quality and automated deployments for emergency-ready flood monitoring.

## 🔧 **CI Workflow** (`.github/workflows/ci.yml`)

### **Triggers**
- **Push** to `main` or `develop` branches
- **Pull Requests** targeting `main` or `develop`

### **Jobs & Checks**

#### **1. Test Job** (Multi-Node Matrix)
**Runs on**: `ubuntu-latest` with Node.js `18.x` and `20.x`

**Quality Gates:**
```bash
1. npm ci                    # Clean dependency install
2. npm run type-check       # TypeScript compilation check
3. npm run lint             # ESLint code quality check  
4. npm run build            # Next.js production build
```

**What it validates:**
- ✅ **TypeScript Compilation**: All `.ts/.tsx` files compile without errors
- ✅ **Code Quality**: ESLint rules for unused vars, explicit any, etc.
- ✅ **Build Success**: Next.js can create production bundle
- ✅ **Cross-Node Compatibility**: Works on Node 18.x and 20.x

#### **2. Lighthouse Job** (Performance Testing)
**Depends on**: Test job completion
**Runs on**: Node.js `20.x`

**Performance Validation:**
```bash
1. npm run build            # Build production app
2. lhci autorun            # Lighthouse CI performance audit
```

**What it measures:**
- ⚡ **Performance**: Load times, Core Web Vitals
- ♿ **Accessibility**: WCAG compliance, screen reader support
- 🎯 **Best Practices**: Security, HTTPS, modern standards
- 🔍 **SEO**: Meta tags, structured data

---

## 🚀 **Release Workflow** (`.github/workflows/release.yml`)

### **Triggers**
- **Push** to `main` branch only
- **Git tags** starting with `v*`

### **Automated Release Process**

#### **1. Quality Validation**
```bash
npm run type-check    # TypeScript check
npm run lint         # Code quality check  
npm run build        # Production build test
```

#### **2. Semantic Versioning**
**Auto-calculates next version based on commits:**
- `BREAKING:` or `breaking:` → **Major** version bump (v1.0.0 → v2.0.0)
- `feat:` → **Minor** version bump (v1.0.0 → v1.1.0)  
- Other commits → **Patch** version bump (v1.0.0 → v1.0.1)

#### **3. Changelog Generation**
- Extracts commit messages since last tag
- Formats into structured release notes
- Includes deployment and emergency use information

#### **4. GitHub Release Creation**
- Creates Git tag with new version
- Publishes release with changelog
- Includes production deployment URL
- Adds emergency use documentation

---

## 🛡️ **Pre-commit Hooks** (Local Quality Gates)

### **Husky Configuration**
**Runs before every commit:**

```bash
📝 Type checking...      # tsc --noEmit
🧹 Linting...           # next lint  
✅ Pre-commit checks passed!
```

**Benefits:**
- Catches issues before CI runs
- Faster feedback loop for developers
- Ensures only quality code reaches remote repository

---

## 🔍 **What Gets Checked & Why**

### **TypeScript Validation** (`npm run type-check`)
**Command**: `tsc --noEmit`
**Checks for:**
- Type safety errors
- Missing imports/exports
- Interface compliance
- Generic type constraints

**Example Common Fixes:**
```typescript
// ❌ Before (TypeScript error)
const response = await fetchWithErrorHandling<ApiResponse<T>>(url);

// ✅ After (Fixed)
const response = await fetchWithErrorHandling<T>(url);
```

### **ESLint Code Quality** (`npm run lint`)
**Configuration**: `.eslintrc.json`
**Enforces:**
- No unused variables/imports
- Explicit typing (warns on `any`)
- Next.js best practices
- Code consistency standards

**Example Common Fixes:**
```typescript
// ❌ Before (ESLint warning)
const data = await this.fetchWithErrorHandling<any>(url);

// ✅ After (Fixed)  
const data = await this.fetchWithErrorHandling<WeatherResponse>(url);
```

### **Build Validation** (`npm run build`)
**Next.js Production Build:**
- Compiles TypeScript to JavaScript
- Optimizes and bundles assets
- Validates all imports/exports resolve
- Checks environment variable usage

---

## 🎯 **Emergency-Ready Quality Standards**

### **Performance Requirements**
- **Load Time**: <3s on 3G networks
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Bundle Size**: <500KB initial, <2MB total

### **Accessibility Standards**
- **WCAG 2.1 AA** compliance minimum
- **Touch Targets**: 44px minimum for mobile
- **Screen Reader**: Full compatibility
- **Color Contrast**: Emergency-appropriate ratios

### **Emergency Use Features Validated**
- 📱 Mobile-first responsive design
- ⚡ Fast loading for emergency situations  
- 🌐 Offline capabilities
- ♿ Full accessibility support
- 🔄 Real-time data updates

---

## 🚨 **CI Failure Scenarios**

The CI pipeline will **fail** and **block deployment** if:

1. **TypeScript Errors**: Type mismatches, missing interfaces
2. **ESLint Violations**: Code quality rules broken
3. **Build Failures**: Import errors, configuration issues
4. **Performance Regression**: Lighthouse scores below threshold
5. **Accessibility Issues**: WCAG compliance failures

This ensures that only high-quality, emergency-ready code reaches production, maintaining the reliability needed for a flood monitoring application.

---

## 📊 **Monitoring & Metrics**

### **CI Pipeline Metrics**
- **Build Time**: Target <5 minutes
- **Test Coverage**: Aim for >80%
- **Success Rate**: >95% pipeline success
- **Deployment Frequency**: Multiple times per day

### **Performance Monitoring**
- **Lighthouse CI**: Automated performance testing
- **Core Web Vitals**: Real user metrics
- **Bundle Analysis**: Size tracking over time
- **Dependency Security**: Vulnerability scanning

---

## 🔧 **Local Development Commands**

### **Quality Checks (Run Locally)**
```bash
# Run all quality checks
npm test                    # Runs type-check + lint

# Individual checks
npm run type-check         # TypeScript compilation
npm run lint              # ESLint code quality
npm run build             # Production build test

# Fix common issues
npm run lint -- --fix     # Auto-fix ESLint issues
```

### **Pre-commit Setup**
```bash
# Install pre-commit hooks
npm run prepare           # Sets up Husky hooks

# Manual pre-commit check
npm test                  # Same checks as pre-commit
```

---

## 🚀 **Deployment Process**

### **Development Flow**
1. **Feature Branch**: Create from `develop`
2. **Local Development**: Pre-commit hooks ensure quality
3. **Pull Request**: CI validates all checks
4. **Code Review**: Manual review + automated checks
5. **Merge to Develop**: Continuous integration testing

### **Release Flow**
1. **Develop → Main**: Merge when release ready
2. **Automatic Release**: Semantic versioning + changelog
3. **Production Deploy**: Automatic deployment to Vercel
4. **Monitoring**: Performance and error tracking

---

## 🛠️ **Troubleshooting CI Issues**

### **Common TypeScript Errors**
```bash
# Check specific file
npx tsc --noEmit src/path/to/file.ts

# Show detailed errors
npx tsc --noEmit --pretty
```

### **Common ESLint Issues**
```bash
# Check specific file
npx eslint src/path/to/file.ts

# Auto-fix when possible
npx eslint src/path/to/file.ts --fix
```

### **Build Issues**
```bash
# Clean build
rm -rf .next node_modules
npm install
npm run build

# Check build output
npm run build -- --debug
```

---

## 📚 **Related Documentation**

- **Git Workflow**: See `BRANCHING_STRATEGY.md`
- **Development Setup**: See `CLAUDE.md`
- **Implementation Plan**: See `IMPLEMENTATION_WORKFLOW.md`
- **System Design**: See `DESIGN.md`