# TruEstate Retail Sales Management System

## 1. Overview
A comprehensive retail sales management dashboard built for TruEstate. This system parses sales data from a CSV into an **optimized SQLite database** for high performance. It provides a robust backend API for searching, filtering, and sorting, coupled with a premium, pixel-perfect React frontend.
* **Live Application:** [truestate-sales-management-system-t.vercel.app](truestate-sales-management-system-t.vercel.app)
* **Backend API:** [https://truestate-sales-management-system.onrender.com/](https://truestate-sales-management-system.onrender.com/)

## 2. Tech Stack
* **Backend:** Node.js, Express.js, SQLite (better-sqlite3), CSV Parser
* **Frontend:** React, Vite, Vanilla CSS / CSS Modules
* **Monorepo:** Managed via NPM scripts

## 3. Search Implementation Summary
Full-text, case-insensitive search implemented on the server-side using SQL queries. It targets:
* `Customer Name`
* `Phone Number`

## 4. Filter Implementation Summary
Advanced filtering logic allows simultaneous multi-selection of:
* **Categorical:** Region, Gender, Category, Payment Method, Tags
* **Ranges:** Age (min/max), Date (start/end)

## 5. Sorting Implementation Summary
Supports sorting via SQL `ORDER BY` clauses for:
* **Date** (Newest First)
* **Quantity**
* **Customer Name** (A-Z)

## 6. Pagination Implementation Summary
Server-side pagination defaults to **10 items per page** using `LIMIT` and `OFFSET`. The frontend automatically persists search and filter states while navigating through pages.

## 7. Setup Instructions
1.  **Install Dependencies**
    ```bash
    npm run install:all
    ```
    *(This script automatically installs dependencies for both backend and frontend)*

2.  **Run Application**
    ```bash
    npm start
    ```
    * **Backend:** [http://localhost:5000](http://localhost:5000)
    * **Frontend:** [http://localhost:5173](http://localhost:5173)
