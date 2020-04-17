var express = require('express');
const request = require('request');
const fs = require('fs');
const csv = require('csv-parser');
var cors = require('cors');
var cron = require('node-cron');

var countryList = require('./country_list.json');

var db = 'covid-19';
var collection = 'covid_statistics';

var app = express();
app.use(cors());

var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/' + db;

cron.schedule('23 59 * * * *', async function () {
    var dateObj = new Date;
    var month = dateObj.getUTCMonth() + 1;
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();

    var month_name = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var formattedMonth = month;

    if (month < 10) {
        month = "0" + month;
    }
    if (day < 10) {
        day = "0" + day;
    }
    newdate = month + "-" + day + "-" + year;

    var formatted_date = day + " " + month_name[formattedMonth-1] + " " + year;
    var fileName = newdate + '.csv';

    const results = [];
    var data = [];
    var totalConfirmed = 0;
    var totalDeaths = 0;
    var totalRecovered = 0;

    const file = fs.createWriteStream(fileName);

    await new Promise((resolve, reject) => {
        request({ uri: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/' + fileName })
            .pipe(file)
            .on('finish', () => {
                fs.createReadStream(fileName)
                    .pipe(csv())
                    .on('data', (data) => results.push(data))
                    .on('end', () => {
                        if (results.length > 0) {
                            for (var i = 0; i < results.length; i++) {
                                totalConfirmed = parseInt(results[i].Confirmed) + totalConfirmed;
                                totalDeaths = parseInt(results[i].Deaths) + totalDeaths;
                                totalRecovered = parseInt(results[i].Recovered) + totalRecovered;
                            }

                            for (var j = 0; j < countryList.length; j++) {
                                var country_obj = JSON.parse(JSON.stringify(countryList[j]));

                                let state = getStatistics(country_obj, results);
                                data.push(state);
                            }

                            var items = {
                                total_confirmed: totalConfirmed,
                                total_deaths: totalDeaths,
                                total_recovered: totalRecovered,
                                last_date_updated: formatted_date,
                                country_statistics: data.sort((a, b) => b.confirmed - a.confirmed)
                            }

                            MongoClient.connect(url, function (err, client) {
                                let database = client.db(db);
                                database.collection(collection).deleteOne({});
                                database.collection(collection).insertOne(items);
                            });
                        }
                    });
                resolve();
            })
            .on('error', (error) => {
                reject(error);
            })
    }).catch(error => {
        console.log(`Something happened: ${error}`);
    });
});

app.get('/', async function (req, res) {
	MongoClient.connect(url, function (err, client) {
		if (err) throw err;

		let database = client.db(db);
		database.collection(collection).findOne().then(function(result){
			if(result){
				res.json(result);
			}
		})
    });
});

app.get('/markers.geojson', function (req, res) {
    MongoClient.connect(url, function (err, client) {
        let database = client.db(db);
        database.collection(collection).find()
            .toArray((err, results) => {
                if (err) throw err;
                results.forEach((value) => {
                    var data = [];
                    var result = JSON.parse(JSON.stringify(value));
                    var total_cases = 0;

                    var country;
                    var us_confirmed;
                    var us_deaths;
                    var us_recovered;
                    var us_total_cases;

                    for (var i = 0; i < result.country_statistics.length; i++) {
                        country = result.country_statistics[i].country;
                        if (country == 'US') {
                            us_confirmed = result.country_statistics[i].confirmed;
                            us_deaths = result.country_statistics[i].deaths;
                            us_recovered = result.country_statistics[i].recovered;
                            us_total_cases = parseInt(us_confirmed) + parseInt(us_deaths) + parseInt(us_recovered);
                        }
                        for (var j = 0; j < result.country_statistics[i].states.length; j++) {
                            var name = result.country_statistics[i].states[j].name;
                            var address = result.country_statistics[i].states[j].address;
                            var latitude = result.country_statistics[i].states[j].latitude;
                            var longitude = result.country_statistics[i].states[j].longitude;
                            var confirmed = result.country_statistics[i].states[j].confirmed;
                            var deaths = result.country_statistics[i].states[j].deaths;
                            var recovered = result.country_statistics[i].states[j].recovered;
                            total_cases = parseInt(confirmed) + parseInt(deaths) + parseInt(recovered);

                            if (country != 'US') {
                                var item = {
                                    type: "Feature",
                                    geometry: {
                                        type: "Point",
                                        coordinates: [longitude, latitude]
                                    },
                                    properties: {
                                        key: j,
                                        name: name,
                                        address: address,
                                        confirmed: confirmed,
                                        deaths: deaths,
                                        recovered: recovered,
                                        total_cases: total_cases
                                    }
                                }
                                data.push(item);
                            }
                        }
                    }
                    var item = {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [-98.35, 39.50]
                        },
                        properties: {
                            key: 9899545,
                            name: 'United States',
                            address: 'US',
                            confirmed: us_confirmed,
                            deaths: us_deaths,
                            recovered: us_recovered,
                            total_cases: us_total_cases
                        }
                    }
                    data.push(item);
                    res.json(data);
                });
            })
    });
});

function getStatistics(country_obj, results) {
    const statistics = [];

    var country;
    var code;
    var flag;
    var coordinates;

    var confirmed = 0;
    var deaths = 0;
    var recovered = 0;

    var state_name;
    var state_latitude;
    var state_longitude;
    var state_address;
    var state_confirmed_count = 0;
    var state_deaths_count = 0;
    var state_recovered_count = 0;

    var country_statistics;

    for (var i = 0; i < results.length; i++) {
        if (results[i].Country_Region == country_obj.country) {
            country = results[i].Country_Region;
            code = country_obj.code;
            flag = country_obj.flag;
            coordinates = country_obj.coordinates;

            confirmed = parseInt(results[i].Confirmed) + confirmed;
            deaths = parseInt(results[i].Deaths) + deaths;
            recovered = parseInt(results[i].Recovered) + recovered;

            if (results[i].Province_State.length > 0) {
                state_name = results[i].Province_State;
            } else {
                state_name = country;
            }
            state_address = results[i].Combined_Key;

            if (results[i].Lat.length > 0 && results[i].Long_.length > 0) {
                state_latitude = parseFloat(results[i].Lat);
                state_longitude = parseFloat(results[i].Long_);
            } else {
                state_latitude = 0.0;
                state_longitude = 0.0;
            }

            state_confirmed_count = results[i].Confirmed;
            state_deaths_count = results[i].Deaths;
            state_recovered_count = results[i].Recovered;

            var state_statistics = {
                key: Math.random().toString(36).substr(2, 5),
                name: state_name,
                address: state_address,
                latitude: state_latitude,
                longitude: state_longitude,
                confirmed: state_confirmed_count,
                deaths: state_deaths_count,
                recovered: state_recovered_count
            }
            statistics.push(state_statistics);
        }
    }
    country_statistics = {
        country: country,
        code: code,
        flag: flag,
        coordinates: coordinates,
        confirmed: confirmed,
        deaths: deaths,
        recovered: recovered,
        states: statistics
    }
    return country_statistics;
}

app.listen(9000, function () {
    console.log('app listening on port 9000!');
});
