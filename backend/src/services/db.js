const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { cleanPrice, parseTags } = require('../utils/formatters');

const DB_PATH = path.join(__dirname, '../../transactions.db');
const CSV_PATH = path.join(__dirname, '../truestate_assignment_dataset.csv');

let db;

const initDB = () => {
    return new Promise((resolve, reject) => {
        try {
            // 1. Initialize Database (Ephemeralish: Delete old one to ensure fresh import)
            if (fs.existsSync(DB_PATH)) {
                fs.unlinkSync(DB_PATH);
            }
            db = new Database(DB_PATH);

            // Performance Tuning
            db.pragma('journal_mode = WAL');
            db.pragma('synchronous = NORMAL');

            console.log('Database initialized.');

            // 2. Create Table
            db.exec(`
                CREATE TABLE IF NOT EXISTS transactions (
                    transactionId TEXT PRIMARY KEY,
                    date TEXT,
                    customerId TEXT,
                    customerName TEXT,
                    phone TEXT,
                    gender TEXT,
                    age INTEGER,
                    region TEXT,
                    status TEXT,
                    productCategory TEXT,
                    quantity INTEGER,
                    totalAmount TEXT,
                    price REAL,
                    productId TEXT,
                    employeeName TEXT,
                    paymentMethod TEXT,
                    tags TEXT
                )
            `);

            // 3. Create Indexes (Crucial for perf)
            db.exec(`CREATE INDEX IF NOT EXISTS idx_customerName ON transactions(customerName)`);
            db.exec(`CREATE INDEX IF NOT EXISTS idx_phone ON transactions(phone)`);
            db.exec(`CREATE INDEX IF NOT EXISTS idx_region ON transactions(region)`);
            db.exec(`CREATE INDEX IF NOT EXISTS idx_gender ON transactions(gender)`);
            db.exec(`CREATE INDEX IF NOT EXISTS idx_category ON transactions(productCategory)`);
            db.exec(`CREATE INDEX IF NOT EXISTS idx_payment ON transactions(paymentMethod)`);
            db.exec(`CREATE INDEX IF NOT EXISTS idx_date ON transactions(date)`);

            // 4. Prepare Insert Statement
            const insert = db.prepare(`
                INSERT INTO transactions VALUES (
                    @transactionId, @date, @customerId, @customerName, @phone, 
                    @gender, @age, @region, @status, @productCategory, 
                    @quantity, @totalAmount, @price, @productId, 
                    @employeeName, @paymentMethod, @tags
                )
            `);

            const insertMany = db.transaction((rows) => {
                for (const row of rows) insert.run(row);
            });

            // 5. Stream and Insert
            console.log('Importing data from CSV...');
            let rows = [];
            let count = 0;
            const startTime = Date.now();

            fs.createReadStream(CSV_PATH)
                .pipe(csv({
                    mapHeaders: ({ header }) => header.trim(),
                    mapValues: ({ value }) => value.trim()
                }))
                .on('data', (data) => {
                    const row = {
                        transactionId: data['Transaction ID'],
                        date: data['Date'],
                        customerId: data['Customer ID'],
                        customerName: data['Customer Name'],
                        phone: data['Phone Number'],
                        gender: data['Gender'],
                        age: parseInt(data['Age'], 10) || 0,
                        region: data['Customer Region'],
                        status: data['Status'] || 'Completed',
                        productCategory: data['Product Category'],
                        quantity: parseInt(data['Quantity'], 10) || 0,
                        totalAmount: data['Total Amount'],
                        price: cleanPrice(data['Total Amount']),
                        productId: data['Product ID'],
                        employeeName: data['Employee Name'],
                        paymentMethod: data['Payment Method'],
                        tags: data['Tags'] // Store as raw string for simplified search, or parsed if needed. normalized table better but text search ok for this.
                    };

                    rows.push(row);

                    // Batch insert every 1000 or so
                    if (rows.length >= 2000) { // Increased batch size for speed
                        insertMany(rows);
                        count += rows.length;
                        rows = [];
                        if (count % 20000 === 0) console.log(`Imported ${count} rows...`);
                    }
                })
                .on('end', () => {
                    if (rows.length > 0) {
                        insertMany(rows);
                        count += rows.length;
                    }
                    console.log(`Import completed. Total ${count} rows in ${(Date.now() - startTime) / 1000}s.`);
                    resolve();
                })
                .on('error', (err) => reject(err));

        } catch (error) {
            reject(error);
        }
    });
};

const getDB = () => {
    if (!db) throw new Error('Database not initialized');
    return db;
}

module.exports = { initDB, getDB };
