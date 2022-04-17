const fs = require("fs");
const AccessLogParser = require('outlawdesigns.io.accesslogparser');
const logPath = 'sample.log';
const maxmind = require('maxmind');
let testLog = fs.readFileSync(logPath).toString().split("\n");
let outputArr = new Array();

maxmind.open('src/database/GeoLite2-City.mmdb').then((lookup) => {
    let geoData, logLine;
    testLog.forEach((line)=>{
        if(line !== ''){
            logLine = AccessLogParser.parseLine(line)
            geoData = lookup.get(logLine.ip_address)
            if (typeof geoData.country === "undefined") {
                logLine.country = "Unknown";
            }
            else{
                logLine.country = geoData.country.names.en;
            }
            if (typeof geoData.subdivisions === "undefined") {
                logLine.state = "Unknown";
            }
            else {
                logLine.state = geoData.subdivisions[0].names.en
            }
            outputArr.push(logLine);
        }
    });
})
.then(() => {
    console.log(outputArr);
})

// .then((geoData) => {
            
//     if (typeof geoData.country === "undefined") {
//         logLine.country = "Unknown";
//     }
//     else{
//         logLine.country = geoData.country.names.en;
//     }
//     if (typeof geoData.subdivisions === "undefined") {
//         logLine.state = "Unknown";
//     }
//     else {
//         logLine.state = geoData.subdivisions[0].names.en
//     }
//     outputArr.push(logLine);

// })
// .then(() => {
// console.log(outputArr);
// })