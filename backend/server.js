const express = require('express');
const cors = require('cors');
require('dotenv').config();

const apiRoutes = require('./routes/api');
const initDatabase = require('./db/init');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CADMech Equipment Manager API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', apiRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
  });
});

app.use((err, req, res, next) => {
  console.error('[Server Error]', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

async function start() {
  try {
    await initDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`[Startup] Port ${PORT} is already in use.`);
        console.error('[Startup] Stop the existing server first, or set a different PORT in .env');
        process.exit(1);
      }
      console.error('[Startup] Server error:', err.message);
      process.exit(1);
    });
  } catch (err) {
    console.error('[Startup] Failed to initialize:', err.message);
    process.exit(1);
  }
}

start();

module.exports = app;
