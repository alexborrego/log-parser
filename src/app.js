const fs = require('fs');
const AccessLogParser = require('outlawdesigns.io.accesslogparser');
const deviceParser = require('ua-parser-js');
const { Parser } = require('json2csv');
const maxmind = require('maxmind');

const fields = ['ip_address','responseCode','requestDate','requestMethod','query','referrer','responseSize','browser_name','browser_version','operating_system_name','operating_system_version','is_mobile', 'country', 'state', 'device']
const opts = { fields };
const csvParser = new Parser(opts);

/**
 * Reads user-entered input log parameter
 * @returns Input Log
 */
const openLog = () => {
    const args = process.argv.slice(2);
    return fs.readFileSync(args[0]).toString().split('\n');
}

/**
 * Iterates over each entry in the log file and
 * looks up geographic data in the Maxmind database.
 * @param {Reader} lookup 
 * @returns JSON object of log file
 */
const generateOutput = (lookup) => {
    let geoData, logLine, device;
    let outputArr = new Array();
        openLog().forEach((line)=>{
            if(line !== ''){
                logLine = AccessLogParser.parseLine(line);
                device = deviceParser(line).device.type;
                try {
                    geoData = lookup.get(logLine.ip_address);
                }
                catch(e){
                    throw e;
                }
                logLine.country = (typeof geoData.country === 'undefined') ? 'Unknown' : geoData.country.names.en;
                logLine.state = (typeof geoData.subdivisions === 'undefined') ? 'Unknown' : geoData.subdivisions[0].names.en;
                logLine.device = (typeof device === 'undefined') ? 'desktop' : device;
                outputArr.push(logLine);
            }
        });
    return outputArr;
}

/**
 * Converts the JSON array to a CSV string.
 * @param {JSON} json 
 * @returns CSV string
 */
const convertCSV = (json) => {
    return csvParser.parse(json);
}

/**
 * Creates the file from csv.
 * @param {string} csv 
 */
const createFile = (csv) => {
    fs.writeFile('Access Log.csv', csv, (err) => {
        console.log((err === null) ? 'Success! Please check the folder.' : err);
    }); 
}

/**
 * Calls the above functions to read from the database,
 * build the JSON object, convert to CSV, and output.
 */
const main = async () => {
    try {
    maxmind.open('src/database/GeoLite2-City.mmdb')
    .then((lookup) => generateOutput(lookup))
        // .catch(() => {
        //     console.log('Please provide a valid path to the log file, or check the format of your log.')
        //     throw 'a';
        // })
    .then((json) => convertCSV(json))
    .then((csv) => createFile(csv))
    }
    catch(e){
        console.log(e)
    }
}

main();


exports.openLog = openLog;
exports.generateOutput = generateOutput;
exports.convertCSV = convertCSV;
exports.createFile = createFile