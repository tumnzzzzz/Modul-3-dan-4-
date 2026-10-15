(function (global) {
var dc = {};

var allCategoriesUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
var menuItemsUrl = "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";

var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  if (targetElem) {
    targetElem.innerHTML = html;
  }
};

var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<h2 style='color:#fff;'>Loading...</h2></div>";
  insertHtml(selector, html);
};

// STEP 4: Fungsi memilih kategori acak
function chooseRandomCategory (categories) {
  var randomArrayIndex = Math.floor(Math.random() * categories.length);
  return categories[randomArrayIndex];
}

document.addEventListener("DOMContentLoaded", function (event) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    allCategoriesUrl,
    buildAndShowHomeHTML,
    true);
});

// STEP 1, 2, 3: Membangun HTML Halaman Utama
function buildAndShowHomeHTML (categories) {
  // STEP 2: Pilih kategori acak
  var chosenCategoryShortName = chooseRandomCategory(categories).short_name;

  // HTML Snippet Langsung Ditanam di Sini (Anti Error 404)
  var homeHtml = `
    <div class="jumbotron">
      <img src="https://raw.githubusercontent.com/jhu-ep-coursera/fullstack-course4/master/assignments/assignment5/assignment5-solution-starter/images/jumbotron_768.jpg" alt="Picture of restaurant" class="img-responsive visible-xs">
    </div>

    <div id="home-tiles" class="row">
      <div class="col-md-4 col-sm-6 col-xs-12">
        <a href="#" onclick="$dc.loadMenuCategories();">
          <div id="menu-tile"><span>menu</span></div>
        </a>
      </div>
      <div class="col-md-4 col-sm-6 col-xs-12">
        <a href="#" onclick="$dc.loadMenuItems('${chosenCategoryShortName}');">
          <div id="specials-tile"><span>specials</span></div>
        </a>
      </div>
      <div class="col-md-4 col-sm-12 col-xs-12">
        <a href="https://goo.gl/maps/A133L3S8T5A2" target="_blank">
          <div id="map-tile">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3084.6752382522203!2d-76.71151608420556!3d39.36358742691734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c81a14e7817803%3A0xab20a0e99daa17ea!2s7105+Reisterstown+Rd%2C+Baltimore%2C+MD+21215!5e0!3m2!1sen!2sus!4v1474221190505" width="100%" height="250" frameborder="0" style="border:0" allowfullscreen></iframe>
            <span>map</span>
          </div>
        </a>
      </div>
    </div>`;

  // STEP 4: Tampilkan ke #main-content
  insertHtml("#main-content", homeHtml);
}

dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(allCategoriesUrl, function (categories) {
    var html = "<h2 class='text-center' style='color:#fff;'>Menu Categories</h2><div class='row'>";
    for (var i = 0; i < categories.length; i++) {
      html += `<div class='col-md-4 col-sm-6 text-center' style='margin-bottom:20px;'>
        <a href='#' onclick="$dc.loadMenuItems('${categories[i].short_name}');" class='btn btn-warning btn-block btn-lg'>
          ${categories[i].name}
        </a>
      </div>`;
    }
    html += "</div>";
    insertHtml("#main-content", html);
  });
};

dc.loadMenuItems = function (categoryShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(menuItemsUrl + categoryShort + ".json", function (categoryMenuItems) {
    var html = `<h2 class='text-center' style='color:#fff;'>${categoryMenuItems.category.name} Menu</h2><div class='row'>`;
    var menuItems = categoryMenuItems.menu_items;
    for (var i = 0; i < menuItems.length; i++) {
      html += `<div class='col-md-6' style='margin-bottom:20px; background:rgba(0,0,0,0.3); padding:15px; border-radius:5px;'>
        <h4 style='color:#f6b319;'>${menuItems[i].name} (${menuItems[i].short_name})</h4>
        <p style='color:#fff;'>${menuItems[i].description}</p>
      </div>`;
    }
    html += "</div>";
    insertHtml("#main-content", html);
  });
};

global.$dc = dc;
})(window);
