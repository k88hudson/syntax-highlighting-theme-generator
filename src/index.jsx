var React = require('react/addons');
var {Markdown} = require('react-markdocs');
var throttle = require('lodash.throttle');
var typeset = require('typeset');

var defaultTheme = require('./default-theme');
var colorClasses = [];
var allColors = {};

Object.keys(defaultTheme).forEach(key => {
  var group = defaultTheme[key];
  Object.keys(group).forEach(color => {
    colorClasses.push(color);
    allColors[color] = group[color];
  });
});

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
      colors: allColors,
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
  scrollToExample: function () {
    var previewEl = this.refs.preview.getDOMNode();
    var egTop = document.getElementById('examples').offsetTop;
    if (previewEl.scrollTop < egTop) previewEl.scrollTop = egTop - 30;
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
      <style>{this.state.css}</style>
      <div className="sidebar" onClick={this.scrollToExample}>
        <div hidden={!this.state.css}>
          <a className="btn" href={'data:application/octet-stream;charset=utf-8,' + encodeURI(this.state.css)}>Download CSS</a>
        </div>
        <div className="color-wrapper">{Object.keys(defaultTheme).map(group => {
          return (<div className="form-group">
            <h3>{group}</h3>
            {Object.keys(defaultTheme[group]).map(color => {
              return <ColorInput label={color} value={this.state.colors[color]} onChange={this.updateSwatch(color)} />
            })}
          </div>);
        })}</div>
      </div>
      <div ref="preview" className="preview">
        <Markdown prism source={require('./docs/main.md')} options={{html: true}} postProcess={(html) => typeset(html, {ligatures: false})} />
      </div>
      <footer className="download" hidden={true}>
        <a className="btn" href={'data:application/octet-stream;charset=utf-8,' + encodeURI(this.state.css)}>Download CSS</a>
      </footer>
    </div>);
  }
});

React.render(<App />, document.getElementById('app'));
