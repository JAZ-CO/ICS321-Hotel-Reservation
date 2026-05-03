const express = require("express");
const pool = require("../db");

function q(name) {
  return `"${name}"`;
}

function pickAllowed(body, allowedFields) {
  const data = {};
  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      data[field] = body[field];
    }
  }
  return data;
}

function createCrudRouter(config) {
  const router = express.Router();
  const table = q(config.tableName);
  const pk = config.primaryKey;
  const pkQuoted = q(pk);

  // GET /api/<resource>
  router.get("/", async (req, res) => {
    try {
      const sql = `SELECT * FROM ${table} ORDER BY ${q(config.defaultOrderBy)};`;
      const result = await pool.query(sql);
      res.json(result.rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /api/<resource>/:id
  router.get("/:id", async (req, res) => {
    try {
      const sql = `SELECT * FROM ${table} WHERE ${pkQuoted} = $1;`;
      const result = await pool.query(sql, [req.params.id]);

      if (!result.rows.length) {
        return res.status(404).json({ error: `${config.tableName} not found.` });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // POST /api/<resource>
  router.post("/", async (req, res) => {
    try {
      const data = pickAllowed(req.body, config.fields);

      for (const field of config.requiredOnCreate || []) {
        if (data[field] === undefined || data[field] === null || data[field] === "") {
          return res.status(400).json({ error: `${field} is required.` });
        }
      }

      const fields = Object.keys(data);
      if (!fields.length) {
        return res.status(400).json({ error: "No valid fields were provided." });
      }

      const placeholders = fields.map((_, index) => `$${index + 1}`);
      const values = fields.map((field) => data[field]);

      const sql = `
        INSERT INTO ${table} (${fields.map(q).join(", ")})
        VALUES (${placeholders.join(", ")})
        RETURNING *;
      `;

      const result = await pool.query(sql, values);
      res.status(201).json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // PUT /api/<resource>/:id
  router.put("/:id", async (req, res) => {
    try {
      const data = pickAllowed(req.body, config.fields);
      const fields = Object.keys(data);

      if (!fields.length) {
        return res.status(400).json({ error: "No valid fields were provided." });
      }

      const setClause = fields.map((field, index) => `${q(field)} = $${index + 1}`).join(", ");
      const values = fields.map((field) => data[field]);
      values.push(req.params.id);

      const sql = `
        UPDATE ${table}
        SET ${setClause}
        WHERE ${pkQuoted} = $${values.length}
        RETURNING *;
      `;

      const result = await pool.query(sql, values);

      if (!result.rows.length) {
        return res.status(404).json({ error: `${config.tableName} not found.` });
      }

      res.json(result.rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // DELETE /api/<resource>/:id
  router.delete("/:id", async (req, res) => {
    try {
      const sql = `DELETE FROM ${table} WHERE ${pkQuoted} = $1 RETURNING *;`;
      const result = await pool.query(sql, [req.params.id]);

      if (!result.rows.length) {
        return res.status(404).json({ error: `${config.tableName} not found.` });
      }

      res.json({ message: `${config.tableName} deleted successfully.`, deleted: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createCrudRouter;
