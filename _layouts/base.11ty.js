//
// CUSTOMIZED FILE
// Added `layout` as a top-level class in order to custom style nav bar on certain layouts
// Added google analytics 4 snippet
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

  return html`
    <!doctype html>
    <html lang="${publication.language}">
      ${this.head(data)}
      <body>
        ${analyticsSnippet}
        ${this.icons(data)}
        ${this.iconscc(data)}
        <div class="quire no-js ${layout}" id="container">
          <div
            aria-expanded="false"
            class="quire__secondary"
            id="site-menu"
            role="contentinfo"
            data-outputs-exclude="epub,pdf"
          >
            ${this.menu({ collections, pageData })}
          </div>
          <div class="quire__primary">
            ${this.navigation(data)}
            <main class="quire-page ${classes}" data-output-path="${outputPath}" data-page-id="${pageId}" >
              ${content}
            </main>
          </div>
          ${this.search(data)}
        </div>
        ${await this.modal(figures)}
        ${this.scripts()}
      </body>
    </html>
  `
}
