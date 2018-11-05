# Experiment 5: Building our Water Notifier Extension

Humans depends on a lot on notification system. The simplest thing and more like a hello world program for WebExtension is building Notification system. I got started with sending simple notification.

## Problem statement and Solution

*Problem Statement*

We are in a very busy life where we even forget to drink the recommended about of water for our body. This leads to dehydration and we start performing badly. One of the simplest solution is being well disciplined and drinking 1 glass of water for every 45 mins, this wont happen unless we have self control. Another solution is having alarm in mobiles, sometimes if it rings people around us will get irritated. Another solution which can be done with WebExtension is sending us notification in our browser for every 45 mins so we know some actions to be done.

*Solution*

So our solution is simple, have a alarm in our system so we will be sending the notification every 45 mins.

**How we can capture this**

Our proposed system has clearly mentioned we need to have alarm in our browser, and to show something in UI for that lets have a small Notification UI. We are having the following list of WebExtension API.

- alarms API [1]
- notifications API [2]
- Runtime API [3]

In our system we need to set alarm for every 45 mins from the time we started our browser, so we need to find out when the browser is started so for that we need the help of **Runtime API**. This Extension is one of my favorite as I started learning WebExtension development with this.

## Building Blocks of Our Water Notifier Extension

We can develop this extension very easily. Our building blocks for this is very simple and we will use simple 3 API for the whole process.

### Finding the Browser Startup & Add-ons Installation

Our first step is to find out when the Add-ons is installed or when the Add-on is opened. From that time we have to calculate 45 mins and send the Notification.

```javascript
// Add a method what to happen when Addon is installed
browser.runtime.onInstalled.addListener(handleInstalled);

// Add a method what to happen when browser starts
browser.runtime.onStartup.addListener(handleStartup);
```

We have two different Listener. First one is when the Extension is installed and the second one is when we are starting our Browser.

### Setting the Alarm

Our next step after finding the Add-ons installation or browser startup is to set the alarm.

```javascript
browser.alarms.create("my-periodic-alarm-install", {
  when,
  periodInMinutes
});
```

Our good practice is to give first the name of the alarm. In our above example **my-periodic-alarm-install** is the name of the alarm.

After that we will be mentioning the value of **when**, the time at what the very first alarm should be triggered.  Secondly we will also be giving the value of **periodInMinutes** this is set to 45 because we wanted to trigger the alarm each 45 mins.

If we already having alarm with same name for this extension, then the previous alarm will be deleted and new alarm will be set.

### Capture the Alarm

Once we set the alarm our next step is to listen in the background when our alarm is triggered and we have to capture it and do our processing. Even in our mobiles, when the alarm signal is trigger it is captured then some sounds (alarm tone) is made to play, we should understand when alarm is triggered it means signals are triggered not the sound.

```javascript
  browser.alarms.onAlarm.addListener(handleAlarm);
```

We have an listener method in alarms API for this.  So we will have method and do the actions we need to do.

### Fire the Notification

After we have captured the alarm triggered our final step is to show the notification.

```javascript
browser.notifications.create(waterNotification, {
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/icon-96.png"),
    "title": "Time for Water",
    "message": "Drink enough water to stay healthy"
  });
```

We will have the notification id at the place of **waterNotification**. As of now Firefox is supporting only basic type of notification. We can have a small **title** text and a descriptive **message** alone in our notification.

Note in case we call notification creation more than once in rapid succession, Firefox may end up not displaying any notification at all.

### Assembling our Water Notifier Extension Parts

So almost everything what we have discussed is available as a single code file (background.js). If we copy and paste with one addition of method thats enough to make this Extension work.

#### Writing manifest.json

Our manifest.json is very simple. Only change which is available in at the permission's part. We need alarms permission and notification permission.

```javascript
{
"manifest_version": 2,
"name" : "Notification Alarm",
"description" : "Sending Notification and Alarm",
"homepage_url": "http://iamvp7.github.io/",

"version": "2.0",
"permissions" : [
  "notifications",
  "alarms"
  ],
"background": {
    "scripts": ["background.js"]
  }
}
```

#### Adding listeners

So as discussed before we are having two listeners in our program.

```javascript

// Add a method what to happen when Addon is installed
browser.runtime.onInstalled.addListener(handleInstalled);

// Add a method what to happen when browser starts
browser.runtime.onStartup.addListener(handleStartup);
```

#### Adding Implementation for listeners

Both the listeners have different parameters in the callback function. So we have to define two methods.

##### Listener for startup

```javascript
// Method handling when the browser starts
function handleStartup() {
  createAlarm();
}
```

So this method wont have any params. The only action we are doing from here is to moving the call where we can create the alarm.

##### Listener for installation

```javascript
// Method to handle when the addon is installed
function handleInstalled(details) {
  createAlarm();
}
```

This call back method will have installation details like id, previous version. Here also we are just moving to  create the alarm method, no other action is done.

#### Create the alarm

So after listening to installation and startup our step is to create the alarm.

```javascript
function createAlarm(){
  const when = nearestMin30();
  browser.alarms.create("my-periodic-alarm-install", {
    when,
    periodInMinutes
  });

}

// Finding the nearest 30 Mins
function nearestMin30(){
  var now = new Date();
  now.setMinutes(d.getMinutes() + 45);
  return  now.getTime();
}
```

We will be finding the nearest 45 mins from startup / installation and we will be setting the alarm. The method **nearestMin30** job is to find the nearest 45 mins and return its milliseconds value.

#### Adding listeners for alarms

Our major one line of this program is adding listener for the Alarms. Once the alarm is set we should be listening for its trigger in background always. If the trigger is set we need to do our required action, in our case its pushing the notification.

```javascript
browser.alarms.onAlarm.addListener(handleAlarm);
```

#### Push the notification

So our final step is to push the simple notification. A simple notification will come, so we can understand water has to be drank at that time.

Before installing the extension for testing bring the time to 1 min or 2 mins. After installing the Extension, wait for the mentioned time and a notification will be coming in soon.

![Water Notification](images/notification.png)

## Exercise

To learn More about below list of API, visit MDN link given below.

- alarms API [1]
- notifications API [2]
- Runtime API [3]

Your simple task is to create a WebExtension which will have a pageAction icon, on click it we should make the article to be opened after 30 mins. This Extension will look like a simple version of Firefox Test pilot Snooze tab. In this we will using Open tab API, Alarms API, pageAction API.

Optional: It will be great if you can share your code or blog about this learning in twitter. Our Mozilla Webextension twitter handle is (@MozWebExt) and make sure you use hashtag #WebExtLearn when you are tweeting about this learning.

## References

- [1] https://mzl.la/2zBlyuT
- [2] https://mzl.la/2zrMn4r
- [3] https://mzl.la/2zqzxDE