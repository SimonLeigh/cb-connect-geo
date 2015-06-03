//// ▶▶ require objects ◀◀ ////

var bodyParser = require('body-parser');
var http = require('http');
var db = require('../model/db');
//db.enableN1QL(function(err,done){});

//// ▶▶ application/json parser ◀◀ ////
var jsonParser = bodyParser.json();

//// ▶▶ application/x-www-form-urlencoded parser ◀◀ ////
var urlencodedParser = bodyParser.urlencoded({ extended: false });

module.exports = function (app) {

    //// ▶▶ enable cors ◀◀ ////
    // Inject headers to all requests.
    app.all('*', function(req, res,next) {


        /**
         * Response settings
         * @type {Object}
         */
        var responseSettings = {
            "AccessControlAllowOrigin": req.headers.origin,
            "AccessControlAllowHeaders": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
            "AccessControlAllowMethods": "POST, GET, PUT, DELETE, OPTIONS",
            "AccessControlAllowCredentials": true
        };

        /**
         * Headers
         */
        res.header("Access-Control-Allow-Credentials", responseSettings.AccessControlAllowCredentials);
        res.header("Access-Control-Allow-Origin",  responseSettings.AccessControlAllowOrigin);
        res.header("Access-Control-Allow-Headers", (req.headers['access-control-request-headers']) ? req.headers['access-control-request-headers'] : "x-requested-with");
        res.header("Access-Control-Allow-Methods", (req.headers['access-control-request-method']) ? req.headers['access-control-request-method'] : responseSettings.AccessControlAllowMethods);

        if ('OPTIONS' == req.method) {
            res.send(200);
        }
        else {
            next();
        }


    });

    //// ▶▶ airports ◀◀ ////
    app.get('/api/airport/findAll',function(req,res) {
        if (req.query.search) {
            airport.findAll(req.query.search, function (err, done) {
                if (err) {
                    res.status = 400;
                    res.send(err);
                    return;
                }
                res.status = 202;
                res.send(done);
            });
        }else{
            res.status = 400;
            res.send({"airport":"bad request"});
            return;
        }
    });


    //// ▶▶ Event Get Single Doc ◀◀ ////
    app.get('/api/events/getOne', function(req,res) {
        if (req.query.key) {
            db.read(req.query.key, function (err, done) {
                if (err) {
                    res.status = 400;
                    res.send(err);
                    return;
                }
                res.status = 202;
                res.send(done);
            });
        }else{
            res.status = 400;
            res.send({"Event":"Error finding key"});
            return;
        }

    });

    //// ▶▶ Event Spatial Query ◀◀ ////
    app.get('/api/events/findEvents',function(req,res) {
        if (req.query.ne_lat && req.query.ne_lon &&
            req.query.sw_lat && req.query.sw_lon) {
            // Construct the array expected by the spatial query
            var coords = [req.query.sw_lon, req.query.sw_lat,
                            req.query.ne_lon, req.query.ne_lat]
            db.spatialQuery(coords, function (err, done) {
                if (err) {
                    res.status = 400;
                    res.send(err);
                    return;
                }
                res.status = 202;
                res.send(done);
            });
        }else{
            res.status = 400;
            res.send({"Events":"bad request"});
            return;
        }
    });

    //// ▶▶ Event Spatial Query With Date ◀◀ ////
    app.get('/api/events/findEventsWithDate',function(req,res) {
        if (req.query.ne_lat && req.query.ne_lon &&
            req.query.sw_lat && req.query.sw_lon &&
            req.query.start && req.query.end) {
            // Construct the array expected by the spatial query
            var coords = [req.query.sw_lon, req.query.sw_lat,
                req.query.ne_lon, req.query.ne_lat];

            var dates = [req.query.start, req.query.end];

            db.spatialQueryWithDates(coords, dates, function (err, done) {
                if (err) {
                    res.status = 400;
                    res.send(err);
                    return;
                }
                res.status = 202;
                res.send(done);
            });
        }else{
            res.status = 400;
            res.send({"Events":"bad request"});
            return;
        }
    });




    //// ▶▶ debug endpoints -- Not Used For Production ◀◀ ////
    app.get('/api/status/ops', function(req,res) {
        db.ops(function(done){
            res.status = 200;
            res.send({'ops':done});
        });
    });




}
