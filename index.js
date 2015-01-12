var request = require('request');
var Converter = require('csvtojson').core.Converter;

var LicenseImporter = {
    requestCSVtoJSON: function (url, username, password, callback) {
        var csvConverter = new Converter({constructResult: true});
        request
            .get(url)
            .auth(username, password, false)
            .on('response', function (response) {
                response.pipe(csvConverter);

                var items = [];
                csvConverter.on('end_parsed', function (json) {
                    if (200 !== response.statusCode) {
                        callback('REST did not respond with 200');

                        return;
                    }

                    json.forEach(function (license) {
                        var LicenseReportModel = {
                            license: license
                        };

                        items.push(LicenseReportModel);
                    });

                    callback(null, items);
                });
            });
    },

    removeCollection: function (collection, items, callback) {
        collection.remove({}, function () {
            callback(null, items);
        });
    }
};

module.exports = {
    LicenseImporter: LicenseImporter
};