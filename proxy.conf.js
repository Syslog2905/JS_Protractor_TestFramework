const PROXY_CONFIG = {
  // static files
  '/insis/ui': { target: 'http://localhost:4200', pathRewrite: {"^/insis/ui" : ""} },
  // api calls
  '/insis/claims': { target: 'http://192.168.2.210:7801/', secure: false },
  '/insis/common': { target: 'http://192.168.2.210:7801/', secure: false },
  '/insis/nonfunctional': { target: 'http://192.168.2.210:7801/', secure: false },
  '/insis/people-dir': { target: 'http://192.168.2.210:7801/', secure: false },
  '/insis/policies': { target: 'http://192.168.2.210:7801/', secure: false },
  '/insis/util': { target: 'http://192.168.2.210:7801/', secure: false },
  // login
  '/insis/login': { target: 'http://192.168.2.210:7801/', secure: false },
};

module.exports = PROXY_CONFIG;
