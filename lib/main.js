'use strict';

/*jshint browser: true */
/*global chrome, alert */

var xhr = require('xhr');
var format = require('util').format;

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function onlogged (err, res, body) {
  // POST req to log works, but we get called with error here, not sure why
  // if (err) alert(err + '\nres: ' + inspect(res));
}

function log_(type, args) {
  var pl = { type: type, msg: format(args) };
  xhr(
    { json: pl
    , uri: 'http://localhost:3000/log'
    , headers: { 'Content-Type': 'application/json' }
    , method: 'POST'
    , cors: true
    } 
  , onlogged
  );
}

var log = {
    info: log_.bind(null, 'info')
  , error: log_.bind(null, 'error')
}

function createMainPanel() {
  return chrome.devtools.panels.create(
      'DevBro'
    , 'logo.png'
    , '/pages/panel.html'
    , function () { log.info('main panel created') }
  );
}

function createSidebar() {
  return chrome.devtools.panels.elements.createSidebarPane(
      'DevBro Files'
    , function (sidebar) { 
        log.info('side panel created');
        sidebar.setObject({ data: 'data to show' });
      } 
  );
}

window._log = log;
createMainPanel();
