<script setup lang="ts">
import AppLayout from '../../layouts/AppLayout.vue'; // Use the main layout
import { useRoute } from 'vue-router';

const route = useRoute();

const adminNavLinks = [
  { name: 'UserManagement', label: 'Users', path: '/admin/users' },
  { name: 'DeckManagement', label: 'Decks', path: '/admin/decks' },
  { name: 'SignalManagement', label: 'Signals', path: '/admin/signals' },
  { name: 'JobMonitoring', label: 'Jobs', path: '/admin/jobs' },
  { name: 'NotificationCenter', label: 'Notifications', path: '/admin/notifications' },
  { name: 'Logs', label: 'Logs', path: '/admin/logs' },
  { name: 'ComplianceTools', label: 'Compliance', path: '/admin/compliance' },
];

const isActive = (routeName: string) => {
  // Check if the current route name or any of its matched routes' names match
  return route.name === routeName || route.matched.some(record => record.name === routeName);
};
</script>

<template>
  <AppLayout :show-admin-link="false"> <!-- Hide the default Admin link when inside admin -->
    <div class="admin-container">
      <aside class="admin-sidebar">
        <h2 class="admin-sidebar-title">Admin Panel</h2>
        <nav class="admin-nav">
          <ul>
            <li v-for="link in adminNavLinks" :key="link.name">
              <router-link :to="link.path" :class="{ active: isActive(link.name) }">
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>
      <main class="admin-content">
        <router-view /> <!-- Renders the specific admin section -->
      </main>
    </div>
  </AppLayout>
</template>

<style scoped>
.admin-container {
  display: flex;
  flex-grow: 1; /* Ensure it takes full height within AppLayout */
  min-height: calc(100vh - var(--emininity-header-height)); /* Adjust based on header height */
}

.admin-sidebar {
  width: 240px; /* Fixed width for the sidebar */
  background-color: var(--emininity-bg-secondary);
  border-right: 1px solid var(--emininity-border-color);
  padding: 1.5rem 1rem;
  flex-shrink: 0; /* Prevent sidebar from shrinking */
  display: flex;
  flex-direction: column;
}

.admin-sidebar-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-left: 0.5rem; /* Align with nav items */
  color: var(--emininity-text-primary);
}

.admin-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.admin-nav li {
  margin-bottom: 0.25rem;
}

.admin-nav a {
  display: block;
  padding: 0.6rem 1rem;
  border-radius: 0.25rem;
  color: var(--emininity-text-secondary);
  text-decoration: none;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
  font-weight: 500;
}

.admin-nav a:hover {
  background-color: #e9ecef; /* Slightly darker hover */
  color: var(--emininity-text-primary);
  text-decoration: none;
}

.admin-nav a.active {
  background-color: var(--emininity-accent-color);
  color: #fff;
  font-weight: 600;
}

.admin-content {
  flex-grow: 1; /* Allow content area to take remaining space */
  padding: 2rem;
  overflow-y: auto; /* Allow content scrolling if needed */
  background-color: var(--emininity-bg-primary);
}

/* Responsive adjustments if needed */
@media (max-width: 768px) {
  .admin-container {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--emininity-border-color);
    min-height: auto; /* Reset min-height */
    padding: 1rem;
  }
  .admin-content {
    padding: 1.5rem;
  }
  .admin-sidebar-title {
     margin-bottom: 1rem;
  }
  .admin-nav ul {
     display: flex;
     flex-wrap: wrap; /* Allow items to wrap */
     gap: 0.5rem;
  }
   .admin-nav li {
     margin-bottom: 0;
   }
}
</style>
