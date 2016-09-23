const optional = require('optional');

const config = optional('./user.config.json');

module.exports.get = function(configKey, environmentVar, throwOnNotFound=false) {
    if (config) {
        if (config.hasOwnProperty(configKey)) {
            return config[configKey];
        }
    }

    environmentVar = environmentVar || toUnderScore(configKey);
    if (process.env.hasOwnProperty(environmentVar)) {
        return process.env[environmentVar];
    }

    if (throwOnNotFound) {
        throw Error(`Could not find conifguration variable in user.config.json with key ${configKey} or environment variable ${environmentVar}`);
    }

    return null;
}

function toUnderScore(s) {
    return s.replace(/\.?([A-Z]+)/g, function (x,y){return "_" + y}).replace(/^_/, "").toUpperCase();
}
