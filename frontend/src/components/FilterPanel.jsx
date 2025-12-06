import React from 'react';
import { X, Check } from 'lucide-react';
import styles from '../styles/FilterPanel.module.css';

const FilterPanel = ({ filters, options, onChange, onClose }) => {
    const toggleSelection = (key, value) => {
        const current = filters[key] || [];
        const updated = current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value];
        onChange(key, updated);
    };

    return (
        <div className={styles.panel}>
            <div className={styles.header}>
                <h3>Filters</h3>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close filters">
                    <X size={20} />
                </button>
            </div>

            <div className={styles.section}>
                <label>Customer Region</label>
                <div className={styles.chips}>
                    {options.regions?.map(region => (
                        <button
                            key={region}
                            className={`${styles.chip} ${filters.regions.includes(region) ? styles.active : ''}`}
                            onClick={() => toggleSelection('regions', region)}
                        >
                            {region} {filters.regions.includes(region) && <Check size={12} />}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <label>Gender</label>
                <div className={styles.chips}>
                    {options.genders?.map(gender => (
                        <button
                            key={gender}
                            className={`${styles.chip} ${filters.genders.includes(gender) ? styles.active : ''}`}
                            onClick={() => toggleSelection('genders', gender)}
                        >
                            {gender} {filters.genders.includes(gender) && <Check size={12} />}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <label>Date Range</label>
                <div className={styles.rangeInput}>
                    <input
                        type="date"
                        value={filters.dateStart}
                        onChange={(e) => onChange('dateStart', e.target.value)}
                    />
                    <span>-</span>
                    <input
                        type="date"
                        value={filters.dateEnd}
                        onChange={(e) => onChange('dateEnd', e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.section}>
                <label>Product Category</label>
                <div className={styles.chips}>
                    {options.categories?.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.chip} ${filters.categories.includes(cat) ? styles.active : ''}`}
                            onClick={() => toggleSelection('categories', cat)}
                        >
                            {cat} {filters.categories.includes(cat) && <Check size={12} />}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <label>Payment Method</label>
                <div className={styles.chips}>
                    {options.paymentMethods?.map(pm => (
                        <button
                            key={pm}
                            className={`${styles.chip} ${filters.paymentMethods.includes(pm) ? styles.active : ''}`}
                            onClick={() => toggleSelection('paymentMethods', pm)}
                        >
                            {pm} {filters.paymentMethods.includes(pm) && <Check size={12} />}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <label>Tags</label>
                <div className={styles.chips}>
                    {options.tags?.map(tag => (
                        <button
                            key={tag}
                            className={`${styles.chip} ${filters.tags.includes(tag) ? styles.active : ''}`}
                            onClick={() => toggleSelection('tags', tag)}
                        >
                            {tag} {filters.tags.includes(tag) && <Check size={12} />}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.section}>
                <label>Age Range</label>
                <div className={styles.rangeInput}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={filters.ageMin}
                        onChange={(e) => onChange('ageMin', e.target.value)}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={filters.ageMax}
                        onChange={(e) => onChange('ageMax', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;
