<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'; // Import the shared layout
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const props = defineProps<{ id: string }>(); // Get deck ID from route params

// --- Mock Data ---
interface ReportData {
  deckId: string;
  companyName: string;
  websiteUrl?: string;
  industry?: string;
  shortDescription?: string;
  deepViewScore: number;
  strengths: string[];
  risks: string[];
  signalBreakdown: { name: string; value: string | number; confidence: number; explanation: string }[];
  benchmarkingData?: any; // Placeholder for chart data
  roleContextPrompt?: string; // Founder vs Investor specific text
}

const reportData = ref<ReportData | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// Mock role (replace with actual role from auth state)
const userRole = computed(() => sessionStorage.getItem('userRole') || 'User');

const fetchReportData = async (deckId: string) => {
  loading.value = true;
  error.value = null;
  console.log(`Fetching report data for deck ID: ${deckId}`);

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // --- Mock Data Generation ---
    // In a real app, this would be an API response based on deckId
    const mockReports: { [key: string]: ReportData } = {
      'deck123': {
        deckId: 'deck123',
        companyName: 'Innovatech Solutions',
        websiteUrl: 'https://innovatech.example.com',
        industry: 'SaaS',
        shortDescription: 'AI-driven platform for optimizing cloud infrastructure.',
        deepViewScore: 85,
        strengths: [
          'Strong market validation with early adopters.',
          'Experienced founding team with relevant domain expertise.',
          'Clear value proposition and differentiation.',
          'Scalable technology stack.',
        ],
        risks: [
          'High dependency on a single cloud provider.',
          'Potential challenges in customer acquisition cost.',
          'Competitive landscape evolving rapidly.',
        ],
        signalBreakdown: [
          { name: 'Market Size (TAM)', value: '$5B+', confidence: 95, explanation: 'Total Addressable Market estimated based on industry reports and projected growth.' },
          { name: 'Team Experience', value: 'High', confidence: 90, explanation: 'Founders have combined 30+ years in the relevant industry.' },
          { name: 'Traction', value: 'Early Revenue', confidence: 80, explanation: 'Generated $50k in pilot programs.' },
          { name: 'Product Differentiation', value: 'Moderate', confidence: 75, explanation: 'Unique AI algorithms but similar solutions exist.' },
        ],
        roleContextPrompt: userRole.value === 'Admin' || userRole.value === 'Investor'
          ? 'Investor Focus: Assess market potential and team strength against investment criteria.'
          : 'Founder Focus: Leverage identified strengths and address risks to refine strategy.',
      },
       'deck456': {
        deckId: 'deck456',
        companyName: 'Synergy Dynamics',
        websiteUrl: 'https://synergy.example.com',
        industry: 'FinTech',
        shortDescription: 'Blockchain platform for secure cross-border payments.',
        deepViewScore: 72,
        strengths: [
          'Innovative use of blockchain technology.',
          'Potential for significant cost savings for users.',
          'Strategic partnerships initiated.',
        ],
        risks: [
          'Regulatory uncertainty in key markets.',
          'Scalability concerns with current blockchain protocol.',
          'Requires significant user adoption to achieve network effects.',
        ],
        signalBreakdown: [
           { name: 'Regulatory Compliance', value: 'Medium Risk', confidence: 60, explanation: 'Navigating complex regulations in multiple jurisdictions.' },
           { name: 'Technology Scalability', value: 'Needs Validation', confidence: 65, explanation: 'Current protocol tested up to 100 TPS, needs further scaling.' },
           { name: 'Competitive Advantage', value: 'High', confidence: 85, explanation: 'Proprietary consensus mechanism offers lower fees.' },
        ],
         roleContextPrompt: userRole.value === 'Admin' || userRole.value === 'Investor'
          ? 'Investor Focus: Evaluate regulatory risks and scalability potential.'
          : 'Founder Focus: Prioritize addressing scalability and regulatory hurdles.',
      },
      // Add more mock reports as needed...
      'deck789': { // Example for a deck not yet analyzed
        deckId: 'deck789',
        companyName: 'Quantum Leap Inc.',
        deepViewScore: 0, // Or handle null score explicitly
        strengths: [],
        risks: [],
        signalBreakdown: [],
        shortDescription: 'Analysis pending...',
      }
    };

    const data = mockReports[deckId];

    if (data) {
      // Simulate score being null if analysis wasn't "complete"
      if (deckId === 'deck789') {
         reportData.value = { ...data, deepViewScore: 0 }; // Use 0 or a specific state
      } else {
         reportData.value = data;
      }
    } else {
      throw new Error('Report not found');
    }
  } catch (err: any) {
    console.error("Failed to fetch report data:", err);
    error.value = err.message || 'Failed to load report data.';
    reportData.value = null;
  } finally {
    loading.value = false;
  }
};

// Function to determine CSS class based on score
const getScoreClass = (score: number): string => {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
};

onMounted(() => {
  fetchReportData(props.id);
});

</script>

<template>
  <AppLayout :show-back-button="true">
    <div class="container report-container">
      <div v-if="loading" class="text-center p-5">
        <p>Loading report...</p>
        <!-- Add spinner here -->
      </div>
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <div v-else-if="reportData">
        <!-- Report Header -->
        <div class="report-header mb-4">
          <h1>{{ reportData.companyName }} - DeepView Report</h1>
          <div v-if="reportData.roleContextPrompt" class="role-prompt">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle me-2" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.064.293.006.399.287.47l.45.082.082.38-.29.287-.082.38.29.287.082.38.29.287.082.38.29.287.082.38c.09.09.27.198.52.198.25 0 .43-.108.52-.198l.082-.38.29-.287.082-.38.29-.287.082-.38.29-.287.082-.38c.064-.293 0-.399-.287-.47l-.45-.082-.082-.38.738-3.468c.064-.293 0-.399-.288-.469l-.45-.083-.082-.38.29-.287-.082-.38zM8 4.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
            </svg>
            {{ reportData.roleContextPrompt }}
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="report-grid">
          <!-- Left Column -->
          <div class="report-column">
            <!-- DeepView Score -->
            <div class="card score-card mb-4">
              <div class="card-body text-center">
                <h5 class="card-title text-secondary">DeepView Score</h5>
                 <p v-if="reportData.deepViewScore === 0 && props.id === 'deck789'" class="score-value pending">
                   Analysis Pending
                 </p>
                 <p v-else class="score-value" :class="getScoreClass(reportData.deepViewScore)">
                   {{ reportData.deepViewScore }}<span class="score-suffix">%</span>
                 </p>
                <div class="score-tooltip" title="Overall assessment based on key signals. Higher is better.">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.11.248-.247V5.786h.114c.137 0 .247-.11.247-.247v-.172c0-.137-.11-.247-.247-.247h-.114v-.114c0-.137-.11-.247-.247-.247h-.825c-.138 0-.248.11-.248.247v.114h-.114c-.137 0-.247.11-.247.247v.172c0 .137.11.247.247.247h.114zM8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Company Details -->
            <div class="card details-card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Company Details</h5>
              </div>
              <div class="card-body">
                <p v-if="reportData.websiteUrl"><strong>Website:</strong> <a :href="reportData.websiteUrl" target="_blank" rel="noopener noreferrer">{{ reportData.websiteUrl }}</a></p>
                <p v-if="reportData.industry"><strong>Industry:</strong> {{ reportData.industry }}</p>
                <p v-if="reportData.shortDescription"><strong>Description:</strong> {{ reportData.shortDescription }}</p>
                 <p v-if="!reportData.websiteUrl && !reportData.industry && !reportData.shortDescription" class="text-secondary">
                   No additional details available.
                 </p>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="report-column">
            <!-- Strengths -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Identified Strengths</h5>
              </div>
              <div class="card-body">
                <ul v-if="reportData.strengths.length > 0" class="list-styled">
                  <li v-for="(strength, index) in reportData.strengths" :key="`strength-${index}`">{{ strength }}</li>
                </ul>
                <p v-else class="text-secondary">No significant strengths identified or analysis pending.</p>
              </div>
            </div>

            <!-- Risks / Gaps -->
            <div class="card mb-4">
              <div class="card-header">
                <h5 class="card-title mb-0">Identified Risks / Gaps</h5>
              </div>
              <div class="card-body">
                <ul v-if="reportData.risks.length > 0" class="list-styled">
                  <li v-for="(risk, index) in reportData.risks" :key="`risk-${index}`">{{ risk }}</li>
                </ul>
                 <p v-else class="text-secondary">No significant risks identified or analysis pending.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Full Width Sections -->
        <!-- Signal Dimension Breakdown -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Signal Dimension Breakdown</h5>
          </div>
          <div class="card-body">
            <div v-if="reportData.signalBreakdown.length > 0" class="table-responsive">
              <table class="table signal-table">
                <thead>
                  <tr>
                    <th>Signal Name</th>
                    <th>Value / Assessment</th>
                    <th>Confidence</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(signal, index) in reportData.signalBreakdown" :key="`signal-${index}`">
                    <td>
                      {{ signal.name }}
                      <span class="tooltip-icon" :title="signal.explanation">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16">
                          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                          <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.064.293.006.399.287.47l.45.082.082.38-.29.287-.082.38.29.287.082.38.29.287.082.38.29.287.082.38c.09.09.27.198.52.198.25 0 .43-.108.52-.198l.082-.38.29-.287.082-.38.29-.287.082-.38.29-.287.082-.38c.064-.293 0-.399-.287-.47l-.45-.082-.082-.38.738-3.468c.064-.293 0-.399-.288-.469l-.45-.083-.082-.38.29-.287-.082-.38zM8 4.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                        </svg>
                      </span>
                    </td>
                    <td>{{ signal.value }}</td>
                    <td>{{ signal.confidence }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
             <p v-else class="text-secondary">Signal breakdown not available or analysis pending.</p>
          </div>
        </div>

        <!-- Benchmarking Visualization (Placeholder) -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="card-title mb-0">Benchmarking</h5>
          </div>
          <div class="card-body">
            <p class="text-secondary">Benchmarking visualization will be displayed here. (Not Implemented)</p>
            <!-- Placeholder for chart component -->
          </div>
        </div>

      </div>
      <div v-else class="text-center p-5 text-secondary">
        Report data could not be loaded or is unavailable.
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.report-container {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.report-header {
  border-bottom: 1px solid var(--emininity-border-color);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.report-header h1 {
  font-size: 1.75rem; /* Slightly smaller H1 for report */
  margin-bottom: 0.5rem;
}

.role-prompt {
  font-size: 0.9rem;
  color: var(--emininity-text-secondary);
  background-color: var(--emininity-bg-secondary);
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  display: inline-flex; /* Use inline-flex */
  align-items: center;
}

.report-grid {
  display: grid;
  grid-template-columns: 1fr; /* Single column by default */
  gap: 1.5rem;
}

@media (min-width: 992px) { /* Two columns on larger screens */
  .report-grid {
    grid-template-columns: 1fr 2fr; /* Example: 1/3 for score/details, 2/3 for lists */
  }
}

.report-column {
  display: flex;
  flex-direction: column;
}

.card {
  border: 1px solid var(--emininity-border-color);
  border-radius: 0.375rem;
  background-color: var(--emininity-bg-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.card-header {
  background-color: var(--emininity-bg-secondary);
  padding: 0.75rem 1.25rem;
  border-bottom: 1px solid var(--emininity-border-color);
}

.card-header .card-title {
  font-size: 1.1rem;
  font-weight: 600;
}

.card-body {
  padding: 1.25rem;
}

.score-card .card-body {
  position: relative; /* For tooltip positioning */
}

.score-value {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  line-height: 1;
  color: var(--emininity-text-primary); /* Default color */
}

.score-value.high { color: #198754; } /* Green for high scores */
.score-value.medium { color: #ffc107; } /* Yellow for medium scores */
.score-value.low { color: var(--emininity-danger-color); } /* Red for low scores */
.score-value.pending {
  font-size: 1.5rem; /* Smaller font size for pending text */
  font-weight: 500;
  color: var(--emininity-text-secondary);
}


.score-suffix {
  font-size: 1.5rem;
  font-weight: 500;
  margin-left: 0.25rem;
  vertical-align: baseline;
}

.score-tooltip {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  cursor: help;
  color: var(--emininity-text-secondary);
}

.details-card p {
  margin-bottom: 0.5rem;
}
.details-card p:last-child {
  margin-bottom: 0;
}
.details-card strong {
  color: var(--emininity-text-primary);
}

.list-styled {
  padding-left: 1.5rem; /* Indent list items */
  margin-bottom: 0;
}

.list-styled li {
  margin-bottom: 0.5rem;
}

.signal-table {
  width: 100%;
  margin-bottom: 0; /* Remove default table margin */
}

.signal-table th,
.signal-table td {
  padding: 0.6rem 0.75rem;
  vertical-align: middle;
  border-top: 1px solid var(--emininity-border-color);
}
.signal-table thead th {
  font-weight: 600;
  color: var(--emininity-text-secondary);
  border-bottom: 2px solid var(--emininity-border-color);
  text-align: left;
}
.signal-table tbody tr:first-child td {
  border-top: none; /* Remove top border for the first row */
}

.tooltip-icon {
  cursor: help;
  margin-left: 0.3rem;
  color: var(--emininity-text-secondary);
  vertical-align: middle;
}

.alert-danger {
  color: var(--emininity-danger-color);
  background-color: #f8d7da;
  border-color: #f5c2c7;
  padding: 1rem 1.25rem;
  border-radius: 0.25rem;
}
</style>
