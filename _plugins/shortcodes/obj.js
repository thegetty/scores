//
// CUSTOMIZED FILE
// Output the first figure from an object
//
const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const logger = chalkFactory('shortcodes:figureGroup')

/**
 * Render multiple <figure> elements in a group
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Array<id>}  ids          An array or list of figure identifiers
 * @return     {String}  An HTML string of the elements to render
 */
module.exports = function (eleventyConfig, { page }) {
  const icon = eleventyConfig.getFilter('icon')
  const { figure_list: figureList } = eleventyConfig.globalData.figures
  const { object_list: objectList } = eleventyConfig.globalData.objects
  

  return function (objId) {  

    // if (!ids.length) {
    //   logger.warn(`NoId: the q-figures shortcode must include one or more 'id' values that correspond to an 'id' in the 'figures.yaml' file. @example {% qfiguregroup columns=2, ids='3.1, 3.2, 3.3' %}`)
    // }

    let figId = ''
    let objImagePath = ''

    for ( let obj of objectList ) {
      if (obj.id == objId) {
        figId = obj.figures[0].id
      }
    }

    for ( let fig of figureList ) {
    
      if (fig.id == figId) {
        const figFilename = fig.src.replace('figures/', '').replace('.jpg', '')

        // objImagePath
        if (fig.thumb) {
          objImagePath = `/_assets/images/${fig.thumb}`
        } else if (fig.annotations) {
          objImagePath = `/iiif/${figId}/base/thumbnail.jpg`
        } else if (fig.zoom) {
          objImagePath = `/iiif/${figId}/${figFilename}/thumbnail.jpg`
        } else if (fig.media_type == 'vimeo' || 'youtube') {
          objImagePath = `/_assets/images/${fig.poster}`
        } 
      }
    }

    return html`
      <div class="object">
        <img src="${objImagePath}" alt="" />
      </div>
    `
}
}
