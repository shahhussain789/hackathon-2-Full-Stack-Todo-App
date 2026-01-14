---
name: frontend-skill
description: Build frontend pages, reusable components, layouts, and styling for modern web applications.
---

# Frontend Development Skill

## Instructions

1. **Page Structure**
   - Create semantic HTML structure
   - Organize pages by route or feature
   - Ensure accessibility (ARIA where needed)

2. **Components**
   - Build reusable UI components
   - Keep components small and focused
   - Use props/state effectively
   - Separate logic from presentation

3. **Layout & Styling**
   - Responsive layouts (Flexbox / Grid)
   - Consistent spacing and typography
   - Theme-based colors and design tokens
   - Support light and dark modes

4. **Styling Approach**
   - Use CSS Modules, Tailwind, or styled-components
   - Avoid inline styles unless necessary
   - Follow mobile-first design principles

5. **Interactivity**
   - Handle user events (click, input, hover)
   - Manage UI state cleanly
   - Provide loading, error, and empty states

## Best Practices
- Reuse components instead of duplicating UI
- Keep styles consistent across pages
- Optimize for performance and accessibility
- Follow design system or UI guidelines
- Test responsiveness across screen sizes

## Example Structure
```jsx
// components/Button.jsx
export default function Button({ label, onClick }) {
  return (
    <button
      className="px-4 py-2 rounded bg-primary text-white hover:opacity-90"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
