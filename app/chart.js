var component = require('app/views/Component');

require('less/app.less');

if (typeof window['datassist'] == 'undefined') {
    window.datassist = {};
}

var datassist = window.datassist;

/**
 * Registers function that initiates compoenent in datassist namespace
 *
 * @param el
 */
datassist.initSunburst = function (el) {
    component(el);
}
