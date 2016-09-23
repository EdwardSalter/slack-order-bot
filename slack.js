const Slack = require('slack-node');
const config = require('./configuration');
const apiToken = config.get('slackApiKey', null, true);
const slack = new Slack(apiToken);

module.exports = slack;
