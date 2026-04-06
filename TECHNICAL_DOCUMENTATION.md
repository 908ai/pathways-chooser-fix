# Energy Navigator Technical Documentation

## 1. Overview

*   **Application Name:** Energy Navigator
*   **Main Purpose:** A comprehensive digital platform designed to streamline compliance with the National Building Code of Canada (NBC) Section 9.36 Energy Efficiency requirements for residential buildings in Alberta and Saskatchewan.
*   **Problem It Solves:** Simplifies the complex process of selecting, calculating, and submitting energy compliance pathways (Prescriptive, Performance, Tiered) which traditionally involves significant manual calculation and fragmented documentation.
*   **Target Audience:** Builders, Developers, Energy Advisors, Building Officials, and Municipalities.
*   **Key Features:**
    *   **Pathway Selector:** Interactive tool to determine the most cost-effective compliance path (9.36.2, 9.36.5, 9.36.7, or 9.36.8).
    *   **Technical Calculator:** Real-time point calculation for tiered prescriptive paths and specification gathering for performance modeling.
    *   **Project Management:** Dashboard for tracking project status, history, and documentation.
    *   **Multi-Role Access:** Dedicated interfaces for Applicants, Service Providers (Energy Advisors), Admins, and Municipal Officials.
    *   **Compliance Verification:** Automated checks against NBC 9.36 standards.
    *   **File Management:** Integrated document upload and storage system.

---

## 2. System Architecture

The application follows a modern **Serverless Web Architecture** leveraging a High-Performance Frontend and a Backend-as-a-Service (BaaS) model.

*   **Architecture Type:** Client-Server (Decoupled)
*   **Frontend:** Single Page Application (SPA) built with React and TypeScript. It handles all UI logic, client-side routing, and real-time calculations.
*   **Backend (Supabase):**
    *   **Authentication:** Managed via Supabase Auth (JWT-based).
    *   **Database:** PostgreSQL with Row Level Security (RLS) for data isolation.
    *   **Storage:** Supabase Storage for project documents and assets.
    *   **Edge Functions:** Deno-based serverless functions for side effects like PDF generation and email notifications.
*   **External Integrations:**
    *   **Dropbox API:** (Optional) Used for external file backup and organization via Edge Functions.
    *   **Resend/SendGrid:** (Inferred) For transactional email delivery.

---

## 3. Project Structure

The project is organized into a modular directory structure promoting clear separation of concerns:

*   **`src/`**: Primary application source code.
    *   **`components/`**: Reusable UI components.
        *   **`ui/`**: Atomic components (shadcn/ui) like buttons, inputs, cards.
        *   **`NBCCalculator/`**: Complex logic and sub-sections for the NBC 9.36 tool.
        *   **`admin/` / `municipal/` / `dashboard/`**: Role-specific feature components.
    *   **`hooks/`**: Custom React hooks for state management (e.g., `useAuth`, `useNBCCalculator`).
    *   **`pages/`**: Top-level route components representing different views.
    *   **`lib/`**: Utility functions, constants, and business logic (e.g., `complianceUtils.ts`).
    *   **`integrations/`**: Configuration for external services (Supabase client).
*   **`supabase/`**: Backend configuration.
    *   **`migrations/`**: SQL files defining the database schema and RLS policies.
    *   **`functions/`**: TypeScript Edge Functions for server-side logic.

**Design Patterns:**
*   **Component-Based Architecture:** Using React for modular, reusable UI.
*   **Hook-Based Logic:** Encapsulating complex state and side effects in custom hooks.
*   **Repository Pattern (Implicit):** Using Supabase client as the data access layer.
*   **Policy-Based Security:** Implementing RLS directly in the database for secure data access.

---

## 4. Environment Setup

### Requirements
*   **Node.js:** v18.x or higher
*   **npm/bun:** Package manager
*   **Supabase Account:** For database and authentication

### Installation
1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Variables:** Create a `.env` file with the following:
    ```env
    VITE_SUPABASE_URL=your_project_url
    VITE_SUPABASE_ANON_KEY=your_anon_key
    ```
4.  **Run Development Server:**
    ```bash
    npm run dev
    ```

---

## 5. Database

**Type:** PostgreSQL (Managed by Supabase)

### Core Schema (Simplified)
*   **`profiles`**: User profile information (extending Auth users).
*   **`project_summaries`**: The primary table storing all project data, technical specs, and compliance results.
*   **`user_roles`**: Maps users to roles (`admin`, `municipal`, `user`, `service_provider`).
*   **`project_events`**: Audit log of all actions taken on a project (comments, status changes).
*   **`feedback` & `feedback_responses`**: Internal support and communication system.
*   **`companies`**: Details about builder/developer organizations.

### Relationships
*   `project_summaries.user_id` -> `auth.users.id` (Many-to-One)
*   `project_events.project_id` -> `project_summaries.id` (Many-to-One)
*   `user_roles.user_id` -> `auth.users.id` (One-to-One)

---

## 6. API (Supabase Client)

The application communicates with the backend using the Supabase Auto-generated REST API and Edge Functions.

### Key Operations
*   **Fetch Projects:** `GET /rest/v1/project_summaries`
*   **Create Project:** `POST /rest/v1/project_summaries`
*   **PDF Generation:** `POST /functions/v1/generate-pdf`
    *   *Input:* `projectId`
    *   *Response:* PDF Binary or Download Link
*   **Auth:** Handled via `@supabase/supabase-js` library methods (`signInWithPassword`, `signUp`).

---

## 7. Main Workflows

1.  **Project Creation:** User enters basic project info (address, building type). A "Draft" project is created in the database.
2.  **Pathway Selection:** User answers climate and occupancy questions. System suggests paths based on NBC 9.36 rules.
3.  **Data Entry:** User fills technical specs. Real-time validation checks for missing required fields.
4.  **Submission:** User uploads mandatory docs (Building Plans, Window Schedule) and agrees to terms. Status moves to "Submitted".
5.  **Review:** Admin or Service Provider reviews the submission. They can request revisions (logging a `project_event`) or approve.
6.  **Approval:** Upon successful modeling/verification, the project is marked "Compliant".

---

## 8. Business Rules

*   **Regional Rules:** Climate zones are automatically assigned based on Province (AB vs SK) and City.
*   **Point Calculation (Tiered Prescriptive):** Points are awarded for exceeding base RSI/U-value requirements.
*   **Path Logic:** 
    *   Performance paths (9365/9367) require Energy Modeling.
    *   Prescriptive paths (9362/9368) rely on direct comparison to code minimums.
*   **Mandatory Fields:** Certain fields (e.g., Window U-Value) are mandatory for submission but optional during the "Draft" stage.

---

## 9. Testing

*   **Unit Testing:** (Recommended) Use Vitest for logic in `complianceUtils.ts` and `helpers.ts`.
*   **Integration Testing:** (Recommended) Playwright or Cypress for end-to-end user flows.
*   **Manual Verification:** Use the `MockEditor` and `TestUpload` pages for isolated component testing.

---

## 10. Deployment and Infrastructure

*   **Hosting:** Vercel (Frontend) & Supabase (Backend).
*   **CI/CD:** Automatic deployment on push to `main` branch via Vercel integration.
*   **PDF Engine:** Likely uses a library like `jspdf` or a Puppeteer-based service in Edge Functions.

---

## 11. Monitoring and Logging

*   **Client Side:** Errors are caught via standard React Error Boundaries.
*   **Server Side:** Supabase Logs (accessible via Supabase Dashboard) track SQL queries, Edge Function execution, and Auth events.
*   **Custom Logging:** The `project_events` table acts as a business-level log for all critical project lifecycle changes.

---

## 12. Security

*   **Row Level Security (RLS):** Every table has strict policies. Users can only see their own projects; Admins can see all.
*   **JWT Authentication:** All requests to Supabase are authenticated via JWT tokens stored in the client.
*   **Role-Based Access Control (RBAC):** UI elements and routes are guarded based on the `user_roles` table.
*   **Input Sanitization:** Data is sanitized before being saved to the database via `inputSanitizers.ts`.

---

## 13. Maintenance and Evolution

*   **Extending NBC Rules:** Update constants in `src/components/NBCCalculator/constants/options.ts` to reflect code updates.
*   **Coding Conventions:**
    *   Use functional components with hooks.
    *   Strict TypeScript typing for all props and data models.
    *   Tailwind CSS for all styling.
*   **Adding Pathways:** Follow the modular pattern in `src/components/NBCCalculator/sections/`.

---

## 14. FAQ / Common Issues

*   **Login Issues:** Ensure `SUPABASE_URL` and `KEY` are correctly set in the environment.
*   **File Upload Failures:** Check Supabase Storage bucket permissions and CORS settings.
*   **Missing Calculations:** Verify that all required thermal inputs (RSI/U-values) are valid numbers.

---

## 15. Contacts / Ownership

*   **Technical Lead:** Application Architect
*   **Product Owner:** Compliance Standards Manager
*   **Support:** Managed via the "My Feedback" system within the app.
