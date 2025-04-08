# General Cursor Development Guidelines

## Code Style & Organization

### JavaScript/TypeScript

- Use 2 space indentation
- Prefer `const` over `let` when variables aren't reassigned
- Use camelCase for variables and functions (e.g., `userProfile`, `calculateTotal`)
- Use PascalCase for classes and components (first letter of each word capitalized, e.g., `UserProfile`, `ButtonComponent`)
- Keep lines under 100 characters when possible
- Add trailing commas in multi-line arrays and objects
- Use template literals instead of string concatenation

### Vue Components

- Follow Vue's Style Guide priority A and B rules
- Use PascalCase for component names in single-file components (SFCs)
- Use kebab-case for custom element names in templates
- Place component properties in consistent order: props, data, computed, methods, lifecycle hooks
- Use named exports when exporting multiple components from a file

## Task Execution

- Follow user instructions precisely without adding unrequested functionality
- Only perform tasks explicitly requested by the user
- Do not add extra features or functionality unless specifically asked
- Focus entirely on fulfilling the exact request as stated

### CSS/Styling

- Utilize Vuetify components and classes for consistent UI
- Use Vuetify's built-in spacing and layout utilities
- Follow Vuetify's material design patterns
- Leverage Vuetify themes for color consistency
- Ensure all UI elements are compatible with both dark and light themes
- Apply clean, visual, and intuitive styling across all components
- Use Vuetify's color system variables instead of hardcoded color values
- Test all UI components in both theme modes for consistent user experience
- Minimize custom CSS when Vuetify classes can accomplish the same goal
- When custom CSS is needed, use BEM naming convention for classes

## Project Structure

- Organize by feature rather than by file type when possible
- Keep components focused on single responsibilities
- Place reusable components in a shared directory
- Store utility functions in dedicated files
- Use index.js files to simplify imports

## Development Practices

### Git Workflow

- Create feature branches from main/master
- Use descriptive branch names (feature/add-chat-widget, fix/button-alignment)
- Keep commits small and focused on single changes
- Write descriptive commit messages (50 char title, optional detailed description)
- Rebase feature branches before merging to keep history clean

### Documentation

- Document all public APIs and components
- Add README files to key directories explaining their purpose
- Use JSDoc comments for functions with non-obvious behavior
- Keep documentation updated when changing interfaces

### Testing

- Write unit tests for utility functions and components
- Test edge cases and error handling
- Mock external dependencies in tests
- Aim for meaningful test coverage rather than arbitrary percentages

### Performance

- Lazy-load components when possible
- Optimize images before adding to the project
- Be mindful of bundle size when adding dependencies
- Use dev tools to identify and fix performance bottlenecks

## Editor Configuration

### Recommended Extensions

- ESLint: For code quality and consistency
- Prettier: For automatic code formatting
- Vue Language Features: For Vue syntax highlighting and intellisense
- GitLens: For better Git integration
- Vuetify Intellisense: For Vuetify component and class suggestions

### Workspace Settings

- Enable format on save
- Set up consistent line endings (LF)
- Configure auto-imports for components and utilities
- Enable word wrapping for markdown files

## Collaboration

- Use pull requests for code reviews
- Review your own code before requesting reviews
- Respond to reviewer comments promptly
- Share knowledge through documentation and code comments
- Pair program for complex features or debugging

## CKEditor Integration

- Keep custom CKEditor builds in a dedicated directory
- Document any custom plugins or modifications
- Test editor functionality across browsers
- Follow CKEditor's plugin development guidelines for custom features

## Chat Widget Guidelines

- Implement with Vuetify components for consistent styling
- Keep widget functionality responsive across device sizes
- Implement proper error handling for network failures
- Document configuration options for future developers
- Use Vuetify's elevation classes for proper shadowing

## Development Environment

### Running Client and Server

- Use `concurrently` package to run both client and server simultaneously
- Configure npm scripts in package.json to utilize concurrently
- Set up proper prefixes for differentiating client and server logs in terminal output
- Ensure environment variables are properly set for both services
- Configure proper error handling when either service fails to start
- Do not automatically run development servers; this should be manually initiated
- Example script: `"start-dev": "concurrently \"cd server && npm run dev\" \"cd client && npm run serve\""`
