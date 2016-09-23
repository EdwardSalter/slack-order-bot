const express = require('express');
const router = express.Router();


const co = require('co-express');
const debug = require('debug')('OrderBot:routes:index');
debug("Setting up index actions");
const trips = require('../data/trips');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});


router.get('/trips', co(function*(req, res, next) {
    var allTrips = yield trips.getAllTrips();
    res.json(allTrips);
}));

router.post('/', co(function*(req, res, next) {
    var body = req.body;
    if (body.token !== "hBLXwTBb2SjsjuvOd7VmTusB") {
        res.status(400).json({
            error: 'Invalid token'
        });
        return;
    }

    var command = body.text.split(" ")[0].toLowerCase();

    let msg = null;
    switch (command) {
        case 'help':
            msg =
                'Typing `/lunchorder view` will display the current orders from today.\n' +
                'Typing `/lunchorder time [HH:mm]` will set the time that the owner will be notified to place the order. \n' +
                'The use of `/lunchorder [Any Other Text]` will add a food order for you.';
            break;

        case 'time':
            let time = yield trips.setTime(body);
            msg = 'The lunch order will alert the creator at ' + time;
            break;

        case 'view':
            let orderString = yield trips.getOrders();

            msg = orderString ? "The following orders have been made today:\n" + orderString : "No orders have been made today.";
            break;

        default:
            yield trips.addOrder(body);
            msg = "Lunch order received of " + body.text;
            break;
    }

    res.json({
        text: msg
    });
    res.send();
}));



module.exports = router;
