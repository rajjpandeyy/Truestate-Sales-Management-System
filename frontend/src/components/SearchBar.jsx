import React from 'react';
import { Search } from 'lucide-react';
import styles from '../styles/SearchBar.module.css';

const SearchBar = ({ onSearch, value }) => {
    return (
        <div className={styles.container}>
            <Search className={styles.icon} size={20} />
            <input
                type="text"
                placeholder="Search by Customer Name or ID..."
                className={styles.input}
                value={value}
                onChange={(e) => onSearch(e.target.value)}
            />
        </div>
    );
};

export default SearchBar;
