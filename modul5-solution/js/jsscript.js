$(function () { // Same as document.addEventListener("DOMContentLoaded",...)

  // Collapse mobile nav menu on blur
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
});

(function (global) {

var dc = {};

var homeHtmlUrl = "snippets/home-snippet.html";
var allCategoriesUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var categoriesTitleHtml = "snippets/categories-title-snippet.html";
var categoryHtml = "snippets/category-snippet.html";
var menuItemsUrl =
  "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
var menuItemsTitleHtml = "snippets/menu-items-title.html";
var menuItemHtml = "snippets/menu-item.html";

// Convenience function for inserting innerHTML
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  if (targetElem) {
    targetElem.innerHTML = html;
  }
};

// Show loading icon inside element specified by 'selector'
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images_menu/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}' with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string.replace(new RegExp(propToReplace, "g"), propValue);
  return string;
};

// Remove the class 'active' from home and switch to Menu button
var switchMenuToActive = function () {
  var classes = document.querySelector("#navHomeButton").className;
  classes = classes.replace(new RegExp("active", "g"), "");
  document.querySelector("#navHomeButton").className = classes;

  classes = document.querySelector("#navMenuButton").className;
  if (classes.indexOf("active") === -1) {
    classes += " active";
    document.querySelector("#navMenuButton").className = classes;
  }
};

// On page load
document.addEventListener("DOMContentLoaded", function (event) {

  // STEP 1 - Request all categories and pass buildAndShowHomeHTML as callback
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true); // Explicitly setting the flag to get JSON from server
});

// STEP 2 & 3 & 4 - Build home HTML with random category short_name
function buildAndShowHomeHTML(categories) {

  $ajaxUtils.sendGetRequest(
    homeHtmlUrl,
    function (homeHtmlSnippet) {

      // STEP 3 - Choose a random category
      var randomCategory = chooseRandomCategory(categories);
      var randomCategoryShortName = "'" + randomCategory.short_name + "'";

      // STEP 4 - Substitute {{randomCategoryShortName}} with chosen category short_name
      var homeHtmlToInsertIntoPage = insertProperty(
        homeHtmlSnippet,
        "randomCategoryShortName",
        randomCategoryShortName
      );

      // Insert the produced HTML into the main element
      insertHtml("#main-content", homeHtmlToInsertIntoPage);
    },
    false);
}

// STEP 2 Helper Function - Given array of category objects, returns a random category object
function chooseRandomCategory(categories) {
  var randomArrayIndex = Math.floor(Math.random() * categories.length);
  return categories[randomArrayIndex];
}

// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowCategoriesHTML);
};

// Load the menu items view
dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    menuItemsUrl + categoryShort + ".json",
    buildAndShowMenuItemsHTML);
};

// Builds HTML for the categories page
function buildAndShowCategoriesHTML (categories) {
  $ajaxUtils.sendGetRequest(
    categoriesTitleHtml,
    function (categoriesTitleHtml) {
      $ajaxUtils.sendGetRequest(
        categoryHtml,
        function (categoryHtml) {
          switchMenuToActive();
          var categoriesViewHtml =
            buildCategoriesViewHtml(categories,
                                    categoriesTitleHtml,
                                    categoryHtml);
          insertHtml("#main-content", categoriesViewHtml);
        },
        false);
    },
    false);
}

function buildCategoriesViewHtml(categories, categoriesTitleHtml, categoryHtml) {
  var finalHtml = categoriesTitleHtml;
  finalHtml += "<section class='row'>";

  for (var i = 0; i < categories.length; i++) {
    var html = categoryHtml;
    var name = "" + categories[i].name;
    var short_name = categories[i].short_name;
    html = insertProperty(html, "name", name);
    html = insertProperty(html, "short_name", short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

// Builds HTML for the single category menu items page
function buildAndShowMenuItemsHTML (categoryMenuItems) {
  $ajaxUtils.sendGetRequest(
    menuItemsTitleHtml,
    function (menuItemsTitleHtml) {
      $ajaxUtils.sendGetRequest(
        menuItemHtml,
        function (menuItemHtml) {
          switchMenuToActive();
          var menuItemsViewHtml =
            buildMenuItemsViewHtml(categoryMenuItems,
                                   menuItemsTitleHtml,
                                   menuItemHtml);
          insertHtml("#main-content", menuItemsViewHtml);
        },
        false);
    },
    false);
}

function buildMenuItemsViewHtml(categoryMenuItems, menuItemsTitleHtml, menuItemHtml) {
  menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "name", categoryMenuItems.category.name);
  menuItemsTitleHtml = insertProperty(menuItemsTitleHtml, "special_instructions", categoryMenuItems.category.special_instructions);

  var finalHtml = menuItemsTitleHtml;
  finalHtml += "<section class='row'>";

  var menuItems = categoryMenuItems.menu_items;
  var catShortName = categoryMenuItems.category.short_name;
  for (var i = 0; i < menuItems.length; i++) {
    var html = menuItemHtml;
    html = insertProperty(html, "short_name", menuItems[i].short_name);
    html = insertProperty(html, "catShortName", catShortName);
    html = insertItemPrice(html, "price_small", menuItems[i].price_small);
    html = insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);
    html = insertItemPrice(html, "price_large", menuItems[i].price_large);
    html = insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);
    html = insertProperty(html, "name", menuItems[i].name);
    html = insertProperty(html, "description", menuItems[i].description);

    if (i % 2 !== 0) {
      html += "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}

function insertItemPrice(html, pricePropName, priceValue) {
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");
  }
  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}

function insertItemPortionName(html, portionPropName, portionValue) {
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }
  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}

global.$dc = dc;

})(window);
