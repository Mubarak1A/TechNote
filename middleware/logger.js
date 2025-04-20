const { format } = require('date-fns');
const { v4: uuid } = require('uuid');   
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem);
    } catch (err) {
        console.error(err); // log any errors to the console
    }
}

const logger = (req, res, next) => {
    const logFileName = 'reqLog.log';
    const message = `${req.method}\t${req.headers.origin}\t${req.url}`;
    logEvents(message, logFileName);
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };