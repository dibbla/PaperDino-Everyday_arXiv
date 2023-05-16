function generate_content_piece(info, index) {
    // Info for saving: [paper url, Paper Name, timestamp, comments, datestring]
    let piece = document.createElement("div");
    piece.classList.add("info");
  
    let paragraph = document.createElement("p");
  
    let paperName = document.createElement("b");
    paperName.textContent = info[1][1];
    paragraph.appendChild(paperName);
  
    let link = document.createElement("a");
    link.href = info[0];
    link.textContent = " URL";
    paragraph.appendChild(link);
    paragraph.appendChild(document.createElement("br"));
  
    if (info[1][3] !== "") {
      let comments = document.createElement("b");
      comments.classList.add("comments");
      comments.textContent = "Comment:";
      paragraph.appendChild(comments);
      paragraph.appendChild(document.createTextNode(" " + info[1][3]));
    }
  
    piece.appendChild(paragraph);
  
    return piece;
}
  
function auxilary_sort(a,b){
    return - (a[1][2] - b[1][2])
}

const divsPerPage = 2; // Number of divs to display per page
let divs = []; // Array to store dynamically generated divs
let currentPage = 1; // Track the current page number

function list_all(){
    chrome.storage.sync.get(null, function(all){
        // Generate date info & sort by timestamp
        var date_arr = new Array()

        for([key, val] of Object.entries(all)){
            date_arr.push([key,val])
            console.log("Key-val: ", key, val)
        }

        // generate 10 different test data with different dates
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google", 1610000000000, "This is a comment", "2021-01-07"]])
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-1", 1610000000222, "This is a comment", "2021-01-08"]])
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-2", 1610000000333, "This is a comment", "2021-01-09"]])
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-3", 1610000000444, "This is a comment", "2021-01-10"]])
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-4", 1610000000555, "This is a comment", "2021-01-11"]])
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-5", 1610000000666, "This is a comment", "2021-01-12"]])
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-6", 1610000000777, "This is a comment", "2021-01-13"]])
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-7", 1610000000888, "This is a comment", "2021-01-13"]])
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-8", 1610000000999, "This is a comment", "2021-01-14"]])
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-9", 1610000001000, "This is a comment", "2021-01-14"]])

        date_arr.sort(auxilary_sort)
        console.log(date_arr)

        let current_date = ""
        console.log(date_arr)
        for (let i = 0; i < date_arr.length; i++) {
            if(current_date != date_arr[i][1][4]){
                current_date = date_arr[i][1][4]
            }
            let content_piece = generate_content_piece(date_arr[i], i)
            divs.push([content_piece, current_date])
            // document.getElementById("pagination").appendChild(content_piece[0])
        }

        // render the first page
        renderCurrentPage(currentPage)
        renderPagination()
        console.log(divs)
    })
}

function renderCurrentPage(page){
    // clear the main page, then put the corresponding divs in
    document.getElementById("pagination").innerHTML = ""

    let current_date = ""
    // creat p element for date
    let date_p = document.createElement("p")
    date_p.setAttribute("class", "date")
    date_p.textContent = divs[(page-1)*divsPerPage][1]
    document.getElementById("pagination").appendChild(date_p)
    current_date = divs[(page-1)*divsPerPage][1]

    for(let i = (page-1)*divsPerPage; i < page*divsPerPage; i++){
        console.log("checking date",divs[i][1], current_date)
        console.log("checking date",typeof(divs[i][1]), typeof(current_date))
        if(divs[i][1]!==current_date){
            // creat p element for date
            let date_p = document.createElement("p")
            date_p.setAttribute("class", "date")
            date_p.textContent = divs[i][1]
            document.getElementById("pagination").appendChild(date_p)
            current_date = divs[i][1]
        }
        if(divs[i] != undefined){
            document.getElementById("pagination").appendChild(divs[i][0])
        }
    }
}

let page_btns = []

function renderPagination(){
    // set up multiple buttons for switching pages
    let numPages = Math.ceil(divs.length/divsPerPage)
    for(let i = 1; i <= numPages; i++){
        let button = document.createElement("button")
        button.setAttribute("class", "page-btn")
        button.textContent = i
        button.addEventListener("click", function(){
            currentPage = i
            for(i = 0; i < page_btns.length; i++){
                page_btns[i].setAttribute("class", "page-btn")
            }
            button.setAttribute("class", "page-btn current-page")
            renderCurrentPage(currentPage)
        })
        page_btns.push(button)
    }
    for(let i = 0; i < page_btns.length; i++){
        document.getElementById("page-btns").appendChild(page_btns[i])
    }
}

window.onload = list_all