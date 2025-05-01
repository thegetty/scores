//
// CUSTOMIZED FILE
// Restructured menu to appear as page footer on all pages but score object pages
// Added custom citations by page type, and showed page and book citations
//
const { html } = require('~lib/common-tags')
const path = require('path')

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
  const contributors = eleventyConfig.getFilter('contributors')
  const copyright = eleventyConfig.getFilter('copyright')
  const eleventyNavigation = eleventyConfig.getFilter('eleventyNavigation')
  const getContributor = eleventyConfig.getFilter('getContributor')
  const linkList = eleventyConfig.getFilter('linkList')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const menuHeader = eleventyConfig.getFilter('menuHeader')
  const menuList = eleventyConfig.getFilter('menuList')
  const menuResources = eleventyConfig.getFilter('menuResources')

  const { 
    contributor: publicationContributors,
    publisher,
    title,
    subtitle,
    resource_link: resourceLinks,
    url
  } = eleventyConfig.globalData.publication

  return function(params) {
    const { collections, pageData } = params
    const { 
      label, 
      layout, 
      pageContributors,
      pageObjects,
      subtitle, 
      title } = pageData.data

    if (!pageData) return

    const footerLinks = resourceLinks.filter(({ type }) => type === 'footer-link')

    const menuState = (layout !== 'score-object' && layout !== 'score-object-cards' )
      ? 'is-expanded'
      : ''
    
    function addWbrToUrl(url) {
      return url.replace(/(https:\/)|(\/(?!\/|$))|(\.)|(-)/g, (match, p1, p2, p3, p4) => {
        if (p1) return 'https://<wbr>';
        if (p2) return '<wbr>/';
        if (p3) return '<wbr>.';
        if (p4) return '<wbr>-';
      });
    }
    const urlPath = path.join(url, pageData.url);
    const urlString = addWbrToUrl(urlPath);

    const citationUrl = `<a href="${urlPath}">${urlString}</a>`

    const citationBook = html`In <em>The Scores Project: Experimental Notation in Music, Art, Poetry, and Dance, 1950–1975</em>, ed. Michael Gallope, Natilee Harren, and John Hicks. Los Angeles: Getty Research Institute, 2025.`

    function connectorString(string) {
        const lastChar = string.slice(-1)
        const connectorString = lastChar != '.' ? '.'  : ''
        return connectorString
    }

    let citationPage = ''

    if (layout == 'score') {

      citationPage = html`“${label}. ${markdownify(title)}: ${markdownify(subtitle)}.”`

    } else if (layout == 'score-object' || layout == 'score-object-cards' ) {
      
      const pageObj = pageObjects[0]
      const pageTitle = pageObj.title
      const objDate = pageObj.date ? `, ${pageObj.date}` : ''
      const objLocation = pageObj.location ? `${pageObj.location}. ` : ''
      
      let objMaker = ''
      if (pageObj.maker_cite) {
        objMaker = `${pageObj.maker_cite}${connectorString(pageObj.maker_cite)}`
      }
      
      citationPage = html`${objMaker} ${markdownify(pageTitle)}${objDate}. ${objLocation}`  

    } else {

      const pageContributorsData = pageContributors
        ? pageContributors.map((item) => getContributor(item))
        : []
        
      let citationAuthor = ''
      if (pageContributorsData) {
        if (pageContributorsData.length == 1) {
          citationAuthor = html`${pageContributorsData[0].last_name}, ${pageContributorsData[0].first_name}${connectorString(pageContributorsData[0].first_name)} `
        } else if (pageContributorsData.length == 2) {
          citationAuthor = html`${pageContributorsData[0].last_name}, ${pageContributorsData[0].first_name}, and ${pageContributorsData[1].first_name} ${pageContributorsData[1].last_name}${connectorString(pageContributorsData[1].first_name)} `
        } else if (pageContributorsData.length == 3) {
          citationAuthor = html`${pageContributorsData[0].last_name}, ${pageContributorsData[0].first_name}, ${pageContributorsData[1].first_name} ${pageContributorsData[1].last_name}, and ${pageContributorsData[2].first_name} ${pageContributorsData[2].last_name}${connectorString(pageContributorsData[2].first_name)} `
        }
      }
      
      citationPage = html`${citationAuthor}“${markdownify(title)}.”`

    } 

    const fullBookUrlString = addWbrToUrl(url);

    const fullBookCitation = html`Gallope, Michael, Natilee Harren, and John Hicks, eds. <em>The Scores Project: Experimental Notation in Music, Art, Poetry, and Dance, 1950–1975</em>. Los Angeles: Getty Research Institute, 2025. <a href="${url}">${fullBookUrlString}</a>.`  
    
    return html`
      <div
        class="quire-menu menu ${menuState}"
        data-page-layout="${layout}"
        role="contentinfo"
        id="site-menu"
        aria-expanded="false"
        data-outputs-exclude="epub,pdf"
      > 
        <h5 class="scores-menu__title">${title}</h5>

        <h5 class="scores-menu__subtitle">${subtitle}</h5>
        
        <nav id="nav" class="quire-menu__list menu-list" role="navigation" aria-label="full">
          <h6 class="visually-hidden">Table of Contents</h6>
          ${menuList({ currentURL: pageData.url, navigation: eleventyNavigation(collections.menu) })} 
        </nav>

        <div class="scores-menu__editors">
          <span class="edited-by">Edited by </span>
          ${contributors({ context: publicationContributors, format: 'name', type: 'primary' })}
        </div>

        <p class="scores-menu__publisher"><span class="published-by">Published by the </span><span class="publisher-name">${publisher[0].name}</span></p>

        <div class="scores-footer">

          <div class="scores-footer__citation">
            <h6>Cite this page</h6>
            <div class="cite-this">
              <span class="cite-this__text">
                ${citationPage} ${citationBook} ${citationUrl}
              </span>
            </div>
            <h6>Cite the book</h6>
            <div class="cite-this">
              <span class="cite-this__text">
                ${fullBookCitation}
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
