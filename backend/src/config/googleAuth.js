const { OAuth2Client } = require('google-auth-library');

// We'll require GOOGLE_CLIENT_ID to be set in the .env file
const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = oAuth2Client;
