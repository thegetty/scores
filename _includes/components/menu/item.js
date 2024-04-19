//
// CUSTOMIZED FILE
// Display subtitles and contributors in sidebar menu
//
/**
 * Renders a menu item
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  params
 * @property      {Object}  data Page data
 * @property      {String}  title Page title
 * @property      {String}  url Page url
 */
module.exports = function(eleventyConfig) {
  const contributors = eleventyConfig.getFilter('contributors')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const { contributorDivider } = eleventyConfig.globalData.config.tableOfContents

  return function(params) {
    const { currentURL, page } = params
    const { data, url } = page
    const { contributor: pageContributors, label, layout, subtitle, title } = data

    const titleText = pageTitle({ label, subtitle, title })

    const contributorText = pageContributors 
      ? `${contributorDivider}${contributors({ context: pageContributors, format: 'string' })}` 
      : ''

    /**
     * Check if item is a reference to a built page or just a heading
     * @type {Boolean}
     */
    const isPage = !!layout
    return isPage
      ? `<a href="${url}" class="${currentURL === url ? 'active' : ''}">${titleText}${contributorText}</a>`
      : titleText
  }
}
