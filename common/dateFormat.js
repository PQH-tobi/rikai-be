exports.dateFormatter = function dateFormatter (date) {
    let option = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
    }
    return new Intl.DateTimeFormat('en-US', option).format(date);
}

exports.stringDateToISOString = function stringDateToISOString (date) {
    return (new Date(date)).toISOString();
}
