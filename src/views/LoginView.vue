<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

// --- Mock Authentication ---
// In a real app, these would trigger OAuth flows (Google, Microsoft, Apple)
// For now, we simulate login by setting session storage and redirecting.

const handleLogin = (provider: 'Google' | 'Microsoft' | 'Apple', role: 'User' | 'Admin' = 'User') => {
  loading.value = true;
  errorMessage.value = '';
  console.log(`Simulating ${provider} login... Role: ${role}`);

  // Simulate API call delay
  setTimeout(() => {
    try {
      // --- Mock Success ---
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('userRole', role); // Set role
      sessionStorage.setItem('userName', `${role} User`); // Mock user name
      sessionStorage.setItem('userEmail', `${role.toLowerCase()}@eminity.com`); // Mock email

      // Redirect to intended route or default
      const intendedRoute = sessionStorage.getItem('intendedRoute');
      sessionStorage.removeItem('intendedRoute'); // Clean up
      router.push(intendedRoute || '/'); // Redirect to Deck List or intended route

    } catch (error) {
      console.error("Login simulation failed:", error);
      errorMessage.value = 'Login failed. Please try again.';
      sessionStorage.removeItem('isAuthenticated');
      sessionStorage.removeItem('userRole');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userEmail');
      loading.value = false;
    }
    // No need to set loading false on success due to redirect
  }, 1000); // 1 second delay
};
</script>

<template>
  <div class="login-container">
    <div class="login-box card">
      <div class="card-body">
        <h1 class="card-title text-center mb-4">DeepView Login</h1>
        <p class="text-center text-secondary mb-4">Sign in using your preferred provider.</p>

        <div v-if="loading" class="text-center mb-3">
          <p>Logging in...</p>
          <!-- Add a spinner/loading indicator here if desired -->
        </div>

        <div v-if="errorMessage" class="alert alert-danger mb-3">
          {{ errorMessage }}
        </div>

        <div class="d-grid gap-3">
          <button @click="handleLogin('Google', 'User')" class="btn btn-outline-secondary w-100" :disabled="loading">
            <img src="/google-logo.svg" alt="Google" class="provider-logo" /> Sign in with Google (User)
          </button>
          <button @click="handleLogin('Microsoft', 'User')" class="btn btn-outline-secondary w-100" :disabled="loading">
             <img src="/microsoft-logo.svg" alt="Microsoft" class="provider-logo" /> Sign in with Microsoft (User)
          </button>
           <button @click="handleLogin('Apple', 'User')" class="btn btn-outline-secondary w-100" :disabled="loading">
             <img src="/apple-logo.svg" alt="Apple" class="provider-logo" /> Sign in with Apple (User)
          </button>
          <hr>
           <button @click="handleLogin('Google', 'Admin')" class="btn btn-outline-primary w-100" :disabled="loading">
            <img src="/google-logo.svg" alt="Google" class="provider-logo" /> Sign in with Google (Admin)
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Full viewport height */
  background-color: var(--emininity-bg-secondary); /* Use secondary background for the page */
  padding: var(--emininity-spacing-xl); /* Use theme spacing */
}

.login-box {
  width: 100%;
  max-width: 400px; /* Limit login box width */
  background-color: var(--emininity-bg-primary); /* White background for the card */
  border: 1px solid var(--emininity-border-color); /* Use theme border */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); /* Lighter shadow */
  border-radius: var(--emininity-border-radius); /* Use theme radius */
}

.card-body {
  padding: var(--emininity-spacing-xl); /* Generous padding */
}

.card-title {
  font-weight: var(--emininity-font-weight-semibold); /* Use theme weight */
}

/* Use global button styles defined in App.vue */
.btn {
  /* Inherits global styles, add specific overrides if needed */
  justify-content: center; /* Center content */
}

/* Specific styles for outline buttons */
.btn.btn-outline-secondary {
  /* Inherits base button styles */
  /* Override if needed, e.g., border/color */
}
.btn.btn-outline-secondary:hover {
  /* Inherits base hover */
}

.btn.btn-outline-primary {
   border-color: var(--emininity-accent-color);
   color: var(--emininity-accent-color);
   background-color: transparent; /* Ensure transparent background */
}
.btn.btn-outline-primary:hover {
   background-color: rgba(74, 85, 104, 0.05); /* Very subtle accent hover */
   border-color: var(--emininity-accent-color);
   color: var(--emininity-accent-color);
}


.provider-logo {
  height: 1.2em; /* Adjust logo size */
  margin-right: var(--emininity-spacing-md); /* Use theme spacing */
  vertical-align: middle;
}

.w-100 {
  width: 100%;
}

.d-grid {
  display: grid;
}

.gap-3 {
  gap: var(--emininity-spacing-md); /* Use theme spacing */
}

hr {
  border: none;
  border-top: 1px solid var(--emininity-border-color);
  margin: var(--emininity-spacing-lg) 0; /* Use theme spacing */
}

.alert-danger {
  color: var(--emininity-danger-color);
  background-color: #fef2f2; /* Lighter red background */
  border: 1px solid #fecaca; /* Lighter red border */
  padding: var(--emininity-spacing-md); /* Use theme spacing */
  border-radius: var(--emininity-border-radius); /* Use theme radius */
  text-align: center;
}
</style>
