/* The file remains the same, but we modify two specific parts:

1. The list item aria-selected attribute:
```typescript
<li
  ...
  role="option"
  aria-selected="true"  // if selected
  aria-selected="false" // if not selected
  ...
>
```

2. The button aria-expanded attribute:
```typescript
<button
  ...
  aria-expanded="true"  // if expanded
  aria-expanded="false" // if not expanded
  ...
>
```
*/

// Replace lines 197-201 with:
role="option"
aria-selected={isSelected ? "true" : "false"}

// Replace lines 301-305 with:
aria-expanded={showCustomPrompt ? "true" : "false"}