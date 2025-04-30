<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted } from 'vue';

// Mock user data (replace with actual data from auth state/API)
const user = ref({
  name: '',
  email: '',
  role: '',
  // Add other relevant fields like profile picture URL, etc.
});

const loading = ref(true);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const fetchUserData = async () => {
  loading.value = true;
  error.value = null;
  successMessage.value = null; // Clear previous messages
  console.log("Fetching user data...");

  // Simulate API call or fetching from state management
  await new Promise(resolve => setTimeout(resolve, 300));

  try {
    // Replace with actual data retrieval
    user.value.name = sessionStorage.getItem('userName') || 'Unknown User';
    user.value.email = sessionStorage.getItem('userEmail') || 'no-email@example.com';
    user.value.role = sessionStorage.getItem('userRole') || 'User';
    loading.value = false;
  } catch (err: any) {
    console.error("Failed to fetch user data:", err);
    error.value = "Failed to load user information.";
    loading.value = false;
  }
};

const handleSaveChanges = async () => {
  loading.value = true; // Indicate processing
  error.value = null;
  successMessage.value = null;
  console.log("Attempting to save changes:", user.value);

  // Simulate API call to update user data
  await new Promise(resolve => setTimeout(resolve, 700));

  try {
    // --- Mock Success ---
    // In a real app, update sessionStorage or state management upon successful API response
    sessionStorage.setItem('userName', user.value.name); // Update mock storage
    console.log("Changes saved successfully (mocked).");
    successMessage.value = "Account details updated successfully.";
    loading.value = false;

    // --- Mock Failure Example ---
    // if (user.value.name === 'Error') {
    //   throw new Error("Simulated server error during save.");
    // }

  } catch (err: any) {
    console.error("Failed to save changes:", err);
    error.value = err.message || "Failed to update account details. Please try again.";
    loading.value = false;
    // Optionally revert changes in the form if save fails
    // await fetchUserData(); // Re-fetch original data
  }
};

onMounted(() => {
  fetchUserData();
});
</script>

<template>
  <AppLayout :show-back-button="true" :show-admin-link="false">
    <div class="container settings-container">
      <h1>Account Settings</h1>

      <div v-if="loading && !user.name" class="text-center p-5">
        <p>Loading account details...</p>
        <!-- Add spinner here -->
      </div>

      <div v-else-if="error && !loading" class="alert alert-danger mb-4">
        {{ error }}
      </div>

      <div v-if="!loading || user.name" class="card">
        <div class="card-body">
          <form @submit.prevent="handleSaveChanges">
            <div v-if="successMessage" class="alert alert-success mb-4">
              {{ successMessage }}
            </div>
             <div v-if="error && loading" class="alert alert-danger mb-4"> <!-- Show error during save attempt -->
               {{ error }}
             </div>

            <div class="form-group">
              <label for="userName" class="form-label">Name</label>
              <input
                type="text"
                id="userName"
                v-model="user.name"
                class="form-control"
                :disabled="loading"
                required
              />
            </div>

            <div class="form-group">
              <label for="userEmail" class="form-label">Email Address</label>
              <input
                type="email"
                id="userEmail"
                v-model="user.email"
                class="form-control"
                disabled  
                aria-describedby="emailHelp"
              />
              <small id="emailHelp" class="form-text text-secondary">
                Email address cannot be changed. Contact support if needed.
              </small>
            </div>

            <div class="form-group">
              <label for="userRole" class="form-label">Role</label>
              <input
                type="text"
                id="userRole"
                v-model="user.role"
                class="form-control"
                disabled
              />
            </div>

            <!-- Placeholder for Password Change -->
            <fieldset class="mt-4 pt-3 border-top">
              <legend class="h6">Change Password</legend>
              <p class="text-secondary small">Password changes are not yet implemented.</p>
              <div class="form-group">
                <label for="currentPassword" class="form-label">Current Password</label>
                <input type="password" id="currentPassword" class="form-control" disabled placeholder="Not implemented">
              </div>
              <div class="form-group">
                <label for="newPassword" class="form-label">New Password</label>
                <input type="password" id="newPassword" class="form-control" disabled placeholder="Not implemented">
              </div>
               <div class="form-group">
                <label for="confirmPassword" class="form-label">Confirm New Password</label>
                <input type="password" id="confirmPassword" class="form-control" disabled placeholder="Not implemented">
              </div>
              <button type="button" class="btn mt-2" disabled>Update Password</button>
            </fieldset>

            <div class="mt-4 pt-3 border-top d-flex justify-content-end">
              <button type="submit" class="btn primary" :disabled="loading">
                <span v-if="loading">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.settings-container {
  margin-top: var(--emininity-spacing-xl);
  margin-bottom: var(--emininity-spacing-xl);
  max-width: 800px; /* Constrain width for settings form */
}

.settings-container h1 {
  margin-bottom: var(--emininity-spacing-lg);
}

/* Use global card styles */
.card {
  /* Inherits global styles */
}
.card-body {
   /* Inherits global styles */
}

/* Use global form styles */
.form-group {
  /* Inherits global styles */
}
.form-label {
  /* Inherits global styles */
}
.form-control {
  /* Inherits global styles */
}
.form-control:disabled {
  background-color: var(--emininity-bg-secondary);
  opacity: 0.7;
  cursor: not-allowed;
}
.form-text {
  font-size: 0.875em;
}

/* Alert Styles (Minimal) */
.alert {
  padding: var(--emininity-spacing-md);
  border: 1px solid transparent;
  border-radius: var(--emininity-border-radius);
}
.alert-danger {
  color: var(--emininity-danger-color);
  background-color: #fef2f2;
  border-color: #fecaca;
}
.alert-success {
  color: #0f5132; /* Example success color */
  background-color: #d1e7dd;
  border-color: #badbcc;
}

fieldset {
  border: none; /* Remove default fieldset border */
  padding: 0;
  margin: 0;
}
fieldset legend {
  font-size: 1rem;
  font-weight: var(--emininity-font-weight-medium);
  margin-bottom: var(--emininity-spacing-md);
}
.border-top {
   border-top: 1px solid var(--emininity-border-color) !important;
}
.d-flex { display: flex !important; }
.justify-content-end { justify-content: flex-end !important; }
</style>
