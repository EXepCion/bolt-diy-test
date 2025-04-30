import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/LoginView.vue';
import DeckUploadView from '../views/DeckUploadView.vue';
import DeckListView from '../views/DeckListView.vue';
import ReportView from '../views/ReportView.vue';
import DeckVersionsView from '../views/DeckVersionsView.vue';
import AccountSettingsView from '../views/AccountSettingsView.vue'; // Import Account Settings view
import AdminLayout from '../views/admin/AdminLayout.vue';
import UserManagementView from '../views/admin/UserManagementView.vue';
import DeckManagementView from '../views/admin/DeckManagementView.vue';
import SignalManagementView from '../views/admin/SignalManagementView.vue';
import JobMonitoringView from '../views/admin/JobMonitoringView.vue';
import NotificationCenterView from '../views/admin/NotificationCenterView.vue';
import LogsView from '../views/admin/LogsView.vue';
import ComplianceToolsView from '../views/admin/ComplianceToolsView.vue';

// Mock authentication check
const isAuthenticated = () => {
  // Replace with actual auth logic (e.g., check token/session)
  // For now, assume logged in if not on login page explicitly
  return sessionStorage.getItem('isAuthenticated') === 'true';
};

// Mock admin role check
const isAdmin = () => {
  // Replace with actual role check logic
  return sessionStorage.getItem('userRole') === 'Admin';
};

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/',
    name: 'DeckList',
    component: DeckListView,
    meta: { requiresAuth: true },
  },
  {
    path: '/upload',
    name: 'DeckUpload',
    component: DeckUploadView,
    meta: { requiresAuth: true },
  },
  {
    path: '/report/:id', // Example: /report/deck123
    name: 'Report',
    component: ReportView,
    props: true, // Pass route params as props
    meta: { requiresAuth: true },
  },
  {
    path: '/versions/:id', // Example: /versions/deck123
    name: 'DeckVersions',
    component: DeckVersionsView,
    props: true, // Pass route params as props
    meta: { requiresAuth: true },
  },
  {
    path: '/account-settings', // New route for account settings
    name: 'AccountSettings',
    component: AccountSettingsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', redirect: { name: 'UserManagement' } }, // Default admin route
      { path: 'users', name: 'UserManagement', component: UserManagementView },
      { path: 'decks', name: 'DeckManagement', component: DeckManagementView },
      { path: 'signals', name: 'SignalManagement', component: SignalManagementView },
      { path: 'jobs', name: 'JobMonitoring', component: JobMonitoringView },
      { path: 'notifications', name: 'NotificationCenter', component: NotificationCenterView },
      { path: 'logs', name: 'Logs', component: LogsView },
      { path: 'compliance', name: 'ComplianceTools', component: ComplianceToolsView },
    ],
  },
  // Catch-all route for 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: '/' } // Redirect to home or a dedicated 404 page
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  // Simulate login for now if trying to access authenticated route directly
  // In a real app, you'd redirect to login if not authenticated
  if (requiresAuth && !isAuthenticated() && to.name !== 'Login') {
     // Store intended destination
     sessionStorage.setItem('intendedRoute', to.fullPath);
     next({ name: 'Login' });
  } else if (requiresAdmin && !isAdmin()) {
    // If auth required and user is not admin, redirect to home or show unauthorized page
    console.warn('Admin access required for:', to.fullPath);
    next({ name: 'DeckList' }); // Or redirect to an 'Unauthorized' page
  } else if (to.name === 'Login' && isAuthenticated()) {
    // If user is already logged in, redirect away from login page
    next({ name: 'DeckList' });
  }
  else {
    next(); // Proceed as normal
  }
});

export default router;
