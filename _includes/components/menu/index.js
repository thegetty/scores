//
// CUSTOMIZED FILE
// Restructured menu to appear as page footer
//
const { html } = require('~lib/common-tags')

/**
 * Menu
 * 
 * This controls the global table of contents for the publication, which is
 * available on all pages. For users with Javascript enabled, this menu is hidden
 * by default. Users with JS disabled will alwasy see the menu in its expanded state.
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 */
module.exports = function(eleventyConfig) {
  const citation = eleventyConfig.getFilter('citation')
  const copyright = eleventyConfig.getFilter('copyright')
  const eleventyNavigation = eleventyConfig.getFilter('eleventyNavigation')
  const linkList = eleventyConfig.getFilter('linkList')
  const menuHeader = eleventyConfig.getFilter('menuHeader')
  const menuList = eleventyConfig.getFilter('menuList')
  const menuResources = eleventyConfig.getFilter('menuResources')

  const { 
    contributor_as_it_appears,
    publisher,
    title,
    subtitle,
    resource_link: resourceLinks 
  } = eleventyConfig.globalData.publication

  return function(params) {
    const { collections, pageData } = params

    if (!pageData) return

    const footerLinks = resourceLinks.filter(({ type }) => type === 'footer-link')

    return html`
      <div
        class="quire-menu menu"
        role="banner"
        id="site-menu__inner"
      > 
        <h5 class="scores-menu__title">${title}</h5>

        <h5 class="scores-menu__subtitle">${subtitle}</h5>
        
        <nav id="nav" class="quire-menu__list menu-list" role="navigation" aria-label="full">
          <h6 class="visually-hidden">Table of Contents</h6>
          ${menuList({ currentURL: pageData.url, navigation: eleventyNavigation(collections.menu) })} 
        </nav>

        <p class="scores-menu__editors">${contributor_as_it_appears}<p>

        <p class="scores-menu__publisher">Published by the ${publisher[0].name}</p>

        <div class="scores-footer">

          <div class="scores-footer__citation">
            <h6>Cite this page</h6>
            <div class="cite-this">
              <span class="cite-this__heading">
                Chicago
              </span>
              <span class="cite-this__text">
              ${citation({ context: 'page', page: pageData, type: 'chicago' })}
              </span>
            </div>
            <div class="cite-this">
              <span class="cite-this__heading">
                MLA
              </span>
              <span class="cite-this__text">
                ${citation({ context: 'page', page: pageData, type: 'mla' })}
              </span>
            </div>
          </div>

          <div class="scores-footer__other-formats">
            ${menuResources()}
          </div>

          <div class="scores-footer__copyright">
          <h6>Copyright</h6>
            ${copyright()}
          </div>

          <div class="scores-footer__links">
            ${linkList({ links: footerLinks, classes: ['menu-list']}) }
          </div>

        </div> 
        
      </div>
    `
  }
}
