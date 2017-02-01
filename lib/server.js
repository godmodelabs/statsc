/**
 * Module dependencies
 */

var statistik = require('statistik');
var log = new statistik();

/**
 * StatsC server
 * @type {Object}
 */

var statsc = {};

/**
 * used for url shortening
 * @type {Object}
 */

var methods = {
  i: 'increment',
  d: 'decrement',
  t: 'timing',
  g: 'gauge',
  s: 'send'
}

/**
 * HTTP server handle
 * 
 * Pass to http(s).createServer() in order to handle the standard script-tag
 * transport.
 *
 * @throws {String} If invalid data is given
 * @param  {object} req
 * @param  {object} res
 */

statsc.http = function(req, res) {

  //CORS, for simple get, there is no pre-flight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');

  res.writeHead(200, {'Content-Type': 'application/json'});

  // overwrite res.end for json serving
  var end = res.end.bind(res);
  res.end = function (data) {
    return end(JSON.stringify(data));
  }

  if (req.method != 'GET') return res.end('Only GET supported');

  var url = decodeURIComponent(req.url).replace(/\//g, '');
  if (url == 'favicon.ico') return res.end();
  if (url[0] != '[') return res.end('File serving not supported');

  try {
    var ops = JSON.parse(url);
  } catch (err) {
    return res.end(err.toString());
  }

  for (var i = 0, len = ops.length; i < len; i++) {
    try {
      statsc.receive(ops[i]);
    } catch(err) {
      return res.end(err.toString());
    }
  }

  res.end('OK');
}

/**
 * Logs `op` to StatsD.
 *
 * Format for `op`:
 *   op = [method, stat, (value/sampleRate), (sampleRate)]
 *
 * @throws {String} If `op` isn't valid
 * @param  {array}  op
 */

statsc.receive = function(op) {
  // must be array
  if (!isArray(op)) throw 'op must be Array, is: '+s(op);

  // must have 2-4 arguments
  if (op.length < 2 || op.length > 4) {
    throw 'Wrong number of arguments: '+s(op);
  }

  // must only consist of strings and numbers
  if (typeof op[0] != 'string') throw '1st arg must be method, is '+s(op[0]);
  if (typeof op[1] != 'string') throw '2nd arg must be stat, is: '+s(op[1]);
  if (typeof op[2] != 'undefined' && typeof op[2] != 'number') {
    throw '3rd arg must be number, is: '+s(op[2]);
  }
  if (typeof op[3] != 'undefined' && typeof op[3] != 'number') {
    throw '4rd arg must be number, is: '+s(op[3]);
  }

  // must call valid method
  var valid = false;
  for (abr in methods) {
    if (abr == op[0]) {
      op[0] = methods[abr];
      valid = true;
      break;
    }
  }
  if (!valid) throw 'Method `'+op[0]+'` not supported';

  // log away, everything's fine
  log[op[0]].apply(log, op.splice(1));
  log.increment('client.stats.collected');
}

/**
 * Configure the address at which StatsD runs
 * 
 * @param {string} address `host:port`
 */

statsc.setAddress = function(address) {
  log = new statistik(address);
}

/**
 * Utilify function array checker
 * 
 * @param  {object}  o
 * @return {Boolean}
 */

function isArray(o) {
  return typeof o == 'object' && o instanceof Array;
}

/**
 * JSON.Stringify shortened
 * @param  {object} o
 * @return {string}
 */

function s(o) {
  return JSON.stringify(o);
}

/**
 * Expose StatsC to the world
 */

module.exports = statsc;
