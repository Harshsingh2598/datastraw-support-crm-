# 🎬 3–5 Minute Demo Video Walkthrough Script

> **Assignment:** Datastraw Hiring Assignment — Customer Support Ticketing CRM  
> **Target Duration:** 3 to 5 minutes  
> **Tools:** Loom (free), OBS Studio, or Windows Game Bar (`Win + G`)  

---

## ⏱️ Scene-by-Scene Script & Action Guide

### Part 1: Introduction & Architecture (0:00 – 0:45)
- **Screen:** Show the OmniDesk CRM home dashboard in Dark Mode.
- **What to say:**
  > *"Hi Datastraw team! My name is Harsh Singh, and this is OmniDesk CRM — a full-stack Customer Support Management System built from scratch for the Datastraw hiring assessment.*
  >
  > *For the architecture, I chose a Node.js and Express REST API backend paired with SQLite for fast, zero-configuration persistent storage, and a React 18 frontend powered by Vite and Tailwind CSS.*
  >
  > *To ensure rock-solid production deployment, the entire application is bundled into a single-service architecture where Express serves both the REST endpoints and the optimized static React assets, allowing 1-click zero-CORS deployment on Render."*

---

### Part 2: Core Features Demo (0:45 – 2:00)
- **Action 1: Listing & Executive KPI Cards**
  > *"On the dashboard, we see a clean, modern list displaying Ticket IDs, Customer Names, Subject, Status, Priority, and relative timestamps. At the top, we have real-time KPI counters for Total, Open, In Progress, and Resolved tickets. Clicking any KPI card instantly filters the list."*
  *(Click on 'Open', then 'In Progress', then back to 'All' to show smooth filtering).*

- **Action 2: Live Search & Multi-criteria Filtering**
  > *"Our search engine works in real-time as you type. I can search across ticket IDs like `TKT-1001`, customer names like `Sarah`, or keywords like `webhook` or `duplicate`. We can also refine tickets by priority and category simultaneously."*
  *(Type in `Sarah`, clear it, select `Technical` category).*

- **Action 3: Creating a New Ticket**
  > *"Let's create a new ticket. I can click 'New Ticket' or press the keyboard shortcut 'N'. Let's enter a customer name, email, subject, set priority to Urgent, and add a description. Notice the auto-generated sequential ticket ID and instant validation."*
  *(Submit the form, show the toast notification, and point out the newly created ticket appearing at the top of the list).*

---

### Part 3: View, Update & Standout Features (2:00 – 3:30)
- **Action 4: Slide-over Detail Dossier & Activity Log**
  > *"Clicking on any ticket opens the comprehensive detail drawer. Here we see the customer profile with one-click email copying, the full issue description, and a chronological activity timeline.*
  >
  > *When thinking about what a real enterprise support team needs, two major problems stood out: SLA compliance and agent response fatigue."*

- **Action 5: Standout Feature 1 — Real-time SLA Urgency Tracking**
  > *"First, real support teams operate under strict SLAs. OmniDesk calculates automated SLA countdowns based on ticket priority: 4 hours for Urgent, 12 for High, 24 for Medium. Tickets show visual indicators whether they are Within SLA, At Risk, or Breached."*

- **Action 6: Standout Feature 2 — AI Support Copilot & Canned Templates**
  > *"Second, Tier-1 agents spend hours writing repetitive customer greetings and structural replies. I built an AI Support Copilot. By clicking 'AI Copilot Reply', the system analyzes the ticket context and drafts a polite, technically accurate resolution response. Agents can also toggle between internal private notes and public customer replies, or use 1-click canned responses like 'Need Info' or 'Escalate to DevOps'."*
  *(Click 'AI Copilot Reply', demonstrate the generated text in the composer, and submit it. Change the status from Open to In Progress).*

- **Action 7: Productivity Tools & Keyboard Palette**
  > *"Additionally, agents have a global Command Palette via `Ctrl + K` to jump to any ticket or action, one-click CSV export, and a 'Reset Demo Data' button so evaluators can test with realistic tickets anytime."*

---

### Part 4: Code Quality & Closing (3:30 – 4:30)
- **Screen:** Switch briefly to VS Code.
- **What to say:**
  > *"Taking a quick look at the codebase:*
  > - *In `backend/db.js`, all SQL queries use parameterized statements to prevent SQL injection.*
  > - *In `backend/routes/tickets.js`, endpoints strictly follow the REST specification with clean error handling and HTTP status codes.*
  > - *In `frontend/src/`, components are modular, responsive, and follow clean React hooks principles.*
  >
  > *Thank you for reviewing my assignment! I look forward to discussing how I can contribute to Datastraw Technologies."*

---

## 💡 Quick Tips for Recording:
1. Keep the browser in full screen.
2. Speak with confidence and clear pacing.
3. Test audio before recording.
4. Upload to **YouTube (Unlisted)** or **Loom** and copy the public link.
