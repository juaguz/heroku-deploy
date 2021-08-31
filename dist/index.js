module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(709);
/******/ 	};
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 709:
/***/ (function(__unusedmodule, __unusedexports, __webpack_require__) {

const core = __webpack_require__(863);
const { promisify } = __webpack_require__(669);

const exec = promisify(__webpack_require__(129).exec);

async function loginHeroku() {
  const login = core.getInput("email");
  const password = core.getInput("api_key");

  try {
    await exec(
      `echo ${password} | docker login --username=${login} registry.heroku.com --password-stdin`
    );
    console.log("Logged in succefully ✅");
  } catch (error) {
    core.setFailed(`Authentication process faild. Error: ${error.message}`);
  }
}

async function buildPushAndDeploy() {
  const appName = core.getInput("app_name");
  const dockerFilePath = core.getInput("dockerfile_path") || ".";
  const buildOptions = core.getInput("options") || "";
  const herokuAction = herokuActionSetUp(appName);
  const formation = core.getInput("formation");
  const dockerFile = core.getInput("docker_file") || "Dockerfile";
  const fileSwitch = `${dockerFilePath}/${dockerFile}`;

  try {
    await exec(
      `docker build --file ${fileSwitch} ${buildOptions} --tag registry.heroku.com/${appName}/${formation} ${dockerFilePath}`
    );
    console.log("Image built 🛠");

    await exec(herokuAction("push"));
    console.log("Container pushed to Heroku Container Registry ⏫");

    await exec(herokuAction("release"));
    console.log("App Deployed successfully 🚀");
  } catch (error) {
    core.setFailed(
      `Something went wrong building your image. Error: ${error.message}`
    );
  }
}

/**
 *
 * @param {string} appName - Heroku App Name
 * @returns {function}
 */
function herokuActionSetUp(appName) {
  /**
   * @typedef {'push' | 'release'} Actions
   * @param {Actions} action - Action to be performed
   * @returns {string}
   */
  return function herokuAction(action) {
    const HEROKU_API_KEY = core.getInput("api_key");
    const exportKey = `HEROKU_API_KEY=${HEROKU_API_KEY}`;

    return `${exportKey} heroku container:${action} web --app ${appName}`;
  };
}

loginHeroku()
  .then(() => buildPushAndDeploy())
  .catch(error => {
    console.log({ message: error.message });
    core.setFailed(error.message);
  });


/***/ }),

/***/ 863:
/***/ (function(module) {

module.exports = eval("require")("@actions/core");


/***/ })

/******/ });