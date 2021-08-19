let color = '#3aa757';

function postback() {
  
  // https://stackoverflow.com/a/10126042
  var inactivityTime = function () {
    console.log("starting timer")
    
    var time;
    
    window.onload = resetTimer;    
    // DOM Events
    // document.onmousemove = resetTimer;
    document.onmousemove = resetTimer;
    document.onkeydown = resetTimer;
    
    var reload_timer;

    function idle() {
        console.log("You are now idle ")
        reload_timer = window.setInterval(function(){
          console.log("Refreshing")
          RightFrame.location.href = RightFrame.location.href;
        }, 5000); // how many mill secs till refresh
    }

    function resetTimer() {
        clearTimeout(time);
        console.log("You are now no longer idle ")
        time = setTimeout(idle, 10000) // how many mill secs till start idleing
        clearInterval(reload_timer);
    }
  };

  resetTimer();
  inactivityTime();


}


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.tabs.onUpdated.addListener( function (tabId_main, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tabURL = tabs[0].url;
      var tabId = tabs[0].id
      console.log(tabId);

      if (tabURL == "https://support.gmhec.org/TDNext/Home/Desktop/Default.aspx"){
        setTimeout(() => {

          let IFR_URL = 'https://support.gmhec.org/TDNext/Apps/51/Tickets/Default.aspx'
          chrome.webNavigation.getAllFrames({tabId},(vals) => {
            
            console.log(vals)
            var frame = vals.find((e) => e.url == IFR_URL && e.parentFrameId == 0) 
            console.log("FRAME: ", frame)
            
            chrome.scripting.executeScript(
              {
                target: {tabId: tabId, frameIds: [frame.frameId]},
                func: postback,
              });

          });

          }, 10000); // time to navigate to correct page
          
      }
  });

  }
})


