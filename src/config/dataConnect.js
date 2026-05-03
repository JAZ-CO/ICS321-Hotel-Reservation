const fs = require('fs');
const path = require('path');
const { initializeApp, cert, getApps, applicationDefault } = require('firebase-admin/app');
const { getDataConnect } = require('firebase-admin/data-connect');
require('dotenv').config();

function getFirebaseApp() {
  if (getApps().length) return getApps()[0];

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../serviceAccountKey.json';
  const resolved = path.resolve(__dirname, '..', '..', serviceAccountPath);

  if (fs.existsSync(resolved)) {
    const serviceAccount = require(resolved);
    return initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID || serviceAccount.project_id
    });
  }

  return initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID
  });
}

function getDc() {
  const app = getFirebaseApp();
  return getDataConnect(
    {
      serviceId: process.env.DATACONNECT_SERVICE_ID,
      location: process.env.DATACONNECT_LOCATION,
      connector: process.env.DATACONNECT_CONNECTOR
    },
    app
  );
}

module.exports = { getDc };
