$(function () { // Same as document.addEventListener("DOMContentLoaded",...

  // Same as document.querySelector("#main-content").innerHTML = ...
  function insertHtml(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  }

  // Show loading icon inside element specified by 'selector'.
  function showLoading(selector) {
    var html = "<div class='text-center'>";
    html += "<img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
  }

  // Return substitute of '{{property}}'
  // with propValue in given 'string'
  var insertProperty = function (string, propName, propValue) {
    var propertyToReplace = "{{" + propName + "}}";
    string = string
      .replace(new RegExp(propertyToReplace, "g"), propValue);
    return string;
  }

  // Remove the class 'active' from home and switch to Menu button
  var switchMenuToActive = function () {
    // Remove 'active' from home button
    var classes = document.querySelector("#navHomeButton").className;
    classes = classes.replace(new RegExp("active", "g"), "");
    document.querySelector("#navHomeButton").className = classes;

    // Add 'active' to menu button if not already there
    classes = document.querySelector("#navMenuButton").className;
    if (classes.indexOf("active") == -1) {
      classes += " active";
      document.querySelector("#navMenuButton").className = classes;
    }
  };

  // On page load (before images or CSS)
  document.addEventListener("DOMContentLoaded", function (event) {

    // TODO: STEP 0 - Set absolute URL for categories stream
    var allCategoriesUrl =
      "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";

    var homeHtmlUrl = "snippets/home-snippet.html";

    // Show loading icon
    showLoading("#main-content");

    // TODO: STEP 1 - Request all categories and pass buildAndShowHomeHTML as callback
    $ajaxUtils.sendGetRequest(
      allCategoriesUrl,
      buildAndShowHomeHTML,
      true); // Explicitly setting the flag to get JSON from server
  });

  // TODO: STEP 2 - Build home HTML with random category short_name
  function buildAndShowHomeHTML(categories) {

    // Load home snippet HTML
    $ajaxUtils.sendGetRequest(
      "snippets/home-snippet.html",
      function (homeHtmlSnippet) {

        // TODO: STEP 3 - Choose a random category
        var randomCategory = chooseRandomCategory(categories);
        var randomCategoryShortName = "'" + randomCategory.short_name + "'";

        // TODO: STEP 4 - Substitute {{randomCategoryShortName}} with chosen category short_name
        var homeHtmlToInsertIntoPage = insertProperty(
          homeHtmlSnippet,
          "randomCategoryShortName",
          randomCategoryShortName
        );

        // Insert the produced HTML into the main element
        insertHtml("#main-content", homeHtmlToInsertIntoPage);
      },
      false); // False because we are getting plain HTML, not JSON
  }

  // TODO: STEP 2 Helper Function - Given array of category objects, returns a random category object
  function chooseRandomCategory(categories) {
    var randomArrayIndex = Math.floor(Math.random() * categories.length);
    return categories[randomArrayIndex];
  }

  // Export $dc to global scope
  window.$dc = {};

});