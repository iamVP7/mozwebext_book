browser.browserAction.onClicked.addListener(icon_clicked);

function icon_clicked(tab){
  var querying_tabs = browser.tabs.query({url: "*://*.twitter.com/*"});
  querying_tabs.then(close_tabs);
}
function close_tabs(twitter_tabs){
var array_of_twitter_tabid = [];
  for(let single_twitter_tab of twitter_tabs){
    array_of_twitter_tabid.push(single_twitter_tab.id);
  }
console.log(array_of_twitter_tabid);
  browser.tabs.remove(array_of_twitter_tabid);
}