// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
'use strict';

//This file is similar to protractor.conf.js. The only function it has is to be used in Bamboo in a separate run to verify build deployment.

module.exports.config = {

  useAllAngular2AppRoots: true,
  // Before performing any action, Protractor waits until there are no pending
  // asynchronous tasks in your Angular application
  allScriptsTimeout: 120000,
  getPageTimeout: 10000,

  specs: [
    'e2e/features/**/*.feature' // accepts a glob
  ],

  //Cucumber throws uncaught exceptions and protractor fails the test suite immediately, hence this
  ignoreUncaughtExceptions: true,

  cucumberOpts: {
    // Require step definitions
    require: [
      'e2e/steps-definitions.js',
      'e2e/utils/hooks.js',
    ],
    format: 'json:.tmp/results.json',
    profile: false,
    'no-source': true,
    tags: '@deploy',
    dryRun: true,
    defaultTimeout: 8000
  },

  multiCapabilities: [
    // {browserName: "firefox"},
    // {browserName: "internet explorer"},
    // {browserName: "MicrosoftEdge"},
    {
      browserName: "chrome",
      chromeOptions: {
        args: [
          // Disable "Chrome is being controlled by automated test software" infobar
          '--disable-infobars',
        ],
      },

    }
  ],

  prefs: {
    // Disable Chrome's annoying password manager
    'profile.password_manager_enabled': true,
    'credentials_enable_service': true,
    'password_manager_enabled': true
  },

  // baseUrl: 'http://192.168.2.252:7801/insis/',
  baseUrl: 'http://192.168.2.252:7801',
  //baseUrl: 'http://insis_gen_v10:insis_gen_v10@localhost:4200',

  framework: 'custom',
  // Path relative to the current config file
  frameworkPath: require.resolve('protractor-cucumber-framework'),

// Custom parameters can be specified here
  params: {
    // Path to file with all page objects
    pageObjects: require('./e2e/page-objects/page-index.js'),
    // Custom timeout to wait for elements on the page
    customTimeout: 8000,
    // Params for setting browser window width and height - can be also
    // changed via the command line as: --params.browserConfig.width 1024
    browserConfig: {
      width: 1920,
      height: 1080
    }
  },

  //HTML report and screenshot
  plugins: [{
    package: 'protractor-multiple-cucumber-html-reporter-plugin',
    options: {
      automaticallyGenerateReport: true,
      openReportInBrowser: true,
      removeExistingJsonReportFile: true,
      removeOriginalJsonReportFile: true,
      time: true,
    }
  }]

}

