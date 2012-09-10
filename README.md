StatsC
======

StatsC lets you log statistics to your graphite/statsd servers straight from the browser.

Just like StatsD, StatsC is a fire and forget thing. StatsC can't take your site down if it fails, only statistics won't get logged.

It supports 2 transports:

* **Ajax** (default): Statistics are aggregated and flushed every 10s
* **Websockets**: Statistics are transmitted immediately

However websockets are only recommended if you already have socket.io included in your site.

Installation
------------

### Server

```bash
git clone git://github.com/juliangruber/statsc.git
cd statsc
npm install
node server
```

### Client

In your `<head>`:

```html
<script src="https://raw.github.com/juliangruber/statsc/master/client.js"></script>
```

StatsC automatically sends collected metrics to `http://localhost:8126/` over the standard transport.

You can scale this thing up easily by just picking one of your available servers randomly, like:

```javascript
var availablePorts = [8127, 8128, 8129];
var port = availablePorts[Math.round(Math.random()*availablePorts.length)-1];
stats.connect('addr:'+port);
```

API
---

### statsc.connect(addr)
Use this if the server isnt listening on `http://localhost:8126` or perhaps if you are using a custom `send` method.

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
statsc.send = function(data) { socket.emit('statsc', data); };
```

License
-------
(MIT)

Copyright (c) 2012 Julian Gruber <jgruber@boerse-go.de>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.