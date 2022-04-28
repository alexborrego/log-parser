const fs = require('fs');
const AccessLogParser = require('outlawdesigns.io.accesslogparser');
const deviceParser = require('ua-parser-js');
const { Parser } = require('json2csv');
const maxmind = require('maxmind');
const readline = require('readline');

const fields = ['ip_address','responseCode','requestDate','requestMethod','query','referrer','responseSize','browser_name','browser_version','operating_system_name','operating_system_version','is_mobile', 'country', 'state', 'device']
const opts = { fields };
const csvParser = new Parser(opts);
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const question = prompt => {
    return new Promise((resolve, reject) => {
      rl.question(prompt, resolve)
    })
};

/**
 * Reads user-entered input log parameter
 * @returns Input Log
 */
const openLog = (path) => {
    return fs.readFileSync(path).toString().split('\n');
}

/**
 * Iterates over each entry in the log file and
 * looks up geographic data in the Maxmind database.
 * @param {Reader} lookup 
 * @returns JSON object of log file
 */
const generateOutput = (lookup, path) => {
    let geoData, logLine, device;
    let outputArr = new Array();
    console.log('Working on it..')
        openLog(path).forEach((line)=>{
            if(line !== ''){
                logLine = AccessLogParser.parseLine(line);
                device = deviceParser(line).device.type;
                geoData = lookup.get(logLine.ip_address);
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
        const logPath = await question('Please enter the path to your log file: ');
        let lookup = await maxmind.open('./src/database/GeoLite2-City.mmdb');
        let json = await generateOutput(lookup, logPath);
        let csv = await convertCSV(json);
        await createFile(csv);
    }
    catch{
        console.log('Please provide a valid path to the log file, or check the format of your log.');
        main();
    }
}

main();