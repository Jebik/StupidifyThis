/**
 * Copyright (c) 2011 The Chromium Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style license that can be
 * found in the LICENSE file.
 */

if (localStorage['lastVersionUsed'] != '1') 
{
	localStorage['lastVersionUsed'] = '1';
	chrome.tabs.create(
	{
		url: chrome.extension.getURL('options.html')
	});
}

function stupidifySelection(info, tab) 
{
	if (info["editable"] == false)
	{
		return;
	}
	chrome.tabs.sendMessage(tab.id, {stupidify: true});
}

function initBackground() 
{
	var defaultKeyString = getDefaultKeyString();
	var keyString = localStorage['stupidifyKey'];
	if (keyString == undefined) 
	{
		keyString = defaultKeyString;
		localStorage['stupidifyKey'] = keyString;
	}
	sendKeyToAllTabs(keyString);
	
	chrome.extension.onRequest.addListener(function(request, sender, sendResponse)
	{
		if (request['init'])
		{
			sendResponse({'key': localStorage['stupidifyKey']});
		}
	});
	
	// Create one test item for each context type.
	var context = "selection";
	chrome.contextMenus.create(
	{
		"title": "Stupidify This",
		"contexts":[context],
		"onclick": stupidifySelection
	});
}

initBackground();
