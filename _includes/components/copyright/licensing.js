//
// CUSTOMIZED FILE
// Updated language of `text-only` license to current Getty standard
//
const { oneLine } = require('~lib/common-tags')

module.exports = function(eleventyConfig) {
  return function (params) {
    const { publication } = eleventyConfig.globalData
    const { license } = publication

    let licenseText = ''

    const licenseAbbreviation = license.abbreviation || license.name
    const licenseName = license.url
      ? `<a rel="license" href="${license.url}" target="_blank">${license.name}</a>`
      : license.name

    if (license.scope == 'some-exceptions') {
      licenseText += `
        Unless otherwise indicated, this work is licensed under a ${licenseName}.
      `
    } else if (license.scope === 'text-only') {
      licenseText += `
        The text of this work is licensed under a ${licenseName}.<span data-outputs-exclude="html,epub"> To view a copy of this license visit ${license.url}.</span> All images are reproduced with the permission of the rights holders acknowledged in captions and are expressly excluded from the ${licenseAbbreviation} license covering the rest of this publication. These images may not be reproduced, copied, transmitted, or manipulated without consent from the owners, who reserve all rights.
      `
    } else {
      licenseText += `
        This work is licensed under a ${licenseName}.
      `
    }

    return oneLine`
      ${licenseText}
    `
  }
}
