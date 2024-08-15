//
// CUSTOMIZED FILE
// Added caption and class parameters that can be fed in from shortcode
// And simplified HTML markup to remove rows
//
const { oneLine } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const figure = require('./figure')
const fig = require('./objFigure')

const logger = chalkFactory('shortcodes:figureGroup')

/**
 * Render multiple <figure> elements in a group
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Array<id>}  ids          An array or list of figure identifiers
 * @return     {String}  An HTML string of the elements to render
 */
module.exports = function (eleventyConfig, { page }) {

  return async function (columns, ids=[], caption, classes) {
    columns = parseInt(columns)
    const figureCaption = eleventyConfig.getFilter('figureCaption')

    /**
     * Parse the ids arg for figure identifiers
     * The ids arg can be either a string of comma separated figure ids,
     * @example 'fig-1, fig-2, fig-3'
     * or an array of identifier strings
     * @example ['fig-1', 'fig-2', 'fig-3']
     */
    ids = Array.isArray(ids) ? ids : ids.split(',').map((id) => id.trim())

    if (!ids.length) {
      logger.warn(`NoId: the q-figures shortcode must include one or more 'id' values that correspond to an 'id' in the 'figures.yaml' file. @example {% qfiguregroup columns=2, ids='3.1, 3.2, 3.3' %}`)
    }

    // if (ErrorNoMediaType) {
    //   logger.warn(`NoMediaType: One of the figures passed to the q-figures shortcode is missing the 'media_type' attribute. Figures in 'figures.yaml' must be have a 'media_type' attribute with a value of either  "vimeo" or "youtube"`)
    // }

    let figureTags = []
    for (let i=0; i < ids.length; i++) {
      figureTags += await fig(eleventyConfig, { page }).bind(this)(ids[i])
    }

    const captionElement = caption ? `<figcaption>${caption}</figcaption>` : ''

    const customClasses = classes ? classes : ''

    return oneLine`
      <figure class="scores-figure scores-figure-group scores-figure-group-grid--${columns} ${customClasses}">
        ${figureTags}
        ${captionElement}
      </figure>
    `
  }
}
