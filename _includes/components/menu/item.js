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
  const markdownify = eleventyConfig.getFilter('markdownify')
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const { contributorDivider } = eleventyConfig.globalData.config.tableOfContents

  return function(params) {
    const { currentURL, page } = params
    const { data, url } = page
    const { contributor: pageContributors, label, layout, subtitle, title } = data

    const labelText = label ? `<span class="item-title__label-text">${label}. </span>` : ''
    const titleText = title ? `<span class="item-title__title-text">${title}</span>` : ''
    const subtitleText = subtitle ? `<span class="item-title__subtitle-text">${markdownify(subtitle)}</span>` : ''

    const titleBock = `<span class="item-title">${labelText}${titleText}${subtitleText}</span>`

    const contributorBlock = pageContributors 
      ? `${contributors({ context: pageContributors, format: 'name' })}` 
      : ''

    /**
     * Check if item is a reference to a built page or just a heading
     * @type {Boolean}
     */
    const isPage = !!layout
    return isPage
      ? `<a href="${url}" class="${currentURL === url ? 'active' : ''}">${titleBock}${contributorBlock}</a>`
      : titleBock
  }
}
