import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import styles from '../styles/SalesTable.module.css';

const SalesTable = ({ data, sort, onSort }) => {

    const renderSortIcon = (field) => {
        if (sort.sortField !== field) return null;
        return sort.sortOrder === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
    };

    if (!data || data.length === 0) {
        return (
            <div className={styles.emptyState}>
                <p>No results found. Try adjusting your filters or search.</p>
            </div>
        );
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th onClick={() => onSort('transactionId')}>Transaction ID {renderSortIcon('transactionId')}</th>
                        <th onClick={() => onSort('date')}>Date {renderSortIcon('date')}</th>
                        <th>Customer ID</th>
                        <th onClick={() => onSort('name')}>Customer Name {renderSortIcon('name')}</th>
                        <th>Phone Number</th>
                        <th>Gender</th>
                        <th>Age</th>
                        <th>Product Category</th>
                        <th onClick={() => onSort('quantity')}>Quantity {renderSortIcon('quantity')}</th>
                        <th>Total Amount</th>
                        <th>Customer Region</th>
                        <th>Product ID</th>
                        <th>Employee Name</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.transactionId}>
                            <td>{item.transactionId}</td>
                            <td>{item.date}</td>
                            <td>{item.customerId}</td>
                            <td className={styles.heavyText}>{item.customerName}</td>
                            <td>{item.phone}</td>
                            <td>{item.gender}</td>
                            <td>{item.age}</td>
                            <td>
                                <span className={`${styles.badge} ${styles[item.productCategory.toLowerCase()]} `}>
                                    {item.productCategory}
                                </span>
                            </td>
                            <td className={styles.centerText}>{item.quantity}</td>
                            <td className={styles.heavyText}>{formatCurrency(item.totalAmount)}</td>
                            <td>{item.region}</td>
                            <td>{item.productId}</td>
                            <td>{item.employeeName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesTable;
