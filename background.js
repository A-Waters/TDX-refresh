// TO DO: create interface 
// TO DO: make sure user navigates the the right page before injection
// TO DO: updateable times

// 1000 milliseconds = 1 second

const tab_to_be = "https://support.gmhec.org/TDNext/Home/Desktop/Default.aspx"


var running = false;
var refresh_time = 180000;
var refresh_tab_id;
var urls = [];

function cleint_update_time(speed) {
  console.log("new_time", speed)
  localStorage.setItem("refresh_speed", speed)
}

function ai_51frame() {
  console.log("added");

  // boring varibales
  var reload_timer;
  var time;

  // inject into new iframe
  function inject() {
    document.getElementById('RightFrame').contentWindow.document.onmousemove = () => {
      window.resetTimer();
    }
  }

  // refresh the window
  window.refresh = function refresh() {
    reload_timer = setInterval(function () {

      // refresh
      RightFrame.location.href = RightFrame.location.href;
      // wait for page to load for 2 seconds
      setTimeout(inject, 2000)

    }, parseInt(localStorage.getItem("refresh_speed"))); // how often should refresh (3 min) 180000
  }

  // check for movement
  window.resetTimer = function resetTimer() {
    // stop reloading
    clearInterval(reload_timer)
    // reset idle timer
    clearTimeout(time);
    time = setTimeout(refresh, parseInt(localStorage.getItem("refresh_speed"))) // how long till idle (currently 1 min) 60000
  }


  // when to reset timer
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;
}

chrome.runtime.onInstalled.addListener(() => {
  
  chrome.storage.local.get(["refresh_time"], function(data) {
    if (data == undefined) {
      chrome.storage.local.set({
        "refresh_time": refresh_time
      });
    } else {
      refresh_time = data.refresh_time
    }

    console.log('Default idol time:', `${refresh_time}`);
  });
  

});


// check each new tab
chrome.tabs.onUpdated.addListener(function (tabId_main, changeInfo, tab) {
  if (changeInfo.url) {
    urls[tabId_main] = changeInfo.url;
  }

  // if loaded and not already running
  if (changeInfo.status == 'complete' && running == false) {

    // grab tab data
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, function (tabs) {

      console.log(tabs)
      var tabURL = tabs[0].url;
      refresh_tab_id = tabs[0].id

      // check if we are at the right location
      if (tabURL == tab_to_be) {

        
        //TO DO: update to be more user friendly
        setTimeout(() => {

          // grab url of Iframe
          const AI_51_URL = "https://support.gmhec.org/TDNext/Apps/51/Tickets/Default.aspx"

          // grab all iframe
          chrome.webNavigation.getAllFrames({
            tabId: refresh_tab_id
          }, (vals) => {

            // once all frames are grabed grab the frame we need
            var ai_51_frame = vals.find((e) => e.url == AI_51_URL && e.parentFrameId == 0)

            // inject js to refresh page
            console.log("injecting")

            chrome.scripting.executeScript({
              target: {
                tabId: refresh_tab_id,
                frameIds: [ai_51_frame.frameId]
              },
              func: ai_51frame,
            });

            // set running to true
            running = true
          });

        }, 10000); // time to navigate to correct page

      }
    });

  }
})



async function getCurrentTab() {
  let queryOptions = {
    active: true,
    currentWindow: true
  };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}


chrome.tabs.onRemoved.addListener(function (tabId, moveInfo) {

  if (urls[tabId] == tab_to_be) {
    running = false;
  }

})




chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log("change recived!");
  chrome.storage.local.get(["refresh_time"], (val) => {
    console.log('New idol time:', val.refresh_time);

    // frameIds: [ai_51_frame.frameId]
    getCurrentTab().then((res) => {

      console.log(res)
      chrome.scripting.executeScript({

        target: {
          tabId: res.id,
        },
        func: cleint_update_time,
        args: [val.refresh_time]
      })
    })
  });

});