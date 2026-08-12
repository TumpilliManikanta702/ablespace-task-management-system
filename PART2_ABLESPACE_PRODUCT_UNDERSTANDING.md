# AbleSpace Product Understanding Submission

## 1. Feature Overview

The **"Take Data"** feature within AbleSpace is the primary data collection interface designed for special education professionals (Teachers, Speech-Language Pathologists, Occupational Therapists, and School Psychologists).

### Core Objectives:
- **IEP Goal Progress Tracking**: Record live trial data against specific Individualized Education Program (IEP) goals during active student sessions.
- **Trial & Behavior Recording**: Capture quantitative metrics (percentage accuracy, prompt hierarchies, frequency, duration, and interval data).
- **Compliance & Progress Reporting**: Persist session observations directly into automated progress reports and IEP compliance records.

---

## 2. Step-by-Step User Workflow

### Step 1 — Open Caseload
- Navigate to the **Caseload** tab from the left sidebar navigation menu (`CAPTURE` section).
- View the active caseload overview displaying all assigned students, groups, and unassigned metrics.

### Step 2 — Select Student
- Locate the target student row within the Caseload table (using global search `⌘+K` or table sorting).
- Review student metadata (IEP Due Date, Evaluation Due Date, Collaborators, Service Time).

### Step 3 — Click Take Data
- Click the prominent **"Take Data"** primary action button located in the rightmost `Actions` column of the student row.

### Step 4 — Record Data
- The student's data collection workspace opens, presenting active IEP goals categorized by domain (e.g., Speech & Language, Motor Skills, Behavioral).
- Use touch-friendly tally controls (`+` / `-`), trial prompt toggles (Independent, Verbal, Visual, Physical Assist), or duration timers to log active responses during session trials.

### Step 5 — Save
- Click **Save Session** to persist recorded trials to the database.
- A success toast notification confirms data persistence, immediately updating student analytical progress graphs.

---

## 3. UI/UX Observations

| UI Aspect | Technical & Design Observation |
| :--- | :--- |
| **Navigation & Layout** | Dark sidebar (`bg-slate-900`) establishes clean visual separation from the main white table content area. Action buttons use high-contrast brand colors (`Take Data`) for instant recognition. |
| **Information Hierarchy** | Important compliance metrics (IEP Due Date, Eval Due Date) and collaborator avatar stacks are displayed directly alongside student names prior to data entry. |
| **Controls & Inputs** | Tally controls feature minimum 44x44px touch target zones optimized for rapid iPad/tablet tapping during live student instruction. |
| **Data Visibility** | Displays baseline stats alongside current target percentages, providing educators with immediate progress context during data logging. |
| **Feedback Mechanics** | Visual micro-feedback (haptic or subtle button state color changes) confirms each trial without disrupting session workflow. |

---

## 4. Key UX Strengths

1. **Classroom Speed & Efficiency**: Direct tap-to-tally controls eliminate administrative friction during live classroom sessions.
2. **Contextual IEP Clarity**: Displaying goal definitions and prompt levels directly within the entry drawer removes the need to switch tabs or open paper IEP binders.
3. **Multi-Disciplinary Standard**: Standardized prompt hierarchies enforce consistent data collection across OTs, SLPs, and Special Ed teachers.

---

## 5. Improvements

- **Offline Sync & Resilience**: Add an offline ServiceWorker buffer (IndexedDB) with an explicit sync status indicator (`"Saved locally - Syncing when online"`).
- **Group Session Mode**: Introduce multi-student split-column tracking allowing therapists to take data for 2-4 students simultaneously during group sessions.
- **Global Quick-Access (`⌘+K`)**: Enable a global shortcut trigger to launch a "Take Data" session from any page in AbleSpace.
- **Voice-Assisted Data Entry**: Implement hands-free voice commands (e.g., *"Alex trial 1 correct independent"*) for therapists holding physical materials.

---

## 6. Prioritization Matrix

| Priority | Improvement | Expected Impact | Rationale |
| :--- | :--- | :--- | :--- |
| **High** | **Offline Data Resilience** | Critical | Prevents data loss during school Wi-Fi drops, safeguarding legally mandated IEP compliance records. |
| **High** | **Group Session Mode** | High | Therapists conduct over 60% of sessions in small groups; multi-student tracking drastically reduces administrative overhead. |
| **Medium** | **Global Quick Access** | Medium | Accelerates navigation for educators managing large student caseloads. |
| **Low** | **Voice-Assisted Entry** | Medium/Low | Enhances hands-free accessibility during physical therapy sessions. |
