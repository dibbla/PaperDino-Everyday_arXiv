var sidebarFlag = false
var original_margin = 0;
var sidebarHTML
var sidebar_arr
var fetch_btn

var arXiv_info_filter = /arxiv\.org\/abs\/[0-9]{4}\.[0-9]{5}/
var arXiv_pdf_filter = /arxiv\.org\/pdf\/[0-9]{4}\.[0-9]{5}\.pdf/

function startFunction(){
  // behaviour at the begining of page loading
  fetch(chrome.runtime.getURL('/sidebar/sidebar.html')).then(r => r.text()).then(html => {
    
    // sidebar init
    sidebarHTML = html
    document.body.insertAdjacentHTML('beforeend',sidebarHTML);
    original_margin = document.body.style.marginLeft
    sidebar_arr = document.getElementsByClassName("sidebar");
    if(sidebarFlag==false){
      sidebar_arr[0].style.visibility = "hidden"
    }

    // fetch btn init
    fetch_btn = document.getElementById("fetch-paper")
    fetch_btn.onclick = fetchPaper

  });
}

function fetchPaper(){
  // url filter
  /*  Current support
      arXiv paper information
      arXiv pdf read
  */
 if(arXiv_info_filter.test(document.URL)){
  
 }
 else{}
}




window.addEventListener('DOMContentLoaded', function () {
  console.log('window.addEventListener');
  startFunction();
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("message!")
    sidebarFlag = !sidebarFlag
    let url = document.URL
    if(arXiv_info_filter.test(url)||arXiv_pdf_filter.test(url)){
      if(sidebarFlag==false){
        document.body.style.marginLeft = original_margin
        sidebar_arr[0].style.visibility = "hidden"
      }
      else{
        document.body.style.marginLeft = "300px"
        sidebar_arr[0].style.visibility = "visible"
      }
    }
    else{
      alert("PaperDino only eats academic url or pdf file")
    }
    if (request.sidebarStat == "on")
      sendResponse({farewell: "get"});
  }
);
