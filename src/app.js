const fs = require("fs");
const AccessLogParser = require('outlawdesigns.io.accesslogparser');
const deviceParser = require('ua-parser-js');
const { Parser } = require('json2csv');
const maxmind = require('maxmind');
const csvParser = new Parser(opts);

const fields = ['ip_address','responseCode','requestDate','requestMethod','query','referrer','responseSize','browser_name','browser_version','operating_system_name','operating_system_version','is_mobile', 'country', 'state', 'device']
const opts = { fields };
const logPath = 'sample.log';

let testLog = fs.readFileSync(logPath).toString().split("\n");
let outputArr = new Array();

maxmind.open('src/database/GeoLite2-City.mmdb').then((lookup) => {
    let geoData, logLine, device;
    testLog.forEach((line)=>{
        if(line !== ''){
            logLine = AccessLogParser.parseLine(line);
            device = deviceParser(line).device.type;
            geoData = lookup.get(logLine.ip_address);
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
            if (typeof device === 'undefined') {
                logLine.device = 'desktop';
            }
            else {
                logLine.device = device;
            }
            outputArr.push(logLine);
        }
    });
}, () => {
    console.log("An unexpected error has occured. Please try again.");
})
.then(() => {
    let csv = csvParser.parse(outputArr);
    console.log(csv);
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