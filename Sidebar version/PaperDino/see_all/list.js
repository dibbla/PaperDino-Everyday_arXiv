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

const divsPerPage = 12; // Number of divs to display per page
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

        date_arr.sort(auxilary_sort)
        console.log(date_arr)

        let current_date = ""
        // console.log(date_arr)
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
    })
}

function renderCurrentPage(page){
    // console.log("rendering page: ", page)
    // clear the main page, then put the corresponding divs in
    document.getElementById("pagination").innerHTML = ""

    let current_date = ""
    // creat p element for date
    let date_p = document.createElement("p")
    date_p.setAttribute("class", "date")
    date_p.textContent = divs[(page-1)*divsPerPage][1]
    document.getElementById("pagination").appendChild(date_p)
    current_date = divs[(page-1)*divsPerPage][1]

    for(let i = (page-1)*divsPerPage; i < Math.min(page*divsPerPage,divs.length); i++){
        if(divs[i] == undefined) break
        if((divs[i][1]!==current_date)&&(divs[i] != undefined)){
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

function renderPagination() {
    const numPages = Math.ceil(divs.length / divsPerPage);
    const pageBtnsContainer = document.getElementById("page-btns");
    const pageBtns = [];
  
    for (let i = 1; i <= numPages; i++) {
      const button = document.createElement("button");
      button.classList.add("page-btn");
      button.textContent = i;
      button.addEventListener("click", function () {
        console.log("clicked page: ", i);
        currentPage = i;
  
        for (let j = 0; j < pageBtns.length; j++) {
          pageBtns[j].classList.remove("current-page");
        }
  
        button.classList.add("current-page");
        renderCurrentPage(currentPage);
      });
  
      pageBtns.push(button);
      pageBtnsContainer.appendChild(button);
    }
  }
  

window.onload = list_all