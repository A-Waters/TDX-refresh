let running = false;

// 1000 milliseconds = 1 second

function ai_51frame() {
  // RightFrame.location.href = RightFrame.location.href;
  console.log("adding a refresh")
  var reload_timer;

  // inject into new iframe
  function inject() {
    document.getElementById('RightFrame').contentWindow.document.onmousemove = () => {
      //gives me location in terms of the iframe but not the entire page.
      window.resetTimer(); 
    }
  }

  // refresh the window
  window.refresh = function refresh() 
  {
    reload_timer = setInterval(function(){
      RightFrame.location.href = RightFrame.location.href;
      setTimeout(inject, 2000)  // wait for page to load for 2 seconds
    }, 5000); // how often should refresh
  }

  // check for movement
  window.resetTimer = function resetTimer() 
  {
    clearInterval(reload_timer)
    clearTimeout(time);
    time = setTimeout(refresh, 60000) // how long till idle (currently 1 min)

  }

  var time;

  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;
}

function rightframe() {
  console.log("adding a refresh pt2")
  document.onmousemove = parent.document.resetTimer;
  document.onkeydown = parent.document.resetTimer;
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.tabs.onUpdated.addListener( function (tabId_main, changeInfo, tab) {
  if (changeInfo.status == 'complete' && running == false) {
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tabURL = tabs[0].url;
      var tabId = tabs[0].id

      if (tabURL == "https://support.gmhec.org/TDNext/Home/Desktop/Default.aspx"){
        setTimeout(() => {
          
          let AI_51_URL = "https://support.gmhec.org/TDNext/Apps/51/Tickets/Default.aspx"
          chrome.webNavigation.getAllFrames({tabId},(vals) => {
                               
            var ai_51_frame = vals.find((e) => e.url == AI_51_URL && e.parentFrameId == 0) 
                     
            chrome.scripting.executeScript(
            {
              target: {tabId: tabId, frameIds: [ai_51_frame.frameId]},
              func: ai_51frame,
            });
            
          
            running = true
          });

          }, 10000); // time to navigate to correct page
          
      }
  });

  }
})


