//
// CUSTOMIZED FILE
// Customized handling of seo metadata
//
const path = require('path')

/**
 * Renders <head> <meta> data tags for Open Graph protocol data
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  data
 * 
 * @return     {String}  HTML meta and link elements
 */
module.exports = function(eleventyConfig) {
  const pageTitle = eleventyConfig.getFilter('pageTitle')
  const removeHTML = eleventyConfig.getFilter('removeHTML')
  const removeMarkdown = eleventyConfig.getFilter('removeMarkdown')
  const siteTitle = eleventyConfig.getFilter('siteTitle')
  const { config, figures, objects, publication } = eleventyConfig.globalData
  const { object_list: objectList } = objects
  const { figure_list: figureList } = figures
  const { imageDir } = config.figures

  return function ({ page }) {
    const { description, identifier, promo_image, pub_date, pub_type, title: pubTitle, url } = publication
    const { abstract, canonicalURL, commentary, content, layout, title, subtitle } = page
    const blurbLength = 240

    let metaTitle = ''
    let metaUrl = ''
    let metaImage = ''
    let metaDescription = ''
    
    function getRandomImage() {
      let randomNumber = Math.floor(Math.random() * 9) + 1;
      let fileName = `promo-image-${randomNumber}.jpg`;
      return fileName;
    }

    if (['essay', 'score', 'objects-page'].includes(page.layout)) {

      metaTitle = pubTitle + ': ' + removeHTML(pageTitle({ title, subtitle }))
      metaUrl = canonicalURL
      metaImage = path.join(url, imageDir, getRandomImage())
 
      if ( commentary && commentary.blurb ) {

        metaDescription = commentary.blurb
        metaDescription = removeMarkdown(commentary.blurb)
        metaDescription = metaDescription.substring(0, metaDescription.lastIndexOf(" ", blurbLength)) + " ..."

      } else if (abstract) {

        metaDescription = removeMarkdown(abstract)

      } else {

        const searchString = '<div class="content">'
        // Find the position of the search string in the text
        let startPos = content.indexOf(searchString);
        // Check if the search string is found
        if (startPos === -1) {
          metaDescription = ''
        }
        // Calculate the position to start extracting characters
        startPos += searchString.length;
        // Strip the html and grab the 1000 characters following the search string
        metaDescription = content.substring(startPos, startPos + 1000)
        metaDescription = removeHTML(metaDescription)
        metaDescription = metaDescription.trimStart()
        metaDescription = metaDescription.replace(/(\r\n|\n|\r)/g, ' ');
        metaDescription = metaDescription.substring(0, metaDescription.lastIndexOf(" ", blurbLength)) + " ..."

      }

    } else if (['score-object', 'score-object-cards'].includes(page.layout)) {

      const objId = page.object[0].id || ''
      let objTitle = ''
      let objDate = ''
      let objDescription = ''
      let figId = ''
      for ( let obj of objectList ) {
        if (obj.id == objId) {
          figId = obj.figures[0].id
          objTitle = removeMarkdown(obj.title)
          objDate = obj.date ? ' (' + obj.date + ')' : ''
          objDescription = obj.extended_caption ? obj.extended_caption : ''
        }
      }

      if (objDescription) {
        metaDescription = removeMarkdown(objDescription)
        metaDescription = metaDescription.substring(0, metaDescription.lastIndexOf(" ", blurbLength)) + " ..."
      } else {
        metaDescription = description.one_line || description.full
      }

      metaTitle = pubTitle + ': ' + objTitle + objDate
      metaUrl = canonicalURL
      
      for ( let fig of figureList ) {   
        if (fig.id == figId) {
          if (fig.poster) {
            metaImage = path.join(url, imageDir, fig.poster)
          } else if (fig.thumbnail) {
            metaImage = path.join(url, imageDir, fig.thumbnail)
          }  
        }
      }

    } else {

      if (title == 'Cover' || title == '') {
        metaTitle = siteTitle()
      } else {
        metaTitle = pubTitle + ': ' + removeMarkdown(title)
      }

      metaUrl = url
      metaImage = path.join(url, imageDir, getRandomImage())
      metaDescription = description.one_line || description.full

    }

    const meta = [
      {
        property: 'og:title',
        content: metaTitle
      },
      {
        property: 'og:url',
        content: metaUrl
      },
      {
        property: 'og:image',
        content: metaImage.replace(":/www", "://www")
      },
      {
        property: 'og:description',
        content: metaDescription.replace(/"/g, "'")
      },
      {
        property: 'og:site_name',
        content: pubTitle
      },
      {
        property: 'og:type',
        content: 'book'
      },
      {
        property: 'og:book:isbn',
        content: identifier.isbn && identifier.isbn.replace(/-/g, '')
      },
      {
        property: 'og:book:release_date',
        content: pub_date
      }
    ]

    /**
     * Builds an array of page or publication contributor objects
     */
    publication.contributor.forEach((contributor, { id }) => {
      if (!id) return
      // resolve a page contributor id to a publication contributor
      contributor = publication.contributor[id] && contributor

      const { type, full_name, first_name, last_name } = contributor
      const name = full_name || `${first_name} ${last_name}`

      if (layout === 'essay') {
        meta.push({ name: 'og:article:author', content: name })
      } else if (pub_type === 'book' && type === 'primary') {
        meta.push({ name: 'og:book:author', content: name })
      }
    })

    const metaTags = meta.map(({ property, content }) => (
      `<meta property="${property}" content="${content}">`
    ))
    return `${metaTags.join('\n')}`
  }
}
