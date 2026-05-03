const express = require('express');
const router = express.Router();
const { getDc } = require('../config/dataConnect');

router.post('/graphql-read', async (req, res) => {
  try {
    const { query, variables } = req.body || {};
    if (!query) {
      return res.status(400).json({ ok: false, message: 'query is required' });
    }
    const dc = getDc();
    const result = await dc.executeGraphqlRead(query, { variables });
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message, stack: error.stack });
  }
});

router.post('/graphql', async (req, res) => {
  try {
    const { query, variables } = req.body || {};
    if (!query) {
      return res.status(400).json({ ok: false, message: 'query is required' });
    }
    const dc = getDc();
    const result = await dc.executeGraphql(query, { variables });
    res.json({ ok: true, result });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message, stack: error.stack });
  }
});

module.exports = router;
