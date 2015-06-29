/**
 * byLatLon
 * Created by simon on 29/05/15.
 */
function (doc, meta) {

    if (doc.latitude && doc.longitude && doc.type && doc.name && doc.type=='Events') {

        if (doc.eventShowtimes){

            doc.eventShowtimes.forEach(function (time) {
                var geojson = {};

                geojson.type = "Point";
                geojson.coordinates = [doc.longitude, doc.latitude];

                var longDate = Date.parse(time);

                emit([geojson, longDate]
                    , {
                        "name": doc.name,
                        "type": doc.type,
                        "price": doc.price,
                        "transport": doc.transportInfo,
                        "venue": doc.venue.name,
                        "showtimes": time.substring(0,10) + " " + time.substring(11,19),
                        "annotation": doc.annotation
                    }
                );
            });
        }
    }
}

/**
 * byLatLonDate
 * Created by simon on 29/05/15.
 */
function (doc, meta) {

    if (doc.latitude && doc.longitude && doc.type && doc.name && doc.type=='Events') {

        if (doc.eventShowtimes){

            doc.eventShowtimes.forEach(function (time) {
                var geojson = {};

                geojson.type = "Point";
                geojson.coordinates = [doc.longitude, doc.latitude];

                var longDate = Date.parse(time);

                emit([geojson, longDate]
                    , {
                        "name": doc.name,
                        "type": doc.type,
                        "price": doc.price,
                        "transport": doc.transportInfo,
                        "venue": doc.venue.name,
                        "showtimes": time.substring(0,10) + " " + time.substring(11,19),
                        "annotation": doc.annotation
                    }
                );

        }
    }
}