function generate_content_piece(info, index){
    // Info for saving: [paper url, Paper Name, timestamp, comments, datestring]
    let piece = ""
    piece += "<div class=\"info\">\n"
    piece += "<p>\n"
    piece += "<b>" + info[1][1] + "</b>"
    piece += "<a href=" + info[0] + "> URL</a><br>"
    if(info[1][3]!=""){
        piece += "<b class=\"comments\">Comment:</b> " + info[1][3]
    }
    piece += "</p>\n"
    piece += "</div>\n"
    return piece
}

function auxilary_sort(a,b){
    return - (a[1][2] - b[1][2])
}

function list_all(){
    chrome.storage.sync.get(null, function(all){
        // Generate date info & sort by timestamp
        var date_arr = new Array()

        for([key, val] of Object.entries(all)){
            date_arr.push([key,val])
        }

        date_arr.sort(auxilary_sort)
        console.log(date_arr)

        let current_date = ""
        for (let i = 0; i < date_arr.length; i++) {
            if(current_date != date_arr[i][1][4]){
                current_date = date_arr[i][1][4]
                document.body.innerHTML += "<p class=\"date\"><b>" + current_date + "</b></p>"
            }
            let content_piece = generate_content_piece(date_arr[i], i)
            document.body.innerHTML += content_piece
        }
    })
}

window.onload = list_all