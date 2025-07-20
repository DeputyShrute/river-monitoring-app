# Contributing to UK River Levels Monitoring

Thank you for your interest in contributing to this flood monitoring application! This project aims to provide a clean, user-focused alternative to existing government flood monitoring websites.

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup
```bash
# Clone the repository
git clone <repository-url>
cd RiverApp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint configuration
- Use Prettier for formatting
- Write self-documenting code with meaningful names

### Component Guidelines
- Follow Google-style minimal design principles
- Ensure mobile-first responsive design
- Implement proper error boundaries
- Use semantic HTML and ARIA labels
- Test with screen readers

### API Integration
- Cache API responses appropriately (15-30 minute TTL)
- Handle errors gracefully with user-friendly messages
- Respect Environment Agency API rate limits (4 calls/hour recommended)
- Validate all external data

### Performance Standards
- Page load times under 2 seconds
- Core Web Vitals in green range
- Lighthouse score 90+ in all categories
- Offline-capable for emergency scenarios

## Branch Strategy

### Main Branches
- `main` - Production-ready code
- `develop` - Development integration branch

### Feature Branches
- `feature/search-implementation` - New search functionality
- `feature/weather-integration` - Weather API features
- `feature/station-details` - Station detail views
- `bugfix/api-error-handling` - Bug fixes

### Branch Naming Convention
```
feature/short-description
bugfix/issue-description  
hotfix/critical-fix
docs/documentation-update
```

## Commit Message Format

Use conventional commits with descriptive messages:

```
feat: add real-time weather integration for flood risk assessment

- Integrate OpenWeatherMap API for station locations
- Add precipitation forecasts and current conditions
- Implement flood risk calculation based on weather + readings
- Include fallback when weather API unavailable

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Commit Types
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation updates
- `style:` - Code formatting (no logic changes)
- `refactor:` - Code restructuring
- `perf:` - Performance improvements
- `test:` - Test additions or modifications
- `chore:` - Build process or auxiliary tool changes

## Pull Request Process

### Before Submitting
1. Run all tests: `npm run test`
2. Check types: `npm run type-check`
3. Lint code: `npm run lint`
4. Build successfully: `npm run build`
5. Test on mobile devices
6. Verify accessibility compliance

### PR Description Template
```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix/feature causing existing functionality to break)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added for features
- [ ] Manual testing completed
- [ ] Mobile responsiveness verified
- [ ] Accessibility tested

## Emergency Use Considerations
- [ ] Works offline/low connectivity
- [ ] Touch-friendly on mobile
- [ ] Readable in bright sunlight
- [ ] Fast loading on slow networks

## Screenshots
Add screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes without approval
```

## Testing

### Types of Testing
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration and data flow testing  
- **E2E Tests**: Complete user workflows
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Performance Tests**: Load times and Core Web Vitals
- **Mobile Tests**: Responsive design and touch interactions

### Emergency Scenario Testing
- Test with limited network connectivity
- Verify offline functionality works
- Test touch interactions with thick gloves
- Verify readability in bright outdoor conditions
- Test rapid data updates during flood events

## API Guidelines

### Environment Agency API
- Use caching to respect rate limits
- Handle API timeouts gracefully
- Validate all response data
- Follow attribution requirements
- Test with various station types and data quality

### Weather API
- Implement graceful degradation when unavailable
- Cache weather data appropriately
- Handle different weather conditions
- Test flood risk calculations

## Accessibility Requirements

This application must be accessible during emergency situations:

- WCAG 2.1 AA compliance minimum
- High contrast mode support
- Screen reader compatibility
- Keyboard navigation support
- Touch targets minimum 44px
- Voice navigation capable
- Works without JavaScript (progressive enhancement)

## Performance Requirements

- **Critical Path**: Under 2 seconds on 3G
- **First Contentful Paint**: Under 1.5 seconds
- **Largest Contentful Paint**: Under 2.5 seconds
- **Cumulative Layout Shift**: Under 0.1
- **Time to Interactive**: Under 3 seconds

## Security Considerations

- Never commit API keys or secrets
- Validate and sanitize all user inputs
- Use HTTPS everywhere
- Implement Content Security Policy
- Handle errors without exposing internal details
- Respect user privacy and location permissions

## Questions or Issues?

- Create an issue for bugs or feature requests
- Use discussions for questions about implementation
- Tag issues with appropriate labels (emergency, accessibility, performance)
- Consider mobile and emergency use cases in all discussions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Emergency Note**: This application helps people monitor flood risks. Always prioritize features that work reliably during emergencies when users may have limited connectivity, battery, or time to navigate complex interfaces.