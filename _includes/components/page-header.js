//
// CUSTOMIZED FILE
// Remove download link icon, added elements for PDF running feet
//
const { html } = require('~lib/common-tags')
const path = require('path')

const checkFormat = require('../../_plugins/collections/filters/output.js')

/**
 * Publication page header
 *
 * @param      {Object}  eleventyConfig
 */
module.exports = function(eleventyConfig) {
  const contributors = eleventyConfig.getFilter('contributors')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const slugify = eleventyConfig.getFilter('slugify')

  const { labelDivider } = eleventyConfig.globalData.config.pageTitle
  const { imageDir } = eleventyConfig.globalData.config.figures

  const pdfConfig = eleventyConfig.globalData.config.pdf

  /**
   * @function checkPagePDF
   * 
   * @param {Object} config pdf object from Quire config
   * @param {Array<string>,string,undefined} outputs outputs setting from page frontmatter 
   * @param {bool} frontmatterSetting pdf page setting from page frontmatter
   * 
   * Check if the PDF link should be generated for this page
   */
  const checkPagePDF = (config,outputs,frontmatterSetting) => {

    // Is the output being created?
    if (!checkFormat('pdf', { data: { outputs } })) {
      return false 
    }

    // Are the footer links set?
    if (config.pagePDF.accessLinks.find((al) => al.header === true) === undefined)  {
      return false
    }

    // Return the core logic check
    return (config.pagePDF.output === true && frontmatterSetting !== false) || frontmatterSetting === true
  }

  return function (params) {
    const {
      byline_format: bylineFormat,
      image,
      label,
      pageContributors,
      short_title: shortTitle,
      subtitle,
      title,
      outputs,
      pdf_feet_recto: pagePDFFeetRecto,
      page_pdf_output: pagePDFOutput,
      key,
    } = params

    const classes = ['quire-page__header', 'hero']

    if (title == 'title page' || title == 'half title page') {
      classes.push('is-screen-only')
    }

    const pageLabel = label
      ? `<span class="label">${label}<span class="visually-hidden">${labelDivider}</span></span>`
      : ''

    const imageElement = image
      ? html`
          <section
            class="${classes} hero__image"
            style="background-image: url('${path.join(imageDir, image)}');"
          >
          </section>
        `
      : ''

    const contributorsElement = pageContributors
      ? html`
          <div class="quire-page__header__contributor">
            ${contributors({ context: pageContributors, format: bylineFormat })}
          </div>
        `
      : ''

    let downloadLink = ''

    const pdfRecto = pagePDFFeetRecto ? markdownify(pagePDFFeetRecto) : ''

    const pdfURL = key ? `getty.edu/publications/scores/${key.replace(/\/commentary/g,'')}/` : ''

    if (checkPagePDF(pdfConfig,outputs,pagePDFOutput)) {
      const text = pdfConfig.pagePDF.accessLinks.find((al) => al.header === true).label
      const href = path.join(pdfConfig.outputDir, `${pdfConfig.filename}-${slugify(key)}.pdf`)
      downloadLink = html`
        <div class="quire-download" data-outputs-exclude="epub,pdf">
          <a class="quire-download__link" href="${ href }" download><span>${ text }</span></a>
        </div>
      `
    }

    return html`
      <section class="${classes}">
        <div class="hero-body">
          <h1 class="quire-page__header__title" id="${slugify(title)}">
            ${pageLabel}
            ${pageTitle({ title, subtitle })}
          </h1>
          ${contributorsElement}
          ${downloadLink}
          <span class="pdf-footers__verso" data-outputs-exclude="epub,html">${markdownify(shortTitle || title)}</span>
          <span class="pdf-footers__recto" data-outputs-exclude="epub,html">${pdfRecto}</span>
          <span class="pdf-footers__url" data-outputs-exclude="epub,html">${pdfURL}</span>
        </div>
      </section>
      ${imageElement}
    `
  }
}
