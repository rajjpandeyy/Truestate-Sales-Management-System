# Architecture Documentation

## 1. Project Structure (Monorepo)
The project is structured as a single repository containing both the backend API and frontend application, ensuring strict separation of concerns.

```text
root/
├── backend/            # Node.js & Express API (Logic & Data Layer)
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── routes/
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── frontend/           # React & Vite Application (Presentation Layer)
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── styles/
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── README.md
├── docs/               # Architecture & Project Documentation
│   └── architecture.md
├── package.json        # Root configuration
└── README.md
```
## 2. Backend Architecture
The backend is built on **Node.js** and **Express**, utilizing a **Model-Controller-Service (MCS)** pattern to ensure modularity, scalability, and maintainability.

* **Database Layer (SQLite):**
    * To handle the large dataset (700,000+ rows) efficiently on constrained free deployment environments, the system utilizes **SQLite** (disk-based storage) instead of in-memory arrays.
    * **Indexing:** Critical columns (`Customer Name`, `Region`, `Date`) are indexed during ingestion to ensure sub-second query performance for search and filtering.
* **Controller Layer:**
    * Handles incoming HTTP requests.
    * Validates and parses query parameters (Search, Filter, Sort, Pagination).
    * Delegates business logic to the Service layer.
* **Service Layer:**
    * Contains the core business logic.
    * Dynamically constructs parameterized SQL queries based on user inputs.
    * Executes queries against the SQLite database and returns formatted data.

## 3. Frontend Architecture
The frontend is a responsive Single Page Application (SPA) developed with **React** and **Vite**.

* **Component-Based UI:**
    * **FilterPanel:** Manages complex state for multi-select inputs (Region, Category) and range sliders (Age, Date).
    * **TransactionTable:** Renders sales data in a structured grid/list format.
    * **Pagination:** Handles page navigation state and communicates limits/offsets to the API.
* **State Management:**
    * Custom React Hooks (e.g., `useSales`) centralize API interaction and state synchronization.
    * Ensures that Search, Filter, and Sort states persist simultaneously during navigation.
* **API Integration:**
    * An **Axios** service layer handles HTTP communication, using environment variables to dynamically connect to the backend.

## 4. Data Flow
The system follows a strict linear data flow:

1.  **System Startup (Ingestion):**
    * The backend streams the `truestate_assignment_dataset.csv` file.
    * Data is parsed and inserted into the local SQLite database in transactional batches.
2.  **User Request:**
    * User applies a filter (e.g., "Region: North") and searches for "John".
    * Frontend sends a GET request: `/api/sales?search=John&region=North`.
3.  **Query Construction:**
    * Backend Controller receives the request.
    * Service layer builds the SQL: `SELECT * FROM sales WHERE Name LIKE '%John%' AND Region = 'North'`.
4.  **Execution & Response:**
    * SQLite executes the query using indices.
    * Backend returns the specific page of data and total count.
5.  **Visualization:**
    * Frontend receives the JSON response and updates the UI components.

## 5. Module Responsibilities
* **backend/src/services/db.js:** Manages SQLite connection, schema initialization, and bulk data ingestion.
* **backend/src/controllers/salesController.js:** Orchestrates the request-response cycle and input validation.
* **frontend/src/services/api.js:** Centralized configuration for Axios and API endpoints.
* **frontend/src/hooks/useSales.js:** Encapsulates data fetching logic, loading states, and error handling.
