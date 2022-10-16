function generate_content(key,url){
    var arXiv = /arxiv\.org\/abs\/[0-9]{4}\.[0-9]{5}/

    if(arXiv.test(url)){
        document.body.innerHTML += "<a href=\"" + val + "\">" +key + "</a>" + "<br"
    }
}

function list_all_bookmarks(){
    var content = ""
    chrome.storage.sync.get(null, function(all){
        for([key, val] of Object.entries(all)){
            // console.log(val)
            generate_content(key,val)


        }
    })
}

window.onload = list_all_bookmarks;