//
// CUSTOMIZED FILE
// Added `layout` as a top-level class in order to custom style nav bar on certain layouts
// Added google analytics 4 snippet
// Changed position of menu to appear as page footer
// Add splash overlay for cover
//
const path = require('path')
const { html } = require('~lib/common-tags')

/**
 * Base layout as a JavaScript method
 *
 * @param      {Object}  data    Final data from the Eleventy data cascade
 * @return     {Function}  Template render function
 */
module.exports = async function(data) {
  const { classes, collections, config, content, layout, pageData, publication } = data
  const { inputPath, outputPath, url } = pageData || {}
  const id = this.slugify(url) || path.parse(inputPath).name
  const pageId = `page-${id}`
  const { googleId } = config.analytics
  const figures = pageData.page.figures

  const analyticsSnippet = googleId ? `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${googleId}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>` : ''

  const splashOverlay = classes.includes('splash') 
    ? `<div class="splash-overlay"><div class="splash-overlay-image"><img src="" alt="" /></div><a class="splash-overlay-link">The Scores Project</a></div>` 
    : ''
  
  const divClass = layout == 'score-object-cards' ? ' score-object' : layout

  return html`
    <!doctype html>
    <html lang="${publication.language}">
      ${this.head(data)}
      <body>
        ${analyticsSnippet}
        ${this.icons(data)}
        ${this.iconscc(data)}
        <div class="quire no-js ${divClass}" id="container">
          ${splashOverlay}
          <div class="quire__primary">
            ${this.navigation(layout)}
            <main class="quire-page ${classes}" data-output-path="${outputPath}" data-page-id="${pageId}" >
              ${content}
            </main>
            ${this.menu({ collections, pageData })}
          </div>
          ${this.search(data)}
        </div>
        ${await this.modal(figures)}
        ${this.scripts()}
      </body>
    </html>
  `
}
