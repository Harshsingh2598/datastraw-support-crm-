# 📧 Submission Email Template

**To:** `ozair.shaikh@datastraw.in`, `aryan.jaiswal@datastraw.in`  
**CC:** `talent@datastraw.in`  
**Subject:** Full-Stack Assignment Submission: Customer Support CRM System — Harsh Singh  

---

### Email Body (Copy & Paste):

Dear Ozair, Aryan, and the Datastraw Talent Team,

I am excited to submit my full-stack assignment for the **Customer Support Ticketing CRM System** ("OmniDesk CRM"). I built this project from scratch with a focus on production reliability, modern design aesthetics, and genuine utility for real-world support teams.

### 🔗 Project Deliverables
- **Live Deployed Application:** `https://datastraw-support-crm.onrender.com` *(Replace with your deployed URL)*
- **GitHub Repository:** `https://github.com/your-username/datastraw-support-crm` *(Replace with your GitHub URL)*
- **Demo Video Walkthrough (3-5 min):** `https://youtu.be/your-video-id` *(Replace with your YouTube/Loom link)*

---

### 1. Technical Approach & Architectural Decisions
- **Unified Full-Stack Architecture:** Built with Node.js/Express for the backend and React 18 (Vite + Tailwind CSS) on the frontend. The production Express server serves both the REST API (`/api/*`) and static client assets from a single port, eliminating CORS complications and enabling a reliable 1-click cloud deployment on Render.
- **Database Engine & Concurrency:** Utilized SQLite3 (`better-sqlite3`) with Write-Ahead Logging (`WAL`) mode and foreign key enforcement. All database queries use parameterized prepared statements to eliminate SQL injection vulnerabilities.
- **State Management & Filtering:** Designed a real-time debounce search engine supporting multi-attribute filtering across ticket IDs, customer names, emails, and descriptions with responsive KPI counters.

### 2. Standout Features & What I Am Most Proud Of
When reviewing the prompt's question — *"What is missing from a bare-bones CRM that a real support team handling hundreds of tickets a day actually needs?"* — I implemented four high-impact features:
1. **Dynamic SLA & Urgency Engine:** Auto-calculates SLA countdowns based on priority (`Urgent: 4h`, `High: 12h`, `Medium: 24h`) and flags tickets that are *Within SLA*, *At Risk*, or *Breached*.
2. **AI Support Copilot:** A one-click smart assistant that analyzes customer sentiment and issue context to generate empathetic, technically accurate draft replies for agents.
3. **Internal Team Notes vs. Public Replies:** Differentiates private internal engineering investigations (`is_internal = 1`) from customer-facing communications (`is_internal = 0`).
4. **Command Palette (`Ctrl + K`) & Quick Seeder:** Supercharged keyboard navigation and an instant demo seeder so evaluators never start with an empty database.

### 3. Challenges Faced & How I Overcame Them
- **Challenge:** Handling Express 5 wildcard routing changes with single-page application client fallback without intercepting API calls.  
  **Resolution:** Implemented clean middleware-based route resolution separating `/api/*` endpoints from SPA catch-all asset serving.
- **Challenge:** Maintaining sub-10ms response times for composite searches across multiple fields.  
  **Resolution:** Created composite SQLite database indexes on `tickets(status, created_at, ticket_id)` and optimized query builders.

### 4. Improvements with Additional Time
- **WebSockets / Server-Sent Events (SSE):** For multi-agent live collision detection (showing when another agent is actively viewing or typing in a ticket).
- **Email Inbound Webhook Integration:** Bi-directional sync connecting customer incoming emails directly to ticket threads via SendGrid or Postmark.
- **Granular RBAC:** Role-based permissions differentiating Admin, Team Lead, and Support Agent roles.

I have thoroughly documented the system architecture, database schema, and API specifications in the repository's `README.md`.

Thank you for the opportunity to complete this assessment. I look forward to your feedback and to discussing how my skills and problem-solving mindset can add value to the engineering team at Datastraw Technologies.

Warm regards,  
**Harsh Singh**  
Full-Stack Developer  
[Your Phone Number] | [Your LinkedIn URL] | [Your Portfolio/GitHub]
