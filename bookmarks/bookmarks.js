function arXiv_to_arXiv_pdf(url){
    return "arxiv.org/pdf/" + url.substring(22) + ".pdf"
}

function arXiv_pdf_to_arXiv(url){
    var api_base = "http://export.arxiv.org/api/query?search_query=id:" + url.substring(22,32)
    // console.log(api_base)
    try{
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open( "GET", api_base, false ); // false for synchronous request
        xmlHttp.onerror = function(){return result.substring(title_start_index,title_end_index)}
        xmlHttp.send( null );
        // console.log(stat)
        var result = xmlHttp.responseText
        var title_start_index = result.indexOf("<title>") + 7
        var title_end_index = result.lastIndexOf("</title>")
        // console.log("Finding: ",title_start_index,title_end_index,result.substring(title_start_index,title_end_index))

        return result.substring(title_start_index,title_end_index)
    }
    catch(e){
        return url.substring(22,32)
    }
}

function generate_content(info){
    var arXiv = /arxiv\.org\/abs\/[0-9]{4}\.[0-9]{5}/
    var arXiv_pdf = /arxiv\.org\/pdf\/[0-9]{4}\.[0-9]{5}\.pdf/

    console.log("Now checking: ",info)

    if(arXiv.test(info[1][0])){
        document.body.innerHTML += "<p><a href=\"" + info[1][0] + "\">" + info[0] + "</a>  "+ "<a href=\"https://" + arXiv_to_arXiv_pdf(info[1][0])+"\">"+"<i>PDF</i>"+"</a>"+"</p>" + "<br>"
        console.log("1st passed")
    }
    if(arXiv_pdf.test(info[1][0])){
        document.body.innerHTML += "<p><a href=\"" + info[1][0] + "\">" + "[PDF]" +arXiv_pdf_to_arXiv(info[1][0]) + "</a></p>" + "<br>"
        arXiv_pdf_to_arXiv(info[1][0])
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
        // date_arr.push(['[1901.10902] Test: Transfer and Exploration via the Information Bottleneck',['https://arxiv.org/abs/1901.10903', 1566077401269, 'Mon Oct 17 2022']]) // This line just for testing
        date_arr.sort(aux_sort).reverse()
        console.log(date_arr)

        current_date = date_arr[0][1][2]

        document.body.innerHTML += "<h2>"+current_date+"</h2>"

        for([key,val] of Object.entries(date_arr)){
            console.log(val[1][2])
            if(val[1][2]!=current_date){
                document.body.innerHTML += "<h2>"+val[1][2]+"</h2>"
                current_date = val[1][2]
            }

            generate_content(val)
        }
    })
}

window.onload = list_all_bookmarks;