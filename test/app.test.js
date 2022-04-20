const { test, expect } = require("@jest/globals");
const { generateOutput, convertCSV, createFile } = require("../src/app");



let testLog =
`50.112.95.211 - - [10/Jun/2015:18:15:18 +0000] "HEAD / HTTP/1.1" 200 0 "-" "NewRelicPinger/1.0 (593863)"
207.114.153.6 - - [10/Jun/2015:18:15:18 +0000] "POST /ngx_pagespeed_beacon?url=http%3A%2F%2Fwww.gobankingrates.com%2Fbanking%2Ffind-cds-now%2F HTTP/1.1" 204 0 "http://www.gobankingrates.com/banking/find-cds-now/" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36"
207.114.153.6 - - [10/Jun/2015:18:15:18 +0000] "GET /favicon.ico HTTP/1.1" 200 0 "http://www.gobankingrates.com/banking/find-cds-now/" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.81 Safari/537.36"`;

let testJSON = `[
    {
      ip_address: '50.112.95.211',
      responseCode: '200',
      requestDate: 2015-06-11T00:15:18.000Z,
      requestMethod: 'HEAD',
      query: '/',
      referrer: false,
      responseSize: '0',
      browser_name: 'Unknown Browser',
      browser_version: 'Unknown Browser Version',
      operating_system_name: 'Unknown Operating System',
      operating_system_version: 'Unknown Operating System Version',
      is_mobile: false,
      country: 'United States',
      state: 'Oregon',
      device: 'desktop'
    },
    {
      ip_address: '207.114.153.6',
      responseCode: '204',
      requestDate: 2015-06-11T00:15:18.000Z,
      requestMethod: 'POST',
      query: '/ngx_pagespeed_beacon?url=http%3A%2F%2Fwww.gobankingrates.com%2Fbanking%2Ffind-cds-now%2F',
      referrer: 'http:www.gobankingrates.com/banking/find-cds-now/',
      responseSize: '0',
      browser_name: 'Chrome',
      browser_version: '43.0.2357.81',
      operating_system_name: 'Windows',
      operating_system_version: '6.1',
      is_mobile: false,
      country: 'United States',
      state: 'Unknown',
      device: 'desktop'
    },
    {
      ip_address: '207.114.153.6',
      responseCode: '200',
      requestDate: 2015-06-11T00:15:18.000Z,
      requestMethod: 'GET',
      query: '/favicon.ico',
      referrer: 'http:www.gobankingrates.com/banking/find-cds-now/',
      responseSize: '0',
      browser_name: 'Chrome',
      browser_version: '43.0.2357.81',
      operating_system_name: 'Windows',
      operating_system_version: '6.1',
      is_mobile: false,
      country: 'United States',
      state: 'Unknown',
      device: 'desktop'
    }
  ]`

let badLog = `adfasdfasdfdas
adfasdfasdfdas
adfasdfasdfdasasdf
af
CxsZa43K75l0PvubRnXnOiQcqfFJ1FFplKW618kbZLu5pN2UQ95V4s
3452345
66876`

test("Tests generating JSON array from input log", () => {
    expect(generateOutput(testLog).toBe(testJSON));
});

test("Tests generateOutput throwing an error when receiving bad data", () => {
    expect.assertions(1);
    return generateOutput(testLog).catch(e => 
        expect(e).toEqual({
            error: 'Please provide a valid path to the log file, or check the format of your log.'
        })
    );
});