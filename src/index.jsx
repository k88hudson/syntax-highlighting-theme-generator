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

var headerString = '/* Generated with http://k88hudson.github.io/react-markdocs-example/www/ */\n';
var lessString = headerString + require('raw!../node_modules/react-markdocs/src/markdocs.less');

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
      <div className="title">
        <div className="color-demo" style={{background: this.props.value}}>
          <input type="color" value={this.props.value} onChange={this.props.onChange} />
        </div>
        <code>@{this.props.label}</code>
      </div>
      <input type="type" value={this.props.value} onChange={throttle(this.props.onChange, 100)} />
    </div>);
  }
});

var App = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {
      colors: allColors,
      css: '',
      firstUpdate: true
    };
  },
  componentDidMount: function () {

    this.updateColors = throttle(() => {
      renderStyles(this.state.colors, (css) => {
        this.setState({css});
      });
    }, 500);

    this.updateColors();

  },
  scrollToExample: function () {
    var previewEl = this.refs.preview.getDOMNode();
    var egTop = document.getElementById('examples').offsetTop;
    if (previewEl.scrollTop < egTop) previewEl.scrollTop = egTop - 30;
  },
  updateSwatch: function (color) {
    return (e) => {
      if (this.state.firstUpdate) {
        this.scrollToExample();
        this.setState({firstUpdate: false});
      }
      var colors = this.state.colors;
      colors[color] = e.target.value;
      this.setState({colors});
      this.updateColors();
    };
  },
  downloadURL: function () {
    return 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(this.state.css);
  },
  render: function () {
    return (<div className="container">
      <style>{this.state.css}</style>
      <div className="sidebar">
        <div className="color-wrapper">
          {Object.keys(defaultTheme).map(group => {
            return (<div className="form-group">
              <h3>{group}</h3>
              {Object.keys(defaultTheme[group]).map(color => {
                return <ColorInput label={color} value={this.state.colors[color]} onChange={this.updateSwatch(color)} />
              })}
            </div>);
          })}
          <a hidden={!this.state.css} className="btn" href={this.downloadURL()}>Download CSS</a>
        </div>
      </div>

      <div ref="preview" className="preview">
        <Markdown prism source={require('./docs/main.md')} options={{html: true}} postProcess={(html) => typeset(html, {ligatures: false})} />
        <div className={'download' + (this.state.css ? ' download-on' : '')} >
          <a className="btn" download="prism-theme.css" href={this.downloadURL()}>Download CSS</a>
        </div>
      </div>
    </div>);
  }
});

React.render(<App />, document.getElementById('app'));
