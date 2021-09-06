const app = window.require('photoshop').app

const { getLayerProperty } = require('./build/LayerDesc')
const { Setup, Rasterize } = require('./build/Setup')
const { ReadGuides } = require('./build/Slicing')

const bounds = getLayerProperty('bounds')
console.log('rebuilt')
