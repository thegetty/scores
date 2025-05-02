//@ts-check
// CUSTOMIZED FILE -- Bronze Guidelines
// Add script for iframe-based image viewer
// Add script to toggle image size on object cards
// Added script to toggle drawers
// Added script to control splash overlay on cover
//
/**
 * @fileOverview
 * @name application.js
 * @description This file serves as the entry point for Webpack, the JS library
 * responsible for building all CSS and JS assets for the theme.
 */

// Stylesheets
import '../../fonts/index.scss';
import '../../styles/application.scss'
import '../../styles/screen.scss'
import '../../styles/custom.css'
import '../../animations/animations.css'

// Modules (feel free to define your own and import here)
import './canvas-panel'
import './soundcloud-api.min.js'
import { goToFigureState, setUpUIEventHandlers } from './canvas-panel'
import Accordion from './accordion'
import Search from '../../../../_plugins/search/search.js'
import scrollToHash from './scroll-to-hash'
import './iframe-viewer'
import './sampler'
import './leaflet.js'

// array of leaflet instances
// const mapArr = []

/**
 * toggleMenu
 * @description Show/hide the menu UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additional binding.
 */
window['toggleMenu'] = () => {
  const menu = document.getElementById('site-menu')
  const menuLink = document.getElementById('site-menu-link')
  const catalogEntryImage = document.querySelector(
    '.side-by-side > .quire-entry__image-wrap > .quire-entry__image'
  )
  const menuAriaStatus = menu.getAttribute('aria-expanded')
  menu.classList.toggle('is-expanded', !menu.classList.contains('is-expanded'))
  if (menuAriaStatus === 'true') {
    catalogEntryImage && catalogEntryImage.classList.remove('menu_open')
    menu.setAttribute('aria-expanded', 'false')
    if (menuLink) {
      menuLink.innerText = 'Contents';
    }
  } else {
    catalogEntryImage && catalogEntryImage.classList.add('menu_open')
    menu.setAttribute('aria-expanded', 'true')
    if (menuLink) {
      menuLink.textContent = 'Opened'
      setTimeout(() => {
        menuLink.textContent = 'Contents'
      }, 2500);
    }
    triggerMenuAnimation()
  }
}

/**
 * toggleSearch
 * @description Show/hide the search UI by changing CSS classes and Aria status.
 * This function is bound to the global window object so it can be called from
 * templates without additinoal binding.
 */
window['toggleSearch'] = () => {
  let searchControls = document.getElementById('js-search')
  let searchInput = document.getElementById('js-search-input')
  let searchAriaStatus = searchControls.getAttribute('aria-expanded')
  searchControls.classList.toggle(
    'is-active',
    !searchControls.classList.contains('is-active')
  )
  if (searchAriaStatus === 'true') {
    searchControls.setAttribute('aria-expanded', 'false')
  } else {
    searchInput.focus()
    searchControls.setAttribute('aria-expanded', 'true')
  }
}

/**
 * Paul Frazee's easy templating function
 * https://twitter.com/pfrazee/status/1223249561063477250?s=20
 */
function createHtml(tag, attributes, ...children) {
  const element = document.createElement(tag)
  for (let attribute in attributes) {
    if (attribute === 'className') element.className = attributes[attribute]
    else element.setAttribute(attribute, attributes[attribute])
  }
  for (let child of children) element.append(child)
  return element
}

/**
 * search
 * @description makes a search query using Lunr
 */
window['search'] = () => {
  let searchInput = document.getElementById('js-search-input')
  let searchQuery = searchInput['value']
  let searchInstance = window['QUIRE_SEARCH']
  let resultsContainer = document.getElementById('js-search-results-list')
  let resultsTemplate = document.getElementById('js-search-results-template')
  if (searchQuery.length >= 3) {
    let searchResults = searchInstance.search(searchQuery)
    displayResults(searchResults)
  }

  function clearResults() {
    resultsContainer.innerText = ''
  }

  function displayResults(results) {
    clearResults()
    results.forEach(result => {
      let clone = document.importNode(resultsTemplate.content, true)
      let item = clone.querySelector('.js-search-results-item')
      let title = clone.querySelector('.js-search-results-item-title')
      let type = clone.querySelector('.js-search-results-item-type')
      let length = clone.querySelector('.js-search-results-item-length')
      item.href = result.url
      title.textContent = result.title
      type.textContent = result.type
      length.textContent = result.length
      resultsContainer.appendChild(clone)
    })
  }
}

function onHashLinkClick(event) {
  // only override default link behavior if it points to the same page
  const anchor = event.target.closest('a')
  const hash = anchor.hash
  if (anchor.pathname.includes(window.location.pathname)) {
    // prevent default scrolling behavior
    event.preventDefault()
    // ensure the hash is manually set after preventing default
    window.location.hash = hash

  }
  scrollToHash(hash)
}

function setupCustomScrollToHash() {
  const invalidHashLinkSelectors = [
    '[href="#"]',
    '[href="#0"]',
    '.accordion-section__heading-link',
    '.q-figure__modal-link'
  ]
  const validHashLinkSelector =
    'a[href*="#"]' +
    invalidHashLinkSelectors
      .map((selector) => `:not(${selector})`)
      .join('')
  // Select all links with hashes, ignoring links that don't point anywhere
  const validHashLinks = document.querySelectorAll(validHashLinkSelector)
  validHashLinks.forEach((link) => {
    link.addEventListener('click', onHashLinkClick)
  })
}

/**
 * globalSetup
 * @description Initial setup on first page load.
 */
function globalSetup() {
  let container = document.getElementById('container')
  container.classList.remove('no-js')
  var classNames = []
  if (navigator.userAgent.match(/(iPad|iPhone|iPod)/i))
    classNames.push('device-ios')

  if (navigator.userAgent.match(/android/i)) classNames.push('device-android')

  if (classNames.length) classNames.push('on-device')

  loadSearchData()
  setupCustomScrollToHash()
}

/**
 * loadSearchData
 * @description Load full-text index data from the specified URL
 * and pass it to the search module.
 */
function loadSearchData() {
  // Grab search data
  const dataURL = document.getElementById('js-search').dataset.searchIndex
  if (!dataURL) {
    console.warn('Search data url is undefined')
    return
  }
  fetch(dataURL).then(async (response) => {
    const { ok, statusText, url } = response
    if (!ok) {
      console.warn(`Search data ${statusText.toLowerCase()} at ${url}`)
      return
    }
    const data = await response.json()
    window['QUIRE_SEARCH'] = new Search(data)
  })
}

/**
 * Applies MLA format to date
 *
 * @param  {Date}   date   javascript date object
 * @return {String}        MLA formatted date
 */
function mlaDate(date) {
  const options = {
    month: 'long'
  }
  const monthNum = date.getMonth()
  let month
  if ([4, 5, 6].includes(monthNum)) {
    let dateString = date.toLocaleDateString('en-US', options)
    month = dateString.replace(/[^A-Za-z]+/, '')
  } else {
    month = (month === 8) ? 'Sept' : date.toLocaleDateString('en-US', options).slice(0, 3)
    month += '.'
  }
  const day = date.getDate()
  const year = date.getFullYear()
  return [day, month, year].join(' ')
}

/**
 * @description
 * Set the date for the cite this partial
 * https://github.com/gettypubs/quire/issues/153
 * Quire books include a "Cite this Page" feature with page-level citations formatted in both Chicago and MLA style.
 * For MLA, the citations need to include a date the page was accessed by the reader.
 *
 */
function setDate() {
  const dateSpans = document.querySelectorAll('.cite-current-date')
  const formattedDate = mlaDate(new Date())
  dateSpans.forEach(((dateSpan) => {
    dateSpan.innerHTML = formattedDate
  }))
}

/**
* Translates the X-position of an element inside a container so that its contents
* are contained
* Expects the contained element to already be translated so that it's centered above
* another element
*
* @param {object} element to position
* @param {object} container element
* @param {number} container margin
*/
function setPositionInContainer(el, container) {
  const margin = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gap'))
  const elRect = el.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  const leftDiff = containerRect.left - elRect.left
  const rightDiff = elRect.right - containerRect.right
  const halfElWidth = elRect.width/2
  // x
  if (rightDiff > 0) {
    el.style.transform = `translateX(-${halfElWidth+rightDiff+margin}px)`
  } else if (leftDiff > 0) {
    el.style.transform = `translateX(-${halfElWidth-leftDiff-margin}px)`
  }
  // @todo y
}

/**
 * @description
 * find expandable class and look for aria-expanded
 * https://github.com/gettypubs/quire/issues/152
 * Cite button where users can select, tied to two config settings:
 * citationPopupStyle - text for text only | icon for text and icon
 * citationPopupLinkText which is whatever text you it to say
 */
function toggleCite() {
  let expandables = document.querySelectorAll('.expandable [aria-expanded]')
  for (let i = 0; i < expandables.length; i++) {
    expandables[i].addEventListener('click', event => {
      // Allow these links to bubble up
      event.stopPropagation()
      let expanded = event.target.getAttribute('aria-expanded')
      if (expanded === 'false') {
        event.target.setAttribute('aria-expanded', 'true')
      } else {
        event.target.setAttribute('aria-expanded', 'false')
      }
      let content = event.target.parentNode.querySelector(
        '.quire-citation__content'
      )
      if (content) {
        content.getAttribute('hidden')
        if (typeof content.getAttribute('hidden') === 'string') {
          content.removeAttribute('hidden')
        } else {
          content.setAttribute('hidden', 'hidden')
        }
        setPositionInContainer(content, document.documentElement)
      }
    })
  }
  document.addEventListener('click', event => {
    let content = event.target.parentNode
    if (!content) return
    if (
      content.classList.contains('quire-citation') ||
      content.classList.contains('quire-citation__content')
    ) {
      // do nothing
    } else {
      // find all Buttons/Cites
      let citeButtons = document.querySelectorAll('.quire-citation__button')
      let citesContents = document.querySelectorAll('.quire-citation__content')
      // hide all buttons
      if (!citesContents) return
      for (let i = 0; i < citesContents.length; i++) {
        if (!citeButtons[i]) return
        citeButtons[i].setAttribute('aria-expanded', 'false')
        citesContents[i].setAttribute('hidden', 'hidden')
      }
    }
  })
}

/**
 * objectSize
 * @description Adds a button to the object controls to toggle the image size
 */
function objectSize() {
  const objectControls = document.querySelector('.object-filters__controls');
  if (objectControls) {
    const controlsGroup = document.createElement('div');
    controlsGroup.classList.add('object-filters__controls-group');
    controlsGroup.classList.add('view-controls');
    const label = document.createElement('label');
    label.setAttribute('for', 'object-size-select');
    label.innerHTML = 'View:';
    const sizeSelect = document.createElement('select');
    sizeSelect.setAttribute('id', 'object-size-select');
    sizeSelect.classList.add('object-filters__select');
    const options = ['Small', 'Large', 'Table'];
    options.forEach(option => {
      const opt = document.createElement('option');
      opt.value = option.toLowerCase();
      opt.innerHTML = option;
      sizeSelect.appendChild(opt);
    });
    sizeSelect.addEventListener('change', () => {
      changeObjectSize(sizeSelect.value);
    });
    controlsGroup.appendChild(label);
    controlsGroup.appendChild(sizeSelect);
    objectControls.appendChild(controlsGroup);
  }
}
window['changeObjectSize'] = (size) => {
  const objectCards = document.querySelector('.object-cards');
  const objectCardsClasses = objectCards.classList;
  objectCardsClasses.remove('small', 'large', 'table');
  objectCardsClasses.add(size);
}

// Toggle score object page between side-by-side and widecreen view
window['toggleCardCaption'] = function(event) {
  const button = event.target
  const caption = button.nextElementSibling

  if (caption.style.display === "none") {
    caption.style.display = "inline"
    button.textContent = '...'
  } else {
    caption.style.display = "none";
    button.textContent = 'Read ...'
  }
}

window['showTagged'] = function(tag) {
  if (tag !== '') {
    const buttons = document.querySelectorAll('.cards-random-button')
    for (const button of buttons) {
      button.classList.remove('used')
    }
  }
  // tag = tag.toLowerCase()
  const hash = window.location.hash
  if (hash) {
    history.pushState("", document.title, window.location.pathname + window.location.search);
  }
  const allCards = document.querySelectorAll('.card, .card-description')
  allCards.forEach(card => {
    // remove the selected class if the card was previously selected with checkCardHash()
    if (card.classList.contains('selected')) {
      card.classList.remove('selected')
      // clone link to remove showTagged listener, and then add original onHashLinkClick listener back on
      const cardLink = card.children[0]
      const clonedLink = cardLink.cloneNode(true)
      clonedLink.addEventListener('click',onHashLinkClick)
      cardLink.parentNode.replaceChild(clonedLink, cardLink);

    }
    if (tag === '') {
      if (card.classList.contains('random')) {
        card.style.display = 'block'
      } else {
        card.style.display = 'none'
      }
    } else if (tag === 'all' ) {
      if (card.classList.contains('card-description')) {
        card.style.display = 'none'
      } else {
        card.style.display = 'block'
      }
    } else {
      const tags = card.getAttribute('data-tags').split(', ')
      card.style.display = tags.includes(tag) ? 'block' : 'none'
    }
  })

  if (typeof tag === 'object') {
    tag = tag.value
  }

  const dropdown = document.getElementById('tagdropdown')
  const options = dropdown.options
  
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === tag) {
      dropdown.selectedIndex = i
      break
    }
  }

  const tagClass = "." + tag.replaceAll(' ', '-') + "-tag"
  const allTags = document.querySelectorAll('.card-caption__tags li')
  const matchedTags = document.querySelectorAll(tagClass)

  for (const t of allTags) {
    t.classList.remove('selected')
  }
  for (const m of matchedTags) {
    m.classList.add('selected')
  }
}

window['showRandom'] = function() {
  const buttons = document.querySelectorAll('.cards-random-button')
  for (const button of buttons) {
    button.classList.add('used')
  }
  const allCards = document.querySelectorAll('.card')
  const allCardDescriptions = document.querySelectorAll('.card-description')
  const allTags = document.querySelectorAll('.card-caption__tags li')
  const dropdown = document.getElementById('tagdropdown');

  // Fisher-Yates shuffle algorithm
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }  
  
  const randomCount = Math.floor(Math.random() * 6) + 1 // Random number between 1 and 6
  const shuffledCards = shuffle(Array.from(allCards)) // Shuffle cards
  shuffledCards.slice(0, randomCount).forEach(card => {
    card.style.display = 'block'
    card.classList.add('random')
  })
  shuffledCards.slice(randomCount).forEach(card => {
    card.style.display = 'none'
    card.classList.remove('random')
  })
  for (const description of allCardDescriptions) {
    description.classList.remove('selected')
    description.style.display = 'none'
  }
  for (const tag of allTags) {
    tag.classList.remove('selected')
  }

  if (dropdown) {
    dropdown.value = ''; // Set the dropdown to the option with no value
  }
}

function checkCardHash() {
  const cardPage = document.querySelector('.quire-score-object-cards')
  const hash = window.location.hash.substring(1); // Remove the '#' from the hash

  if (hash == 'text-start') return

  if (cardPage && hash) {
    const cards = document.querySelectorAll('.card');
    const descriptions = document.querySelectorAll('.card-description');
    const dropdown = document.getElementById('tagdropdown');

    cards.forEach(card => {
      if (card.id === hash) {
        card.style.display = 'block';
        card.classList.add('selected')  
        // Add showTagged so clicking on the selected card will reset the grid to the previous state
        const cardLink = card.children[0]
        const dropdownValue = dropdown.value;
        cardLink.addEventListener('click', function() {
          showTagged(dropdownValue);
        });
      } else {
        card.style.display = 'none';
        card.classList.remove('selected')
      }
    });

    descriptions.forEach(description => {
      description.style.display = 'none';
    });

  }
}

// Toggle score object page between side-by-side and widecreen view
window['toggleEntryContent'] = () => {
  const myDiv = document.getElementById('quire-entry-view')
  const myButton = document.getElementById('quire-entry-view-toggle')

  myDiv.classList.toggle('narrow')
  myDiv.classList.toggle('wide')

  const currentThumb = document.querySelector('.current-thumbnail')
  if (currentThumb) {
    if (!isElementInView(currentThumb)) {
      currentThumb.scrollIntoView({ inline: "nearest" });
    }
  }

  if (myButton.textContent.includes('View: Wide')) {
    myButton.textContent = 'View: Narrow'
  } else {
    myButton.textContent = 'View: Wide'
  }
}

function hideSplash() {
  let splash = document.querySelector('.splash-overlay');
  if (splash) {
    splash.setAttribute('hidden', 'true')
    triggerMenuAnimation()
  }
}

function triggerMenuAnimation() {
  let menu = document.getElementById('site-menu')
  if (menu) {
    menu.offsetHeight // Force reflow
    menu.classList.add('show-animation')
  }
}

function randomImage() {
  let splashImages = [
    "r2012418_890164_b39_f32_012.jpg",
    "fig-201-a_AR832709.jpg",
    "p27023_890164_b39_i_39_32_situations_pianos_1.jpg",
    "gri_2006_m_24_45_330393ds.jpg",
    "r2013910_2006_m_24_b1_f5_015.jpg",
    "gri_2006_m_24_241_1_b1_f2_349357ds.jpg",
    "r2013910_2006_m_24_b1_f3_001.jpg",
    "980063-b24f9_standing.jpg",
    "r2014449_980063_b4_f13_003.jpg",
    "980063-b20f13_r-loss.jpg",
    "r2014504_980063_b26_f7_012.jpg",
    "r32814_980039_b9_r_001.jpg",
    "r2015418_980039_b9_f25_001.jpg",
    "gri_980039_b176_f01_040_mm.jpg",
    "r2015669_980039_b174_f4_001.jpg"
  ];

  let randomSplashImage = splashImages[Math.floor(Math.random() * splashImages.length)];
  let splash = document.querySelector('.splash-overlay-image img');

  if (splash) {
    let splashSrc = '_assets/images/figures/splash/' + randomSplashImage;
    let currentSrc = splash.getAttribute('src');
    
    if (splashSrc === currentSrc) {
      do {
        randomSplashImage = splashImages[Math.floor(Math.random() * splashImages.length)];
        splashSrc = '_assets/images/figures/' + randomSplashImage;
      } while (splashSrc === currentSrc);
    }
    splash.setAttribute('src', splashSrc);
  }
}

function scrollView() {
  const scrollTargets = document.getElementsByClassName('current-thumbnail')
  if (scrollTargets.length > 0) {
    for (const target of scrollTargets) {
      const parent = target.parentElement
      const parentRect = parent.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()

      // Calculate the scrolling offsets
      const offsetTop = targetRect.top - parentRect.top + parent.scrollTop
      const offsetLeft = targetRect.left - parentRect.left + parent.scrollLeft
      
      // Scroll the parent element to center the target element
      parent.scrollTop = offsetTop - (parent.clientHeight / 2) + (target.clientHeight / 2)
      parent.scrollLeft = offsetLeft - (parent.clientWidth / 2) + (target.clientWidth / 2)
    }
  }
}

// Scroll to newThumbnail if it's not in view
function isElementInView(element) {
  const rect = element.getBoundingClientRect();
  const parentRect = element.parentElement.getBoundingClientRect();
  return (
      rect.left >= 0 &&
      rect.right <= parentRect.width
  );
}

// Function to copy the current URL to the clipboard
function copyLink(event) {
  const element = event.currentTarget;
  if (element.classList.contains('current-thumbnail')) {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      const tooltip = element.querySelector('.thumbnail-tooltip');
      if (tooltip) {
        tooltip.hidden = false;
        setTimeout(() => {
          tooltip.hidden = true; 
        }, 2000);
      }
    }).catch(err => {
        console.error('Failed to copy link: ', err);
    });
  }
}

function addThumbnailLinkCopying() {
  // Get all a.thumbnail elements on the page
  const thumbnails = document.querySelectorAll('a.thumbnail');

  thumbnails.forEach(thumbnail => {
    // Add the copyLink function triggered by click
    thumbnail.addEventListener('click', copyLink);
  });
}


/**
 * pageSetup
 * @description This function is called after each smoothState reload.
 * Set up page UI elements here.
 */
function pageSetup() {
  setDate()
  toggleCite()
  objectSize()
  randomImage()
  scrollView()
  checkCardHash()
  addThumbnailLinkCopying()
}

function parseQueryParams() {
  const url = new URL(window.location)
  const uniqueKeys = [...new Set(url.searchParams.keys())]
  return Object.fromEntries(
    uniqueKeys.map((key) => [
      key,
      url.searchParams.getAll(key).map(decodeURIComponent)
    ])
  )
}

// Start
// -----------------------------------------------------------------------------
//
// Run immediately
globalSetup()

// Run when DOM content has loaded
window.addEventListener('load', () => {

  let splashLink = document.querySelector(".splash-overlay-link");
  let splashOverlayImage = document.querySelector(".splash-overlay-image");
  if (splashOverlayImage && splashLink) {
    splashLink.addEventListener('click', randomImage)
    splashOverlayImage.addEventListener('click', hideSplash)
  }
  pageSetup()
  scrollToHash(window.location.hash, 75, 'swing')
  const params = parseQueryParams()
  /**
   * Accordion Setup
   */
  Accordion.setup()
  /**
   * Canvas Panel Setup
   */
  setUpUIEventHandlers()
  if (window.location.hash) {
    goToFigureState({
      figureId: window.location.hash.replace(/^#/, ''),
      annotationIds: params['annotation-id'],
      region: params['region'] ? params['region'][0] : null,
      sequence: {
        index: params['sequence-index'] ? params['sequence-index'][0] : null,
      },
    })
  }
})

window.addEventListener('hashchange', () => {
  checkCardHash()
})

window.addEventListener('scroll', () => {
  let nav = document.getElementById('nav');
  if (nav.getBoundingClientRect().top < window.innerHeight) {
    triggerMenuAnimation()
  }
})

window.addEventListener('keydown', (event) => {
  const thumbnails = document.querySelector('.quire-entry__thumbnails')
  if (thumbnails) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      let currentThumbnail = document.querySelector('a.thumbnail.current-thumbnail');
        if (currentThumbnail) {
          currentThumbnail.classList.remove('current-thumbnail');
          let newThumbnail;
        if (event.key === 'ArrowRight') {
          newThumbnail = currentThumbnail.nextElementSibling;
          if (!newThumbnail || !newThumbnail.classList.contains('thumbnail')) {
            newThumbnail = currentThumbnail.parentElement.firstElementChild;
          }
          console.log('ArrowRight')
        } else if (event.key === 'ArrowLeft') {
          newThumbnail = currentThumbnail.previousElementSibling;
          if (!newThumbnail || !newThumbnail.classList.contains('thumbnail')) {
            newThumbnail = currentThumbnail.parentElement.lastElementChild;
          }
          console.log('ArrowLeft')
        }
        if (newThumbnail && newThumbnail.classList.contains('thumbnail')) {
          newThumbnail.classList.add('current-thumbnail');
          if (!isElementInView(newThumbnail)) {
            newThumbnail.scrollIntoView({ inline: "nearest" });
          }
        }
      }
    }
  }
})
