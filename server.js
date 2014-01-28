'use strict';

var http     =  require('http');
var fs       =  require('fs');
var path     =  require('path');
var log      =  require('npmlog');

function serveError (res, err) {
  console.error(err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end(err.toString());
}

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function logMsg (req, res) {
  var data = '';
  req
    .on('data', function (d) { data += d } )
    .on('end', function () {
      var args = JSON.parse(data);
      log[args.type]('chrome', args.msg);
      res.writeHead(201);
      res.end();
    })
}

function sendOptions(req, res) {
  log.info('server', 'origin', req.headers.origin);
  var hdrs = req.headers;

  // allow exactly what the extension needs
  var replyHdr = { 
      'Access-Control-Allow-Origin'      : hdrs.origin
    , 'Access-Control-Allow-Methods'     : hdrs['access-control-request-method']
    , 'Access-Control-Allow-Headers'     : hdrs['access-control-request-headers']
    , 'Access-Control-Allow-Credentials' : true
    , 'Access-Control-Max-Age'           : 1728000
  };
  res.writeHead(200, replyHdr);
  res.end();
}

var server = http.createServer(function (req, res) {
  log.http('server', '%s %s', req.method, req.url);
  if (req.method === 'OPTIONS') return sendOptions(req, res);
  if (req.url === '/log') return logMsg(req, res);
  res.writeHead(404);
  res.end();
});

server.on('listening', function (address) {
  var a = server.address();
  console.log('listening: http://%s:%d', a.address, a.port);  
});
server.listen(3000);
