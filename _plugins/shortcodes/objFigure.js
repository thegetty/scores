//
// CUSTOMIZED FILE
// Based on obj.js, but made to output figure images on the commentaries
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
  const markdownify = eleventyConfig.getFilter('markdownify')
  const { figure_list: figureList } = eleventyConfig.globalData.figures
  
  return function (figId) {  

    // if (!ids.length) {
    //   logger.warn(`NoId: the q-figures shortcode must include one or more 'id' values that correspond to an 'id' in the 'figures.yaml' file. @example {% qfiguregroup columns=2, ids='3.1, 3.2, 3.3' %}`)
    // }

    let objLink = ''
    let figImagePath = ''
    let figAlt = ''
    let figLabel = ''
    let figCaption = ''
    let figCredit = ''

    for ( let fig of figureList ) {   
      if (fig.id == figId) {
        objLink = fig.link ? fig.link : ''
        figLabel = fig.label ? fig.label : ''
        figCaption = fig.caption ? fig.caption : ''
        figCredit = fig.credit ? fig.credit : ''
        figAlt = fig.alt ? fig.alt : ''

        // figImagePath
        if (fig.thumb) {
          figImagePath = `/_assets/images/${fig.thumb}`
        } else if (fig.annotations) {
          figImagePath = `/iiif/${figId}/base/static-inline-figure-image.jpg`
        } else if (fig.zoom) {
          const figFilename = fig.src.replace('figures/', '').replace('.jpg', '')
          figImagePath = `/iiif/${figId}/${figFilename}/static-inline-figure-image.jpg`
        } else if (fig.media_type == 'vimeo' || 'soundcloud' || 'audio' ) {
          figImagePath = `/_assets/images/${fig.poster}`
        } 
      }
    } 

    return html`
      <figure class="scores-figure" id="${figId}">
        <a class="scores-figure__link" href="${objLink}" target="object-iframe" class="object-link">
        <img class="scores-figure__class" src="${figImagePath}" alt="${figAlt}" />
        </a>
        <figcaption>
          <span class="scores-figure__label">${figLabel}</span>
          <span class="scores-figure__caption">${markdownify(figCaption)}</span>
          <span class="scores-figure__credit">${markdownify(figCredit)}</span>
        </figcaption>
      </figure>
    `
  }
}
