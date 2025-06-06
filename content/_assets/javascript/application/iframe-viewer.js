//
// CUSTOMIZED FILE
// Scripts for iframe-based image viewer
// 
window['toggleViewer'] = () => {
  var div = document.getElementById('iframe-viewer');

  if (div.style.display == "block") {
    div.style.display = "none"
    // load a blank source so that the iframe properly loads fresh on the next use
    div.querySelector('iframe').src = ""
  } else {
    div.style.display = "block"
  }


  // Pause audio in iframe if it's playing
  const target = document.getElementById('object-iframe').contentDocument
  const mediaPlayers = target.querySelectorAll('audio')
  for (let player of mediaPlayers) {
    if (!player.paused) {
      player.pause()
    }
  }
}

window['toggleTextSize'] = (target) => {
  const toggleButton = document.getElementById('toggle-button-label')
  if (toggleButton) {
    toggleButton.textContent = toggleButton.textContent == 'Increase Text Size'
    ? 'Decrease Text Size'
    : 'Increase Text Size'
  }
  const targetDoc = target == 'iframe'
    ? document.getElementById('object-iframe').contentDocument
    : document
  const mains = targetDoc.getElementsByTagName('main');
  mains[0].classList.toggle("table-zoom")
}

window['copyLink'] = () => {
  const thisButton = event.target.closest('a')
  const originalText = thisButton.textContent
  const baseURL = 'https://www.getty.edu'
  const href = thisButton.getAttribute('data-href')
  const copyLink = baseURL.concat(href)
  navigator.clipboard.writeText(copyLink);

  thisButton.textContent = 'Copied'
  setTimeout(() => {
    thisButton.textContent = originalText
  }, 2000);
}

window['updateViewer'] = (currentObjectHref) => {
  const myIFrame = document.getElementById('object-iframe');
  const myIFrameLoadIndicator = document.getElementById('iframe-loading-indicator');
  
  // Hide iframe and display loading indicator to start
  myIFrame.style.display = "none"
  myIFrameLoadIndicator.style.display = "block"
  
  myIFrame.addEventListener("load", function() {
    // Add class for style overrides
    const pageBody = this.contentDocument.body
    pageBody.classList.add('iframe-version')

    const pageHTML = this.contentDocument.querySelector('html')
    pageHTML.style.backgroundColor = 'black'

    // Add target=_blank to links displayed in iframe
    if (this.contentDocument.URL.includes('visual-atlas')) {
      const contentAreas = this.contentDocument.querySelectorAll('.quire-page__content, .quire-entry__lightbox--embed')
      for (let area of contentAreas) {
        const links = area.querySelectorAll('a:not(.ref)')
        for (let link of links) {
          link.setAttribute('target', '_blank')
        }
      }
    }

    // Show iframe and hide loading indicator after 1000 ms
    setTimeout(() => {
      myIFrame.style.display = "block"
      myIFrameLoadIndicator.style.display = "none"
    }, 750);
  });

  // Update Prev / Next Links 
  // -- THESE WERE REMOVED as not consistent or clear for users
  var nav = document.getElementById('iframe-nav');
  nav.innerHTML = '';
  const pageObjectLinks = document.querySelectorAll("a.object-link")
  let hrefArrayAll = []
  for (var index = 0; index < pageObjectLinks.length; ++index) {
    hrefArrayAll.push(pageObjectLinks[index].getAttribute('href'))
  }
  let hrefArrayUnique = [...new Set(hrefArrayAll)];
  const currentObjectIndex = hrefArrayUnique.indexOf(currentObjectHref)
  const prevObjectIndex = currentObjectIndex == 0 ? hrefArrayUnique.length - 1 : currentObjectIndex - 1
  const nextObjectIndex = currentObjectIndex == hrefArrayUnique.length - 1 ? 0 : currentObjectIndex + 1
  
  const prevButton = document.createElement("a");
  prevButton.href = hrefArrayUnique[prevObjectIndex]
  prevButton.setAttribute('aria-label', 'Previous image')
  prevButton.setAttribute('target', 'object-iframe')
  prevButton.classList.add('iframe-control')
  prevButton.addEventListener('click', () => {
    updateViewer(hrefArrayUnique[prevObjectIndex]);
  })
  prevButton.innerHTML = 'Prev'
  
  const nextButton = document.createElement("a");
  nextButton.href = hrefArrayUnique[nextObjectIndex]
  nextButton.setAttribute('aria-label', 'Next image')
  nextButton.setAttribute('target', 'object-iframe')
  nextButton.classList.add('iframe-control')
  nextButton.addEventListener('click', () => {
    updateViewer(hrefArrayUnique[nextObjectIndex]);
  })
  nextButton.innerHTML = 'Next'
  
  nav.prepend(nextButton)
  nav.prepend(prevButton)  

  // Add href path to share button for copying
  const shareButton = document.getElementById('iframe-share')
  shareButton.setAttribute('data-href', currentObjectHref)
}

window.addEventListener('load', () => {
  document.querySelectorAll('a[target="object-iframe"]:not(.button)').forEach(link => {
    link.addEventListener('click', toggleViewer)
    link.addEventListener('click', () => {
      const currentObjectHref = link.getAttribute('href');
      updateViewer(currentObjectHref);
    })
  })
})
