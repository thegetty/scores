//
// CUSTOMIZED FILE
// Based on obj.js, but made to output figure images on the commentaries
// Also added special section of links to An Anthology images to meet with rights requirements
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

    let anthologyData = [{"text":1,"href":"/object-index/238/#fig-238-a"},{"text":"2–3","href":"/object-index/238/#fig-238-b"},{"text":"4–5","href":"/object-index/238/#fig-238-c"},{"text":"6–7","href":"/object-index/238/#fig-238-d"},{"text":"8–9","href":"/object-index/238/#fig-238-e"},{"text":"10–11","href":"/object-index/238/#fig-238-f"},{"text":"12–13","href":"/object-index/238/#fig-238-g"},{"text":"14–15","href":"/object-index/238/#fig-238-h"},{"text":"16–17","href":"/object-index/238/#fig-238-i"},{"text":"18–19","href":"/object-index/238/#fig-238-j"},{"text":"20–21","href":"/object-index/238/#fig-238-k"},{"text":"22–23","href":"/object-index/238/#fig-238-l"},{"text":"24–25","href":"/object-index/238/#fig-238-m"},{"text":"26–27","href":"/object-index/238/#fig-238-n"},{"text":"28–29","href":"/object-index/238/#fig-238-o"},{"text":"30–31","href":"/object-index/238/#fig-238-p"},{"text":"32–33","href":"/object-index/238/#fig-238-q"},{"text":"34–35","href":"/object-index/238/#fig-238-r"},{"text":"36–37","href":"/object-index/238/#fig-238-s"},{"text":"38–39","href":"/object-index/238/#fig-238-t"},{"text":"40–41","href":"/object-index/238/#fig-238-u"},{"text":"42–43","href":"/object-index/238/#fig-238-v"},{"text":"44–45","href":"/object-index/238/#fig-238-w"},{"text":"46–47","href":"/object-index/238/#fig-238-x"},{"text":"48–49","href":"/object-index/238/#fig-238-y"},{"text":"50–51","href":"/object-index/238/#fig-238-z"},{"text":"52–53","href":"/object-index/238/#fig-238-aa"},{"text":"54–55","href":"/object-index/238/#fig-238-ab"},{"text":"56–57","href":"/object-index/238/#fig-238-ac"},{"text":"58–59","href":"/object-index/238/#fig-238-ad"},{"text":"60–61","href":"/object-index/238/#fig-238-ae"},{"text":"62–63","href":"/object-index/238/#fig-238-af"},{"text":"64–65","href":"/object-index/238/#fig-238-ag"},{"text":"66–67","href":"/object-index/238/#fig-238-ah"},{"text":"Letter Recto","href":"/object-index/238/#fig-238-ai"},{"text":"Letter Verso","href":"/object-index/238/#fig-238-aj"},{"text":"68–69","href":"/object-index/238/#fig-238-ak"},{"text":"70–71","href":"/object-index/238/#fig-238-al"},{"text":"72–73","href":"/object-index/238/#fig-238-am"},{"text":"74–75","href":"/object-index/238/#fig-238-an"},{"text":"76–77","href":"/object-index/238/#fig-238-ao"},{"text":"78–79","href":"/object-index/238/#fig-238-ap"},{"text":"80–81","href":"/object-index/238/#fig-238-aq"},{"text":"82–83","href":"/object-index/238/#fig-238-ar"},{"text":"84–85","href":"/object-index/238/#fig-238-as"},{"text":"86–87","href":"/object-index/238/#fig-238-at"},{"text":"88–89","href":"/object-index/238/#fig-238-au"},{"text":"90–91","href":"/object-index/238/#fig-238-av"},{"text":"92–93","href":"/object-index/238/#fig-238-aw"},{"text":"94–95","href":"/object-index/238/#fig-238-ax"},{"text":"96–97","href":"/object-index/238/#fig-238-ay"},{"text":"98–99","href":"/object-index/238/#fig-238-az"},{"text":"100–101","href":"/object-index/238/#fig-238-ba"},{"text":"102–103","href":"/object-index/238/#fig-238-bb"},{"text":"104–105","href":"/object-index/238/#fig-238-bc"},{"text":"106–107","href":"/object-index/238/#fig-238-bd"},{"text":"108–109","href":"/object-index/238/#fig-238-be"},{"text":"110–111","href":"/object-index/238/#fig-238-bf"},{"text":"112–113","href":"/object-index/238/#fig-238-bg"},{"text":"114–115","href":"/object-index/238/#fig-238-bh"},{"text":"116–117","href":"/object-index/238/#fig-238-bi"},{"text":"118–119","href":"/object-index/238/#fig-238-bj"},{"text":"120–121","href":"/object-index/238/#fig-238-bk"},{"text":"122–123","href":"/object-index/238/#fig-238-bl"},{"text":"124–125","href":"/object-index/238/#fig-238-bm"},{"text":"126–127","href":"/object-index/238/#fig-238-bn"},{"text":"128–129","href":"/object-index/238/#fig-238-bo"},{"text":"130–131","href":"/object-index/238/#fig-238-bp"},{"text":"132–133","href":"/object-index/238/#fig-238-bq"},{"text":"134–135","href":"/object-index/238/#fig-238-br"},{"text":"Envelope","href":"/object-index/238/#fig-238-bs"},{"text":"Envelope Contents","href":"/object-index/238/#fig-238-bt"}]

    let objLink = ''
    let figImagePath = ''
    let figAlt = ''
    let figLabel = ''
    let figCaption = ''
    let figCredit = ''
    let anthologyLinks = ''

    for ( let fig of figureList ) {   
      if (fig.id == figId) {
        objLink = fig.link ? fig.link : ''
        figLabel = fig.label ? fig.label : ''
        figCaption = fig.caption ? fig.caption : ''
        figCredit = fig.credit ? fig.credit : ''
        figAlt = fig.alt ? fig.alt : ''

        // Add list of page link to An Anthology figures to meet rights requirements
        if (fig.anthology_links) {
          anthologyLinks = '<div class="anthology-links" data-outputs-exclude="epub,pdf"><div class="anthology-links-heading">View: </div><div class="anthology-links-scrollarea">';
          anthologyData.forEach(item => {
            if (item.href == objLink) {
              anthologyLinks += `<a href="${item.href}" class="current-thumbnail" target="object-iframe">${item.text}</a>, `;
            } else {
              anthologyLinks += `<a href="${item.href}" target="object-iframe">${item.text}</a>, `;
            }
          });
          // Remove the last comma and space
          anthologyLinks = anthologyLinks.slice(0, -2);
          anthologyLinks += '</div></div>';
        }

        // figImagePath
        if (fig.thumb) {
          figImagePath = `/_assets/images/${fig.thumb}`
        } else if (fig.annotations) {
          figImagePath = `/iiif/${figId}/base/static-inline-figure-image.jpg`
        } else if (fig.zoom) {
          const figFilename = fig.src.replace('figures/', '').replace('.jpg', '')
          figImagePath = `/iiif/${figId}/${figFilename}/static-inline-commentary-image.jpg`
        } else if (fig.media_type == 'vimeo' || 'soundcloud' || 'audio' ) {
          figImagePath = `/_assets/images/${fig.poster}`
        } 

        // figPDFImagePath
        if (fig.thumb) {
          figPDFImagePath = `/_assets/images/${fig.thumb}`
        } else if (fig.annotations) {
          figPDFImagePath = `/iiif/${figId}/base/print-image.jpg`
        } else if (fig.zoom) {
          const figFilename = fig.src.replace('figures/', '').replace('.jpg', '')
          figPDFImagePath = `/iiif/${figId}/${figFilename}/print-image.jpg`
        } else if (fig.media_type == 'vimeo' || 'soundcloud' || 'audio' ) {
          figPDFImagePath = `/_assets/images/${fig.poster}`
        } 
      }
    } 

    return html`
      <figure class="scores-figure" id="${figId}">
        <a class="scores-figure__link" href="${objLink}" target="object-iframe" class="object-link" data-outputs-include="html">
        <img class="scores-figure__class" src="${figImagePath}" alt="${figAlt}" />
        </a>
        <div class="scores-figure__link" class="object-link" data-outputs-include="pdf,epub">
        <img class="scores-figure__class" src="${figPDFImagePath}" alt="${figAlt}" />
        </div>
        ${anthologyLinks}
        <figcaption>
          <div>
          <span class="scores-figure__label">${figLabel}</span>
          <span class="scores-figure__caption">${markdownify(figCaption)}</span>
          <span class="scores-figure__credit">${markdownify(figCredit)}</span>
          </div>       
          <a class="scores-figure__link" href="https://getty.edu/publications/scores${objLink}" data-outputs-exclude="html">getty.edu/publications/scores${objLink}</a>
        </figcaption>
      </figure>
    `
  }
}
