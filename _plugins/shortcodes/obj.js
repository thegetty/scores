//
// CUSTOMIZED FILE
// Output the first figure from an object
//
const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')
const path = require('path')

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
  const removeHTML = eleventyConfig.getFilter('removeHTML')
  const { figure_list: figureList } = eleventyConfig.globalData.figures
  const { object_list: objectList } = eleventyConfig.globalData.objects
  const { imageDir } = eleventyConfig.globalData.config.figures
  

  return function (objId) {  

    // if (!ids.length) {
    //   logger.warn(`NoId: the q-figures shortcode must include one or more 'id' values that correspond to an 'id' in the 'figures.yaml' file. @example {% qfiguregroup columns=2, ids='3.1, 3.2, 3.3' %}`)
    // }

    let figId = ''
    let figAlt = ''
    let objTitle = ''
    let objImagePath = ''
    let objImageLengthString = ''
    let objDateString = ''

    for ( let obj of objectList ) {
      if (obj.id == objId) {
        figId = obj.figures[0].id
        objTitle = markdownify(obj.title)
        // objTitle = removeHTML(objTitle)
        objImageLengthString = obj.figures.length > 1 
          ? ` (${obj.figures.length} items)`
          : ''
        objDateString = obj.date
          ? ` (${obj.date})`
          : ''
      }
    }

    for ( let fig of figureList ) {   
      if (fig.id == figId) {
        figAlt = fig.alt ? fig.alt : ''
        if (fig.poster) {
          objImagePath = `${path.join(imageDir, fig.poster)}`
        } else if (fig.thumbnail) {
          objImagePath = `${fig.thumbnail}`
        }  
      }
    }

    return html`
      <figure class="object-link__image">
        <div class="object-link__image__wrapper">
        <img src="${objImagePath}" alt="${figAlt}" />
        </div>
        <figcaption>${objTitle}${objDateString}</figcaption>
      </figure>
    `
}
}
