// Initialize button with user's preferred color
let refresh = document.getElementById("Refresh_Rate");

refresh.addEventListener("change", (data) => {
  console.log(data)

  chrome.storage.local.set({
    "refresh_time": refresh.value
  });
});
