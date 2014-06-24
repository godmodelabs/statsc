# StatsC

StatsC lets you log statistics to your graphite/statsd servers straight from the browser.

Just like StatsD, StatsC is a fire and forget thing. StatsC can't take your site down if it fails, only statistics won't get logged.

StatsC is __transport agnostic__ so you can use whatever transport method you want.

By default it uses script-tags to provide cross domain ajax without using any libraries. Logging operations are buffered for 5s and then transmitted together.

## Installation

### Server

```bash
$ sudo npm install -g statsc
$ statsc-server
  StatsC server listening on port 8127
```

or

```bash
$ npm install statsc
```

```javascript
var statsc = require('statsc');
var http = require('http');

http.createServer(statsc.http).listen(8127, function() {
  console.log('StatsC server listening on port 8127');
});
```

### Client

Include the client script in your `<head>`:

```html
<script src="client.js"></script>
```

For testing you can serve it from rawgithub.com:

```html
<script src="https://rawgithub.com/godmodelabs/statsc/master/client.js"></script>
```

StatsC automatically sends collected metrics to `http://localhost:8127/` over the standard transport.

You can scale this thing up easily by just picking one of your available servers randomly, like:

```javascript
var availablePorts = [8127, 8128, 8129];
var port = availablePorts[Math.round(Math.random()*availablePorts.length)-1];
statsc.connect('addr:'+port);
```

## Server API

### statsc.http(req, res)
HTTP(s) server handle. Pass to http(s).createServer() in order to handle the standard script-tag transport.

### statsc.receive(op)
Logs `op` to StatsD.

You have to use this if you don't use `statsc.http`.

Example with Learnboost/socket.io:

```javascript
socket.on('statsc', function(data) {
 statsc.receive(data);
});
```

### statsc.setAddress(addr)
Configure the address at which StatsD runs.

## Client API

### statsc.connect(addr)
Use this if the server isnt listening on `http://localhost:8127` or perhaps if you are using a custom `send` method.

### statsc.increment(stat[, sampleRate])
Increment the counter at `stat` by 1.

### statsc.decrement(stat[, sampleRate])
Decrement the counter at `stat` by 1.

### statsc.gauge(stat, value[, sampleRate])
Set the gauge at `stat` to `value`.

### statsc.timing(stat, time[, sampleRate])
Log `time` to `stat`.

`time` can either be

  * a number in milliseconds
  * a Date object, created at the timer's start
  * a synchronous function to be timed

### statsc.timer(stat[, sampleRate])
Timer utility in functional style.

Returns a function you can call when you want to mark your timer as resolved.

### statsc.send(data)
Standard implementation of a `send` method using script tags. This shouldn't need to be called manually.

Overwrite this if you want to use websockets or jsonp or whatever.

Example using LearnBoost/socket.io:

```javascript
statsc.send = function(data) {
 socket.emit('statsc', data);
};
```

## License

(MIT)

Copyright (c) 2012 Julian Gruber &lt;jgruber@boerse-go.de&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
