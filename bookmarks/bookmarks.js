function arXiv_to_arXiv_pdf(url){
    return "arxiv.org/pdf/" + url.substring(22) + ".pdf"
}

function generate_content(key,info){
    var arXiv = /arxiv\.org\/abs\/[0-9]{4}\.[0-9]{5}/
    var arXiv_pdf = /arxiv\.org\/pdf\/[0-9]{4}\.[0-9]{5}\.pdf/

    console.log("Now checking: ",info)

    if(arXiv.test(info[0])){
        document.body.innerHTML += "<p><a href=\"" + info[0] + "\">" +key + "</a>  "+arXiv_to_arXiv_pdf(info[0])+"</p>" + "<br>"
        console.log("1st passed")
    }
    if(arXiv_pdf.test(info[0])){
        document.body.innerHTML += "<p><a href=\"" + info[0] + "\">" + "[pdf]" +key + "</a></p>" + "<br>"
        console.log("2nd passed")
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