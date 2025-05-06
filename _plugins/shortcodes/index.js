//
// CUSTOMIZED FILE
// Add obj shortcode
//
const accordion = require('./accordion.js')
const addComponentTag = require('../../_plugins/components/addComponentTag')
const backmatter = require('./backmatter')
const bibliography = require('./bibliography')
const cite = require('./cite')
const contributors = require('./contributors')
const figure = require('./figure')
const figureGroup = require('./figureGroup')
const obj = require('./obj')
const objFigure = require('./objFigure')
const ref = require('./ref')
const shortcodeFactory = require('../components/shortcodeFactory')
const title = require('./title')
const tombstone = require('./tombstone')

module.exports = function(eleventyConfig, collections, options) {
  const { addShortcode, addPairedShortcode } = shortcodeFactory(eleventyConfig, collections)

  addPairedShortcode('accordion', accordion)
  addComponentTag(eleventyConfig, 'ref', ref)
  addPairedShortcode('backmatter', backmatter)
  addShortcode('bibliography', bibliography)
  addShortcode('cite', cite)
  addComponentTag(eleventyConfig, 'contributors', contributors)
  addShortcode('figure', figure)
  addShortcode('figuregroup', figureGroup)
  addShortcode('obj', obj)
  addShortcode('fig', objFigure)
  addShortcode('title', title)
  addShortcode('tombstone', tombstone)
}
