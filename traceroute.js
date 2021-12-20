'use strict';

const Flag = require('./flag');
const Process = require('./process');

class Traceroute extends Process {
    constructor(ipVersion = '', sendwait = 0) {
        const args = ['-n', '-l', 29, '-m', 15];

        const ipFlag = Flag.getIpFlag(ipVersion);
        if (ipFlag) {
            args.push(ipFlag);
        }

        super('tracepath', args);
    }

    parseDestination(data) {
        const regex = /^traceroute\sto\s(?:[a-zA-Z0-9:.]+)\s\(([a-zA-Z0-9:.]+)\)/;
        const parsedData = new RegExp(regex, '').exec(data);

        let result = null;
        if (parsedData !== null) {
            result = parsedData[1];
        }

        return result;
    }

    parseHop(hopData) {
        const parsedData = hopData.replace(/\s+/g, ' ').trim()
        let result = null;
        if (parsedData !== null) {
            if (isNaN(parsedData.split(" ")[1].slice("")[0]) === false) {
                result = {
                    hop: parsedData.split(" ")[0].split(":")[0],
                    ip: parsedData.split(" ")[1],
                    rtt1: parsedData.split(" ")[2]
                };
            }
        }
        return result;
    }
}

module.exports = Traceroute;
