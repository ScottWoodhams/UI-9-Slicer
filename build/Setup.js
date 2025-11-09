"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = Setup;
// @ts-ignore
const photoshop_1 = require("photoshop");
const BatchPlayFunctions_1 = require("./BatchPlayFunctions");
async function Setup() {
    const activeLayer = photoshop_1.app.activeDocument.activeLayers[0];
    console.log(activeLayer);
    let sliceDoc = await photoshop_1.app.createDocument({
        width: photoshop_1.app.activeDocument.width,
        height: photoshop_1.app.activeDocument.height,
        resolution: photoshop_1.app.activeDocument.resolution,
        // @ts-ignore
        mode: 'RGBColorMode',
        name: 'SlicingDoc',
        fill: 'transparent'
    });
    let sliceLayer = await activeLayer.duplicate(sliceDoc);
    // @ts-ignore
    await (0, BatchPlayFunctions_1.Rasterize)(sliceLayer._id);
    await (0, BatchPlayFunctions_1.TrimDocument)();
    await CreateSetupGuides(sliceDoc);
}
async function CreateSetupGuides(document) {
    const width = document.width;
    const height = document.height;
    // @ts-ignore
    const id = document._id;
    await (0, BatchPlayFunctions_1.CreateGuide)(id, 0, "horizontal" /* Orientation.horizontal */);
    await (0, BatchPlayFunctions_1.CreateGuide)(id, 0, "vertical" /* Orientation.vertical */);
    await (0, BatchPlayFunctions_1.CreateGuide)(id, height, "horizontal" /* Orientation.horizontal */);
    await (0, BatchPlayFunctions_1.CreateGuide)(id, width, "vertical" /* Orientation.vertical */);
}
//# sourceMappingURL=Setup.js.map