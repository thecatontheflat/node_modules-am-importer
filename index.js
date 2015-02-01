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
                        items.push(license);
                    });

                    callback(null, items);
                });
            });
    },

    updateItemsInCollection: function (model, items, callback) {
        var count = 0;
        console.log(items.length);
        items.forEach(function (item) {
            model.collection.update(
                {licenseId: item.licenseId},
                {
                    licenseId: item.licenseId,
                    organisationName: item.organisationName,
                    addOnName: item.addOnName,
                    addOnKey: item.addOnKey,
                    technicalContactName: item.technicalContactName,
                    technicalContactEmail: item.technicalContactEmail,
                    technicalContactPhone: item.technicalContactPhone,
                    technicalContactAddress1: item.technicalContactAddress1,
                    technicalContactAddress2: item.technicalContactAddress2,
                    technicalContactCity: item.technicalContactCity,
                    technicalContactState: item.technicalContactState,
                    technicalContactPostcode: item.technicalContactPostcode,
                    technicalContactCountry: item.technicalContactCountry,
                    billingContactName: item.billingContactName,
                    billingContactEmail: item.billingContactEmail,
                    billingContactPhone: item.billingContactPhone,
                    edition: item.edition,
                    licenseType: item.licenseType,
                    startDate: item.startDate,
                    endDate: item.endDate,
                    renewalAction: item.renewalAction
                },
                {
                    upsert: true
                }, function (err, item) {
                    count++;
                    if (count == items.length) {
                        callback(null);
                    }
                });
        });
    }
};

module.exports = {
    LicenseImporter: LicenseImporter
};