
createMenu();

function createMenu() {
	// Get the list of Seach Engine
	browser.search.get().then(buildContextMenu);

}

function buildContextMenu(searchEngineGot) {
	
	// Iterating Search Engine One by One
	for (let searchEngine of searchEngineGot) {

		// Create ContextMenu Item
		browser.contextMenus.create({
			id: searchEngine.name, // searchEngine name is set as id.
			title: searchEngine.name,  // searchEngine name is set as title.
			icons: {
				"32": searchEngine.favIconUrl  // searchEngine favicon url is set as icon
			},
			contexts: ["selection"] // context is when we selected a word
		});

	}
}

//When Menu Item is clicked we will goto function menuItemClicked
browser.contextMenus.onClicked.addListener(menuItemClicked);

function menuItemClicked(menu_info_object, tab_object){
	
	// First we have to check whether there is selectionText and also the menuItemId, both should not be null.
	if(menu_info_object != null && menu_info_object.hasOwnProperty('menuItemId')
		&& menu_info_object.hasOwnProperty('selectionText')){
			browser.search.search({
				query: menu_info_object.selectionText, // Selection text is the text which we selected and did right click
				engine: menu_info_object.menuItemId // is the searchEngine.name which we defined previously.
			});
		}
}