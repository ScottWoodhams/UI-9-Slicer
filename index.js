const { app, action } = window.require('photoshop')
const { Setup } = require('./build/Setup')
const { ReadGuides, ExecuteSlice } = require('./build/Slicing')
const { DeleteHistory } = require('./build/BatchPlayFunctions')

const btnReset = document.getElementById('btnReset')
const btnSetup = document.getElementById('btnSetup')
const btnSlice = document.getElementById('btnSlice')

btnSetup.addEventListener('click', SetupInNewDoc)
btnReset.addEventListener('click', Reset)
btnSlice.addEventListener('click', ExecuteSlice)
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

async function UpdateGuidesPositions () {
  const guides = await ReadGuides(app.activeDocument._id)
  console.log(guides)
  sliceTop.textContent = 'Top | ' + guides.Top
  sliceLeft.textContent = 'Left | ' + guides.Left
  sliceBottom.textContent = 'Bottom | ' + guides.Bottom
  sliceRight.textContent = 'Right | ' + guides.Right
}

console.log('rebuilt')