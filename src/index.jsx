var React = require('react/addons');
var {Markdown} = require('react-markdocs');
var throttle = require('lodash.throttle');

var defaultTheme = require('./default-theme');
var colorClasses = Object.keys(defaultTheme);
var lessString = require('raw!../node_modules/react-markdocs/src/markdocs.less');

function createColorVariableString(colors) {
  return colorClasses.map(color => {
    return `@${color}: ${colors[color]};`;
  }).join('\n');
}

function renderStyles(colors, callback) {
  var str = lessString;
  str = str + '\n\n' + createColorVariableString(colors);
  window.less.render(str)
    .then(function (output) {
      callback(output.css);
    }, function (err) {
      console.log(err);
    });
}

var ColorInput = React.createClass({
  render: function () {
    return (<div className="color">
      <div className="color-demo" style={{background: this.props.value}}>
         <input type="color" value={this.props.value} onChange={this.props.onChange} />
      </div>
      <code>@{this.props.label}</code>
      <input type="type" value={this.props.value} onChange={throttle(this.props.onChange, 100)} />
    </div>);
  }
});

var App = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {
      colors: defaultTheme,
      css: ''
    };
  },
  componentDidMount: function () {

    this.updateColors = throttle(() => {
      renderStyles(this.state.colors, (css) => {
        this.setState({css});
      });
    }, 500);

    // this.updateColors();

  },
  updateSwatch: function (color) {
    return (e) => {
      var colors = this.state.colors;
      colors[color] = e.target.value;
      this.setState({colors});
      this.updateColors();
    };
  },
  render: function () {
    return (<div className="container">
      <div className="sidebar">
        <div className="color-wrapper">{colorClasses.map(color => {
          return <ColorInput label={color} value={this.state.colors[color]} onChange={this.updateSwatch(color)} />
        })}</div>
      </div>
      <div className="preview">
        <Markdown prism source={require('./docs/main.md')} />
      </div>
      <footer className="download" hidden={this.state.css}>
        <a className="btn" href={'data:application/octet-stream;charset=utf-8,' + encodeURI(this.state.css)}>Download CSS</a>
      </footer>
      <style>{this.state.css}</style>
    </div>);
  }
});

React.render(<App />, document.getElementById('app'));
