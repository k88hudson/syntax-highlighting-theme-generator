var React = require('react/addons');
var Markdown = require('react-markdocs').Markdown;
var typeset = require('typeset');

var main = require('./docs/main.md');
var App = React.createClass({
  render: function () {
    return (<div>
      <Markdown source={main} postProcess={(html) => typeset(html, {ligatures: false})} />
    </div>);
  }
});

React.render(<App />, document.getElementById('app'));
