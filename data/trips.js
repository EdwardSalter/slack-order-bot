const Trips = require('./database').trips;
const co = require('co');
const debug = require('debug')('OrderBot:data:trips');
const Users = require('./user');

function* getOrders() {
    let trip = yield getTripForToday();
    if (!trip || !trip.orders || !trip.orders.length) return null;

    return trip.orders.reduce(function(previousValue, currentValue, currentIndex, array) {
        return previousValue + currentValue.user_name + ": " + currentValue.order + "\n";
    }, '');
}

function* setTime(body) {
    let trip = yield getOrCreateTripForToday(body);
    let time = body.text.substr(5);
    let timeParts = time.split(':');
    let alertAtTime = new Date(trip.date);
    let tzOffset = yield Users.getTimezoneForUser(body.user_id);

    debug(`Got time of ${timeParts[0]}:${timeParts[1]} offset by ${tzOffset} seconds`);

    alertAtTime.setUTCHours(timeParts[0]);
    alertAtTime.setUTCMinutes(timeParts[1]);
    alertAtTime.setUTCSeconds(alertAtTime.getSeconds() - tzOffset);

    yield Trips.updateOne({
        _id: trip._id
    }, {
        $set: {
            alertAtTime: alertAtTime.getTime()
        }
    });
    return time;
}

function* markAsAlerted(tripId) {
    yield Trips.updateOne({
        _id: tripId
    }, {
        $set: {
            alertSent: true
        }
    });
}

function* getOrCreateTripForToday(body) {
    // TODO: SIMPLIFY INTO SINGLE UPSERT COMMAND (INSERTONE WITH UPSERT=TRUE)
    let trip = yield getTripForToday();

    if (trip == null) {
        debug("Not found trip, creating a new one");
        trip = yield addTrip({
            id: body.user_id,
            name: body.user_name
        });
    }
    if (trip == null) throw new Error('Failed to create trip');
    return trip;
}

function* getAllTrips() {
    var trips = yield Trips.find({}).sort({date: -1}).toArray();
    return trips;
}

function* addOrder(body) {
    let trip = yield getOrCreateTripForToday(body);
    debug("Adding an order");
    let order = {
        user_name: body.user_name,
        user_id: body.user_id,
        order: body.text
    };
    yield Trips.updateOne({
        _id: trip._id
    }, {
        $pull: {
            orders: {
                user_id: body.user_id
            }
        }
    });
    yield Trips.updateOne({
        _id: trip._id
    }, {
        $addToSet: {
            orders: order
        }
    });
}

function* addTrip(creator) {
    var trip = {
        date: new Date().getTime(),
        creator: creator,
        orders: []
    };
    yield Trips.insertOne(trip);
    return trip;
}

function* getTripForToday() {
    debug("Getting a trip for today");
    var today = new Date();
    today.setUTCHours(0);
    today.setUTCMinutes(0);
    today.setUTCSeconds(0);
    today.setUTCMilliseconds(0);

    var tomorrow = new Date(today.getTime() + 1 * 86400000);

    debug("Searching for trips with dates between " + today.getTime() + " and " + tomorrow.getTime());

    var trips = yield Trips.find({
        date: {
            $gt: today.getTime(),
            $lt: tomorrow.getTime()
        }
    }).limit(1).toArray();

    if (trips.length === 0) {
        return null;
    }
    return trips[0];
}


module.exports = {
    getTripForToday: co.wrap(getTripForToday),
    addTrip: co.wrap(addTrip),
    addOrder: co.wrap(addOrder),
    getOrCreateTripForToday: co.wrap(getOrCreateTripForToday),
    getOrders: co.wrap(getOrders),
    setTime: co.wrap(setTime),
    getAllTrips: co.wrap(getAllTrips),
    markAsAlerted: co.wrap(markAsAlerted)
}
