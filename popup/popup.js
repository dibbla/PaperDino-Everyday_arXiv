console.log("popup inits OK")

async function enumStorage() {
    const all = await chrome.storage.sync.get();
    console.log("Enum all begin:")
    for (const [key, val] of Object.entries(all)) {
      console.log(key+" "+val)
    }
}

function fetchURL(){
    console.log("fetchURL button clicked!")
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs=>{
        let url = tabs[0].url;
        let tab_key = tabs[0].title;
        console.log("Succuessfully fetched url as type: ",typeof(url));

        // Save the new url
        chrome.storage.sync.get(null, function(all){
            var flag = true;
            for(const [key, val] of Object.entries(all)){
                console.log("Before saving, we have: "+key+" "+val);
                if(String(val)==String(url)){
                    flag = false
                    console.log("find the same! Enum exit, with flag = "+flag);
                    break;
                }
            }
            // If url is new, save. Else alert the url exists
            if(flag){
                // Asynchronous call back, the url store operation will be done here
                chrome.storage.sync.set({ [tab_key] : url }, function(){
                    console.log("Url saved to sync ", url)
                });
            }
            else{
                alert("This url is already saved")
            }
        })
    })
};

function openMenu(){
    chrome.tabs.create({'url': 'bookmarks/bookmarks.html'}, function(tab) {});
}

let fetch_url_button = document.getElementById("fetch_url_button");
let open_menu_button = document.getElementById("open_menu_button");


fetch_url_button.onclick = fetchURL;
open_menu_button.onclick = openMenu;