document.addEventListener('DOMContentLoaded', () => {
  const sampler = document.querySelector('.music-sampler')

  if (sampler) {

    const gridItems = document.querySelectorAll('.grid-item')
    const clickPlayModeButton = document.getElementById('click-play-mode')
    const hoverPlayModeButton = document.getElementById('hover-play-mode')
    const keyPlayModeButton = document.getElementById('key-play-mode')
    let playMode = 'click'
    let currentAudio = null

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
      if (!sampler.classList.contains('continuous') && currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
      audioElement.currentTime = 0
      audioElement.play()
      currentAudio = audioElement
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
        }
      })

      element.addEventListener('mouseenter', () => {
        if (playMode === 'hover') {
          playAudio(audio)
        }
      })

      element.addEventListener('touchstart', () => {
        playAudio(audio)
      })

      element.addEventListener('touchmove', () => {
        if (playMode === 'hover') {
          playAudio(audio)
        }
      })

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

    }
  
})
