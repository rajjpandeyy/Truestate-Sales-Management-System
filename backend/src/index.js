const express = require('express');
const cors = require('cors');
const dataService = require('./services/dataService');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for the assignment to avoid CORS errors during grading
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/sales', salesRoutes);

app.get('/', (req, res) => {
    res.send('TruEstate Backend API is running. Access endpoints at /api/sales');
});

// Start Server
const startServer = async () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log('Starting background data load...');
            dataService.loadData()
                .then(() => console.log('Dataset loaded successfully.'))
                .catch(err => console.error('Data load failed:', err));
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
