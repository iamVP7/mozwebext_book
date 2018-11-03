
	browser.tabs.onUpdated.addListener(listen_tab_update);

	browser.tabs.onActivated.addListener(listen_when_tab_activated);

	browser.tabs.onCreated.addListener(listen_when_tab_create);

	// Come to this method when the tab url gets changed
	function listen_tab_update(tabId, changeInfo, tab) {
		getCurrentTabDetails();
	}

	// Come to this method when the tab gets changed.
	function listen_when_tab_activated (activeInfo) {
		getCurrentTabDetails();
	}

	// When the tab is created we will get tab object, from tab object itself we can get the tab id and show directly
	function listen_when_tab_create(tab){
		getCurrentTabDetails();
	}


	function getCurrentTabDetails(){
		var querying = browser.tabs.query({currentWindow: true, active: true});
		querying.then(getInfoForTab, onError);
	}

	/* 
	Once we get the tab Information of current tab, come here.
	get the current tab object.
	check current tab is Article type.
		if Article type then show the pageAction icon.

	*/
	function getInfoForTab(tabs) {
		if (tabs.length > 0 && tabs[0] != null && tabs[0].isArticle) {
				browser.pageAction.show(tabs[0].id);
		}
	}


	function onError(error) {
		console.log(`Error: ${error}`);
	}



	/*
		After the user clicked the small page action icon, we will be listening at doPageActClickProc
	*/
	browser.pageAction.onClicked.addListener(doPageActClickProc);



	// Bring in the save as PDF pop-up
	function doPageActClickProc(){
			// browser.tabs.toggleReaderMode();	
		browser.tabs.saveAsPDF({});
	}
