var React = require('react/addons');
var Prism = require('prism');
var less = require('less');
var {Markdown} = require('react-markdocs');
var throttle = require('lodash.throttle');

var themeInfo = require('./lib/theme-info');
var {renderStyles} = require('./lib/render-utils');

// How many edits until we shake the button?
var SHAKE_COUNT = 10;

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
      colors: themeInfo.colors,
      css: '',
      updateCount: 0
    };
  },
  componentDidMount: function () {

    this.updateColors = throttle(() => {
      renderStyles(this.state.colors, (css) => {
        var updateCount = this.state.updateCount;

        // Scroll to examples on first user update
        if (updateCount === 1) this.scrollToExample();

        // Shake
        if (updateCount % SHAKE_COUNT === 0) {
          this.setState({shakeOn: true});
          setTimeout(() => this.setState({shakeOn: false}), 1000);
        }

        this.setState({css, updateCount: updateCount + 1});
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
      var colors = this.state.colors;
      colors[color] = e.target.value;
      this.setState({colors});
      this.updateColors();
    };
  },
  nicerType: function (html) {
    return html;
  },
  downloadURL: function () {
    return 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(this.state.css);
  },
  render: function () {
    return (<div className="container">
      <style>{this.state.css}</style>
      <div className="sidebar">
        <div className="color-wrapper">
          {Object.keys(themeInfo.sections).map(group => {
            return (<div key={group} className="form-group">
              <h3>{group}</h3>
              {Object.keys(themeInfo.sections[group]).map(color => {
                return (<ColorInput
                  key={color}
                  label={color}
                  value={this.state.colors[color]}
                  onChange={this.updateSwatch(color)} />);
              })}
            </div>);
          })}
        </div>
      </div>

      <div ref="preview" className="preview">
        <Markdown
          prism
          source={require('./lib/documentation.md')}
          options={{html: true}}
          postProcess={this.nicerType} />
        <div className={'download' + (this.state.css ? ' download-on' : '')} >
          <a
            className={'btn' + (this.state.shakeOn ? ' shake' : '')}
            download="prism-theme.css"
            href={this.downloadURL()}>
            Download CSS</a>
        </div>
      </div>
    </div>);
  }
});

React.render(<App />, document.getElementById('app'));
