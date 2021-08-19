let color = '#3aa757';

function postback() {
  // alert('test123');
  javascript:document.getElementById("btnRefresh").click();
}


chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tabURL = tabs[0].url;
      var tabID = tabs[0].id
      console.log(tabID);

      if (tabURL == "https://support.gmhec.org/TDNext/Home/Desktop/Default.aspx"){
        setTimeout(() => {  

          console.log("REFRESHING!");
          
          chrome.scripting.executeScript(
            {
              target: {tabId: tabID},
              func: postback,
            });

        }, 10000);
        
      }
  });

  }
})


