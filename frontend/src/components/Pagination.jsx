import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from '../styles/Pagination.module.css';

const Pagination = ({ pagination, onPageChange }) => {
    const { page, totalPages, total } = pagination;

    if (total === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.info}>
                Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </div>
            <div className={styles.controls}>
                <button
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                    className={styles.btn}
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>
                <div className={styles.pages}>
                    {[...Array(totalPages)].map((_, i) => {
                        // Simple logic to show a few pages around current. 
                        // For detailed logic, complex rendering is needed. 
                        // For now, if pages < 8 show all, else simple abbrev (skipped for brevity of this artifact)
                        if (totalPages <= 7 || Math.abs(page - (i + 1)) < 3 || i === 0 || i === totalPages - 1) {
                            return <button
                                key={i}
                                className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ''}`}
                                onClick={() => onPageChange(i + 1)}
                            >
                                {i + 1}
                            </button>
                        }
                        if (i === 1 || i === totalPages - 2) return <span key={i}>...</span>
                        return null;
                    })}
                </div>
                <button
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                    className={styles.btn}
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
