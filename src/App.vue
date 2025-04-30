<script setup lang="ts">
// No specific script needed for the main layout shell yet
</script>

<template>
  <div id="main-app-container">
    <!-- RouterView will render the component based on the current route -->
    <router-view />
  </div>
</template>

<style>
/* Global styles for the entire application - Refactored Theme */
:root {
  /* Color Palette - Minimal & Analytical */
  --emininity-bg-primary: #ffffff; /* White background */
  --emininity-bg-secondary: #f8f9fa; /* Very light grey for subtle contrast */
  --emininity-text-primary: #212529; /* Dark grey for primary text */
  --emininity-text-secondary: #6c757d; /* Medium grey for secondary text, icons */
  --emininity-border-color: #dee2e6; /* Light grey for borders */
  --emininity-accent-color: #4a5568; /* Desaturated blue/grey for subtle accents/links */
  --emininity-accent-hover-color: #2d3748; /* Darker accent for hover */
  --emininity-danger-color: #dc3545; /* Red for delete/errors */
  --emininity-danger-hover-color: #c82333; /* Darker red for hover */
  --emininity-focus-ring-color: rgba(74, 85, 104, 0.25); /* Subtle focus ring */

  /* Typography - Clean & Readable */
  --emininity-font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  --emininity-base-font-size: 16px;
  --emininity-base-line-height: 1.6;
  --emininity-font-weight-normal: 400;
  --emininity-font-weight-medium: 500;
  --emininity-font-weight-semibold: 600;

  /* Layout & Spacing - Whitespace-driven */
  --emininity-header-height: 60px;
  --emininity-spacing-xs: 0.25rem; /* 4px */
  --emininity-spacing-sm: 0.5rem;  /* 8px */
  --emininity-spacing-md: 1rem;    /* 16px */
  --emininity-spacing-lg: 1.5rem;  /* 24px */
  --emininity-spacing-xl: 2rem;    /* 32px */
  --emininity-spacing-xxl: 3rem;   /* 48px */
  --emininity-border-radius: 0.25rem; /* 4px */
}

/* Apply base theme */
html, body {
  color-scheme: light; /* Force light mode */
}

body {
  margin: 0;
  font-family: var(--emininity-font-family);
  font-size: var(--emininity-base-font-size);
  line-height: var(--emininity-base-line-height);
  background-color: var(--emininity-bg-primary);
  color: var(--emininity-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#app {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: none;
  padding: 0;
  text-align: left;
}

#main-app-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* Basic reset and typography */
*, *::before, *::after {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: var(--emininity-spacing-md); /* Consistent bottom margin */
  font-weight: var(--emininity-font-weight-semibold);
  line-height: 1.3; /* Slightly tighter line height for headings */
}

h1 { font-size: 2rem; }       /* 32px */
h2 { font-size: 1.75rem; }   /* 28px */
h3 { font-size: 1.5rem; }    /* 24px */
h4 { font-size: 1.25rem; }   /* 20px */
h5 { font-size: 1.125rem; }  /* 18px */
h6 { font-size: 1rem; }      /* 16px */


p {
  margin-top: 0;
  margin-bottom: var(--emininity-spacing-md);
}

a {
  color: var(--emininity-accent-color);
  text-decoration: none;
  transition: color 0.15s ease-in-out;
}
a:hover {
  text-decoration: underline;
  color: var(--emininity-accent-hover-color);
}

/* Minimal Button Styling */
button, .button-like {
  display: inline-flex; /* Use flex for alignment */
  align-items: center;
  justify-content: center;
  font-weight: var(--emininity-font-weight-medium);
  line-height: var(--emininity-base-line-height);
  color: var(--emininity-text-primary);
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  background-color: var(--emininity-bg-primary); /* White background */
  border: 1px solid var(--emininity-border-color); /* Subtle border */
  padding: var(--emininity-spacing-sm) var(--emininity-spacing-md); /* 8px 16px */
  font-size: 0.95rem; /* Slightly smaller button text */
  border-radius: var(--emininity-border-radius);
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
button:hover, .button-like:hover {
  background-color: var(--emininity-bg-secondary); /* Subtle hover */
  border-color: #adb5bd; /* Slightly darker border on hover */
  color: var(--emininity-text-primary);
}
button:focus, .button-like:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem var(--emininity-focus-ring-color); /* Subtle focus ring */
}
button:disabled, .button-like:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* Primary Button Style (Subtle Accent) */
button.primary, .button-like.primary {
  color: #fff;
  background-color: var(--emininity-accent-color);
  border-color: var(--emininity-accent-color);
}
button.primary:hover, .button-like.primary:hover {
  background-color: var(--emininity-accent-hover-color);
  border-color: var(--emininity-accent-hover-color);
  color: #fff;
}

/* Danger Button Style */
button.danger, .button-like.danger {
    color: #fff;
    background-color: var(--emininity-danger-color);
    border-color: var(--emininity-danger-color);
}
button.danger:hover, .button-like.danger:hover {
    background-color: var(--emininity-danger-hover-color);
    border-color: var(--emininity-danger-hover-color);
    color: #fff;
}

/* Utility Classes (Keep as is, adjust values if needed) */
.container {
  width: 100%;
  padding-right: var(--emininity-spacing-lg); /* 24px */
  padding-left: var(--emininity-spacing-lg); /* 24px */
  margin-right: auto;
  margin-left: auto;
}
/* Responsive container widths */
@media (min-width: 576px) { .container { max-width: 540px; } }
@media (min-width: 768px) { .container { max-width: 720px; } }
@media (min-width: 992px) { .container { max-width: 960px; } }
@media (min-width: 1200px) { .container { max-width: 1140px; } }
@media (min-width: 1400px) { .container { max-width: 1320px; } }

.text-center { text-align: center; }
.text-secondary { color: var(--emininity-text-secondary) !important; } /* Helper */

/* Spacing Utilities */
.mt-1 { margin-top: var(--emininity-spacing-xs) !important; }
.mt-2 { margin-top: var(--emininity-spacing-sm) !important; }
.mt-3 { margin-top: var(--emininity-spacing-md) !important; }
.mt-4 { margin-top: var(--emininity-spacing-lg) !important; }
.mt-5 { margin-top: var(--emininity-spacing-xl) !important; }
.mb-1 { margin-bottom: var(--emininity-spacing-xs) !important; }
.mb-2 { margin-bottom: var(--emininity-spacing-sm) !important; }
.mb-3 { margin-bottom: var(--emininity-spacing-md) !important; }
.mb-4 { margin-bottom: var(--emininity-spacing-lg) !important; }
.mb-5 { margin-bottom: var(--emininity-spacing-xl) !important; }
.ms-1 { margin-left: var(--emininity-spacing-xs) !important; }
.ms-2 { margin-left: var(--emininity-spacing-sm) !important; }
.ms-3 { margin-left: var(--emininity-spacing-md) !important; }
.me-1 { margin-right: var(--emininity-spacing-xs) !important; }
.me-2 { margin-right: var(--emininity-spacing-sm) !important; }
.me-3 { margin-right: var(--emininity-spacing-md) !important; }
.p-1 { padding: var(--emininity-spacing-xs) !important; }
.p-2 { padding: var(--emininity-spacing-sm) !important; }
.p-3 { padding: var(--emininity-spacing-md) !important; }
.p-4 { padding: var(--emininity-spacing-lg) !important; }
.p-5 { padding: var(--emininity-spacing-xl) !important; }

/* Minimal Card Style */
.card {
  border: 1px solid var(--emininity-border-color);
  border-radius: var(--emininity-border-radius);
  background-color: var(--emininity-bg-primary);
  box-shadow: none; /* Remove shadow for minimal look */
  margin-bottom: var(--emininity-spacing-lg); /* Consistent margin */
}
.card-body {
  padding: var(--emininity-spacing-lg); /* Generous padding */
}
.card-header {
  padding: var(--emininity-spacing-md) var(--emininity-spacing-lg); /* Consistent padding */
  margin-bottom: 0;
  background-color: var(--emininity-bg-secondary); /* Subtle header background */
  border-bottom: 1px solid var(--emininity-border-color);
  border-top-left-radius: calc(var(--emininity-border-radius) - 1px);
  border-top-right-radius: calc(var(--emininity-border-radius) - 1px);
}
.card-title {
  margin-bottom: var(--emininity-spacing-sm); /* Space below title */
  font-size: 1.125rem; /* Consistent card title size */
  font-weight: var(--emininity-font-weight-medium);
}
.card-header .card-title {
   margin-bottom: 0; /* No margin if title is in header */
}


/* Minimal Form Styling */
.form-group {
  margin-bottom: var(--emininity-spacing-md);
}

.form-label {
  display: inline-block;
  margin-bottom: var(--emininity-spacing-sm);
  font-weight: var(--emininity-font-weight-medium);
  font-size: 0.9rem; /* Slightly smaller label */
}

.form-control {
  display: block;
  width: 100%;
  padding: var(--emininity-spacing-sm) var(--emininity-spacing-md); /* 8px 16px */
  font-size: 1rem;
  font-weight: var(--emininity-font-weight-normal);
  line-height: var(--emininity-base-line-height);
  color: var(--emininity-text-primary);
  background-color: var(--emininity-bg-primary);
  background-clip: padding-box;
  border: 1px solid var(--emininity-border-color);
  appearance: none;
  border-radius: var(--emininity-border-radius);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  color: var(--emininity-text-primary);
  background-color: var(--emininity-bg-primary);
  border-color: var(--emininity-accent-color); /* Use accent for focus border */
  outline: 0;
  box-shadow: 0 0 0 0.2rem var(--emininity-focus-ring-color);
}

/* Remove default Vite styles */
.logo { display: none; }
.read-the-docs { display: none; }

/* Basic Table Styling */
.table {
  width: 100%;
  margin-bottom: var(--emininity-spacing-md);
  color: var(--emininity-text-primary);
  border-collapse: collapse; /* Cleaner look */
}

.table th,
.table td {
  padding: var(--emininity-spacing-md); /* Consistent padding */
  vertical-align: top;
  border-top: 1px solid var(--emininity-border-color);
  text-align: left; /* Default left align */
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid var(--emininity-border-color); /* Stronger header bottom border */
  font-weight: var(--emininity-font-weight-medium);
  color: var(--emininity-text-secondary); /* Slightly muted header text */
  font-size: 0.9rem;
}

.table tbody tr:nth-of-type(odd) {
  /* Optional: Subtle striping for readability */
  /* background-color: rgba(0, 0, 0, 0.02); */
}

.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

</style>

<style scoped>
/* Scoped styles specific to App.vue if needed */
#main-app-container {
  /* Add specific styles if the container needs them */
}
</style>
