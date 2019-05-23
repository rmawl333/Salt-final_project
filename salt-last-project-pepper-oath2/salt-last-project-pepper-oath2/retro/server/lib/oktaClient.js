const okta = require('@okta/okta-sdk-nodejs');

const client = new okta.Client({
  orgUrl: 'https://dev-789949.oktapreview.com',
  token: '00CScboebWAcnibIh5zJ_eh5vJsg8nQ4XAuFo9pQTC',
});

module.exports = client;
