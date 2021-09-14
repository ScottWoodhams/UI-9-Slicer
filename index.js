const { app, action } = window.require('photoshop')
const { entrypoints } = window.require('uxp')
const { Setup } = require('./build/Setup')
const { ReadGuides, ExecuteSlice } = require('./build/Slicing')
const { DeleteHistory } = require('./build/BatchPlayFunctions')
const { TestRun } = require('./build/Test')

const btnReset = document.getElementById('btnReset')
const btnSetup = document.getElementById('btnSetup')
const btnSlice = document.getElementById('btnSlice')

btnSetup.addEventListener('click', SetupInNewDoc)
btnReset.addEventListener('click', Reset)
btnSlice.addEventListener('click', Execute)
btnReset.disabled = true

const sliceTop = document.getElementById('Top')
const sliceLeft = document.getElementById('Left')
const sliceBottom = document.getElementById('Bottom')
const sliceRight = document.getElementById('Right')

async function SetupInNewDoc () {
  await Setup()
  await action.addNotificationListener([
    {
      event: 'historyStateChanged'
    }
  ], UpdateGuidesPositions)
}

async function Reset () {
  await DeleteHistory()
  btnReset.disabled = true
}

async function Execute () {
  const Slices = await ReadGuides(app.activeDocument._id)
  const CanvasWidth = app.activeDocument.width
  const CanvasHeight = app.activeDocument.height
  const DocID = app.activeDocument._id
  const inputScale = document.querySelector('#percentDecrease').value

  let ScalePercent = parseInt(inputScale.value)

  // default to a value if no value exists
  if (isNaN(ScalePercent)) {
    ScalePercent = 33
  }

  const toPowerOfTwo = document.querySelector('#toNearestPow2').checked

  await ExecuteSlice(Slices, CanvasWidth, CanvasHeight, DocID, ScalePercent, toPowerOfTwo)
}

async function UpdateGuidesPositions () {
  const guides = await ReadGuides(app.activeDocument._id)
  console.log(guides)
  sliceTop.textContent = 'Top | ' + guides.Top
  sliceLeft.textContent = 'Left | ' + guides.Left
  sliceBottom.textContent = 'Bottom | ' + guides.Bottom
  sliceRight.textContent = 'Right | ' + guides.Right
}

async function openHelpDialog () {
  const theDialog = document.getElementById('dialog-help')
  const r = await theDialog.uxpShowModal({
    title: 'UI Nine-Slicer Help',
    resize: 'none', // "both", "horizontal", "vertical",
    size: {
      width: 880,
      height: 240
    }
  })
}

// set up entry points -- this defines the Reload Plugin handler
// and the panel (including its associated flyout items)
entrypoints.setup({
  commands: {
    // openHelp: () => openHelpDialog()
  },
  panels: {
    Slicer: {
      show ({ node } = {}) {},
      menuItems: [
        { id: 'helpDialog', label: 'Show Dialog', checked: false, enabled: true }
      ],
      invokeMenu (id) {
        switch (id) {
          case 'helpDialog': openHelpDialog(); break
        }
      }
    }
  }
})

console.log('rebuilt')
