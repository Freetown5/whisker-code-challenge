/* 
    Note: I switched from using javascript's fetch api to the csv to json library
    below because fetch was designed to read directly from json files, not csv's and has no
    method for conversions in it.
*/

const longLatEndpoint = '/sensors_latlon.csv';
const csv = require('csvtojson');

csv()
    .fromFile(__dirname + longLatEndpoint)
    .then((jsonObj) => {
        allDifferences(jsonObj);
    });

const diffCollection = [];
const diffAndSns = [];

function difference(objA, objB){

    // Note: the euclidean distance is what is being calculated by this function based on
    // references made to the Pythagorean theorem during the 1st interview

    let latDifSquared = (objB.lat-objA.lat)*(objB.lat-objA.lat);
    let lonDifSquared = (objB.lon-objA.lon)*(objB.lon-objA.lon);
    let latLonAdded = lonDifSquared+latDifSquared;
    let totalDistance = Math.sqrt(latLonAdded);

    let newObject = {distance: totalDistance, snA: objA.sn, snB: objB.sn}

    diffCollection.push(totalDistance);
    diffAndSns.push(newObject);
}

function allDifferences(latData){
    for(let i=0; i<latData.length; i++){
        for(let j=i+1; j < latData.length; j++) {
            difference(
                latData[i], 
                latData[j], 
            );

        }
    }

    const smallestNumber = Math.min(...diffCollection);
    const smallNumObject = diffAndSns.find(u => u.distance === smallestNumber);
    console.log(`The shortest distance is: ${smallNumObject.distance} and it's associated sn's are ${smallNumObject.snA} and ${smallNumObject.snB}`);
}

/* Left to do:
    - Add readme for running the project
    - Add git to project and push to Github(? is this too much)
    - Add readme for running the project
    - Extra (if there's time), create a quick html page to show calculation in the browser
 */

