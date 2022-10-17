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
                if(String(val[0])==String(url)){
                    flag = false
                    console.log("find the same! Enum exit, with flag = "+flag);
                    alert("url already svaed")
                    break;
                }
            }

            // We don't save non academic url
            var arXiv = /arxiv\.org\/abs\/[0-9]{4}\.[0-9]{5}/
            var arXiv_pdf = /arxiv\.org\/pdf\/[0-9]{4}\.[0-9]{5}\.pdf/
            if((!arXiv.test(url))&&(!arXiv_pdf.test(url))){
                flag = false
                alert("Be academic!")
            }

            // If url is new, save. Else alert the url exists
            if(flag){
                var time = new Date()
                var time_stamp = time.getTime()
                var time_date = time.toDateString()
                var info = [url,time_stamp,time_date]
                // Asynchronous call back, the url store operation will be done here
                chrome.storage.sync.set({ [tab_key] : info }, function(){
                    console.log("Url saved to sync ", info)
                });
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