This is the repository for *The Scores Project: Experimental Notation in Music, Art, Poetry, and Dance, 1950–1975*, edited by Michael Gallope, Natilee Harren, and John Hicks. This digital book was first published May 6, 2025, by the Getty Research Institute. It is available online at https://www.getty.edu/publications/scores/ and may be downloaded there free of charge in multiple formats.

## About the Book

Artists working in and across the fields of visual art, music, poetry, theater, and dance at midcentury began to use experimental scores in ways that revolutionized artistic practice and opened up new forms of interdisciplinary collaboration. Their experimental practices—associated with the neo-avant-garde, neo-Dadaism, intermedia, Fluxus, and postmodernism—exploded in notoriety during the 1960s in locales from New York to Europe, East Asia, and Latin America, becoming foundational to global trends in contemporary art and performance. *The Scores Project* is a unique digital publication that provides a comprehensive view of this historical moment through a series of experimental scores and complete edition of the groundbreaking *An Anthology of Chance Operations* (1963). The featured scores by John Cage, George Brecht, Sylvano Bussotti, Morton Feldman, Allan Kaprow, Alison Knowles, Jackson Mac Low, Benjamin Patterson, Yvonne Rainer, Mieko Shiomi, David Tudor, and La Monte Young include expert commentaries from an interdisciplinary team of scholars and are accompanied by a digitized archive of over 2,000 ephemera and audiovisual materials. Ambitious, provocative, and playful, *The Scores Project* fosters a renewed sense of wonder at this innovative and historically complex moment in the history of art.

## Using this Repository

This is one in series of multiformat publications using [Quire](http://quire.getty.edu)™, Getty’s multiformat publishing tool. 

We are dedicated to maintaining this publication for years to come at the permanent URL, https://www.getty.edu/publications/scores/, and in its various formats and incarnations. For any updates to the book, we will be following something between an app and traditional book publication model. Updates will only be made in regulated chunks as formal revisions and new editions and will always be thoroughly documented here in the repository, as well as in the revision history included with each of the book’s many formats.

The primary content pieces of the book can be found in the `content` directory. The `main` branch represents the current, published edition at all times, and the `revisions` branch, when present, will show changes currently under consideration. We invite you to submit suggestions or corrections via pull request on the revisions branch, by posting an issue, or by emailing us at [pubsinfo@getty.edu](mailto:pubsinfo@getty.edu).

## Development Notes

This project was last built with the following software versions:

- Node 18.20.5
- Quire CLI 1.0.0-rc.15

### Branches

| branch | about |
| --- | --- |
| `main` | The primary branch |
| `first-pages`, `second-pages`, `final-pages`, `final-pages-v2` | Versions of the project at various staages |
| `forthcoming` | A static placeholder page that was displayed at the book’s final URL on getty.edu prior to publication |
| `revisions` | Any revisions currently under consideration but not yet published |
| `prototype` | An early prototype of the project built to verify final data structure and design |

### Figure Images Submodule

Many of figure images for *The Scores Project* are licensed from third parties for use exclusively in this publication. As such, they are kept in a separate, private repository, https://github.com/thegetty/scores-images/, which is linked to this main publication repository as a submodule in `content/_assets/images/figures/`. When cloning this repo for further development, you’ll permissions for the private repository and will need to clone recursively in order to clone both the main repo and the submodule.

```
git clone --recursive https://github.com/thegetty/scores.git
```

### Previewing the Online Edition Locally

1. Install Node.js 18.16.0 and verify with with `node --version`

2. Install the Quire CLI with `npm install -g @thegetty/quire-cli@1.0.0-rc.11`

3. Clone this repository and select the appropriate branch

4. Run `npm install` to install the project dependencies (this just needs to be done once when first cloning the project, or whenever the core template/code files are updated)

5. Change the `url` in `content/_data/publication.yaml` to `http://localhost:8080/`

6. See the preview with `quire preview`

### Creating a PDF Version

1. Temporarily switch `url` in publication.yaml to `url: 'http://localhost:8080'`

2. Run `quire build`

3. In `_site/pdf.css` correct the four `@font-face` paths at the top of the file by prepending `_assets/fonts/`. For example:

    ```
    src: url("_assets/fonts/u001/u001-reg.woff2")
    ```

4. With PrinceXML 15.3 installed, run `quire pdf --lib prince`

### Creating an EPUB Version

1. Temporarily switch `url` in publication.yaml to `url: 'http://localhost:8080'`

2. Run `quire build`

3. Inside the `_epub` directory, run the following find and replace regex patterns to remove links to pages that were not included in the EPUB output:

    ```
    FIND: <a href="object-index/[0-9]{3}/.*?" target="object-iframe">((.|\n)*?)</a>
    REPLACE: $1
    ```

    ```
    FIND: <a href="object-index/[0-9]{3}/.*?">((.|\n)*?)</a>
    REPLACE: $1
    ```

    ```
    FIND: <a href="[0-9]{2}/.*?">(.+?)</a>
    REPLACE: $1
    ```

4. Run `quire epub`

5. Unzip resulting file, paste the required accessibility metadata items into the `<metadata>` of the `package.opf` file, and re-zip.

    ```html
    <meta property="schema:accessibilitySummary">This publications meets baseline accessibility standards</meta>
    <meta name="schema:accessMode" content="textual" />
    <meta name="schema:accessMode" content="visual" />
    <meta name="schema:accessModeSufficient" content="textual" />
    <meta name="schema:accessModeSufficient" content="visual" />
    <meta name="schema:accessibilityFeature" content="alternativeText" />
    <meta name="schema:accessibilityFeature" content="structuralNavigation" />
    <meta name="schema:accessibilityFeature" content="tableOfContents" />
    <meta name="schema:accessibilityHazard" content="noFlashingHazard" />
    <meta name="schema:accessibilityHazard" content="noMotionSimulationHazard" />
    <meta name="schema:accessibilityHazard" content="noSoundHazard" />
    ```

### Customizations

In addition to changes in `content/_assets/styles/custom.css` and `content/_assets/styles/variables.scss`, the following changes have been made to the template and style files in this project:

**_includes/components/analytics.js**
**_layouts/base.11ty.js**
Added Google Analytics 4

**_includes/components/copyright/licensing.js**
Updated language of `text-only` license to current Getty standard

**_includes/components/head.js**
**_includes/components/head-tags/opengraph.js**
**_includes/components/head-tags/twitter-card.js**
Customized handling of seo metadata

**_includes/components/license-icons.js**
Remove CC SVG icons from epub output

**_includes/components/lightbox/ui.js**
Use text labels instead of icons for full screen, next, and prev

**_includes/components/menu/index.js**
**_includes/components/menu/item.js**
**_includes/components/menu/resources.js**
Restructured menu to appear as page footer
Added custom citations by page type, and showed page and book citations

**_includes/components/navigation.js**
Changed to just four links, consistent across all pages

**_includes/components/page-header.js**
Added PDF download link to page header

**_includes/components/search.js**
Replaced icons with text labels, and updated input placeholder text

**_includes/components/object-filters/object-card/object-image.webc**
Used `poster` as source of thumbnails for audio, video, tables/embeds, and external IIIF

**_includes/components/object-filters/object-filters.webc**
Used "..." instead of "All" in select boxes

**_includes/components/object-filters/objects-catalog.webc**
Added object-filters__controls-group wrapper to aid in styling

**_includes/web-components/image-sequence/index.js**
**_includes/web-components/image-sequence/styles.js**
Fixed .image-sequence height, and sequence styles to work with custom design

**_includes/web-components/image-sequence/index.js**
Added touch support

**_plugins/figures/iiif/config.js**
Changed thumbnail and static-inline size

**_plugins/shortcodes/tombstone.js**
Handle special outputs for Maker and Type properties

**_plugins/transforms/outputs/epub/transform.js**
Add rel="contents" to epub-contents.md page for EPUB validation

**_layouts/base.11ty.js**
Added `layout` as a top-level class in order to custom style nav bar on certain layouts

**_layouts/essay.liquid**
Added markup for iframe viewer, and passed PDF info in to pageHeader

**_layouts/page.liquid**
Removed prev/next buttons, passed short_title into pageHeader for PDF running feet

**_layouts/pdf.liquid**
**_plugins/transforms/outputs/pdf/write.js**
Improve PDF accessibility

**_layouts/score.liquid**
A custom layout for the primary score landing pages

**_layouts/score-object.liquid**
A custom layout based on `quire-entry` that adds figure thumbnails for lightbox navigation

**_layouts/score-object-cards.liquid**
A custom layout based on `score-object` but displays an array of filterable cards in the lightbox

**_plugins/figures/iiif/config.js**
**_plugins/figures/image/transformer.js**
**_plugins/shortcodes/objFigure.js**
**package.json**
Allow for images to be transformed to single-channel bw

**_plugins/shortcodes/contributors.js**
Parse contributor info passed in as JSON string, for `score.liquid` layout

**_plugins/shortcodes/figureGroup.js**
Added caption and class parameters that can be fed in from shortcode, and simplified HTML markup to remove rows

**_plugins/shortcodes/obj.js**
**_plugins/shortcodes/objFigure.js**
**_plugins/shortcodes/index.js**
Add custom shortcodes for displaying figures/objects

**_plugins/transforms/outputs/epub/manifest.js**
Use config.epub.defaultCoverImage as first choice

**_plugins/transforms/outputs/pdf/transform.js**
Fixed transform that was converting external links to slugified anchor links

**content/_assets/fonts/index.scss**
**content/_assets/fonts/u001**
Add u001 font

**content/_assets/javascript/application/canvas-panel.js**
Add class to current thumbnail for styling

**content/_assets/styles/components/quire-buttons.scss**
**content/_assets/styles/components/quire-page.scss**
Remove all default `<a>` and `button` styles

**content/_assets/styles/components/quire-entry.scss**
Fixed hard-coded heights to use $navbar-height instead

**content/_assets/styles/components/q-lightbox-ui.scss**
Rewrote styles for simpler display of text only links, without icons

**content/_assets/styles/colors.scss**
Define `$off-black` as `$black`

## License

© 2025 J. Paul Getty Trust

The text of this work is licensed under a <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank" rel="license">Creative Commons Attribution-NonCommercial 4.0 International License</a>. All images are reproduced with the permission of the rights holders acknowledged in captions and are expressly excluded from the CC BY-NC license covering the rest of this publication. These images may not be reproduced, copied, transmitted, or manipulated without consent from the owners, who reserve all rights. 