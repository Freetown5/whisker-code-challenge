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

    let latDifSquared = (objB.lat-objA.lat)*(objB.lat-objA.lat); // calculates latitude delta
    let lonDifSquared = (objB.lon-objA.lon)*(objB.lon-objA.lon); // calculates longitude delta
    let latLonAdded = lonDifSquared+latDifSquared; // adds the above calculations together
    let totalDistance = Math.sqrt(latLonAdded); // finds the square root of sum which is the distance

    // creates a new object to hold the calculated distance and the sn values associated with the points used
    let newObject = {distance: totalDistance, snA: objA.sn, snB: objB.sn}

    // pushes the total distance to the empty array created to hold them under the csv fetch
    diffCollection.push(totalDistance);
    // pushes the new object created to hold the distance and the sn values to another empty array
    diffAndSns.push(newObject);
}

function allDifferences(latData){
    // Takes each of the objects in the converted csv file and calculates the distance between them for every possible pair 
    for(let i=0; i<latData.length; i++){
        for(let j=i+1; j < latData.length; j++) {
            difference(
                latData[i], 
                latData[j], 
            );

        }
    }

    const smallestNumber = Math.min(...diffCollection); // uses the Math operator to find the smallest number in the array holding all of the calculated distances
    const smallNumObject = diffAndSns.find(u => u.distance === smallestNumber); // finds the object that contains the smallest number 
    console.log(`The shortest distance is: ${smallNumObject.distance} and it's associated sn's are ${smallNumObject.snA} and ${smallNumObject.snB}`); // prints the distance betweeen the two shortest points and both associated sn's
}

