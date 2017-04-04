$(document).ready(function(){
  
  //animate search text box to expand on focus
  $('.search-input').on('focusin',function(){
    $(this).animate({width: '+=20%'},'slow');
  });
  
  $('.search-input').on('focusout',function(){
    $(this).animate({width: '-=20%'}, 'slow');
  });
  
  $('form[name=search]').on('submit', function(){
    event.preventDefault();
    $('#search-input').autocomplete("close");
    var searchValue = $('#search-input').val();
    clearResults();
    opensearch(searchValue);
  });
  
  $('#random-search').on('click',function(){
    //call function
    event.preventDefault();
    //just in case the user is typing something
    $('#search-input').autocomplete("close");
    clearResults();
    randomSearch();
  });
  
  
  //autocomplete
  $('#search-input').autocomplete({
    source: function(request, response){
      var url = "https://en.wikipedia.org/w/api.php?action=query&format=json&maxlag=5&list=prefixsearch&redirects=1&formatversion=2&pssearch="+request.term+"&pslimit=10&callback=?";
      
      var responseArray = [];
      $.getJSON(url, function(json){
        for (var i=0; i<json.query.prefixsearch.length; i++){
          responseArray[i] = json.query.prefixsearch[i].title;
        }
        response(responseArray);
      });
    }, minLength:0
  });

  
});


var randomSearch = function(){
  $.ajax({
    url: "https://en.wikipedia.org/w/api.php?",
    data: {
      "action": "query",
      "format": "json",
      "maxlag": 5,
      "prop": "extracts",
      "list": "random",
      "redirects": 1,
      "formatversion": 2,
      "exintro": 1,
      "explaintext": 1,
      "rnlimit": 10,
      "rnnamespace": 0
    },
    type: "GET",
    dataType: "jsonp",
    headers: {"Api-User-Agent": "Wikipedia Viewer (https://codepen.io/mplibunao/pen/NdwOxL; markpaololibunao@gmail.com )"},
    success: function(json){
      //set result header
      $('.result-header-title').html("Check out these random articles");
      var resultTitle = [];
      var resultLink = [];
      var resultHtml;
      for (var i=0; i<json.query.random.length; i++){
        resultLink[i] = "https://en.wikipedia.org/?curid="+json.query.random[i].id;
        resultTitle[i] = json.query.random[i].title;
        
        resultHtml = $('<div class="well random-results"><a href="'+resultLink[i]+'" target="_blank"><h4 class="result-title">'+resultTitle[i]+'</h4></a></div>').hide();
        $('.results-content').append(resultHtml);
        resultHtml.show(1000);
      }
    }
  });
}

var clearResults = function(){
  $('.result-header-title').empty();
  $('.results-content').empty();
}

var opensearch = function(searchVal){
  //console.log("searching for: "+ searchVal);
  $.ajax({
    url: "https://en.wikipedia.org/w/api.php?",
    data: {
      "action": "opensearch",
      "format": "json",
      "maxlag": 5,
      "search": searchVal,
      "limit": 10,
      "formatversion": 2
    },
    type: "GET",
    dataType: "jsonp",
    headers: {"Api-User-Agent": "Wikipedia Viewer (https://codepen.io/mplibunao/pen/NdwOxL; markpaololibunao@gmail.com )"},
    success: function(json){
      //console.log(json);
      
      //insert searchResultHeader
      $('.result-header-title').html('Search Results about '+json[0]+":");
      
      var resultTitle = [];
      var resultDescription = [];
      var resultLink = [];
      var resultHtml;
      //testing
      var resultJq;
      //store results then display
      for (var i=0; i<json[1].length; i++){
        resultTitle[i] = json[1][i];
        resultDescription[i] = json[2][i];
        resultLink[i] = json[3][i];
        
        //resultHtml = $('<div class="well"><a href="'+resultLink[i]+'" target="_blank"><h4 class="result-title">'+resultTitle[i]+'</h4></a> <h5 class="result-description">'+ resultDescription[i] +'</h5> <a href="'+ resultLink[i] +'" target="_blank"><h6>[more..]</h6></a></div>').hide();
        
        /* testing */
        resultHtml = '<div class="well"><a href="'+resultLink[i]+'" target="_blank"><h4 class="result-title">'+resultTitle[i]+'</h4></a> <h5 class="result-description">'+ resultDescription[i] +'</h5> <a href="'+ resultLink[i] +'" target="_blank"><h6>[more..]</h6></a></div>';
        resultJq = $(resultHtml).hide();
        $('.results-content').append(resultJq);
        /* end testing */
        
        //$('.results-content').append(resultHtml);
        
        //close autocomplete menu here just in case it wasn't done loading when I clicked submit
        $('#search-input').autocomplete("close");
        //render the results
        resultJq.show(1000);
        //resultHtml.show(1000);
      }
    }
  });
}
