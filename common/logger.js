const { dateFormatter } = require('./dateFormat');

const logger = (logType, content) => {
    switch (logType) {
        case 'log':
            console.log(dateFormatter(new Date()), ': ' + content);
            break;
        case 'info':
            console.info(dateFormatter(new Date()), ': ' + content);
            break;
        case 'debug':
            console.debug(dateFormatter(new Date()), ': ' + content);
            break;
        case 'warn':
            console.warn(dateFormatter(new Date()), ': ' + content);
            break;
        case 'error':
            console.error(dateFormatter(new Date()), ': ' + content);
            break;
        default:
            console.log(dateFormatter(new Date()), ': ' + content);
    }
    return true;
}

module.exports = logger;
