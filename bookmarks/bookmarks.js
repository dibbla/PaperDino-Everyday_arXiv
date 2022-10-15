function list_all_bookmarks(){
    var content = ""
    chrome.storage.sync.get(null, function(all){
        for(const [key, val] of Object.entries(all)){
            console.log(val)
            document.getElementById("t").innerHTML += val
            document.getElementById("t").innerHTML += "<br>"
        }
    })
}

window.onload = list_all_bookmarks;