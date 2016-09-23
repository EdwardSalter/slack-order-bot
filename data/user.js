const slack = require('../slack');
const co = require('co');
const debug = require('debug')('OrderBot:data:user');

function getUserInfoAsync(userId) {
    return new Promise(function(fulfill, reject) {
        slack.api('users.info', {
            user: userId
        }, function(err, response) {
            if (err) {
                reject(err);
                return;
            }
            fulfill(response.user);
        });
    });
}

module.exports.getTimezoneForUser = function*(userId) {
    var info = yield getUserInfoAsync(userId);
    debug(`Got user ${userId} timezone of ${info.tz_offset}`);
    return info.tz_offset;
};
