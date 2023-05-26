var sidebarFlag = false
var original_margin = 0;
var sidebarHTML
var sidebar_arr
var fetch_btn

// Supported url patterns are listed here
var arXiv_info_filter = /arxiv\.org\/abs\/[0-9]{4}\.[0-9]{5}/
var arXiv_pdf_filter = /arxiv\.org\/pdf\/[0-9]{4}\.[0-9]{5}\.pdf/
var nips_pdf = /papers\.nips\.cc\/paper\/[0-9]{4}\/file\/[0-9a-zA-Z\-]+-Paper\.pdf/
var nips_info = /papers\.nips\.cc\/paper\/[0-9]{4}\/hash\/[0-9a-zA-Z\-]+-Abstract\.html/

function startFunction(){
  // for api request
  // behaviour at the begining of page loading
  if(arXiv_info_filter.test(document.URL)||
     arXiv_pdf_filter.test(document.URL))
    fetch(chrome.runtime.getURL('/sidebar/sidebar.html')).then(r => r.text()).then(html => {
      // sidebar init
      sidebarHTML = html
      document.body.insertAdjacentHTML('beforeend',sidebarHTML);
      original_margin = document.body.style.marginLeft
      sidebar_arr = document.getElementsByClassName("PaperDino-sidebar");
      if(sidebarFlag==false){
        sidebar_arr[0].style.visibility = "hidden"
      }

      // fetch btn init
      fetch_btn = document.getElementById("fetch-paper")
      fetch_btn.onclick = fetchPaper
      seeall_btn = document.getElementById("seeall")
      seeall_btn.onclick = seeall
  })
  else{}
}

function fetchPaper(){
  // url filter
  /*  Current support
      arXiv paper information
      arXiv pdf read
  */
  // get url
  var url = document.URL 

  // Create timestamp
  var time = new Date()
  var time_stamp = time.getTime()
  var time_date = time.toDateString()
  console.log(time_stamp, time_date)

  // Fetch paper's information
  if(arXiv_info_filter.test(url)){
    // Save the url
    var paper_name = document.title
  }
  else if(arXiv_pdf_filter.test(url)){
    // constrcut the query for arXiv api
    var api_base = "https://export.arxiv.org/api/query?search_query=id:" + url.substring(22,32)
    console.log(api_base)
    try{
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open( "GET", api_base, false ); // false for synchronous request
      xmlHttp.onerror = function(){return result.substring(title_start_index,title_end_index)}
      xmlHttp.send( null );
      // console.log(stat)
      var result = xmlHttp.responseText
      var title_start_index = result.indexOf("<title>") + 7
      var title_end_index = result.lastIndexOf("</title>")
      var paper_name = "[" + url.substring(22,32)+"] " + result.substring(title_start_index,title_end_index) + "(pdf)"
      console.log("Finding: ",title_start_index,title_end_index,result.substring(title_start_index,title_end_index))
    }
    catch(e){
      alert("PaperDino Fail to use arXiv API QAQ. PDF number stored")
    }
  }
  else if(nips_info.test(url)){
    // nips pdf
    var paper_name = document.title
  }
  else if(nips_pdf.test(url)){
    // nips pdf
    var paper_name = document.title + "(pdf)"
  }
  // construct information for save
  // Info for saving: [paper url, Paper Name, timestamp, comments, datestring]
  var comments = document.getElementById("comment").value
  var info = [url, paper_name, time_stamp, comments, time_date]
  console.log("current url is ",url)
  chrome.storage.sync.get(null, function(all){
    var flag = true;
    for(const [key, val] of Object.entries(all)){
      console.log("Before saving, we have: "+key+" "+val[0],val[1],val[3]);
      if((String(val[0])==String(url)) && (String(val[3])==comments)){ // we update comment as well
        flag = false
        console.log("find the same! Enum exit, with flag = "+flag);
        alert("PaperDino has already tasted this!")
        break;
      }
    }
    // If url is new, save. Else alert the url exists
    if(flag){
      // Asynchronous call back, the url store operation will be done here
      chrome.storage.sync.set({ [url] : info }, function(){
          console.log("url saved to sync ", info)
      });
    }
  })
}

// for pre-load sidebar
window.addEventListener('DOMContentLoaded', function () {
  console.log('window.addEventListener')
  startFunction()
});

function seeall(){
  // it shall send message to background.js so that chrome API can be called
  (async () => {
    const response = await chrome.runtime.sendMessage({greeting: "seeall"});
    // do something with response here, not outside the function
    console.log(response);
  })();
}

// for sidebar toggle
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log("message!")
    sidebarFlag = !sidebarFlag
    let url = document.URL
    // url filter
    // Please modify this if more sites to be added
    if(
       arXiv_info_filter.test(url)
     ||arXiv_pdf_filter.test(url)
     ||nips_pdf.test(url)
     ||nips_info.test(url)
     ){
      // toggle to show/hide sidebar
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
      seeall()
      // alert("PaperDino only eats academic url or pdf file")
    }
    if (request.sidebarStat == "on")
      sendResponse({farewell: "get"});
  }
);
