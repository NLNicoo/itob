// ==UserScript==
// @name          Ignore threads on bitcointalk
// @author        NLNico
// @version       0.0.1
// @namespace     https://github.com/NLNicoo
// @downloadURL   https://github.com/NLNicoo/itob/raw/master/itob.user.js
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js
// @include       https://bitcointalk.org/*
// @grant         GM_getValue
// @grant         GM_setValue
// ==/UserScript==

// Load ignored threads
var threads = GM_getValue("threads");
if (typeof threads === "undefined") {
  threads = "";
  if ((defaultThreads = prompt("Optional: fill in ignored thread list:","")) !== null && defaultThreads !== "") threads = defaultThreads;
  GM_setValue("threads",threads);
}

// Loop all threads
if ($("#bodyarea table.bordercolor table.bordercolor,#bodyarea .tborder table.bordercolor")) {
  $("#bodyarea table.bordercolor table.bordercolor,#bodyarea .tborder table.bordercolor").each(function() {
    $(this).find("tr").each(function() {
      var link = $(this).find("td:eq(2) a");
      if (typeof link.attr("href") !== "undefined") {
        var id = link.attr("href").match(/topic\=([0-9]+)/);
        if(id !== null) {
          if(threads.split(",").indexOf(id[1]) != -1) $(this).addClass("ignored_topic");
          switchLink($(this).find("td:eq(2)"),id);
        }
      }
    });
  });
}

// Add remove/add link
function switchLink(element,id) {
  // Check which link to add
  if(threads.split(",").indexOf(id[1]) != -1) {
    var remove = 1;
    element.find('.addLink').remove();
    var elementHtml = $('<a href="#" class="removeLink">+</a>');
  } else {
    var remove = 0;
    element.find('.removeLink').remove();
    var elementHtml = $('<a href="#" class="addLink">-</a>');
  }

  // Add link and click handler
  element.prepend(elementHtml).find(elementHtml).click(function(){
    if (remove == 1) {
      threads = threads.split(",");
      threads.splice(threads.indexOf(id[1]), 1);
      threads = threads.join(",");
      GM_setValue("threads",threads);
      $(this).parent().parent().removeClass("ignored_topic");
      switchLink(element,id);
    } else {
      threads = threads.split(",");
      threads.push(id[1]);
      threads = threads.join(",");
      GM_setValue("threads",threads);
      $(this).parent().parent().addClass("ignored_topic");
      switchLink(element,id);
    }
    return false;
  });
}

// Add Ignored threads link
$('<td valign="top" class="maintab_back"><a href="#">Ignored threads</a></td>').insertBefore('.maintab_last').click(function(){
  if ((defaultThreads = prompt("Ignored threads:",threads)) !== null) {
    if (threads != defaultThreads) {
      if (defaultThreads.indexOf("...") != -1) {
        // TODO: should fix maybe
        alert("Aw.. we got a bug in Chrome where you cannot edit the thread list if it's more than 2,000 characters... sorry :(");
      } else {
        threads = defaultThreads;
        GM_setValue("threads",threads);
        window.location.reload(false);
      }
    }
  }
  return false;
});

// Style
$('body').append("<style>.addLink,.removeLink{float:right;width:18px;text-align:center;margin:0 2px;padding:5px 0;border:1px solid #476c8e;}.ignored_topic .addLink,.ignored_topic .removeLink{border-color:#acabad}.ignored_topic .newimg{display:none;}</style>");