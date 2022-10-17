function arXiv_to_arXiv_pdf(url){
    return "arxiv.org/pdf/" + url.substring(22) + ".pdf"
}

// function arXiv_pdf_to_arXiv(url){
    // request for title
// }

function generate_content(info){
    var arXiv = /arxiv\.org\/abs\/[0-9]{4}\.[0-9]{5}/
    var arXiv_pdf = /arxiv\.org\/pdf\/[0-9]{4}\.[0-9]{5}\.pdf/

    console.log("Now checking: ",info)

    if(arXiv.test(info[1][0])){
        document.body.innerHTML += "<p><a href=\"" + info[1][0] + "\">" + info[0] + "</a>  "+ "<a href=\"https://" + arXiv_to_arXiv_pdf(info[1][0])+"\">"+"PDF"+"</a>"+"</p>" + "<br>"
        console.log("1st passed")
    }
    if(arXiv_pdf.test(info[1][0])){
        document.body.innerHTML += "<p><a href=\"" + info[1][0] + "\">" + "[pdf]" +info[0] + "</a></p>" + "<br>"
        console.log("2nd passed")
    }
}

function aux_sort(a,b){
    return a[1][1]-b[1][1]
}

function list_all_bookmarks(){
    var content = ""
    chrome.storage.sync.get(null, function(all){
        // Generate date info
        var date_arr = new Array()

        for([key, val] of Object.entries(all)){
            date_arr.push([key,val])
        }

        date_arr.sort(aux_sort)
        console.log(date_arr)

        current_date = date_arr[0][1][2]

        document.body.innerHTML += "<h2>"+current_date+"</h2>"

        for([key,val] of Object.entries(date_arr)){
            console.log(val[1][2])
            if(val[1][2]!=current_date){
                document.body.innerHTML += "<h2>"+current_date+"</h2>"
                current_date = val[1][2]
            }

            generate_content(val)
        }
    })
}

window.onload = list_all_bookmarks;