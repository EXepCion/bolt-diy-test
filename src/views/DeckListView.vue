<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'; // Import the shared layout
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- Mock Data ---
interface Deck {
  id: string; // Represents the base ID for a deck and its versions
  companyName: string;
  uploadDate: string; // Date of the *latest* version upload
  lastAnalyzed: string | null; // Date of the *latest* analysis
  deepViewScore: number | null; // Score of the *latest* version
  versions?: number; // Total number of versions available
}

// Mock data now represents the LATEST version shown in the list
const allDecks = ref<Deck[]>([
  { id: 'deck123', companyName: 'Innovatech Solutions', uploadDate: new Date(2024, 6, 15, 10, 30).toISOString(), lastAnalyzed: new Date(2024, 6, 15, 11, 0).toISOString(), deepViewScore: 85, versions: 3 },
  { id: 'deck456', companyName: 'Synergy Dynamics', uploadDate: new Date(2024, 6, 14, 14, 0).toISOString(), lastAnalyzed: new Date(2024, 6, 14, 14, 30).toISOString(), deepViewScore: 72, versions: 1 }, // Only 1 version known
  { id: 'deck789', companyName: 'Quantum Leap Inc.', uploadDate: new Date(2024, 6, 13, 9, 0).toISOString(), lastAnalyzed: null, deepViewScore: null, versions: 1 }, // Not analyzed yet, assume 1 version
  { id: 'deck101', companyName: 'EcoPlanet Ventures', uploadDate: new Date(2024, 6, 12, 16, 45).toISOString(), lastAnalyzed: new Date(2024, 6, 12, 17, 15).toISOString(), deepViewScore: 91, versions: 5 },
  { id: 'deck112', companyName: 'HealthBridge AI', uploadDate: new Date(2024, 6, 11, 8, 20).toISOString(), lastAnalyzed: new Date(2024, 6, 11, 8, 55).toISOString(), deepViewScore: 68, versions: 1 }, // Only 1 version known
]);

const searchQuery = ref('');
const showDeleteConfirm = ref<string | null>(null); // Store ID of deck to delete

const filteredDecks = computed(() => {
  if (!searchQuery.value) {
    return allDecks.value;
  }
  const lowerQuery = searchQuery.value.toLowerCase();
  return allDecks.value.filter(deck =>
    deck.companyName.toLowerCase().includes(lowerQuery)
  );
});

const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const formatScore = (score: number | null | undefined): string => {
  if (score === null || score === undefined) return 'Pending';
  // Add any specific formatting if needed (e.g., color coding based on score)
  return `${score}%`;
};

const viewReport = (deckId: string) => {
  // This still navigates to the report for the base deck ID.
  // The report view currently shows data based on this ID (mocked latest).
  router.push({ name: 'Report', params: { id: deckId } });
};

const reanalyzeDeck = (deckId: string, event: MouseEvent) => {
  event.stopPropagation(); // Prevent row click
  console.log(`Reanalyzing deck (latest version): ${deckId}`);
  // Add API call logic here - likely triggers analysis on the latest version
  alert(`Reanalyzing deck: ${deckId} (Not Implemented)`);
};

const confirmDelete = (deckId: string, event: MouseEvent) => {
  event.stopPropagation(); // Prevent row click
  showDeleteConfirm.value = deckId;
};

const cancelDelete = () => {
  showDeleteConfirm.value = null;
};

const deleteDeck = () => {
  if (!showDeleteConfirm.value) return;
  const deckIdToDelete = showDeleteConfirm.value;
  console.log(`Deleting deck and ALL its versions: ${deckIdToDelete}`);
  // Add API call logic here - should delete the deck and all associated versions
  allDecks.value = allDecks.value.filter(deck => deck.id !== deckIdToDelete);
  showDeleteConfirm.value = null; // Close modal
  alert(`Deleted deck: ${deckIdToDelete} and all its versions (Mocked)`);
};

const viewVersions = (deckId: string, event: MouseEvent) => {
  event.stopPropagation(); // Prevent row click
  console.log(`Navigating to versions view for deck: ${deckId}`);
  // Navigate to the new DeckVersionsView, passing the base deck ID
  router.push({ name: 'DeckVersions', params: { id: deckId } });
};

</script>

<template>
  <AppLayout>
    <div class="container list-container">
      <div class="list-header">
        <h1>My Pitch Decks</h1>
        <router-link :to="{ name: 'DeckUpload' }" class="button-like primary"> <!-- Use button-like class -->
          Upload New Deck
        </router-link>
      </div>

      <div class="search-bar mb-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search by company name..."
          class="form-control"
        />
      </div>

      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Upload Date (Latest)</th>
              <th>Last Analyzed (Latest)</th>
              <th>DeepView Score (Latest)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredDecks.length === 0">
              <td colspan="5" class="text-center text-secondary">
                {{ searchQuery ? 'No decks found matching your search.' : 'No decks uploaded yet.' }}
              </td>
            </tr>
            <tr v-for="deck in filteredDecks" :key="deck.id" @click="viewReport(deck.id)" class="deck-row">
              <td>{{ deck.companyName }}</td>
              <td>{{ formatDate(deck.uploadDate) }}</td>
              <td>{{ formatDate(deck.lastAnalyzed) }}</td>
              <td>
                <span :class="{ 'score-pending': deck.deepViewScore === null }">
                  {{ formatScore(deck.deepViewScore) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                   <button @click.stop="reanalyzeDeck(deck.id, $event)" class="btn btn-sm btn-icon" title="Reanalyze Latest">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                       <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                       <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                     </svg>
                   </button>
                   <!-- Show versions button only if versions > 1 -->
                   <button v-if="deck.versions && deck.versions > 1" @click.stop="viewVersions(deck.id, $event)" class="btn btn-sm btn-icon" title="View Versions">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers" viewBox="0 0 16 16">
                       <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 0.235 9.559a.5.5 0 0 0-.47 0l-7.5 4A.5.5 0 0 0 0 14.5v1a.5.5 0 0 0 .5.5h15a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.235-.441l-7.5-4a.5.5 0 0 0-.47 0L12.813 8l2.952-1.559a.5.5 0 0 0 0-.882zM7.765 1.79l7.5 4-7.5 4-7.5-4zM1 9.882l7.5 4 7.5-4L8.563 8z"/>
                     </svg>
                   </button>
                   <button @click.stop="confirmDelete(deck.id, $event)" class="btn btn-sm btn-icon btn-danger-outline" title="Delete All Versions">
                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                       <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                       <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                     </svg>
                   </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="modal-backdrop">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Deletion</h5>
              <button type="button" class="btn-close" @click="cancelDelete" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete the deck for "{{ allDecks.find(d => d.id === showDeleteConfirm)?.companyName }}"? <strong>This will delete all associated versions and cannot be undone.</strong></p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" @click="cancelDelete">Cancel</button> <!-- Use base button style -->
              <button type="button" class="btn danger" @click="deleteDeck">Delete Deck & Versions</button> <!-- Use danger button style -->
            </div>
          </div>
        </div>
      </div>

    </div>
  </AppLayout>
</template>

<style scoped>
.list-container {
  margin-top: var(--emininity-spacing-xl); /* Use theme spacing */
  margin-bottom: var(--emininity-spacing-xl);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--emininity-spacing-lg); /* Use theme spacing */
}

.list-header h1 {
  margin-bottom: 0;
}

.search-bar input.form-control {
  max-width: 400px; /* Limit search bar width */
}

.table-responsive {
  overflow-x: auto; /* Ensure table scrolls horizontally if needed */
}

/* Use global table styles from App.vue */
.table {
  /* Inherits global styles */
  vertical-align: middle; /* Align cell content vertically */
}

.table th,
.table td {
  padding: var(--emininity-spacing-md); /* Consistent padding */
  white-space: nowrap; /* Prevent text wrapping initially */
}

.table thead th {
  /* Inherits global styles */
  font-weight: var(--emininity-font-weight-medium); /* Use theme weight */
  color: var(--emininity-text-secondary); /* Use theme color */
  font-size: 0.9rem;
}

.table tbody tr {
  transition: background-color 0.15s ease-in-out;
}

.table-hover tbody tr:hover {
  background-color: var(--emininity-bg-secondary); /* Use theme color */
}

.deck-row {
  cursor: pointer;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: var(--emininity-spacing-sm); /* Use theme spacing */
}

/* Simplified Icon Button Styles */
.btn.btn-sm {
  font-size: 0.875rem; /* Keep size small */
  line-height: 1;
}

.btn.btn-icon {
  padding: var(--emininity-spacing-sm); /* Square padding */
  border: 1px solid transparent; /* Transparent border for alignment */
  background-color: transparent;
  color: var(--emininity-text-secondary);
}
.btn.btn-icon:hover {
  background-color: var(--emininity-bg-secondary);
  color: var(--emininity-text-primary);
  border-color: transparent; /* Keep border transparent on hover */
}
.btn.btn-icon:focus {
   box-shadow: 0 0 0 0.2rem var(--emininity-focus-ring-color); /* Use theme focus */
   border-color: transparent;
}

/* Specific style for danger icon button */
.btn.btn-icon.btn-danger-outline {
  color: var(--emininity-danger-color);
}
.btn.btn-icon.btn-danger-outline:hover {
  background-color: #fef2f2; /* Light red background */
  color: var(--emininity-danger-hover-color);
}


.score-pending {
  color: var(--emininity-text-secondary);
  font-style: italic;
}


/* Modal Styles - Minimal */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(33, 37, 41, 0.5); /* Use text primary with alpha */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-dialog {
  background-color: var(--emininity-bg-primary);
  border-radius: var(--emininity-border-radius); /* Use theme radius */
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1); /* Softer shadow */
  max-width: 500px;
  width: calc(100% - 2rem);
  margin: 1rem;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 2rem);
  border: 1px solid var(--emininity-border-color); /* Add subtle border */
}

.modal-content {
   display: flex;
   flex-direction: column;
   flex-grow: 1;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--emininity-spacing-md) var(--emininity-spacing-lg); /* Use theme spacing */
  border-bottom: 1px solid var(--emininity-border-color); /* Use theme border */
}

.modal-title {
  margin-bottom: 0;
  line-height: 1.5;
  font-size: 1.25rem;
  font-weight: var(--emininity-font-weight-medium); /* Use theme weight */
}

.btn-close {
  padding: 0.5rem;
  margin: -0.5rem -0.75rem -0.5rem auto; /* Adjust margin */
  background: transparent url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%236c757d'%3e%3cpath d='M.293.293a1 1 0 0 1 1.414 0L8 6.586 14.293.293a1 1 0 1 1 1.414 1.414L9.414 8l6.293 6.293a1 1 0 0 1-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L6.586 8 .293 1.707a1 1 0 0 1 0-1.414z'/%3e%3c/svg%3e") center/1em auto no-repeat; /* Use secondary text color */
  border: 0;
  border-radius: var(--emininity-border-radius);
  opacity: 0.7;
  cursor: pointer;
  transition: opacity 0.15s ease-in-out;
}
.btn-close:hover {
  opacity: 1;
}
.btn-close:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem var(--emininity-focus-ring-color); /* Use theme focus */
}


.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: var(--emininity-spacing-lg); /* Use theme spacing */
  overflow-y: auto;
}
.modal-body strong { /* Make warning more prominent */
    color: var(--emininity-danger-color);
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  padding: var(--emininity-spacing-md) var(--emininity-spacing-lg); /* Use theme spacing */
  border-top: 1px solid var(--emininity-border-color); /* Use theme border */
  gap: var(--emininity-spacing-sm); /* Use theme spacing */
  background-color: var(--emininity-bg-secondary); /* Subtle footer background */
  border-bottom-left-radius: calc(var(--emininity-border-radius) - 1px);
  border-bottom-right-radius: calc(var(--emininity-border-radius) - 1px);
}
</style>
