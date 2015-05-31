/**
 * Created by simon on 29/05/15.
 */
var viewFunc = function (doc, meta) {

    if (doc.latitude && doc.longitude && doc.type && doc.name && doc.type=='Events') {

        if (doc.eventShowtimes){

            doc.eventShowtimes.forEach(function (time) {

                var longTime = new Date.parse(time.substring(0, 10));

                emit([doc.longitude, doc.latitude, longTime]
                    , {
                        "name": doc.name,
                        "type": doc.type,
                        "price": doc.price,
                        "transport": doc.transportInfo,
                        "venue": doc.venue.name,
                        "showtimes": longTime.toDateString(),
                        "annotation": doc.annotation
                    }
                );
            });
        }
    }
}