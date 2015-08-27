var sections = {
  'Inline Code': {
    inlineCodeColor: '#DB4C69',
    inlineCodeBackground: '#F9F2F4'
  },
  'Code Blocks': {
    blockBackground: '#F8F5EC',
    baseColor: '#5C6E74',
    selectedColor: '#b3d4fc'
  },
  'Line Highlights': {
    highlightBackground: '#F7EBC6',
    highlightAccent: '#F7D87C'
  },
  'Tokens': {
    commentColor: '#93A1A1',
    punctuationColor: '#999999',
    propertyColor: '#990055',
    selectorColor: '#669900',
    operatorColor: '#a67f59',
    operatorBg: '#FFFFFF',
    variableColor: '#ee9900',
    functionColor: '#DD4A68',
    keywordColor: '#0077aa'
  }
};

var colorNames = [];
var colors = {};

Object.keys(sections).forEach(key => {
  var group = sections[key];
  Object.keys(group).forEach(color => {
    colorNames.push(color);
    colors[color] = group[color];
  });
});

module.exports = {
  sections,
  colors,
  colorNames
};
