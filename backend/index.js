// Backend entry point for local development
// This imports the shared API module and starts a local Express server

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('../api/index.js');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Voyago server running on port ${PORT}`));
