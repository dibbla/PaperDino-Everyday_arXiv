function generate_content(key,url){
    var arXiv = /arxiv\.org\/abs\/[0-9]{4}\.[0-9]{5}/
    var arXiv_pdf = /arxiv\.org\/pdf\/[0-9]{4}\.[0-9]{5}\.pdf/

    console.log("Now checking: ",url)

    if(arXiv.test(url)){
        document.body.innerHTML += "<p><a href=\"" + url + "\">" +key + "</a></p>" + "<br>"
        console.log("1st passed")
    }
    else{
        if(arXiv_pdf.test(url)){
            document.body.innerHTML += "<p><a href=\"" + url + "\">" + "[pdf]" +key + "</a></p>" + "<br>"
            console.log("2nd passed")
        }
    }
}

function list_all_bookmarks(){
    var content = ""
    chrome.storage.sync.get(null, function(all){
        for([key, val] of Object.entries(all)){
            generate_content(key,val)
        }
    })
}

window.onload = list_all_bookmarks;