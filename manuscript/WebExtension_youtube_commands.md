# Experiment 6: Building Shortcuts for Youtube Controller

## Problem Statement and Solution

*Problem Statement*

Think of the busy working day. To relax you should be playing some of your favorite songs on Youtube. And as you continue listening you will start browsing the internet. It is very easy to open so many tabs and it will become difficult to find the Youtube tab which you opened long back. You may love to skip the song when some irritating song comes or you would like to switch between pause and play when someone comes and talks to you.

*Solution*

In such a case we should be quickly able to find the Youtube tab and do the action. There are two ways we can do this. 

The first solution is to make a small pop-up with different buttons like play/pause and next song.

The second solution is to make use of the shortcuts. Yes, we can build our own shortcuts in Firefox.

In this tutorial, we will learn how to creat our own shortcuts in an extension. 

**How we can capture this**

As our proposed solution is related to shortcuts we have a WebExtension API named `commands` [1] which we can use to build our own shortcuts for Firefox. And after creating shortcuts we can programmatically click the next song button or play/pause button on Youtube. To achieve this we need to write some minimal script to click the buttons. After we write the script we have to execute them, to this in the Tabs API we have a special method called **executeScript()** [2], similarly, we also have for CSS named **insertCSS()** which we won't use as of now.

## Building Blocks of Our Youtube Controller Extension

### Define the Shortcut

Our very first task will be to define the shortcut which we are going to use for our actions. We need to define unique shortcuts for both the set of actions. Our shortcuts will be defined in the manifest.json

```javascript

"commands": {
  "next-song": {
      "suggested_key": { "default": "Ctrl+Alt+N" },
      "description": "Go to next song"
    }
}
```

Each and every command will have a name, in our example **next-song** is the name of the shortcut. Each command will have two properties *suggested_key* and *description*. **Description** is the just one line about this particular shortcut. And **suggested_key** will have the set of shortcuts based on the operating system. List of keys which can be present in the suggested_key json is shared below. **default** is not specific to any platform it will be used in all platforms.

```javascript
"default", "mac", "linux", "windows", "chromeos", "android", "ios"
```

### Listening to commands

In our background script, we should be listening when our command is triggered. We have **onCommand.addListener** method for this. In this, for the call back function, we will be receiving the **command_name** as the argument. Based on the **command_name** we have to execute different scripts.

```javascript
  browser.commands.onCommand.addListener(on_command_received);
  
  function on_command_received(command_name){
    // Do something based on command_name
  }

```

### Execute the Click Scripts

So we have manually found out the button ID in the Youtube. It should be done before starting the development of extension. It is one time process only.

```javascript
// Script for clicking the next button
document.querySelector(".ytp-next-button.ytp-button").click();

// Script for clicking the play/pause button
document.querySelector(".ytp-play-button.ytp-button").click()
```

The first part of executing the script is to find in which tab the *Youtube* is running. To this, we have already using `tabs.query` API. We just need to change the value of the variable **url**

```javascript
  var querying = browser.tabs.query({
    url: "*://*.youtube.com/*"
  });
```

So from this, we will be getting the tabs object, in that for the first tab we will be getting the ID and executing the script on that tab alone.

```javascript
  var executing = browser.tabs.executeScript(
    tabID, {
      code: commandToExecute
      });
```

Here the value of **commandToExecute** is the script which we have got earlier for programatically click the play/pause or next song button.

## Assembling our Power Search Extension Parts

### manifest.json file

As usual, we will be starting with our manifest.json file and will make the single script file.

```javascript
{
    "manifest_version": 2,
    "name": "Youtube controller Using Shortcuts",
    "description": "Control Youtube play without visiting the tab.",
    "homepage_url": "http://iamvp7.github.io/",
    "version": "1.0",
    "icons": {
        "96": "icons/icon-96.png"
    },
    "background": {
        "scripts": ["background.js"]
    },
    "permissions": [
        "*://*.youtube.com/*",
        "tabs"
    ],
    "commands": {
        "next-song": {
            "suggested_key": {
                "default": "Ctrl+Alt+N"
            },
            "description": "Go to next song"
        },
        "pp-song": {
            "suggested_key": {
                "default": "Ctrl+Alt+P"
            },
            "description": "play or pause the song"
        }

    }
}
```

In this manifest.json in permission, we will be requiring the website permission of youtube and tabs because we are going to execute the script where youtube in running.

And the newest part of manifest.json you will notice is the **commands** object. We will be defining what are the commands we will be using and what are their shortcuts and their description in manifest.json itself.

### Our Background Script File

```javascript
var commandToExecute = '';

browser.commands.onCommand.addListener(on_command_received);
function on_command_received(command_name) {

    if (command_name == 'next-song') {
        commandToExecute = 'document.querySelector(".ytp-next-button.ytp-button").click()';
    } else if (command_name == 'pp-song') {
        commandToExecute = 'document.querySelector(".ytp-play-button.ytp-button").click()';
    }

    // Query tabs based on url
    var querying = browser.tabs.query({
        url: "*://*.youtube.com/*"
    });
    querying.then(executeOnTab, onError);
}


function executeOnTab(tabs) {
    var tabID = tabs[0].id; // getting the first tab ID alone

    var executing = browser.tabs.executeScript(
        tabID, {
            code: commandToExecute
        }
    );
    executing.then(onExecuted, onError);
}

function onError(error) {
    console.log(`Error: ${error}`);
}


function onExecuted(result) {
    console.log(`We executed script in the first youtube tab`);
}
```

So our background script file is well explained and is organized well.

First, we will have a listener (**onCommand.addListener**) to listen when the shortcut is triggered. We have a callback function (**on_command_received**) for this listener. This callback function will be receiving the command as the argument.

Then based on the command (either *next-song* or *pp-song*) we will be assigning the script which we need to execute. After that our process is to find the first Youtube tab. Using the **tabs.query** the method we will be getting the **tabId** of first Youtube tab. 

As we have the required tab ID and the script to execute, we will be using **browser.tabs.executeScript** method to execute the script and make our necessary changes.

Note: Since this extension is purely based on commands it is not possible to add the screenshot of UI.

## Exercise

To learn more about Commands API [1] and tabs.Execute [2], visit the MDN link given below.

We are having a small limitation on this. Our system will work when we have only one Youtube tab. But in the ideal world people can have more than one Youtube tabs. So instead of using the commands API, try to create the browserAction popup with the screenshot of the images. You can get the screenshot of the tab using **tabs.captureTab()** [3].

You can also do this exercise for other music streaming sites. 

Optional: It will be great if you can share your code or blog about this learning on Twitter. Make sure you use hashtag #WebExtLearn when you are tweeting about this activity. 


## References

- [1] https://mzl.la/2zuxQoJ
- [2] https://mzl.la/2Lnf1aT
- [3] https://mzl.la/2D4QoPJ
