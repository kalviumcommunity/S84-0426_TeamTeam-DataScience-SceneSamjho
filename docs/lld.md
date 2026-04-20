# Low-Level Design (LLD) - Traffic Accident Insights & Intervention System

## 1. Introduction
This document outlines the low-level architecture, database schema, API contracts, and frontend component structure for the Traffic Accident Insights system. The application utilizes a React frontend, a FastAPI backend, Pandas for data processing, and a PostgreSQL database.

---

## 2. Database Schema (PostgreSQL)
We will use a single, robust table named `accidents` to store all incident reports. This schema includes specific factors relevant to the Indian context.

**Table Name: `accidents`**

| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `incident_id` | `UUID` | Primary Key, Auto-gen | Unique identifier for the accident. |
| `incident_date` | `DATE` | Not Null | Date of the accident. |
| `incident_time` | `TIME` | Not Null | Exact time of the accident. |
| `road_type` | `VARCHAR(50)` | Not Null | e.g., City Junction, Narrow Lane, Highway, Flyover. |
| `location_zone` | `VARCHAR(50)` | Not Null | e.g., Commercial, Residential, Highway. |
| `weather` | `VARCHAR(50)` | Not Null | e.g., Clear, Rain, Fog/Smog. |
| `road_condition`| `VARCHAR(50)` | Not Null | e.g., Dry, Wet, Potholes, Unmarked Breaker. |
| `stray_animals` | `BOOLEAN` | Default False | Was a stray animal involved/cause? |
| `wrong_way` | `BOOLEAN` | Default False | Was wrong-way driving involved? |
| `overloaded` | `BOOLEAN` | Default False | Was the vehicle overloaded (goods/passengers)? |
| `vehicle_type` | `VARCHAR(50)` | Not Null | Two-wheeler, Car, Auto-rickshaw, Bus, Truck. |
| `driver_age` | `INTEGER` | Nullable | Age of the primary driver involved. |
| `dui_alcohol` | `BOOLEAN` | Default False | Was alcohol involved? |
| `helmet_seatbelt`| `BOOLEAN` | Default False | Was safety gear used correctly? |
| `severity` | `VARCHAR(50)` | Not Null | Property Damage, Minor Injury, Severe, Fatal. |
| `ambulance_eta` | `VARCHAR(50)` | Nullable | e.g., < 15 mins, 15-30 mins, > 30 mins, N/A. |

---

## 3. API Endpoints Specification (FastAPI)
The backend will expose RESTful APIs under the `/api/v1` prefix. FastAPI will handle asynchronous database connections and pass data to Pandas for aggregation.

### 3.1. Admin Data Entry Endpoint
*   **Route:** `POST /api/v1/accidents/`
*   **Purpose:** Receives a new accident report from the React Admin Form and inserts it into PostgreSQL.
*   **Request Payload (JSON):**
    ```json
    {
      "incident_date": "2023-10-25",
      "incident_time": "18:30:00",
      "road_type": "City Junction",
      "weather": "Rain",
      "stray_animals": false,
      "wrong_way": true,
      "severity": "Severe Injury",
      "...": "..."
    }
    ```
*   **Response:** `201 Created` - `{"message": "Accident logged successfully", "id": "uuid"}`

### 3.2. Analytics: High-Level KPIs
*   **Route:** `GET /api/v1/analytics/kpis/`
*   **Purpose:** Fetches total accidents, total fatalities, and highest-risk zones for the top of the dashboard.
*   **Response Payload (JSON):**
    ```json
    {
      "total_accidents": 5420,
      "total_fatalities": 120,
      "top_hazard_weather": "Fog/Smog",
      "top_hazard_road": "Potholes"
    }
    ```

### 3.3. Analytics: Time & Demographics Trend
*   **Route:** `GET /api/v1/analytics/trends/`
*   **Purpose:** Returns time-series data grouped by hour and severity (Processed by Pandas `groupby`).
*   **Response Payload (JSON):**
    ```json[
      {"hour": "08:00", "total": 150, "fatal": 2, "minor": 148},
      {"hour": "18:00", "total": 310, "fatal": 15, "minor": 295}
    ]
    ```

### 3.4. Analytics: Indian-Specific Context (Correlations)
*   **Route:** `GET /api/v1/analytics/indian-context/`
*   **Purpose:** Analyzes the involvement of stray animals, potholes, and wrong-way driving against severity.
*   **Response Payload (JSON):**
    ```json
    {
      "stray_animals_accidents": 450,
      "wrong_way_accidents": 620,
      "pothole_related": 380,
      "severity_distribution_wrong_way": {"Fatal": 30, "Severe": 150, "Minor": 440}
    }
    ```

---

## 4. Backend Logic & Data Processing (Python/Pandas)
Instead of writing complex SQL queries, the backend will utilize Pandas for advanced aggregations to leverage Python's Data Science capabilities.

**Flow:**
1. FastAPI receives `GET` request for analytics.
2. SQLAlchemy (or asyncpg) runs a simple `SELECT * FROM accidents` (with date filters if applied).
3. Data is loaded into a Pandas DataFrame: `df = pd.DataFrame(db_records)`
4. Pandas performs transformations:
   * *Example:* `df.groupby('weather')['severity'].value_counts().unstack().to_dict()`
5. FastAPI returns the generated dictionary as a JSON response to React.

---

## 5. Frontend Architecture (React)
The frontend will be a single-page application (SPA) using React Router for navigation and Recharts for data visualization.

### 5.1. Component Tree
```text
src/
 ├── App.js (Handles routing between Admin and Analytics)
 ├── components/
 │    ├── Sidebar.jsx (Navigation menu)
 │    ├── Topbar.jsx (Header)
 │    └── FormInput.jsx (Reusable input component)
 ├── pages/
 │    ├── AdminDashboard.jsx (Contains the data entry form)
 │    └── AnalyticsDashboard.jsx (Main container for charts)
 ├── charts/ (Uses Recharts)
 │    ├── TimeTrendChart.jsx (Line chart for accident frequencies over time)
 │    ├── CauseDistributionChart.jsx (Pie chart for weather/road conditions)
 │    └── SeverityBarChart.jsx (Bar chart comparing severity vs. variables)
 └── api/
      └── axiosClient.js (Handles API calls to FastAPI)
```

### 5.2. State Management
*   Component-level state (`useState`, `useEffect`) will be used to fetch data on component mount.
*   When the Admin submits a new record, the API triggers a success toast, and the Analytics dashboard will automatically fetch the latest data upon next visit.

---

## 6. Directory Structure
```text
traffic-insights-project/
│
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── backend/                  # FastAPI application
│   ├── main.py               # Application entry point & routing
│   ├── database.py           # PostgreSQL connection setup
│   ├── models.py             # SQLAlchemy models
│   ├── analytics.py          # Pandas data crunching logic
│   ├── requirements.txt      
│   └── ...
│
└── data_pipeline/            # Scripts to generate dummy data
    └── generate_dummy_db.py  # Faker script to populate PostgreSQL initially
```
