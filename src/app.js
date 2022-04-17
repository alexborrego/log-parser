const fs = require("fs");
const AccessLogParser = require('outlawdesigns.io.accesslogparser');
const logPath = 'sample.log';
const maxmind = require('maxmind');

let log = fs.readFileSync(logPath).toString().split("\n");



maxmind.open('src/database/GeoLite2-City.mmdb').then((lookup) => {
    log.forEach((line)=>{

        console.log(AccessLogParser.parseLine(line));
    });
    console.log(lookup.get('66.6.44.4'));
});