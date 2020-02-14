// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function moduleDidLoad() {
  common.hideModule();
}

// Called by the common.js module.
function domContentLoaded(name, tc, config, width, height) {
  navigator.webkitPersistentStorage.requestQuota(2048 * 2048,
      function(bytes) {
        common.updateStatus(
            'Allocated ' + bytes + ' bytes of persistant storage.');
        common.attachDefaultListeners();
        common.createNaClModule(name, tc, config, width, height);
      },
      function(e) { alert('Failed to allocate space') });
}

// Called by the common.js module.
function attachListeners() {
  var radioEls = document.querySelectorAll('input[type="radio"]');
  for (var i = 0; i < radioEls.length; ++i) {
    radioEls[i].addEventListener('click', onRadioClicked);
  }

  // Wire up the 'click' event for each function's button.
  var functionEls = document.querySelectorAll('.function');
  for (var i = 0; i < functionEls.length; ++i) {
    var functionEl = functionEls[i];
    var id = functionEl.getAttribute('id');
    var buttonEl = functionEl.querySelector('button');

    // The function name matches the element id.
    var func = window[id];
    buttonEl.addEventListener('click', func);
  }
}

function onRadioClicked(e) {
  var divId = this.id.slice(5);  // skip "radio"
  var functionEls = document.querySelectorAll('.function');
  for (var i = 0; i < functionEls.length; ++i) {
    var visible = functionEls[i].id === divId;
    if (functionEls[i].id === divId)
      functionEls[i].removeAttribute('hidden');
    else
      functionEls[i].setAttribute('hidden', '');
  }
}

// function addNameToSelectElements(cssClass, handle, name) {
//   var text = '[' + handle + '] ' + name;
//   var selectEls = document.querySelectorAll(cssClass);
//   for (var i = 0; i < selectEls.length; ++i) {
//     var optionEl = document.createElement('option');
//     optionEl.setAttribute('value', handle);
//     optionEl.appendChild(document.createTextNode(text));
//     selectEls[i].appendChild(optionEl);
//   }
// }
// 
// function removeNameFromSelectElements(cssClass, handle) {
//   var optionEls = document.querySelectorAll(cssClass + ' > option');
//   for (var i = 0; i < optionEls.length; ++i) {
//     var optionEl = optionEls[i];
//     if (optionEl.value == handle) {
//       var selectEl = optionEl.parentNode;
//       selectEl.removeChild(optionEl);
//     }
//   }
// }

var filehandle_map = {};
var dirhandle_map = {};

function fopen(e, fname) {
  
  
  var command = {'command': 'open', "target":fname, "buffer":e, "id": "hobu"} ;
   
  nacl_module.postMessage(command);
}


function getheader(e) {
  var command = {'command': 'getheader', "id":'hobu'}  
  nacl_module.postMessage(command);
}

function readData(e) {
    // var buffer = new ArrayBuffer(1065*34);
    // var buffer = new ArrayBuffer(416627466);
    // var buffer = new ArrayBuffer(4240553288); // 421196726
    // var buffer = new ArrayBuffer(421196726);
    
    
    
  var command = {'command': 'read', 'count': 500, "id":"hobu", 'skip':4, 'start': 2}  
  nacl_module.postMessage(command);
}

function fclose(e) {
    
  var command = {'command': 'close', "id":"hobu"}  
  nacl_module.postMessage(command);
}





function fopenResult(filename, filehandle) {
  filehandle_map[filehandle] = filename;
  var command = {'command': 'open', "filename":filename}
  addNameToSelectElements('.file-handle', filehandle, filename);
  common.logMessage('File ' + filename + ' opened successfully.');
}


/**
 * Return true when |s| starts with the string |prefix|.
 *
 * @param {string} s The string to search.
 * @param {string} prefix The prefix to search for in |s|.
 * @return {boolean} Whether |s| starts with |prefix|.
 */
function startsWith(s, prefix) {
  // indexOf would search the entire string, lastIndexOf(p, 0) only checks at
  // the first index. See: http://stackoverflow.com/a/4579228
  return s.lastIndexOf(prefix, 0) === 0;
}

function makeCall(func) {
  var message = func;
  for (var i = 1; i < arguments.length; ++i) {
    message += '\1' + arguments[i];
  }

  return message;
}

// Called by the common.js module.
function handleMessage(message_event) {
  var msg = message_event.data;

  common.logMessage("From module: " + msg);
}

$(function() {
    console.log("Document loaded");
    $("#fopenFilename").on("change", function() {
        var file = $("#fopenFilename").get(0).files[0];
        var fr = new FileReader();
        fr.onload = function(e) {
            var ab = e.target.result;
            console.log(ab, ab.byteLength);
            fopen(ab, file.name);
        }
        fr.readAsArrayBuffer(file);
    });
})

document.onload = function(e) {
    
}
