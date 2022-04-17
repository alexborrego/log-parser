const fs = require("fs");
const AccessLogParser = require('outlawdesigns.io.accesslogparser');
const logPath = 'sample.log';

let data = fs.readFileSync(logPath).toString().split("\n");

data.forEach((line)=>{
    console.log(AccessLogParser.parseLine(line));
});