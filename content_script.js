/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

var stupidifyKeyStr;

function stupidifyAlgo(text)
{
	var i = 0;
	var updatedText = text.split('');
	while (i < text.length)
	{
		updatedText[i] = updatedText[i].toUpperCase();
		i += Math.floor(Math.random() * 3) + 2;
	}
	
	return updatedText.join('');
}

async function stupidify() 
{
	navigator.permissions.query({
		name: 'clipboard-read'
	});	
	navigator.permissions.query({
		name: 'clipboard-write'
	});
	document.execCommand("cut");
	var text = await navigator.clipboard.readText();
	text = stupidifyAlgo(text);
	await navigator.clipboard.writeText(text);
	document.execCommand("paste");
}

function onExtensionMessage(request) 
{
	if (request['key'] != undefined)
	{
		stupidifyKeyStr = request['key'];
	}
}

function initContentScript()
{
	chrome.extension.onRequest.addListener(onExtensionMessage);
	chrome.extension.sendRequest({'init': true}, onExtensionMessage);
	
	chrome.runtime.onMessage.addListener(function(request, sender) 
	{
		if (request.stupidify == true)
		{
			 stupidify();
		}
	});
	
	document.addEventListener('keydown', function(evt) 
	{
		if (!document.hasFocus()) 
		{
			return true;
		}
		var keyStr = keyEventToString(evt);
		if (keyStr == stupidifyKeyStr && stupidifyKeyStr.length > 0)
		{
			stupidify();
			evt.stopPropagation();
			evt.preventDefault();
			return false;
		}
		return true;
	}, false);
}

initContentScript();
