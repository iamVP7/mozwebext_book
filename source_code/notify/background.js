const periodInMinutes = 45; // for every 45 alarm should come

var waterNotification = "water-notification";



// Add a method what to happen when Addon is installed
browser.runtime.onInstalled.addListener(handleInstalled);

// Add a method what to happen when browser starts
browser.runtime.onStartup.addListener(handleStartup);

// Add a method when a alarm is triggerd
browser.alarms.onAlarm.addListener(handleAlarm);


// Create the basic notification
function createNoti(){

browser.notifications.create(waterNotification, {
    "type": "basic",
    "iconUrl": browser.extension.getURL("icons/icon-96.png"),
    "title": "Time for Water",
    "message": "Drink enough water to stay healthy"
  });

}

// when the alarm is triggerd print the alarm name and create the notification call
function handleAlarm(alarmInfo) {
  console.log("on alarm: " + alarmInfo.name);
	createNoti();
}



// Method handling when the browser starts
function handleStartup() {

createAlarm();

}

// Method to handle when the addon is installed
function handleInstalled(details) {

createAlarm();

}


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
	now.setMinutes(now.getMinutes() + 45);
	return  now.getTime();
}


