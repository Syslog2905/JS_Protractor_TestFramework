'use strict';

module.exports = (function () {

  let styleSeatPage = {

    //Left menu's items
    firstLevelMenu: 'div > div.search-advanced.search-form.disable-ng-animate.ng-scope > label.search-input-service > input',
    searchServiceInput: 'input[placeholder="Haircut, salon name, stylist name"]',
    searchCityInput: 'input[placeholder="Enter city, state, or zip code"]',
    cityBinding: 'span a em.ng-binding',
    searchResultOverlay: 'div search-result-overlay',
    searchButton: ".search-form-submit",
    firstCityResult: '//label[2]/div/div[1]',
    button: 'button[title="Search"]',
    secondLevelMenuItem: '//ins-nav-tree-item/li/a/span[contains(text(),"text")]',
    mapView: 'div.map-container  div > div:nth-child(1) > div:nth-child(3)',
    firstSalonName: '.search-result-component .service-name'


  };

  return styleSeatPage;

})();
