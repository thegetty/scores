document.addEventListener('DOMContentLoaded', () => {
  const gridItems = document.querySelectorAll('.grid-item')
  const clickPlayModeButton = document.getElementById('click-play-mode')
  const hoverPlayModeButton = document.getElementById('hover-play-mode')
  const keyPlayModeButton = document.getElementById('key-play-mode')
  let playMode = 'click'

  const preloadAudio = (audioFile) => {
    const audio = new Audio(`/publications/scores/_assets/images/figures/samplers/${audioFile}`)
    audio.preload = 'auto'
    return audio
  }

  const audioElements = Array.from(gridItems).map(item => ({
    element: item,
    audio: preloadAudio(item.dataset.audio)
  }))

  const playAudio = (audioElement) => {
    audioElement.currentTime = 0
    audioElement.play()
  }

  const updateGridItemClass = () => {
    gridItems.forEach(item => {
      item.classList.remove('hover', 'click', 'key')
      item.classList.add(playMode)
    })
  }

  audioElements.forEach(({ element, audio }) => {
    element.addEventListener('click', () => {
      if (playMode === 'click') {
        playAudio(audio)
        element.classList.add('active')
        setTimeout(() => element.classList.remove('active'), 200)
      }
    })

    element.addEventListener('mouseenter', () => {
      if (playMode === 'hover') {
        playAudio(audio)
        element.classList.add('active')
      }
    })

    element.addEventListener('mouseleave', () => {
      if (playMode === 'hover') {
        element.classList.remove('active')
      }
    })
  })

  // Touch swipe functionality for hover mode
  let touchStartX = 0
  let touchStartY = 0

  document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
  })

  document.addEventListener('touchmove', (event) => {
    if (playMode === 'hover') {
      const touchEndX = event.touches[0].clientX
      const touchEndY = event.touches[0].clientY
      const touchMoved = Math.abs(touchEndX - touchStartX) > 10 || Math.abs(touchEndY - touchStartY) > 10

      if (touchMoved) {
        const touchTarget = document.elementFromPoint(touchEndX, touchEndY)

        if (touchTarget && touchTarget.closest('.grid-item')) {
          const gridItem = touchTarget.closest('.grid-item')
          gridItem.classList.add('touch-active')
          playAudio(audioElements[Array.from(gridItems).indexOf(gridItem)].audio)
        }
      }
    }
  })

  document.addEventListener('touchend', (event) => {
    if (playMode === 'hover') {
      document.querySelectorAll('.grid-item').forEach(item => {
        item.classList.remove('touch-active')
      })
    }
  })

  document.addEventListener('keydown', (event) => {
    if (playMode === 'key') {
      const key = event.key
      const keyMap = {
        '1': 0,
        '2': 1,
        '3': 2,
        '4': 3,
        '5': 4,
        '6': 5,
        '7': 6,
        '8': 7,
        '9': 8,
        '0': 9,
        '-': 10,
        '=': 11
      }
      if (key in keyMap) {
        const index = keyMap[key]
        if (index < (audioElements.length / 2)) { // Check if index is within bounds
          const item = audioElements[index]
          playAudio(item.audio)
          item.element.classList.add('active')
          setTimeout(() => item.element.classList.remove('active'), 200)
        } 
      }
    }
  })

  clickPlayModeButton.addEventListener('click', () => {
    playMode = 'click'
    updateGridItemClass()
    clickPlayModeButton.classList.add('active')
    hoverPlayModeButton.classList.remove('active')
    keyPlayModeButton.classList.remove('active')
  })

  hoverPlayModeButton.addEventListener('click', () => {
    playMode = 'hover'
    updateGridItemClass()
    clickPlayModeButton.classList.remove('active')
    hoverPlayModeButton.classList.add('active')
    keyPlayModeButton.classList.remove('active')
  })

  keyPlayModeButton.addEventListener('click', () => {
    playMode = 'key'
    updateGridItemClass()
    clickPlayModeButton.classList.remove('active')
    hoverPlayModeButton.classList.remove('active')
    keyPlayModeButton.classList.add('active')
  })

  // Initial setup
  updateGridItemClass()
})
