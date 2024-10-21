//
// CUSTOMIZED FILE
// Output the first figure from an object
//
const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const logger = chalkFactory('shortcodes:obj')

/**
 * Render multiple <figure> elements in a group
 *
 * @param      {Object}  eleventyConfig  eleventy configuration
 * @param      {Array<id>}  ids          An array or list of figure identifiers
 * @return     {String}  An HTML string of the elements to render
 */
module.exports = function (eleventyConfig, { page }) {
  const icon = eleventyConfig.getFilter('icon')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const { figure_list: figureList } = eleventyConfig.globalData.figures
  const { object_list: objectList } = eleventyConfig.globalData.objects
  

  return function (objId) {  

    // if (!ids.length) {
    //   logger.warn(`NoId: the q-figures shortcode must include one or more 'id' values that correspond to an 'id' in the 'figures.yaml' file. @example {% qfiguregroup columns=2, ids='3.1, 3.2, 3.3' %}`)
    // }

    let figId = ''
    let figAlt = ''
    let objTitle = ''
    let objImagePath = ''
    let objImageLengthString = ''

    for ( let obj of objectList ) {
      if (obj.id == objId) {
        figId = obj.figures[0].id
        objTitle = obj.title
        objImageLengthString = obj.figures.length > 1 
          ? ` (${obj.figures.length} items)`
          : ''
      }
    }

    for ( let fig of figureList ) {   
      if (fig.id == figId) {
        figAlt = fig.alt ? fig.alt : ''
        // objImagePath
        if (fig.thumb) {
          objImagePath = `/_assets/images/${fig.thumb}`
        } else if (fig.annotations) {
          objImagePath = `/iiif/${figId}/base/static-inline-figure-image.jpg`
        } else if (fig.sequences) {
          figStart = fig.sequences[0].start.replace('.jpg', '')
          if (!figStart) {
            logger.error(`Every figure with a sequence needs an explicity defined start image for the obj.js shortcode`)
          }
          objImagePath = `/iiif/${figId}/${figStart}/static-inline-figure-image.jpg`
        } else if (fig.zoom) {
          const figFilename = fig.src.replace('figures/', '').replace('.jpg', '')
          objImagePath = `/iiif/${figId}/${figFilename}/static-inline-figure-image.jpg`
        } else if (fig.media_type == 'vimeo' || 'soundcloud' || 'audio' ) {
          objImagePath = `/_assets/images/${fig.poster}`
        } 
      }
    }

    return html`
      <figure class="object-link__image">
        <div class="object-link__image__wrapper">
        <img src="${objImagePath}" alt="${figAlt}" />
        </div>
        <figcaption>${markdownify(objTitle)}${objImageLengthString}</figcaption>
      </figure>
    `
}
}
