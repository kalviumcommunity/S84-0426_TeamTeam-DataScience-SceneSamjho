# Team Task Allocation & Sprint Plan (`task.md`)

## 1. Project Team & Core Roles
To ensure parallel development and avoid Git merge conflicts, the project has been divided into three distinct architectural pillars. Each member is the sole owner of their pillar.

*   **Avinash:** Lead Data Engineer & Backend Architect 
*   **Keshav:** Lead Frontend Developer (Data Ingestion & Admin Portal)
*   **Akanksha:** Lead UI/UX Developer (Data Visualization & Analytics Dashboard)

> **⚠️ Important Ground Rule for Version Control:** 
> To maintain a clean codebase, strict directory ownership applies. Keshav and Akanksha will only write code inside the `/frontend` directory. Avinash will solely manage the `/backend`, `/database`, and root configuration files. 

---

## 2. Individual Task Breakdown

### 🧑‍💻 Avinash: Backend Architecture & Data Processing Engine
*Role Focus: Database construction, Data Pipeline generation, and Python/Pandas Analytics Engine.*

*   **Task 1: Relational Database Architecture:** Design, provision, and deploy the PostgreSQL database schema (Tables, Enums, UUIDs) to ensure strict data integrity.: Avinash has done it 
*   **Task 2: Historical Data Pipeline Engine:** Write the Python/Faker automation script to generate 5,000+ localized, statistically relevant dummy records simulating years of Indian traffic accident data.
*   **Task 3: Core API Gateway Construction:** Initialize and configure the FastAPI server, setting up CORS, environment variables, and asynchronous database connection pooling.
*   **Task 4: Data Science & Analytics Endpoints:** Utilize Pandas and NumPy to write the complex querying and data aggregation logic. Build the GET endpoints that calculate KPI percentages, time-series trends, and categorical cross-referencing.
*   **Task 5: Data Validation Layer:** Implement Pydantic models to strictly validate incoming POST request payloads from the frontend Admin Portal before database insertion.

### 🧑‍💻 Keshav: Client-Side Architecture & Admin Ingestion Portal
*Role Focus: React.js setup, frontend routing, and building the secure Admin data-entry system.*

*   **Task 1: React Initialization & App Shell Architecture:** Initialize the React application, configure React Router for seamless Single Page Application (SPA) navigation between the Admin and Analytics views, and set up the global CSS/Tailwind framework.
*   **Task 2: Global Navigation & Layout:** Build the persistent Sidebar/Navbar components that will house the entire application layout.
*   **Task 3: Admin Data Ingestion Engine (UI):** Build the complex, multi-field "New Accident Report" form. This includes handling diverse input types (Dates, Dropdowns, Checkboxes for booleans like 'Stray Animals').
*   **Task 4: Client-Side Form State & Validation:** Implement React state management (`useState`) to capture form data and build client-side validation to prevent empty or malformed submissions.
*   **Task 5: API Integration (POST Logic):** Use `axios` or `fetch` to connect the React form to Avinash’s `/api/v1/accidents` endpoint. Implement success/error handling (e.g., UI Toast notifications upon successful database entry).

### 👩‍💻 Akanksha: Data Visualization Integration & BI Dashboard
*Role Focus: Consuming backend analytics APIs and translating JSON data into interactive business intelligence (BI) charts.*

*   **Task 1: Analytics View Layout Architecture:** Design and build the grid-based responsive layout for the main Analytics Dashboard where all data will be displayed.
*   **Task 2: KPI Card Components:** Build the dynamic top-level statistical cards (e.g., "Total Accidents", "High Risk Weather") that consume data from the backend KPI endpoint.
*   **Task 3: Recharts Integration (Time-Series):** Implement the `Recharts` library to build the complex Line Charts detailing accident frequencies across different times of the day.
*   **Task 4: Recharts Integration (Categorical Data):** Build Pie Charts and Bar Graphs to visualize Indian-specific context correlations (e.g., Severity distributions against Wrong-Way Driving or Potholes).
*   **Task 5: Asynchronous Data Fetching Logic:** Write the `useEffect` hooks and API polling logic to dynamically fetch the JSON data from Avinash's Pandas API endpoints and map that data directly into the Recharts components. Ensure loading states and spinners are handled.

---

## 3. Integration & Final Walkthrough (Collaborative)
Once all three pillars are complete, the team will come together for:
*   End-to-End Testing (Keshav submitting a form -> Avinash's DB saving it -> Akanksha's charts updating).
*   Final UI Polish and CSS alignment.
*   Recording the final Video Presentation.
