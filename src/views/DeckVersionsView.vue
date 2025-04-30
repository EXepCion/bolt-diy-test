<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const props = defineProps<{ id: string }>(); // Get base deck ID from route params

// --- Mock Data ---
interface DeckVersion {
  versionId: string; // Unique ID for this specific version
  baseDeckId: string; // ID of the original deck upload group
  versionNumber: number;
  companyName: string; // Should be consistent for the group
  uploadDate: string;
  lastAnalyzed: string | null;
  deepViewScore: number | null;
}

const versions = ref<DeckVersion[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const companyName = ref(''); // To display in the header

const fetchVersions = async (baseDeckId: string) => {
  loading.value = true;
  error.value = null;
  console.log(`Fetching versions for base deck ID: ${baseDeckId}`);

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    // --- Mock Data Generation ---
    // In a real app, fetch versions associated with baseDeckId
    const mockVersionData: { [key: string]: DeckVersion[] } = {
      'deck123': [ // Innovatech Solutions
        { versionId: 'v3-deck123', baseDeckId: 'deck123', versionNumber: 3, companyName: 'Innovatech Solutions', uploadDate: new Date(2024, 6, 15, 10, 30).toISOString(), lastAnalyzed: new Date(2024, 6, 15, 11, 0).toISOString(), deepViewScore: 85 },
        { versionId: 'v2-deck123', baseDeckId: 'deck123', versionNumber: 2, companyName: 'Innovatech Solutions', uploadDate: new Date(2024, 6, 10, 9, 0).toISOString(), lastAnalyzed: new Date(2024, 6, 10, 9, 30).toISOString(), deepViewScore: 82 },
        { versionId: 'v1-deck123', baseDeckId: 'deck123', versionNumber: 1, companyName: 'Innovatech Solutions', uploadDate: new Date(2024, 6, 5, 14, 15).toISOString(), lastAnalyzed: new Date(2024, 6, 5, 15, 0).toISOString(), deepViewScore: 78 },
      ],
      'deck101': [ // EcoPlanet Ventures
         { versionId: 'v5-deck101', baseDeckId: 'deck101', versionNumber: 5, companyName: 'EcoPlanet Ventures', uploadDate: new Date(2024, 6, 12, 16, 45).toISOString(), lastAnalyzed: new Date(2024, 6, 12, 17, 15).toISOString(), deepViewScore: 91 },
         { versionId: 'v4-deck101', baseDeckId: 'deck101', versionNumber: 4, companyName: 'EcoPlanet Ventures', uploadDate: new Date(2024, 6, 8, 11, 0).toISOString(), lastAnalyzed: new Date(2024, 6, 8, 11, 20).toISOString(), deepViewScore: 88 },
         { versionId: 'v3-deck101', baseDeckId: 'deck101', versionNumber: 3, companyName: 'EcoPlanet Ventures', uploadDate: new Date(2024, 6, 1, 10, 0).toISOString(), lastAnalyzed: new Date(2024, 6, 1, 10, 30).toISOString(), deepViewScore: 85 },
         { versionId: 'v2-deck101', baseDeckId: 'deck101', versionNumber: 2, companyName: 'EcoPlanet Ventures', uploadDate: new Date(2024, 5, 25, 15, 0).toISOString(), lastAnalyzed: new Date(2024, 5, 25, 15, 30).toISOString(), deepViewScore: 80 },
         { versionId: 'v1-deck101', baseDeckId: 'deck101', versionNumber: 1, companyName: 'EcoPlanet Ventures', uploadDate: new Date(2024, 5, 20, 9, 30).toISOString(), lastAnalyzed: new Date(2024, 5, 20, 10, 0).toISOString(), deepViewScore: 75 },
      ],
      // Add mock data for other decks with versions > 1 if needed
      'deck456': [ // Synergy Dynamics (Only 1 version shown in list, but maybe more historically?)
         { versionId: 'v1-deck456', baseDeckId: 'deck456', versionNumber: 1, companyName: 'Synergy Dynamics', uploadDate: new Date(2024, 6, 14, 14, 0).toISOString(), lastAnalyzed: new Date(2024, 6, 14, 14, 30).toISOString(), deepViewScore: 72 },
      ],
       'deck112': [ // HealthBridge AI (Only 1 version shown in list)
         { versionId: 'v1-deck112', baseDeckId: 'deck112', versionNumber: 1, companyName: 'HealthBridge AI', uploadDate: new Date(2024, 6, 11, 8, 20).toISOString(), lastAnalyzed: new Date(2024, 6, 11, 8, 55).toISOString(), deepViewScore: 68 },
      ],
       'deck789': [], // Quantum Leap Inc. (No versions as not analyzed)
    };

    const data = mockVersionData[baseDeckId];

    if (data) {
      versions.value = data.sort((a, b) => b.versionNumber - a.versionNumber); // Sort descending
      if (data.length > 0) {
        companyName.value = data[0].companyName; // Get company name from the first version
      } else {
         // Attempt to get company name from route params or a fallback mechanism if needed
         // For now, assume we can get it or show a generic title
         companyName.value = "Unknown Company"; // Fallback
         console.warn(`No version data found for ${baseDeckId}, company name might be incorrect.`);
      }
    } else {
      // Handle case where the baseDeckId might not have specific version data (e.g., only 1 version exists)
      // Or if the ID is invalid
      console.warn(`No specific version mock data found for ${baseDeckId}. Displaying empty list or error.`);
      versions.value = [];
      companyName.value = "Unknown Company"; // Fallback
      // Optionally set an error message
      // error.value = 'Could not find version history for this deck.';
    }
  } catch (err: any) {
    console.error("Failed to fetch versions:", err);
    error.value = err.message || 'Failed to load version history.';
    versions.value = [];
  } finally {
    loading.value = false;
  }
};

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
  return `${score}%`;
};

const viewVersionReport = (version: DeckVersion) => {
  // Navigate to the report view. Pass the *base* deck ID.
  // The report view currently only uses the base ID.
  // If reports needed to be version-specific, we'd pass versionId here too.
  router.push({ name: 'Report', params: { id: version.baseDeckId } });
};

onMounted(() => {
  fetchVersions(props.id);
});

</script>

<template>
  <AppLayout :show-back-button="true">
    <div class="container versions-container">
      <div class="versions-header">
        <h1>Version History: {{ companyName }}</h1>
        <!-- Maybe add a button to upload a NEW version for this company? -->
      </div>

      <div v-if="loading" class="text-center p-5">
        <p>Loading version history...</p>
        <!-- Add spinner here -->
      </div>
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <div v-else class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>Version</th>
              <th>Upload Date</th>
              <th>Analysis Date</th>
              <th>DeepView Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="versions.length === 0">
              <td colspan="5" class="text-center text-secondary">
                No version history found for this deck.
              </td>
            </tr>
            <tr v-for="version in versions" :key="version.versionId" @click="viewVersionReport(version)" class="version-row">
              <td>Version {{ version.versionNumber }}</td>
              <td>{{ formatDate(version.uploadDate) }}</td>
              <td>{{ formatDate(version.lastAnalyzed) }}</td>
              <td>
                <span :class="{ 'score-pending': version.deepViewScore === null }">
                  {{ formatScore(version.deepViewScore) }}
                </span>
              </td>
              <td>
                 <div class="action-buttons">
                    <button @click.stop="viewVersionReport(version)" class="btn btn-sm btn-icon" title="View Report">
                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-text" viewBox="0 0 16 16">
                         <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5.5 9a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM5.5 11a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z"/>
                         <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z"/>
                       </svg>
                    </button>
                    <!-- Add other version-specific actions here if needed (e.g., delete version) -->
                 </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.versions-container {
  margin-top: var(--emininity-spacing-xl);
  margin-bottom: var(--emininity-spacing-xl);
}

.versions-header {
  margin-bottom: var(--emininity-spacing-lg);
}

.versions-header h1 {
  margin-bottom: 0;
}

.table-responsive {
  overflow-x: auto;
}

/* Use global table styles */
.table {
  vertical-align: middle;
}

.table th,
.table td {
  padding: var(--emininity-spacing-md);
  white-space: nowrap;
}

.table thead th {
  font-weight: var(--emininity-font-weight-medium);
  color: var(--emininity-text-secondary);
  font-size: 0.9rem;
}

.table tbody tr {
  transition: background-color 0.15s ease-in-out;
}

.table-hover tbody tr:hover {
  background-color: var(--emininity-bg-secondary);
}

.version-row {
  cursor: pointer;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: var(--emininity-spacing-sm);
}

/* Use global icon button styles */
.btn.btn-sm {
  font-size: 0.875rem;
  line-height: 1;
}

.btn.btn-icon {
  padding: var(--emininity-spacing-sm);
  border: 1px solid transparent;
  background-color: transparent;
  color: var(--emininity-text-secondary);
}
.btn.btn-icon:hover {
  background-color: var(--emininity-bg-secondary);
  color: var(--emininity-text-primary);
}
.btn.btn-icon:focus {
   box-shadow: 0 0 0 0.2rem var(--emininity-focus-ring-color);
   border-color: transparent;
}

.score-pending {
  color: var(--emininity-text-secondary);
  font-style: italic;
}

.alert-danger {
  color: var(--emininity-danger-color);
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  padding: var(--emininity-spacing-md);
  border-radius: var(--emininity-border-radius);
}
</style>
