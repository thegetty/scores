//
// CUSTOMIZED FILE
// Changed to just four links, consistent across all pages
//
const { html } = require('~lib/common-tags')

module.exports = function() {

  return function (layout) {

    const contentsAction = layout == 'score-object'
      ? `onclick="toggleMenu()"`
      : `href="#site-menu"`

    const homePageLink = html`<a href="/">The Scores Project</a>`
    const contentsLink = html`<a ${contentsAction} id="site-menu-link">Contents</a>`
    const imageIndexLink = html`<a href="/image-index/">Image Index</a>`
    const searchLink = html`<a onclick="toggleSearch()">Search</a>`

    return html`
      <div class="quire-navbar">
        <a href="#main" class="quire-navbar-skip-link" tabindex="1">
          Skip to Main Content
        </a>
        <nav class="quire-navbar-controls">
          ${homePageLink}
          <div class="quire-navbar-controls__subgroup">
          ${contentsLink}
          ${imageIndexLink}
          ${searchLink}
          </div>
        </nav>
      </div>
    `
  }
}
