require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const createCrudRouter = require("./utils/crudRouter");
const tables = require("./config/tables");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    project: "Hotel Reservation Backend",
    status: "running",
    baseUrl: `http://localhost:${PORT}`,
    resources: Object.keys(tables).map((name) => `/api/${name}`),
    note: "Use the /api endpoints for GET, POST, PUT, DELETE."
  });
});

app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS server_time;");
    res.json({
      ok: true,
      message: "Backend and database are working.",
      serverTime: result.rows[0].server_time
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

for (const [resource, config] of Object.entries(tables)) {
  app.use(`/api/${resource}`, createCrudRouter(config));
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
