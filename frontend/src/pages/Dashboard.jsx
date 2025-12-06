import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { useSales } from '../hooks/useSales';
import SearchBar from '../components/SearchBar';
import SalesTable from '../components/SalesTable';
import FilterPanel from '../components/FilterPanel';
import Pagination from '../components/Pagination';
import styles from '../styles/App.module.css'; // Reusing App styles for now as layout is identical

const Dashboard = () => {
    const {
        data,
        loading,
        error,
        pagination,
        filters,
        filterOptions,
        handleSearch,
        handleFilterChange,
        handleSortChange,
        handlePageChange
    } = useSales();

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    return (
        <div className={styles.appContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className={`container ${styles.headerContent}`}>
                    <img src="/vite.svg" alt="TruEstate App" className={styles.logo} style={{ height: '32px' }} />
                    <div className={styles.actions}>
                        <SearchBar value={filters.search} onSearch={handleSearch} />
                        <button
                            className={`${styles.filterBtn} ${isFilterOpen ? styles.active : ''}`}
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                        >
                            <Filter size={18} />
                            Filters
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className={`container ${styles.main}`}>
                {error && <div className={styles.error}>{error}</div>}

                {loading ? (
                    <div className={styles.loading}>Loading Data...</div>
                ) : (
                    <>
                        <SalesTable
                            data={data}
                            sort={{ sortField: filters.sortField, sortOrder: filters.sortOrder }}
                            onSort={handleSortChange}
                        />
                        <Pagination pagination={pagination} onPageChange={handlePageChange} />
                    </>
                )}
            </main>

            {/* Filter Sidebar */}
            {isFilterOpen && (
                <FilterPanel
                    filters={filters}
                    options={filterOptions}
                    onChange={handleFilterChange}
                    onClose={() => setIsFilterOpen(false)}
                />
            )}
        </div>
    );
};

export default Dashboard;
