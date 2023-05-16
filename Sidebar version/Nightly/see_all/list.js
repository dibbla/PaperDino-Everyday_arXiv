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
        date_arr.push(["https://www.google.com", ["https://www.google.com", "Google-9", 1610000000000, "This is a comment", "2021-01-14"]])

        date_arr.sort(auxilary_sort)
        console.log(date_arr)

        let current_date = ""
        console.log(date_arr)
        for (let i = 0; i < date_arr.length; i++) {
            if(current_date != date_arr[i][1][4]){
                current_date = date_arr[i][1][4]
                // document.body.innerHTML += "<p class=\"date\"><b>" + current_date + "</b></p>"
                divs.push([])
            }
            
            let content_piece = generate_content_piece(date_arr[i], i)
            divs[divs.length-1].push(content_piece)
            document.getElementById("pagination").appendChild(content_piece)
        }
        
        console.log(divs)
    })
}

function renderPagination(){

}
window.onload = list_all