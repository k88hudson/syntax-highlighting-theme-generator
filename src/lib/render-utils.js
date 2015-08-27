var themeInfo = require('./theme-info');
var headerString = '/* Generated with http://k88hudson.github.io/syntax-highlighting-theme-generator/www */\n';
var lessString = headerString + require('raw!../less/prism.less');

var renderUtils = {

  createColorVariableString(colors) {
    return themeInfo.colorNames.map(color => {
      return `@${color}: ${colors[color]};`;
    }).join('\n');
  },

  renderStyles(colors, callback) {
    var str = lessString;
    str = str + '\n\n' + renderUtils.createColorVariableString(colors);

    window.less.render(str)
      .then(function (output) {
        callback(output.css);
      }, function (err) {
        console.log(err);
      });
  }
};

module.exports = renderUtils;
