const schedule = require('node-schedule');
const trips = require('./data/trips');
const co = require('co');
const debug = require('debug')('OrderBot:clock');
const slack = require('./slack');
debug('Setting up job scheduler');

var j = schedule.scheduleJob('*/1 * * * *', co.wrap(function*() {
    debug('Job scheduler running');
    let trip = yield trips.getTripForToday();
    if (!trip) {
        debug('No trip found for today, skipping');
        return;
    }

    if (trip.alertSent) {
        debug('Alert already sent today, skipping');
        return;
    }
    if (!trip.alertAtTime) {
        debug('No alert at time, skipping');
        return;
    }
    if (!trip.orders || !trip.orders.length) {
        debug('Trip has no orders, skipping');
    }

    let now = new Date().getTime();
    if (now < trip.alertAtTime) {
        debug('Alert time not yet reached, skipping');
        return;
    }

    debug('Alert time has passed, sending alert');
    let orderString = yield trips.getOrders();

    debug('Got order list, sending message to slack');
    let response = slack.api('chat.postMessage', {
        text: 'It is time. Place the order:\n' + orderString,
        channel: trip.creator.id
    }, co.wrap(function*(err, response) {
        if (err) {
            debug('Error occurred whilst sending message: ' + e);
            return;
        }
        debug('Message sent to slack. Response was :' + JSON.stringify(response));
        yield trips.markAsAlerted(trip._id);
    }));
}));
