'use strict';

/* global browser, expect, element, by, EC */
/* eslint new-cap: 0 */ // --> OFF for Given, When, Then

// #############################################################################

// Use the external Chai As Promised to deal with resolving promises in expectations
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const protractor = require('protractor');
const errors = require('./utils/errors.js');

chai.use(chaiAsPromised);
const expect = chai.expect;
const EC = protractor.ExpectedConditions;
const defaultCustomTimeout = 20000;
const customTimeout = browser.params.customTimeout || defaultCustomTimeout;
const pageObjects = browser.params.pageObjects;
const timeToWaitMax = 60000; // Maximum time to wait for in 'I wait for (int) ms' step
browser.ignoreSynchronization = true;

//var key = require('selenium-webdriver').Key;
//var actionSequence = require('selenium-webdriver').ActionSequence;

/**
 * Waits for the element to be present and displayed on the page
 * @param {string} elementSelector
 */
function waitForPresence(elementSelector) {
  return browser.wait(EC.presenceOf(elementSelector));
}

/**
 *
 * Waits for the element to be present and displayed on the page
 * @param {string} elementSelector
 */
function waitForDisplayed(elementSelector) {
  return browser.wait(EC.visibilityOf(elementSelector));
}

function getElmnt(locator) {
  let elmnt;
  if (locator[0] + locator[1] === '//') {
  //element.all(by.css("ul.nav button")).first()
    elmnt = element(by.xpath(locator));
  } else {
    elmnt = element(by.css(locator));
  }
  return elmnt;
}

/**
 * Composes proper element locator using getElmnt function
 * @param {string} page
 * @param {string} elem
 * @returns {object} elmnt
 */
function composeLocator(page, elem) {
  let locator = pageObjects[page][elem];
//  console.log('LOCATOR'+' ', locator);
  return getElmnt(locator);
}

/**
 * Composes proper element locator by changing text in xpath locator
 * @param {string} page
 * @param {string} elem
 * @param {string} text
 * @returns {object} elmnt
 */
function composeLocatorUsingText(page, elem, text) {
  let locator = pageObjects[page][elem];
  if (text && locator.indexOf('"text"') > -1) {
    locator = locator.replace('"text"', '"' + text + '"');

  }
  return getElmnt(locator);
}

// Make sure that the new window is open in a new tab and we are navigating correctly to it
function switchToWindow(number) {
  var winHandles = browser.getAllWindowHandles();
  winHandles.then(function (handles) {
    var window = handles[number];
    browser.switchTo().window(window);
  });
}

function countElementInArray(elmnt) {
  // const elmnt = element.all(by.css(pageObjects[page][elem]));
  var count = 0;
  return elmnt.then(all => {
    var promiseArray = [];
    console.log("PromiseArray ", promiseArray)
    for (let i = 0; i < all.length; i++) {
      promiseArray.push(all[i]);
    }
    return Promise.all(promiseArray).then((results) => {
      return results.length;
    });
  });
}

function countElementInArrayByText(elmnt, text) {
  // const elmnt = element.all(by.css(pageObjects[page][elem]));
  var count = 0;
  var arrayText = [];
  return elmnt.then(all => {
    var promiseArray = [];
    for (let i = 0; i < all.length; i++) {
      promiseArray.push(all[i].getText());
    }
    return Promise.all(promiseArray).then((results) => {
      console.log("RES ", results, "TEXT ", text);
      return results.filter(result => result === text).length;
    });
  });
}

function countElementInArrayContainsText(elmnt, text) {
  // const elmnt = element.all(by.css(pageObjects[page][elem]));
  var count = 0;
  var arrayText = [];
  return elmnt.then(all => {
    var promiseArray = [];
    for (let i = 0; i < all.length; i++) {
      promiseArray.push(all[i].getText());
    }
    return Promise.all(promiseArray).then((results) => {
      console.log("RES ", results, "TEXT ", text);
      return results.filter(result => result.indexOf(text) > -1).length;
    });
  });
}

var {defineSupportCode} = require('cucumber');

defineSupportCode(function ({setDefaultTimeout}) {
  setDefaultTimeout(60 * 1000);
});


defineSupportCode(function ({Given, When, Then}) {

  //GIVEN steps

  Given('{string} with {string} is logged in', function (user, password) {
    const buttonLogin = composeLocator('insisPage', 'buttonLogin');
    const username = composeLocator('insisPage', 'username');
    const pass = composeLocator('insisPage', 'password');
    const insisLogo = composeLocator('insisPage', 'insisLogo');

    // browser.get("http://192.168.2.210:7801/insis/");
    browser.get('');

    return browser.wait(EC.visibilityOf(buttonLogin), 5000)
      .then(() => {
        browser.wait(EC.elementToBeClickable(username))
          .then(() => username.sendKeys(user));
        browser.wait(EC.elementToBeClickable(pass))
          .then(() => pass.sendKeys(password));
        return browser.wait(EC.elementToBeClickable(buttonLogin))
          .then(() => buttonLogin.click())
          .then(() => browser.wait(EC.visibilityOf(insisLogo)));
      }).catch(() => browser.wait(EC.visibilityOf(insisLogo)));
  });

  //WHEN steps
   When('open the current url', () => {
      browser.get('');
    });

  When('refresh the current url', () => {
    browser.refresh();
  });


  When('select {string}.{string} and press KBD button ENTER', (page, elem) => {
    const elmnt = composeLocator(page, elem);

    return waitForDisplayed(elmnt).then(() => elmnt.sendKeys(protractor.Key.ENTER));
  });

  When('select {string}.{string} and press KBD button SHIFT+ENTER', (page, elem) => {
    const elmnt = composeLocator(page, elem);

    return waitForDisplayed(elmnt)
      .then(() => elmnt.sendKeys(protractor.Key.chord(protractor.Key.ENTER, protractor.Key.SHIFT)));
  });
  // element(by.css('input')).sendKeys(arg1).then(function() { browser.actions().sendKeys(protractor.Key.ENTER).perform().then(callback); });

  When('select {string}.{string} and delete its content', (page, elem) => {
    const elmnt = composeLocator(page, elem);

    return waitForDisplayed(elmnt)
      .then(() => elmnt.sendKeys(protractor.Key.chord(protractor.Key.CONTROL, "a")))
      .then(() => elmnt.sendKeys(protractor.Key.chord(protractor.Key.Delete)));
  });


  When('{string}.{string} is visible click {string}.{string}', (page1, elem1, page2, elem2) => {
    const elmnt1 = composeLocator(page1, elem1);
    const elmnt2 = composeLocator(page2, elem2);

    return browser.wait(EC.visibilityOf(elmnt1), 30000)
      .then(() => {
        browser.wait(EC.elementToBeClickable(elmnt2))
          .then(() => elmnt2.click());
      });
  });

  When('click {string}.{string}', (page, elem) => {
    const elmnt = composeLocator(page, elem);
    //console.log("SEARCH", elmnt);
    return browser.wait(EC.elementToBeClickable(elmnt))
      .then(() => elmnt.click());
  });

  When('click invisible element {string}.{string}', (page, elem) => {
    const elmnt = composeLocator(page, elem);
    // console.log("STAR", elmnt);

    return browser.wait(EC.presenceOf(elmnt))
      .then(() => elmnt.click());
  });

  When('I type {string} in the {string}.{string}', function (text, page, elem) {
    const inputField = composeLocator(page, elem);

    return browser.wait(EC.elementToBeClickable(inputField))
      .then(() => inputField.sendKeys(text));
  });

  When('I wait for {int} ms', {timeout: timeToWaitMax}, function (timeToWait, callback) {
    setTimeout(callback, timeToWait);
  });

  When('I wait for {string}.{string} to be present', (page, elem) => {
    const elmnt = composeLocator(page, elem);

    return waitForPresence(elmnt);
  });

  When('select {string} by {string}.{string}', (text, page, elem) => {
    const filterItem = composeLocatorUsingText(page, elem, text);

    return browser.wait(EC.elementToBeClickable(filterItem))
      .then(() => filterItem.click());
  });

  When('switch focus to {string}.{string}', (page, elem, callback) => {
    browser.switchTo().frame(0);
    callback();
  });

  When('switch to parent window', function (callback) {
    switchToWindow(0);
    callback();
  });

  When('{string}.{string} is shown, close it clicking {string}.{string}', function (page1, elem1, page2, elem2) {
    const elmnt1 = composeLocator(page1, elem1);
    const elmnt2 = composeLocator(page2, elem2);

    return browser.wait(EC.visibilityOf(elmnt1), 1000)
      .then(() => {
        browser.wait(EC.elementToBeClickable(elmnt2))
          .then(() => elmnt2.click());
      });
  });

//THEN steps
  Then('{string}.{string} should be present', function (page, elem) {
    //debugger;

    const elmnt = composeLocator(page, elem);

    return browser.wait(EC.presenceOf(elmnt));
  });

  Then('{string} in {string}.{string} should not be present', function (text, page, elem) {
    const elmnt = composeLocatorUsingText(page, elem);

    return browser.wait(EC.stalenessOf(elmnt));
  });

  Then('{string}.{string} should not be present', function (page, elem) {
    const elmnt = composeLocator(page, elem);

    return browser.wait(EC.stalenessOf(elmnt));
  });

  Then('I wait until {string}.{string} is visible', (page, elem) => {
    const elmnt = composeLocator(page, elem);

    return browser.wait(EC.visibilityOf(elmnt));
  });

  Then('I wait until {string}.{string} is not visible', (page, elem) => {
    const elmnt = composeLocator(page, elem);

    return browser.wait(EC.invisibilityOf(elmnt));
  });

  Then('{string}.{string} contains text {string}', function (page, elem, text) {
    const elmnt = composeLocatorUsingText(page, elem, text);

    //expect(elmnt.getText().then(function(value){return value.toUpperCase()})).to.eventually.include(text.toUpperCase()).and.notify(callback);

    expect(elmnt.getText().then(function(value){return value.toUpperCase()})).to.eventually.include(text.toUpperCase());
    console.log();
   // expect(elmnt.getText()).to.eventually.include(text);
  });

  Then('{string}.{string} should not contain text {string}', function (page, elem, text, callback) {
    const elmnt = composeLocatorUsingText(page, elem, text);

    expect(elmnt.getText()).to.eventually.not.include(text);
  });

  Then('the title should equal to {string}', function (text, callback) {
    expect(browser.getTitle()).to.eventually.equal(text);
  });

//This step is ONLY for Menu Items
  Then('{string}.{string} is selected', (page, elem) => {
    const elmnt = composeLocator(page, elem);

    return browser.wait(EC.elementToBeClickable(elmnt))
      .then(() => elmnt.element(by.xpath('..')))
      .then((parentElement) => parentElement.getAttribute('class'))
      .then((classes) => {
        //console.log("CLASS ", classes);
        const activeClass = 'active-menuitem';
        expect(classes.indexOf(activeClass)).to.not.equal(-1);
      });
  });

  Then('{string}.{string} is checked', (page, elem) => {
    const elmnt = composeLocator(page, elem);

    return browser.wait(EC.elementToBeClickable(elmnt))
      .then(() => expect(elmnt.isSelected()).to.eventually.equal(true));
  });

  Then('{string}.{string} is unchecked', (page, elem) => {
    const elmnt = composeLocator(page, elem);

    return browser.wait(EC.elementToBeClickable(elmnt))
      .then(() => expect(elmnt.isSelected()).to.eventually.equal(false));
  });

  Then('count {string}.{string} with the text {string}', (page, elem, string) => {
    //here we get all elements as an array
    const elmnt = element.all(by.css(pageObjects[page][elem]));

    return countElementInArrayByText(elmnt, string).then(count => console.log("COUNT ", count));
  });

  Then('count {string}.{string} with the long text:', (page, elem, string) => {
    //here we get all elements as an array
    const elmnt = element.all(by.css(pageObjects[page][elem]));
    return countElementInArrayByText(elmnt, string).then(count => console.log("COUNT ", count));
  });

  Then('count {string}.{string} with the text {string} and assert', (page, elem, string) => {
    //here we get all elements as an array
    const elmnt = element.all(by.css(pageObjects[page][elem]));

    const hasCountPromise = countElementInArrayContainsText(elmnt, string)
      .then(count => {
        console.log("COUNT ", count);
        return count;
      })
      .then(count => count > 0);
    return expect(hasCountPromise).to.eventually.equal(true);
  });

  Then('count {string}.{string} and assert', (page, elem) => {
    //here we get all elements as an array
    const elmnt = element.all(by.css(pageObjects[page][elem]));
    const hasCountPromise = countElementInArray(elmnt)
      .then(count => {
        console.log("COUNT ", count);
        return count;
      })
      .then(count => count > 0);
    return expect(hasCountPromise).to.eventually.equal(true);
   });
});
