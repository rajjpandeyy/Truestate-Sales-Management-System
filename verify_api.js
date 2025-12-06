const axios = require('axios');

async function testApi() {
    try {
        console.log('Fetching Data (Limit 1)...');
        const sales = await axios.get('http://localhost:5000/api/sales?limit=1');
        console.log('First Record:', JSON.stringify(sales.data.data[0], null, 2));

        console.log('\nFetching Filter Options...');
        const options = await axios.get('http://localhost:5000/api/sales/options');
        console.log('Options Keys:', Object.keys(options.data));
        console.log('Regions Preview:', options.data.regions ? options.data.regions.slice(0, 5) : 'Missing');
        console.log('Payment Methods Preview:', options.data.paymentMethods ? options.data.paymentMethods.slice(0, 5) : 'Missing');
    } catch (err) {
        console.error('API Test Failed:', err.message);
    }
}

testApi();
