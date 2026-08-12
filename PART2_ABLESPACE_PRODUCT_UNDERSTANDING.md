# AbleSpace Product Understanding Submission

## 1. Feature Overview

The **"Take Data"** feature within AbleSpace is the primary data-collection interface designed for special education professionals, including Teachers, Speech-Language Pathologists, Occupational Therapists, and School Psychologists.

### Core Objectives

- **IEP Goal Progress Tracking**: Record live trial data against specific Individualized Education Program (IEP) goals during active student sessions.
- **Trial & Behavior Recording**: Capture quantitative metrics such as percentage accuracy, prompt levels, frequency, duration, and interval data.
- **Compliance & Progress Reporting**: Persist session observations so they can contribute to progress tracking and reporting.

---

## 2. Step-by-Step User Workflow

### Step 1 — Open Caseload

Navigate to the **Caseload** tab from the left sidebar under the `CAPTURE` section. The Caseload screen provides an overview of assigned students, groups, and unassigned students.

![AbleSpace Caseload screen](./caseload_take_data.png)

*Figure 1: AbleSpace Caseload screen showing the student list and the "Take Data" action available for each student.*

### Step 2 — Select Student

Locate the target student in the Caseload table using search or filtering. Review relevant student information such as IEP Due Date, Evaluation Due Date, Collaborators, Service Time, and School.

### Step 3 — Click Take Data

Click the primary blue **"Take Data"** action in the `Actions` column of the selected student's row.

### Step 4 — Record Data

The data-collection workflow allows the educator to record observations against the student's active goals using the available data-entry controls.

### Step 5 — Save

Save the recorded session observations so that the collected data is persisted and can be used for progress tracking and reporting.

---

## 3. UI/UX Observations

| UI Aspect | Technical & Design Observation |
|---|---|
| **Navigation & Layout** | The dark sidebar clearly separates the main navigation from the student data area. The blue **Take Data** action provides strong visual emphasis for the primary workflow. |
| **Information Hierarchy** | IEP Due Date, Evaluation Due Date, collaborators, service time, and school information are visible before entering the data-collection workflow. |
| **Controls & Inputs** | The data-entry controls are designed for quick interaction during live sessions, reducing the number of steps required to record observations. |
| **Data Visibility** | Relevant student and goal information is presented in context so educators can make data-entry decisions without unnecessary navigation. |
| **Feedback Mechanics** | Clear visual states and confirmation feedback can help users understand whether their data has been recorded successfully. |

---

## 4. Key UX Strengths

- **Classroom Speed & Efficiency** — The direct **Take Data** action provides quick access to the data-collection workflow.
- **Contextual Clarity** — Keeping student and goal-related information close to the data-entry workflow reduces unnecessary navigation.
- **Structured Data Collection** — Standardized data-entry methods can help maintain consistency across different professionals and sessions.

---

## 5. Improvements

### 1. Offline Data Resilience

Add an offline Service Worker/IndexedDB buffer with an explicit sync status indicator to handle unreliable school connectivity and reduce the risk of losing session data.

### 2. Group Session Mode

Introduce multi-student tracking to reduce repetitive navigation when professionals work with multiple students during group sessions.

### 3. Global Quick Access

Provide a global shortcut such as `⌘+K` to accelerate access to the Take Data workflow for users managing larger caseloads.

### 4. Voice-Assisted Data Entry

Provide optional hands-free interaction for accessibility and convenience, while considering privacy, accuracy, and user consent requirements.

---

## 6. Prioritization Matrix

| Priority | Improvement | Expected Impact | Rationale |
|---|---|---|---|
| **High** | **Offline Data Resilience** | Critical | Prevents data loss when connectivity is unreliable during classroom sessions. |
| **High** | **Group Session Mode** | High | Could reduce repetitive navigation when professionals work with multiple students in a group session. |
| **Medium** | **Global Quick Access** | Medium | Could accelerate access to the Take Data workflow for users managing larger caseloads. |
| **Low** | **Voice-Assisted Data Entry** | Medium/Low | Could provide hands-free interaction, although it would require additional accessibility, privacy, and accuracy considerations. |
