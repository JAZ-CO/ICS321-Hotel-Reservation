const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    ok: true,
    message: 'Hotel SQL Connect backend starter is running.',
    serviceId: process.env.DATACONNECT_SERVICE_ID,
    location: process.env.DATACONNECT_LOCATION,
    connector: process.env.DATACONNECT_CONNECTOR
  });
});

module.exports = router;
