startFetchingTabs();

// Fetch all the tabs
function startFetchingTabs() {
  var querying = browser.tabs.query({});
  querying.then(create_list_tabs, onError);
}

function create_list_tabs(fetched_tabs) {
  // delete already existing child nodes.
  if (document.getElementById("tabs_list").childNodes.length > 0) {
    var myNode = document.getElementById("tabs_list");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  }

  // Create new child nodes.
  for (let single_tab of fetched_tabs) {

    var created_div = document.createElement("div");
    created_div.style.width = "200px";
    created_div.style.background = "red";
    created_div.style.color = "white";
    created_div.innerHTML = single_tab.title;
    created_div.id = single_tab.id;
    created_div.className = "single_div";
    created_div.addEventListener("click", function () {
      close_tab(single_tab.id);
    }, false);

    document.getElementById("tabs_list").appendChild(created_div);
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}

// Close the tab and recreate the popup html
function close_tab(tab_id_to_close) {
  browser.tabs.remove(tab_id_to_close);
  startFetchingTabs();
}
