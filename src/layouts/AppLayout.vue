<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// Props to control layout variations
const props = defineProps({
  showBackButton: {
    type: Boolean,
    default: false,
  },
  showAdminLink: {
    type: Boolean,
    default: true, // Show admin link by default if user is admin
  }
});

// Mock user state (replace with actual auth state management, e.g., Pinia)
const isAuthenticated = computed(() => sessionStorage.getItem('isAuthenticated') === 'true');
const isAdmin = computed(() => sessionStorage.getItem('userRole') === 'Admin');
const userName = computed(() => sessionStorage.getItem('userName') || 'User');

const showAccountMenu = ref(false);

const toggleAccountMenu = () => {
  showAccountMenu.value = !showAccountMenu.value;
};

const closeAccountMenu = () => {
  // Close menu with a slight delay to allow click events on menu items
  setTimeout(() => {
    showAccountMenu.value = false;
  }, 150);
};

const handleLogout = () => {
  console.log('Logging out...');
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('userRole');
  sessionStorage.removeItem('userName');
  sessionStorage.removeItem('userEmail');
  showAccountMenu.value = false;
  router.push({ name: 'Login' });
};

const goToAccountSettings = () => {
  router.push({ name: 'AccountSettings' });
  showAccountMenu.value = false; // Close menu after navigation
};


const goBack = () => {
  // Consider edge cases: if no history, go to default route
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'DeckList' }); // Fallback route
  }
};

// Determine if the current route is within the admin section
const isInAdminSection = computed(() => route.matched.some(record => record.path.startsWith('/admin')));

</script>

<template>
  <div class="app-layout">
    <header v-if="isAuthenticated" class="app-header">
      <nav class="navbar">
        <div class="navbar-left">
          <!-- Back Button (Conditional) -->
          <button v-if="props.showBackButton" @click="goBack" class="nav-button back-button" title="Back">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            <span class="back-button-text">Back</span>
          </button>
           <!-- App Logo/Title (Conditional based on back button) -->
           <router-link v-else :to="{ name: 'DeckList' }" class="navbar-brand">
             DeepView
           </router-link>
        </div>

        <div class="navbar-right">
           <!-- Admin Panel Link (Conditional) -->
           <router-link
             v-if="isAdmin && props.showAdminLink && !isInAdminSection"
             :to="{ name: 'UserManagement' }"
             class="nav-link admin-link"
             title="Admin Panel"
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-gear me-1" viewBox="0 0 16 16">
               <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
               <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.27-.922 1.656-.922 1.926 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.922.27 1.656.922 1.926 0l.094-.319a1.873 1.873 0 0 0 1.115-2.693l.16-.291c.415-.764-.42-1.6-1.185-1.184l-.291.159a1.873 1.873 0 0 0-2.693-1.116z"/>
             </svg>
             Admin
           </router-link>

          <!-- Settings (Placeholder - Minimal Icon Button) -->
          <!-- <button class="nav-button icon-button" title="Settings (Not Implemented)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-sliders" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"/>
            </svg>
          </button> -->

          <!-- Account Dropdown -->
          <div class="account-menu-container">
            <button @click="toggleAccountMenu" @blur="closeAccountMenu" class="nav-button account-button" title="Account">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
                 <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
              </svg>
              <span class="account-button-text">{{ userName }}</span>
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-down dropdown-caret" viewBox="0 0 16 16">
                 <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
               </svg>
            </button>
            <div v-if="showAccountMenu" class="account-dropdown">
              <!-- Use button for navigation action -->
              <button @click="goToAccountSettings" class="dropdown-item">Account Settings</button>
              <hr class="dropdown-divider">
              <button @click="handleLogout" class="dropdown-item logout-button">Logout</button>
            </div>
          </div>
        </div>
      </nav>
    </header>
    <main class="main-content">
      <!-- Slot for the page content -->
      <slot></slot>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--emininity-bg-primary);
}

.app-header {
  height: var(--emininity-header-height, 60px);
  background-color: var(--emininity-bg-primary); /* White header */
  border-bottom: 1px solid var(--emininity-border-color); /* Subtle border */
  padding: 0 var(--emininity-spacing-lg); /* Consistent padding */
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
  flex-shrink: 0;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.navbar-left,
.navbar-right {
  display: flex;
  align-items: center;
  gap: var(--emininity-spacing-sm); /* Reduced gap */
}

.navbar-brand {
  font-size: 1.4rem; /* Slightly smaller brand */
  font-weight: var(--emininity-font-weight-semibold);
  color: var(--emininity-text-primary);
  text-decoration: none;
  margin-right: var(--emininity-spacing-md);
}
.navbar-brand:hover {
  text-decoration: none;
  color: var(--emininity-text-primary); /* No color change on hover */
}

/* Base style for nav buttons and links */
.nav-button, .nav-link {
  background: none;
  border: none;
  padding: var(--emininity-spacing-sm) var(--emininity-spacing-sm); /* Consistent padding */
  cursor: pointer;
  color: var(--emininity-text-secondary); /* Use secondary text color */
  display: inline-flex; /* Use inline-flex for alignment */
  align-items: center;
  justify-content: center;
  border-radius: var(--emininity-border-radius);
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  text-decoration: none;
  font-size: 0.95rem;
  line-height: 1; /* Ensure icon and text align well */
  height: 36px; /* Fixed height for alignment */
  min-width: 36px; /* Ensure icon buttons have width */
}

.nav-button:hover, .nav-link:hover {
  background-color: var(--emininity-bg-secondary); /* Subtle hover */
  color: var(--emininity-text-primary); /* Darken text on hover */
  text-decoration: none;
}

/* Specific button adjustments */
.back-button {
  padding: var(--emininity-spacing-sm) var(--emininity-spacing-md); /* More padding for back button */
}

.back-button-text {
  margin-left: var(--emininity-spacing-sm);
  font-weight: var(--emininity-font-weight-medium);
}

.admin-link {
   font-weight: var(--emininity-font-weight-medium);
   padding: var(--emininity-spacing-sm) var(--emininity-spacing-md);
}
.admin-link svg {
   margin-right: var(--emininity-spacing-sm);
}

.icon-button {
  padding: var(--emininity-spacing-sm); /* Square padding for icon buttons */
}

.account-button {
  padding: var(--emininity-spacing-sm) var(--emininity-spacing-md);
}

.account-button-text {
  margin-left: var(--emininity-spacing-sm);
  margin-right: var(--emininity-spacing-xs);
  font-weight: var(--emininity-font-weight-medium);
  color: var(--emininity-text-primary);
}

.dropdown-caret {
   opacity: 0.7;
   margin-left: var(--emininity-spacing-xs);
}

.account-menu-container {
  position: relative;
}

/* Minimal Dropdown */
.account-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: var(--emininity-bg-primary);
  border: 1px solid var(--emininity-border-color);
  border-radius: var(--emininity-border-radius);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Subtle shadow */
  min-width: 180px;
  z-index: 1010;
  padding: var(--emininity-spacing-sm) 0;
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  display: flex; /* Use flex for potential icon alignment */
  align-items: center;
  width: 100%;
  padding: var(--emininity-spacing-sm) var(--emininity-spacing-lg); /* Consistent padding */
  clear: both;
  font-weight: var(--emininity-font-weight-normal);
  color: var(--emininity-text-primary);
  text-align: inherit;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  font-size: 0.95rem;
}

.dropdown-item:hover {
  background-color: var(--emininity-bg-secondary);
  color: var(--emininity-text-primary);
}

.dropdown-item.disabled {
  color: var(--emininity-text-secondary);
  pointer-events: none;
  background-color: transparent;
}

.logout-button {
  color: var(--emininity-danger-color);
}
.logout-button:hover {
  background-color: #fdf2f2; /* Very light red hover */
  color: var(--emininity-danger-hover-color);
}


.dropdown-divider {
  height: 1px; /* Use height instead of border */
  margin: var(--emininity-spacing-sm) 0;
  overflow: hidden;
  background-color: var(--emininity-border-color); /* Use border color for divider */
  border: 0; /* Remove border */
}

.main-content {
  flex-grow: 1;
  /* Padding is handled by the container class within child views */
}

/* Hide text on smaller screens - Keep this for minimal mobile view */
@media (max-width: 768px) {
  .app-header {
    padding: 0 var(--emininity-spacing-md);
  }
  .back-button-text, .account-button-text, .admin-link span { /* Target span if needed */
    display: none; /* Hide text labels */
  }
   .navbar-brand {
     font-size: 1.25rem;
   }
   .navbar-left, .navbar-right {
     gap: var(--emininity-spacing-xs); /* Tighter gap */
   }
   .nav-button, .nav-link {
     padding: var(--emininity-spacing-sm);
   }
   .admin-link svg {
     margin-right: 0; /* Remove margin when text is hidden */
   }
}
</style>
