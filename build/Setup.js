"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Setup = void 0;
// @ts-ignore
const photoshop_1 = require("photoshop");
const BatchPlayFunctions_1 = require("./BatchPlayFunctions");
async function Setup() {
    const activeLayer = photoshop_1.app.activeDocument.activeLayers[0];
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
exports.Setup = Setup;
async function CreateSetupGuides(document) {
    const width = document.width;
    const height = document.height;
    // @ts-ignore
    const id = document._id;
    await (0, BatchPlayFunctions_1.CreateGuide)(id, 0, "horizontal" /* horizontal */);
    await (0, BatchPlayFunctions_1.CreateGuide)(id, 0, "vertical" /* vertical */);
    await (0, BatchPlayFunctions_1.CreateGuide)(id, height, "horizontal" /* horizontal */);
    await (0, BatchPlayFunctions_1.CreateGuide)(id, width, "vertical" /* vertical */);
}
//# sourceMappingURL=Setup.js.map