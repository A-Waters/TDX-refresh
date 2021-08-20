let running = false;
// TO DO: create interface 
// TO DO: create closing tab to turn off running
// TO DO: make sure user navigates the the right page before injection

// 1000 milliseconds = 1 second

function ai_51frame() {

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
  window.refresh = function refresh() 
  {
    reload_timer = setInterval(function(){
      
      // refresh
      RightFrame.location.href = RightFrame.location.href; 
      // wait for page to load for 2 seconds
      setTimeout(inject, 2000)  

    }, 180000 ); // how often should refresh (3 min) 180000
  }

  // check for movement
  window.resetTimer = function resetTimer() 
  {
    // stop reloading
    clearInterval(reload_timer)
    // reset idle timer
    clearTimeout(time);
    time = setTimeout(refresh, 60000) // how long till idle (currently 1 min) 60000
  }


  // when to reset timer
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ idle_time });
  console.log('Default idol time:', `${idle_time}`);
});


// check each new tab
chrome.tabs.onUpdated.addListener( function (tabId_main, changeInfo, tab) {

  // if loaded and not already running
  if (changeInfo.status == 'complete' && running == false) {
    
    // grab tab data
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tabURL = tabs[0].url;
      var tabId = tabs[0].id

      // check if we are at the right location
      if (tabURL == "https://support.gmhec.org/TDNext/Home/Desktop/Default.aspx"){
        
      //TO DO: update to be more user friendly
        setTimeout(() => {
          
          // grab url of Iframe
          let AI_51_URL = "https://support.gmhec.org/TDNext/Apps/51/Tickets/Default.aspx"
          
          // grab all iframe
          chrome.webNavigation.getAllFrames({tabId}, (vals) => {
            
            
            // once all frames are grabed grab the frame we need
            var ai_51_frame = vals.find((e) => e.url == AI_51_URL && e.parentFrameId == 0) 
            
            // inject js to refresh page
            chrome.scripting.executeScript(
            {
              target: {tabId: tabId, frameIds: [ai_51_frame.frameId]},
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


