# Building our Tabs Closer

We have seen previosly how to search using different search engine available in our browsers. It should interesting and easy one right ? Hope the execrise you tried might have left to finding the URL of different search engines and what are all the extra information they are sending as request params.

## Problem statement and Solution

*Problem Statement*

Now when we are star surfing internet, we end up opening atleast 10-20 tabs, because each and every page have some many hyperlinks which we love to learn and come back, but in reality hyperlinks in that pages leads to different page again there are so many hyper links. In such a case if you are in college or office closing the social media websites (some of us do, we dont love to show it to our boss) will be difficult have to close so many tabs after finding them.

*Solution*

The simple solution will be to have the list of social websites we visit and with one click, we can close all the tabs. The another solution will be to list all the tabs we have close from an pop-up one by one; this will work great when we are having more than 20 tabs.

**How we can capture this**

Breaking according to two solutions.

*Showing the pre-defined Social Network sites*

In this type, we will be pre-defining the one social media website which we visit often. We will be having the icon to close that particular social media website alone. On clicking the icon, all the tabs having that social media website URL should be closed.

*Fetching all opened URL*

Another approach will be fetching all the opened websites, listing them one by one and when we click on close button we can close them. Just incase we need to visit them we will have another button to visit the particular tab.

In this execrise we will be learning the following list of API

- Tabs.query (To fetch all tabs)
- Tabs.remove (Close)
- Tabs.move (To display the tab clicked)
- Browser Action Icon
- Browser Action pop-up

# Building Blocks of Our Social Media Tab Closer

First we will take a look at the API we will be using in this Execrise.

### Starting the Closing Operation

First step is we need to click on the browserAction icon. As the name suggest browserAction icon will have to scope throughtout the browser and it is not specific to any one particular tab. So whenever we click on it irrespective of tabs we can do the procedure. Once we have click the icon we need to capture the click action.

We have browserAction API for capturing this. *browserAction.onClicked* will be used to listen to click action on that icon.

```javascript
browser.browserAction.onClicked.addListener(action_jump_function_name);
```

### Fetching the twitter tabs

In this case we will be knowing the website URL of Twitter, it is nothing but https://twitter.com/ . So our first step will be to get all the tabs where Twitter is loaded. Our WebExtension *tabs.query* have lot of combination to get(or fetch) the tabs loaded, in this case we are going to fetch based on **URL**

```javascript
browser.tabs.query({url: "*://*.twitter.com/*"});
```

Some times we wont know whether its *http* or *https* so we are using the regex (Regular Expression) *://* before twitter.com and also we may be having anything loaded so we have /* at the end of .com

### Close the tabs

Once we have got the tabs (or single tab) we need to close them. We have to get the tabid from the tab object we got, based on that only we will be closing the tabs.

```javascript
var removing = browser.tabs.remove([tab_id1, tab_id10, tab_id15]);
```

## Assembling parts of our Extension