# Test Flow for 44 Frames Real Estate Demo

## Prerequisites
- Node.js 18+ installed
- All dependencies installed (`npm install`)
- Development server running (`npm run dev`)

## Test Flow Steps

### 1. Landing Page (/) - Intake
- [ ] Open http://localhost:3000
- [ ] Verify hero section displays "Paste Zillow/Redfin URL" and "Upload Photos"
- [ ] Test URL input with valid Zillow URL (e.g., https://www.zillow.com/homedetails/123-Main-St-New-York-NY-10001/12345678_zpid/)
- [ ] Verify toast notification "Scraping started..." appears
- [ ] Verify redirect to /gallery after successful scrape
- [ ] Test file upload by dragging/dropping files
- [ ] Verify redirect to /gallery after upload

### 2. Gallery Page (/gallery) - Photo Selection
- [ ] Verify photos from listing are displayed in grid
- [ ] Test multi-select functionality (click multiple photos)
- [ ] Test "Select All" button
- [ ] Test filter chips (Interior/Exterior, Horizontal/Vertical)
- [ ] Click on individual photo to open ImageDrawer
- [ ] Verify ImageDrawer shows photo details
- [ ] Test "Apply Preset" button (should navigate to /prompt)
- [ ] Test "Open Prompt Composer" button (should navigate to /prompt)

### 3. Prompt Page (/prompt) - Preset & Prompt Configuration
- [ ] Verify preset cards are displayed
- [ ] Test preset selection (should update suggested prompt)
- [ ] Test prompt textarea editing
- [ ] Test "Generate variations" buttons (1, 2, 3)
- [ ] Verify prompt variations are generated with diff highlighting
- [ ] Test "Save as preset" functionality
- [ ] Test "Generate N clips" button
- [ ] Verify jobs are created and redirect to /generate

### 4. Generate Page (/generate) - Job Processing
- [ ] Verify job list displays with status indicators
- [ ] Check progress bar shows overall generation progress
- [ ] Verify jobs transition from "Queued" → "Running" → "Succeeded/NeedsWork/Failed"
- [ ] Test concurrency limit (should show max 8 running)
- [ ] Wait for jobs to complete
- [ ] Verify toast notifications for job completion
- [ ] Test navigation to review page

### 5. Review Page (/review) - Clip Review & Decisions
- [ ] Verify tabs: All, Approved, Needs Work, Failed
- [ ] Test filtering by status
- [ ] For each job, test action buttons:
  - [ ] Approve (should mark as approved)
  - [ ] Revise (should create revision job)
  - [ ] Delete (should mark as deleted)
- [ ] Test A/B comparison modal for revisions
- [ ] Verify review decisions persist after page refresh

### 6. Export Page (/export) - Download & Manifest
- [ ] Verify export statistics are displayed
- [ ] Test "Download ZIP" button (should download ZIP file)
- [ ] Test "Download CSV manifest" button (should download CSV file)
- [ ] Verify filename schema is displayed
- [ ] Check downloaded files contain expected data

### 7. Billing Page (/billing) - Subscription Status
- [ ] Verify subscription plan details are displayed
- [ ] Check "Active/Inactive" badge status
- [ ] Verify "Manage plan" button is disabled (cosmetic only)

### 8. Navigation & Persistence
- [ ] Test TopNav step highlighting
- [ ] Test "Reset Demo" button functionality
- [ ] Verify localStorage persistence across page refreshes
- [ ] Test browser back/forward navigation

### 9. Responsive Design
- [ ] Test on different screen sizes
- [ ] Verify mobile-friendly interactions
- [ ] Check Tailwind responsive classes work correctly

## Expected Behaviors
- All pages should load without errors
- State should persist in localStorage
- Mock data should be realistic and varied
- Job processing should simulate real-world timing
- Export functionality should work client-side
- Toast notifications should appear appropriately
- Navigation should be smooth and intuitive

## Common Issues to Check
- TypeScript compilation errors
- ESLint warnings/errors
- Console errors in browser dev tools
- Missing dependencies
- Incorrect import paths
- State management issues
- Responsive design breakpoints
