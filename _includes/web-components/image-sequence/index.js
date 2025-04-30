//
// CUSTOMIZED FILE
// Removed .description__icon and used text indicator instead
//
import { LitElement, css, html, render, unsafeCSS } from 'lit'
import { createRef, ref } from 'lit/directives/ref.js'

import { imageSequenceStyles } from './styles.js'


/**
 * @class ImageSequence
 * @description A reactive Lit element for showing and interacting with a sequence of images.
 *
 * @todo on fetch error raise an error message on the status-overlay component
 * and set cursor: not-allowed
 */
class ImageSequence extends LitElement {

  static styles = [ imageSequenceStyles ]

  static properties = {
    animationFrame: { 
      type: Number,
      state: true,
    },
    bufferSize: { 
      type: Number,
      state: true,
    },
    didInteract: {
      type: Boolean,
      state: true,
    },
    images: {
      type: Array,
      state: true,
    },
    imageUrls: {
      attribute: 'image-urls',
      type: String,
    },
    index: {
      type: Number,
    },
    intrinsicHeight: {
      type: Number,
      state: true,
    },
    intrinsicWidth: {
      type: Number,
      state: true,
    },
    rotateToIndex: {
      attribute: 'rotate-to-index',
      type: Number,        
    },
    transition: {
      type: Number,
    },
    visible: {
      type: Boolean,
      state: true,
    }
  }

  canvasRef = createRef()

  /**
   * @private
   * @property #bufferWindow
   * 
   * @returns an array of indexes included in `bufferSize` given `index`
   */ 
  get #bufferWindow() {
    // NB: Calculated one length higher to protect against numerical under run
    const imageCount = this.images.length
    const windowStart = imageCount + this.index - Math.round(this.bufferSize/2)
    
    return Array(this.bufferSize)
      .fill(0)
      .map((_, i) => ((windowStart + i) % imageCount))
  }

  /**
   * @private
   * @property #bufferReady
   * 
   * @returns true if the buffer is loaded ahead and behind of `index`
   */
  get #bufferReady() {
    return this.images.filter((img, j) => this.#bufferWindow.includes(j) && img !== null ).length === this.bufferSize
  }

  /**
   * @property bufferedPct
   * @returns percent of the buffer that is not-null
   */
  get bufferedPct() {
    return Math.floor( this.images.filter((img, j) => this.#bufferWindow.includes(j) && img !== null).length / this.bufferSize * 100 )
  }

  /**
   * @property someImagesLoaded
   * @returns true if there is at least one image loaded
   */
  get someImagesLoaded() {
    return this.images.some((image) => image !== null)
  }

  /**
   * @function #fetchImage
   * @param url {string} - image URL to fetch
   * @param seqIndex {Number} - index to store this image 
   * 
   * Fetches `url`, converts it into a blob and stores the image data in `seqIndex`.
   * 
   * The in-flight fetch is stored in this.requests for cancellation and request deduplication, nulled on completion.
   * 
   * @returns {Promise} fetch resposne
   */
  #fetchImage(url, seqIndex) {
    if (this.requests[seqIndex]) return

    const request = new Request(url)

    const response = fetch(request)
      .then((response) => response.blob())
      .then((blob) => window.createImageBitmap(blob))
      .then((bmp) => {
        if (this.intrinsicHeight === 0) {
          this.intrinsicHeight = bmp.height
          this.intrinsicWidth = bmp.width   
        }
        this.images[seqIndex] = bmp
      })
      .then(() => {
        this.requests[seqIndex] = null
        this.requestUpdate()
      })
      .catch((error) => {
        console.error(error)
      })

    this.requests[seqIndex] = response

    return response
  }

  /**
   * @function connectedCallback
   * 
   * `lit` lifecycle method fired the first time the element is connected to the document
   * 
   * Used to register our visibility IntersectionObserver
   */
  connectedCallback() {
    super.connectedCallback()

    const callback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.visible = true
          observer.disconnect()
        }
      })
    }

    const options = { root: null, threshold: 0.5 }

    // Observes this component against the viewport to trigger image preloads
    const io = new IntersectionObserver(callback, options)

    io.observe(this)
  }

  constructor() {
    super()

    // Passed params and config
    this.description = 'Click and drag horizontally'
    this.imageUrls = this.getAttribute('items').split(',')
    this.posterImageSrc = this.imageUrls.length > 0 ? this.imageUrls[0] : ''
    this.isContinuous = this.getAttribute('continuous') === 'true'
    this.isInteractive = this.getAttribute('interactive') === 'true'
    this.didInteract = false
    this.isReversed = this.getAttribute('reverse') === 'true'
    this.sequenceId = this.getAttribute('sequence-id')

    // Internal state
    const pctToBuffer = 0.2
    this.bufferSize = Math.ceil(this.imageUrls.length * pctToBuffer)
    this.blitting = null // null | animationFrameRequestId
    this.images = Array(this.imageUrls.length).fill(null) // Array< null | ImageBitmap >
    this.requests = Array(this.imageUrls.length).fill(null) // Array< null | Promise >
    this.visible = false
    this.index = 0
    this.intrinsicHeight = 0
    this.intrinsicWidth = 0
    this.oldIndex = null
    this.oldX = null
    this.imageCount = this.imageUrls.length

    // Set up observable and mouse events
    if (this.isInteractive) {
      this.addEventListener('mousemove', this.handleMouseMove.bind(this))
    }
  }

  /**
   * @function debounce
   * 
   * Returns a function, that, as long as it continues to be invoked, will not
   * be triggered. The function will be called after it stops being called for
   * N milliseconds. If `immediate` is passed, trigger the function on the
   * leading edge, instead of the trailing.
   *
   * using David Waslsh's debounce
   * https://davidwalsh.name/javascript-debounce-function
   * which is take from underscore.js
   *
   * @example
   *   var myEfficientFn = debounce(function() {
   *     // All the taxing stuff you do
   *   }, 250)
   *
   * @param {function} func - the function to execute
   * @param {integer} wait - the tine to wait in milliseconds
   * @param {boolean} immediate - whether to call the function immediately or at the end of the timeout
   *
   * @returns
   */
  debounce(fn, wait = 250, immediate = false) {
    let timeout = null

    return function () {
      const context = this
      const args = arguments
      const later = function () {
        timeout = null
        if (!immediate) {
          fn.apply(context, args)
        }
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) {
        fn.apply(context, args)
      }
    }
  }

  /**
   * @function handleMouseMove
   * 
   * @param {Event.buttons}
   * @param {Event.clientX}
   * 
   * Sets interaction flag, hides overlays, and handles reversability check
   */
  handleMouseMove({ buttons, clientX }) {
    if (buttons) {
      this.didInteract = true

      if (this.oldX) {
        const deltaX = clientX - this.oldX
        const deltaIndex = Math.floor(Math.log(Math.abs(deltaX))) || 1
        if (deltaX > 0) {
          this.isReversed
            ? this.previousImage(deltaIndex)
            : this.nextImage(deltaIndex)
        } else if (deltaX < 0) {
          this.isReversed
            ? this.nextImage(deltaIndex)
            : this.previousImage(deltaIndex)
        }
      }
      this.oldX = clientX
    } else {
      this.oldX = null
    }
  }

  /**
   * @function nextImage
   * @param {Integer} n Number of steps between start index and end index
   * 
   * Set the sequence image to the index `n` steps after the current index
   */
  nextImage(n=1) {
    const newIndex = this.index + n >= this.imageCount
      ? this.index + n - this.imageCount
      : this.index + n
    this.index = newIndex
  }

  /**
   * @function #draw
   * 
   * Performs drawing operations against `this.context`
   */
  #draw(image) {
    this.context.drawImage(image,0,0)
  }

  /**
   * @function #paintCanvas
   * @param {ImageBitmap} - image - image to paint 
   * 
   * Paints the `canvas` element with the image from this.index
   */
  #paintCanvas(image) {
    if (!this.canvasRef.value) {
      return
    }

    this.context ??= this.canvasRef.value.getContext('2d')

    if (image) {
      window.cancelAnimationFrame(this.blitting)
      this.blitting = window.requestAnimationFrame( () => this.#draw(image) )
      return
    }

    if (!this.images[this.index]) {
      this.#fetchImage(this.imageUrls[this.index],this.index)
      return
    }

    window.cancelAnimationFrame(this.blitting)
    this.blitting = window.requestAnimationFrame( () => this.#draw(this.images[this.index]) )
    
  }

  /**
   * @function willUpdate
   * @param changedProperties
   * 
   * `lit` lifecycle method for changed properties
   */
  willUpdate(changedProperties) {
    // Determine the animation indices, preload them, and then do the rotation 
    if (changedProperties.has('rotateToIndex') && this.rotateToIndex!==false) {
      const frameCount = this.rotateToIndex - this.index + this.bufferSize / 2
      const animationIndices = Array(frameCount).fill(0).map((_, i) => this.index + i + 1)
      this.#preloadImages(animationIndices).then(this.animateRotation(this.rotateToIndex))
    }

    // Draws `animationFrame` directly to canvas (for use )
    if (changedProperties.has('animationFrame')) {
      if (!this.animationFrame) { return }
      if (this.images[this.animationFrame] === null) { return }

      this.#paintCanvas(this.images[this.animationFrame])
    } 

    if (changedProperties.has('index') && this.someImagesLoaded) {
      this.#preloadImages().then(() => {
        this.animateRotation(this.index)
      })
    }

    // Load enough to prepare for interaction
    if (changedProperties.has('visible') && !this.visible) {
      this.#preloadImages().then(() => this.#paintCanvas())
    }
  }

  /**
   * @function #preloadImages
   * 
   * Loads images of this.indexesToBuffer -- ahead and behind `this.index`
   * 
   * @returns {Promise} - Promise resolution for all preloads
   */
  #preloadImages(bufferWindow) {
    if (!this.images.some(i => i === null)) return Promise.all([]);

    const indexesToLoad = bufferWindow ?? this.#bufferWindow
    const imageRequests = this.images
      .map((image, i) => {
        // Skip anything out of our range or already loaded
        if (!indexesToLoad.includes(i) || image !== null) return null;
        const url = this.imageUrls[i]
        return this.#fetchImage(url, i);
      })
      .filter((imageRequest) => imageRequest)

    return Promise.all(imageRequests)
  }

  /**
   * Animates a rotation by stepping through images from the current index to the provided `newValue`
   */
  animateRotation(untilIndex) {
    if (this.animationFrame === untilIndex) return

    this.animationFrame = this.index

    const interval = setInterval(() => {
      /**
       * Set rotateToIndex to false when rotation is done and clear the interval
       */
      if (this.animationFrame === untilIndex) {
        this.index = untilIndex
        this.rotateToIndex = false
        this.synchronizeSequenceInstances()
      }
      /**
       * Clear the interval if user has triggered another rotation
       */
      if (this.rotateToIndex !== untilIndex) {
        clearInterval(interval)
        return
      }
      /**
       * Step through images
       */
      this.animationFrame += 1
    }, this.transition)
  }

  /**
   * Set the sequence image to the index `n` indices before the current index
   * @param {Integer} n Number of steps between start index and end index
   */
  previousImage(n=1) {
    const newIndex = this.index - n < 0
      ? this.imageCount + this.index - n
      : this.index - n
    this.index = newIndex
  }

  synchronizeSequenceInstances() {
    clearTimeout(this.updateTimer)
    this.updateTimer = setTimeout(() => {
      const sequenceInstances = document.querySelectorAll(`q-image-sequence[sequence-id="${this.sequenceId}"]`)
      sequenceInstances.forEach((sequence) => {
        if (parseInt(sequence.getAttribute('index')) !== this.index) {
          sequence.setAttribute('index', this.index)
        }
      })
    }, 250)
  }

  render() {
    const descriptionOverlay = this.isInteractive ? 
      html`<div slot='overlay' class="overlay ${ this.didInteract === false ? 'visible' : '' }"><span class="description">
            <span class="description__text">${this.description}</span>
          </span></div>` 
      : ''

    return html`<div class="image-sequence ${this.#bufferReady ? '' : 'loading'} ${this.isInteractive ? 'interactive' : ''}">
        <slot name="loading-overlay">
          <div slot="loading-overlay" class='${ this.#bufferReady ? '' : 'visible'} loading overlay'>
            <div class="buffering-indicator">Loading Image Sequence&nbsp;(${ this.bufferedPct }%)...</div>
            </div>
        </slot>
        <canvas ${ref(this.canvasRef)} height="${this.intrinsicHeight}" width="${this.intrinsicWidth}" class="${this.someImagesLoaded ? 'visible' : ''} ${this.didInteract ? '' : 'fade-in'}" slot="images"></canvas>
        <slot name="overlay">
          ${descriptionOverlay}
        </slot>
      </div>`
  }
}

customElements.define('q-image-sequence', ImageSequence)
