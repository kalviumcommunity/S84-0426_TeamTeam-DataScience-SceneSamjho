# High-Level Design (HLD) - Traffic Accident Insights & Intervention System

## 1. Project Overview
The Traffic Accident Insights system is a full-stack data application designed to help traffic police and city planners understand and reduce road accidents. By collecting granular, localized data (including Indian-specific contexts like stray animals and wrong-way driving), the system processes raw historical records into actionable visual insights.

The platform serves two primary functions:
1. **Data Ingestion (Admin Portal):** A secure entry point for traffic officials to log new accident reports into the system.
2. **Data Analytics (Dashboard):** An interactive visual interface that highlights correlations between environmental, infrastructural, and human factors to suggest targeted interventions.

---

## 2. System Architecture Diagram
The system follows a modern **3-Tier Architecture**, separating the presentation, application/logic, and data management layers.

```text
  [ Tier 1: Presentation ][ Tier 2: Application & Processing ]          [ Tier 3: Data ]
 
       +---------------+                  +-------------------+                 +----------------+
       |               |    HTTP/REST     |                   |   SQL Queries   |                |
       |  React.js UI  | <==============> |  FastAPI Backend  | <=============> |   PostgreSQL   |
       | (Web Browser) |   (JSON Data)    |     (Python)      |  (Raw Records)  |   (Database)   |
       |               |                  |                   |                 |                |
       +-------+-------+                  +---------+---------+                 +----------------+
               |                                    |
               |                                    v
     +---------+---------+                 +------------------+
     |   Recharts.js     |                 |  Pandas Engine   |
     | (Visualizations)  |                 | (Data Analytics) |
     +-------------------+                 +------------------+
```

---

## 3. Core Components Description

### 3.1. Frontend Layer (Client)
*   **Technology:** React.js, React Router, Recharts.
*   **Role:** The user-facing layer. It provides the UI for the Admin Data Entry form and the Analytics Dashboard. 
*   **Interaction:** It communicates exclusively with the backend via REST APIs using asynchronous HTTP requests (`axios` or `fetch`). It receives pre-processed JSON data and renders it into interactive graphs (bar charts, line graphs, pie charts) using Recharts.

### 3.2. Backend Logic Layer (API & Data Processing)
*   **Technology:** FastAPI (Python), Pandas, SQLAlchemy/asyncpg.
*   **Role:** The "brain" of the application. It serves two sub-roles:
    1.  **API Gateway:** FastAPI exposes endpoints (`/api/v1/...`) to securely handle requests from the React frontend. It uses Pydantic models to validate incoming form data before saving it to the database.
    2.  **Data Processing Engine:** Instead of forcing the database to perform complex statistical aggregations, FastAPI fetches raw data from PostgreSQL and loads it into **Pandas DataFrames**. Pandas performs groupings, calculates percentages, and formats the data specifically for charting before sending it back to the frontend.

### 3.3. Database Layer (Storage)
*   **Technology:** PostgreSQL (Local or Supabase).
*   **Role:** The persistent storage system. It holds the `accidents` table containing all historical and newly added records. PostgreSQL was chosen for its strict relational schema and data integrity, ensuring that reports are structured perfectly for data science tasks.

---

## 4. System Data Flow

### Flow 1: Data Entry (Admin generating a new report)
1. **Action:** The traffic admin fills out the "New Accident Report" form in the React frontend and clicks 'Submit'.
2. **Request:** React sends a `POST` request with a JSON payload to the FastAPI backend.
3. **Validation:** FastAPI validates the payload (e.g., ensuring date formats are correct and required fields are filled).
4. **Storage:** FastAPI executes an `INSERT` SQL query to save the record in PostgreSQL.
5. **Confirmation:** The database confirms the insertion, and FastAPI sends a `201 Created` success response back to React.

### Flow 2: Analytics Generation (Dashboard loading)
1. **Action:** A user navigates to the Analytics Dashboard in the React application.
2. **Request:** React components mount and trigger `GET` requests to various FastAPI analytics endpoints (e.g., `/api/v1/analytics/trends`).
3. **Data Retrieval:** FastAPI sends a `SELECT` query to PostgreSQL to fetch the relevant raw accident records.
4. **Data Transformation:** FastAPI loads the raw SQL rows into a Pandas DataFrame. Pandas executes the analytical logic (e.g., grouping by time of day, correlating weather with severity).
5. **Response:** Pandas converts the processed summary into a JSON-friendly format (dictionaries/lists), which FastAPI sends back to React.
6. **Rendering:** React feeds the JSON array into Recharts, displaying the final visualizations on the screen.

---

## 5. Technology Stack Justification
*   **React:** Chosen for its component-driven architecture, making it easy to manage separate views (Forms vs. Dashboards) without reloading the page.
*   **FastAPI:** Chosen over Django/Flask because it is asynchronous by default, incredibly fast, and features built-in data validation (Pydantic) which is crucial when accepting user-generated data.
*   **Pandas:** The industry standard for Python data science. Doing heavy calculations in Pandas rather than raw SQL makes the codebase easier to read, maintain, and adapt for future machine learning implementations.
*   **PostgreSQL:** A highly reliable relational database. Because our data schema is highly structured (rows of accidents with specific columns), a relational DB is superior to NoSQL (like MongoDB) for tabular data analysis.
