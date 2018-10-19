# Building our Power Search Add-on

We got to many browser actions can be used by developers via WebExtension API(Application Program Interface), we also built our first WebExtension with which we can get motivational images whenever we open a new tab.

## Problem statement and Solution

*Problem Statement*

When we are surfing a lot there are lot of cases where we need to search on different search engines. We always don't need to use Google or Bing alone. Sometimes we will directly search in Wikipedia or want to do video search in Youtube. We are not always active to make everything using Keyboard(KB) because keyboard follow is something like 

- select the word using mouse, right click and copy it or Ctrl+C
- goto the website (if we know the address correctly we will go directly or type in google and go there)
- paste the word which we copied and hit enter.

I understand you might have sipped your coffee more than twice here.

*Solution*

So our good solution will be to use the mouse. The follow with mouse as follows; 

- select the word.
- right click. 
- search in our preferred search engine by selecting from list.

When you are selecting a word and doing the right click, you will be poped up with list of options. This small window which is coming near your mouse cursor is called as Context Menu.

![Context Menu](images/right_click.png)

**How we can capture this**

Our proposed solution has totally 3 steps. First is selecting the word, once right click is done we have to populate our options (list of search engines available in browser), then once the preferred search engine is selected then we have to create the new tab. As we have 3 steps here we are going to use 3 simple WebExtension API for this.

- Context Menu API
- Search API
- Tabs.create API (Tabs API has so many sub-api inside them, we will go through them in future)

Since our problem statement is clearly defined and we are going to use this three API only, our WebExtension development will be easier and can be finished quickly.

## Building Blocks of Our Power Search Add-on

For this extension we will learn the API step by step. So at the end joining them will be very easier.

### Create the New Tab

To create the tab, we just need the fully qualified URL which we need to open. We need to give url like "https://www.google.com" instead of "www.google.com"

A sample script is below.

```javascript
browser.tabs.create({
    url:"https://twitter.com/"
  });
```

In the above example, the value of **url** is "https://twitter.com/", we have to change this if we need to open the different tab.

### Context Menu API

Context Menu is nothing but when we click the right click a new pop-up comes near our mouse pointer. We can add our own options in the context menu using Browser Action API. It comes under privileged API, so we need to get **"contextMenus"** permission for using context menu. In  our program we will be adding the list of search engines in the context.

#### To add Options in Context Menu

It is very simple to add options in the Context menu.

```javascript
browser.contextMenus.create({
  id: "id1",
  title: "Display Word",
  contexts: ["selection"]
});
```

For each and every context menu item we need to give unique **id** so based on it we can do different actions. 
In this the value of **title** is what general users see. In Previous image **Add to Notes** is title.
Then we need to mention, when we need to show the particular contextMenu item, whether we need to show always or when we select a word (selection), when we select image alone; this is defined in **contexts**

Note: If we have only one contextMenu for our WebExtension then it will be shown directly, if we have more than 1 then under our Extension Name the list will be available.

#### Getting the selected word

Whenever we click on the contextMenu item we will be getting two things to the listener method we have defined. First one is **info Object** which will have variety of options based ont he context and Second one is **tab Object** which will have information like tabid, url and so on. When we want to start the search in our desired website, we need to have the word which is selected, so from contextMenu item we will be getting the selected word.

The word which we have click will be available in **info Object** with the key **selectionText**

### Search API

Search API will be providing us the details like what are all the search engines installed in the browser, which one is default, what is their fav icon. Search API is also privileged one, we need to get **"search" permission** from user.

#### Get list of Search Engine

Search API will be giving the list of search engine installed in our browser. As discussed before we may be having more than 1 search engine in our browser. If its not available we can install from addons.mozilla.org it will be easier and helpful.

```javascript
var list_of_searchengine = browser.search.get()
```

The above simple snippet will be fetching and giving us the list of search engine available in our machine. Each search engine will be having the values like name i.e., search engine name , may have favIconUrl i.e., search engine fav icon URL. We may be using this two things.

#### Searching in Preferred Engine

Once we got the selectedText from contextMenu our next step would be to search in the preferred search engine. To search in our required engine below code snippet will do.

```javascript
browser.search.search({
    query: "word to search",
    engine: "Wikipedia (en)"
  });
```

In this case **query** which will have the word to be searched in mandatory, **engine** is not mandatory, if we are not mentioning it, then default one will be taken. In case we mentioned it wrongly exception is thrown.

## Assembling our Power Search Extension Parts

Previously we learned about different parts for building our Power Search Extension. We have to create context menu using the search engines avaialble, get selectionText value and search it in the search engine we have.

### Writing manifest.json

As usual lets start with writing our manifest file. Here in this time we are additionally introducing three new keys for manifest.json

```json
{
"manifest_version": 2,
"name" : "Power Search Engine",
"description" : "Search the selected text in other search engines in your machine",
"version": "1.0",
"icons": {
    "96": "icons/icon-96.png"
  },
  "permissions" : [
	"search","contextMenus"
	],
"background": {
    "scripts": ["background.js"]
  }
}
```

#### icons

icons is the JSONObject, which can be used to show the icon for particular extension. It is good pratice to have beautiful icons for our extension. The normal size we should include is 96px X 96px, 60px X 60px. 

#### permissions

Permission are mandatory if we are going to use API with specific data. In this experiment we are going to use search API and contextMenu API. We have to request permission from user. Only if user grants permission we can run this extension.

#### background

As the name suggest we will have something running in the backgroud. Here we can define array of scripts so they will be useful and will be listening to everything happens around our extension.

**Note: In this program we wont be using any HTML pages, without even HTML page we can run the WebExtension**

### Our Background script file

In this experiment we are using only one background script namely background.js; we should have included this in manifest.json else we cant use it.

```javascript
createMenu();

function createMenu() {
// Get the list of Seach Engine
browser.search.get().then(buildContextMenu);
}
```

So our First step we are going to do in the background is to fetch the serach engine and once we are done with fetching we are going to build the context menu.

Whenever the script is loaded, the very first method  **createMenu()** is called.

In this method we have done steps to get the search engine **browser.search.get()**.

*.then(some_function_name)* represents once the previous process is done successfully jump to the method  *some_function_name*

So in our case once we have got the search engine list using WebExtension API we will be going to the function names **buildContextMenu**

```javascript
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
  }); // End of contextMenu creation

} // End of iteartion of SearchEngine List

} // End of method
```

Once we got the list of searchEngine successfully we are going to method named **buildContextMenu**. The parameter which we will get here is list of SearchEngine Object. This is defined by WebExtension API and we should follow the params as it is.

In this method we are having so many searchEngine's in **searchEngineGot**, so we are iterating one by one.

In one searchEngine we are having **name** and **favIconUrl** value. Additional values are also present but we are not using it. 
We are then creating the contextMenu with **name** as the *id* and *title*. Then we have to **favIconUrl** which we are using as icon to dispaly the menuitem.

```javascript
//When Menu Item is clicked we will goto function menuItemClicked
browser.contextMenus.onClicked.addListener(menuItemClicked);
```

After the menu items are created our next step is to listen whenever an menu item is clicked. This is also provided in WebExtension API. Whenever a menu item is clicked we can have a listener and pass the values to listener.

```javascript
function menuItemClicked(menu_info_object, tab_object){
// First we have to check whether there is selectionText and also the menuItemId, both should not be null.
  if(menu_info_object != null && menu_info_object.hasOwnProperty('menuItemId') && menu_info_object.hasOwnProperty('selectionText')){
    browser.search.search({
      query: menu_info_object.selectionText, // Selection text is the text which we selected and did right click
      engine: menu_info_object.menuItemId // is the searchEngine.name which we defined previously.
    });
  }
}
```

We have created a Listener named menuItemClicked; so whenever an menu item is clicked our code flow control will be passed here. We will be getting two objects, one is menu item information object and another one is tab object.

First we will be checking whether we have the menuItemId and the selected text. Both of them should be not null. And we can also have a additional check whether menuItemId we got matches with the list of search engine we have in our machine. 

Once all the preliminary checks are done we will be at our final stage. Now our only step pending is to use the query text and menuitemId( search engine ) and search in the respective Website. *browser.search.search* will accept the JSONObject, where *query* key is mandatory here we will be passing the selectedText and for search engine we have *engine* key.

![Power Search Addon Demo](images/power_search.png)

Just in case, if you want to search in the current tab itself instead of opening in new tab, you have to make slight changes.

- First in permission you additionally have to get **"activeTab"** Permission
- Second you have to make small modification in the *browser.search.search* API.

```javascript
browser.search.search({
      query: menu_info_object.selectionText, // Selection text is the text which we selected and did right click
      engine: menu_info_object.menuItemId, // is the searchEngine.name which we defined previously.
      tabId: tab_object.id // We will be passing the current tab id here.
    });
```

## Exercise

To learn More about Search API [1] and ContextMenu API [2], visit MDN link given below.

Your simple task here to find out the various search engines (around 15-20). Make them listed in your ContextMenu. This task will involve you to understand the basic how the search Query params works.

For Example: 
In Wikipedia if you are search **hello world** you will be getting the URL like below

Wiki URL: https://en.wikipedia.org/w/index.php?search=**hello+world**&title=Special%3ASearch&go=Go

In this only the highlighted part will be changing everytime. Likewise find for other search engines also and create your extension. You may have to decide what title you have to give, id you have to give.

You may also have to do some little parsing.

Optional: It will be great if you can share your code or blog about this learning in twitter. Our Mozilla Webextension twitter handle is (@MozWebExt) and make sure you use hashtag #WebExtLearn when you are tweeting about this learning. 

- [1] https://mzl.la/2q13lSO
- [2] https://mzl.la/2J3k7tc

\pagebreak
