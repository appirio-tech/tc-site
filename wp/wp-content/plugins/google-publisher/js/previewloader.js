/*
Copyright 2013 Google Inc. All Rights Reserved.

This file is part of the Google Publisher Plugin.

The Google Publisher Plugin is free software:
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation,
either version 2 of the License, or (at your option) any later version.

The Google Publisher Plugin is distributed in the hope that it
will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty
of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General
Public License for more details.

You should have received a copy of the GNU General Public License
along with the Google Publisher Plugin.
If not, see <http://www.gnu.org/licenses/>.
*/

var googlePublisherPluginPreviewLoader = {};


/**
 * The URL of the publisher plugin frontend server.
 * @const {string}
 */
googlePublisherPluginPreviewLoader.FRONTEND_URL =
    'https://publisherplugin.google.com';


/**
 * Callback to handle postMessage calls.
 *
 * @param {Object} event The postMessage event.
 */
googlePublisherPluginPreviewLoader.receiveMessage = function(event) {
  if (event.origin !== googlePublisherPluginPreviewLoader.FRONTEND_URL) {
    return;
  }
  var data = /** @type {PostMessageData} */ (JSON.parse(event.data));
  if (data.action == 'load_script' &&
      data.relativeScriptSrc.indexOf('/_/publisher_plugin/') == 0) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.gstatic.com' +
        data.relativeScriptSrc;
    document.body.appendChild(script);
  }
};


/**
 * Sends a postMessage to retrieve the scripts required for previews.
 */
googlePublisherPluginPreviewLoader.getScripts = function() {
  if (window.self !== window.parent) {
    // Only attempt postMessage when this page is shown in an iframe.
    window.top.frames['admin-iframe'].postMessage(JSON.stringify({
      action: 'get_scripts'
    }), 'https://publisherplugin.google.com');
  }
};


window.addEventListener('message',
    googlePublisherPluginPreviewLoader.receiveMessage, false);

window.addEventListener('DOMContentLoaded',
    googlePublisherPluginPreviewLoader.getScripts, false);
