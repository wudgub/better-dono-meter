import { merge } from 'lodash';

// Main config file

const config = {
	dev: 'dev',
	prod: 'prod',
	//port: process.env.NODE_PORT || 3000,
	expireTime: 24 * 60 * 60 * 365 // 1 year
	//expireTime: 30 // 30 seconds for testing
};

// defaulting to dev.
// TODO: make this better or change to prod when done.
config.env = 'dev.js';

let envConfig;
// If file doesn't exist, require could error out
try {
	envConfig = require('./' + config.env);
	// make sure require got something back
	envConfig = envConfig || {};
} catch(err) {
	envConfig = {};
}
// merge two config files together. envConfig will overwrite
// redundancies on config object.

export default merge(config, envConfig);