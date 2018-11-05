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
