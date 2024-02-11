const express = require('express');
const app = express();
const port = 3000;

// Halifax
const current = [44.651070, -63.582687];


//Random Bicycles
const halifaxBoundingCoordinates = {
    minLat: 44.5,
    maxLat: 44.7,
    minLon: -63.8,
    maxLon: -63.3
};

function generateRandomCoordinate(minLat, maxLat, minLon, maxLon) {
    const lat = Math.random() * (maxLat - minLat) + minLat;
    const lon = Math.random() * (maxLon - minLon) + minLon;
    return [lat, lon];
}

const numberOfBicycles = 10;
const bicycleCoordinates = Array.from({ length: numberOfBicycles }, () =>
    generateRandomCoordinate(halifaxBoundingCoordinates.minLat, halifaxBoundingCoordinates.maxLat, halifaxBoundingCoordinates.minLon, halifaxBoundingCoordinates.maxLon)
);
console.log('Hello')
console.log(bicycleCoordinates);


// Dauphin, Kingston
const bikeshops_arr = [[44.6881763770323, -63.37899451070543]];
const bicyles_arr = [[49.19522514942003, -123.17891257743827]];

function calc_distance(lat1, lon1, lat2, lon2) {
    // Convert decimal degrees to radians
    const x1 = lat1
    const y1 = lon1
    const x2 = lat2
    const y2 = lon2
    let calc = (x2 - x1) * (y2 - y1) + (y2 - y1) * (y2 - y1)
    const distance = Math.round(Math.abs(Math.sqrt(calc)))
    return distance
}

function smallest_distance(current_loc, possible_locations) {
    let distances = [];
    possible_locations.forEach(pos => {
        // console.log(current_loc[0], current_loc[1], pos[0], pos[1])
        distances.push(calc_distance(current_loc[0], current_loc[1], pos[0], pos[1]));
    });
    // res.send(`Distances from current location to possibities: ${distances}`);
    // console.log(distances)
    let smallest_distance = (distances.indexOf(Math.min(...distances)))
    // console.log(smallest_distance)
    return possible_locations[smallest_distance]
}

function final_min_distance(origin, bikeshops_arr, bicyles_arr) {
    const min_bikeshop_dist = smallest_distance(origin, bikeshops_arr);
    const min_bicycle_dist = smallest_distance(origin, bicyles_arr);
    console.log(`Bikeshops: ${min_bikeshop_dist}`)
    console.log(`Bicylces: ${min_bicycle_dist}`)
    const response = {};

    if (min_bikeshop_dist <= min_bicycle_dist) {
        response.is_bikeshop = true;
        response.coordinates = min_bikeshop_dist;
    } else {
        response.is_bikeshop = false;
        response.coordinates = min_bicycle_dist;
    }
    console.log(response)
    return response;
}



//Receives a query with lat and long and returns the nearest coordinates of a bike station or a parked bike
app.get('/api/location', (req, res) => {
    const { lat, long } = req.query;

    // Ensure both lat and long parameters are provided
    if (!lat || !long) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    // Convert lat and long strings to numbers
    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);

    const origin = [latitude, longitude]

    // Do something with latitude and longitude, for example:
    res.send(final_min_distance(origin, bikeshops_arr, bicyles_arr));
});


function calculateBilledAmount(timeDiff) {
    const unlock_cost = 1;
    const cost_per_min = 0.20;

    const [, hours, minutes, seconds] = timeDiff.match(/(\d+)h (\d+)m (\d+)s/);

    const totalMinutes = parseInt(hours) * 60 + parseInt(minutes) + Math.round(parseInt(seconds) / 60);

    const billedAmount = unlock_cost + totalMinutes * cost_per_min;

    return billedAmount.toFixed(2)
}

app.get('/api/calculate-travel-details', (req, res) => {
    const { startTime, endTime } = req.query;

    if (!startTime || !endTime) {
        return res.status(400).json({ error: 'Start time and end time are required' });
    }

    const timeDifference = calculateTimeDifference(startTime, endTime);

    // You can calculate billed amount based on the time difference or any other logic here
    const billedAmount = calculateBilledAmount(timeDifference);

    res.json({ travel_time: timeDifference, billed_amount: billedAmount });
});

function calculateTimeDifference(startTime, endTime) {
    if (!startTime || !endTime) {
        return 'Start time and end time are required';
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const difference = Math.abs(end - start);
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    const timeDifference = `${hours}h ${minutes}m ${seconds}s`;

    return timeDifference;
}

const startTime = '2024-02-10T11:00:00';
const endTime = '2024-02-10T11:18:35';

const timeDifference = calculateTimeDifference(startTime, endTime);
console.log(timeDifference);
//start_time()



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});



//end_time()
