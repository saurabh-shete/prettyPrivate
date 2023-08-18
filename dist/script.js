var images = [
  'https://cdn.quotesgram.com/img/41/6/796602907-just-know-no-matter-what-happens-i-will-always-be-there-for-you.png'
]

var currentIndex = 0
var totalClicks = 0

function randomizeImage () {
  let root = document.documentElement
  root.style.setProperty('--image', 'url(' + images[currentIndex] + ')')
  currentIndex++
  if (currentIndex >= images.length) {
    currentIndex = 0
  }
  var puzzleItems = document.querySelectorAll('#puzz i')
  for (var i = 0; i < puzzleItems.length; i++) {
    puzzleItems[i].style.left = Math.random() * (window.innerWidth - 100) + 'px'
    puzzleItems[i].style.top = Math.random() * (window.innerHeight - 100) + 'px'
  }
}

randomizeImage()

function reloadPuzzle () {
  var doneItems = document.querySelectorAll('.done')
  doneItems.forEach(function (element) {
    element.classList.toggle('done')
  })
  var droppedItems = document.querySelectorAll('.dropped')
  droppedItems.forEach(function (element) {
    element.classList.toggle('dropped')
  })
  var allDoneElement = document.querySelector('.allDone')
  allDoneElement.style = ''
  allDoneElement.classList.toggle('allDone')
}

// Mobile functionality
var puzzleItemsMobile = document.querySelectorAll('#puzz i')

var touchStartX = 0
var touchStartY = 0

var puzzleCompleted = false // Add this variable to track completion

puzzleItemsMobile.forEach(function (element) {
  element.addEventListener('touchstart', function (e) {
    e.preventDefault()
    if (puzzleCompleted) return // Don't allow interactions if puzzle is completed

    totalClicks++
    document.querySelector('#clicks').innerHTML = totalClicks
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  })

  element.addEventListener('touchend', function (e) {
    if (puzzleCompleted) return // Don't allow interactions if puzzle is completed

    var touchEndX = e.changedTouches[0].clientX
    var touchEndY = e.changedTouches[0].clientY
    var touchDistanceX = touchEndX - touchStartX
    var touchDistanceY = touchEndY - touchStartY

    if (Math.abs(touchDistanceX) < 10 && Math.abs(touchDistanceY) < 10) {
      if (document.querySelector('.clicked')) {
        document.querySelector('.clicked').classList.toggle('clicked')
        element.classList.toggle('clicked')
      } else {
        element.classList.toggle('clicked')
      }
    }

    if (
      document.querySelectorAll('.dropped').length === 9 &&
      !puzzleCompleted
    ) {
      puzzleCompleted = true // Set the puzzle as completed

      setTimeout(function () {
        reloadPuzzle()
        randomizeImage()
        puzzleCompleted = false // Reset the puzzle completion after 9 seconds
      }, 9000) // 9000 milliseconds = 9 seconds
    }
  })
})

// ...

function allowDrop (ev) {
  ev.preventDefault()
}

function drag (ev) {
  ev.dataTransfer.setData('text', ev.target.className)
}

function drop (ev) {
  ev.preventDefault()
  var data = ev.dataTransfer.getData('text')

  if (ev.target.className == data) {
    ev.target.classList.add('dropped')
    document
      .querySelector('.' + data + "[draggable='true']")
      .classList.add('done')

    if (document.querySelectorAll('.dropped').length == 9) {
      document.querySelector('#puz').classList.add('allDone')
      document.querySelector('#puz').style.border = 'none'
      document.querySelector('#puz').style.animation =
        'allDone 1s linear forwards'

      setTimeout(function () {
        reloadPuzzle()
        randomizeImage()
      }, 1500)
    }
  }
}
