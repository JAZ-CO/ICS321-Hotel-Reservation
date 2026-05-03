const express = require('express');
require('dotenv').config();

const healthRoutes = require('./routes/health');
const graphqlRoutes = require('./routes/graphql');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', healthRoutes);
app.use('/api', graphqlRoutes);

app.get('/', (req, res) => {
  res.json({
    project: 'Hotel Reservation SQL Connect Backend',
    message: 'Use /api/health, /api/graphql-read, and /api/graphql',
    endpoints: {
      health: '/api/health',
      graphqlRead: 'POST /api/graphql-read',
      graphql: 'POST /api/graphql'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
