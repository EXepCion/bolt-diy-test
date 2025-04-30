<script setup lang="ts">
import AppLayout from '../layouts/AppLayout.vue'; // Import the shared layout
import { ref } from 'vue';

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isDragging = ref(false);
const uploadProgress = ref<number | null>(null); // null, 0-100
const uploadStatus = ref<'idle' | 'uploading' | 'success' | 'error'>('idle');
const errorMessage = ref('');

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0]);
  }
};

const processFile = (file: File) => {
  errorMessage.value = '';
  uploadStatus.value = 'idle';
  uploadProgress.value = null;

  // Basic Validation (PDF only, size limit example: 10MB)
  if (file.type !== 'application/pdf') {
    errorMessage.value = 'Invalid file type. Only PDF files are accepted.';
    selectedFile.value = null;
    return;
  }
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    errorMessage.value = `File is too large. Maximum size is ${maxSize / 1024 / 1024} MB.`;
    selectedFile.value = null;
    return;
  }

  selectedFile.value = file;
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const clearSelection = () => {
  selectedFile.value = null;
  uploadStatus.value = 'idle';
  uploadProgress.value = null;
  errorMessage.value = '';
  if (fileInput.value) {
    fileInput.value.value = ''; // Reset file input
  }
};

const handleSubmit = () => {
  if (!selectedFile.value) return;

  uploadStatus.value = 'uploading';
  uploadProgress.value = 0;
  errorMessage.value = '';

  // --- Mock Upload ---
  console.log('Simulating upload for:', selectedFile.value.name);
  const interval = setInterval(() => {
    if (uploadProgress.value === null) uploadProgress.value = 0; // Should not happen here, but safe check
    uploadProgress.value += 10;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      uploadProgress.value = 100;
      // Simulate success/error randomly for demo
      if (Math.random() > 0.2) { // 80% chance of success
        uploadStatus.value = 'success';
        console.log('Mock upload successful!');
        // Optionally clear selection after a delay or redirect
        // setTimeout(clearSelection, 3000);
      } else {
        uploadStatus.value = 'error';
        errorMessage.value = 'An error occurred during upload. Please try again.';
        console.error('Mock upload failed!');
        uploadProgress.value = null; // Reset progress on error
      }
    }
  }, 200); // Simulate progress update every 200ms
};

</script>

<template>
  <AppLayout>
    <div class="container upload-container">
      <h1 class="mb-4">Upload Pitch Deck</h1>
      <p class="text-secondary mb-4">Upload your pitch deck in PDF format for analysis.</p>

      <div class="card">
        <div class="card-body">
          <div
            class="drop-zone"
            :class="{ 'is-dragging': isDragging }"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input
              ref="fileInput"
              type="file"
              @change="handleFileChange"
              accept="application/pdf"
              hidden
            />
            <div v-if="!selectedFile && uploadStatus !== 'success'" class="drop-zone-prompt">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-cloud-arrow-up mb-3 text-secondary" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z"/>
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.021-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
              </svg>
              <p>Drag & drop your PDF here</p>
              <p class="text-secondary">or click to select file</p>
              <p class="text-secondary small mt-2">Max file size: 10MB</p>
            </div>

            <div v-if="selectedFile && uploadStatus !== 'success'" class="file-info">
              <p><strong>Selected:</strong> {{ selectedFile.name }}</p>
              <p class="text-secondary small">{{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB</p>
              <button @click.stop="clearSelection" class="btn btn-sm btn-outline-secondary mt-2">Change File</button>
            </div>

             <div v-if="uploadStatus === 'success'" class="upload-success text-center">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-check-circle-fill mb-3 text-success" viewBox="0 0 16 16">
                 <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
               </svg>
               <h4>Upload Successful!</h4>
               <p class="text-secondary">Your deck "{{ selectedFile?.name }}" has been uploaded.</p>
               <button @click.stop="clearSelection" class="btn btn-outline-secondary mt-3">Upload Another File</button>
             </div>
          </div>

          <div v-if="uploadStatus === 'uploading'" class="progress mt-3">
            <div
              class="progress-bar"
              role="progressbar"
              :style="{ width: uploadProgress + '%' }"
              :aria-valuenow="uploadProgress ?? 0"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {{ uploadProgress }}%
            </div>
          </div>

          <div v-if="errorMessage" class="alert alert-danger mt-3">
            {{ errorMessage }}
          </div>

          <div class="mt-4 text-center" v-if="selectedFile && uploadStatus !== 'uploading' && uploadStatus !== 'success'">
            <button
              @click="handleSubmit"
              class="btn primary"
              :disabled="uploadStatus === 'uploading'"
            >
              {{ uploadStatus === 'uploading' ? 'Uploading...' : 'Start Analysis' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.upload-container {
  max-width: 800px; /* Limit width for better readability */
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.drop-zone {
  border: 2px dashed var(--emininity-border-color);
  border-radius: 0.375rem;
  padding: 3rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;
  background-color: var(--emininity-bg-secondary);
  min-height: 250px; /* Ensure minimum height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.drop-zone.is-dragging {
  border-color: var(--emininity-accent-color);
  background-color: #e7f0fe; /* Light blue background on drag */
}

.drop-zone:hover {
  border-color: darken(var(--emininity-border-color), 10%);
  background-color: #f1f3f5; /* Slightly darker background on hover */
}

.drop-zone-prompt p {
  margin-bottom: 0.5rem;
}

.file-info {
  margin-top: 1rem;
}

.file-info p {
  margin-bottom: 0.25rem;
}

.alert-danger {
  color: var(--emininity-danger-color);
  background-color: #f8d7da;
  border-color: #f5c2c7;
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
}

.progress {
  height: 1.25rem; /* Make progress bar slightly taller */
  background-color: var(--emininity-bg-secondary);
  border-radius: 0.25rem;
  overflow: hidden; /* Ensure inner bar respects border radius */
}

.progress-bar {
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  color: #fff;
  text-align: center;
  white-space: nowrap;
  background-color: var(--emininity-accent-color);
  transition: width .6s ease;
  font-size: 0.85rem;
}

.text-success {
  color: #198754; /* Bootstrap success green */
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
}

.btn.primary {
  padding: 0.5rem 1.5rem; /* Larger primary button */
  font-size: 1.1rem;
}
</style>
