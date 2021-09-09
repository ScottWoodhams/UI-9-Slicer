"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRun = void 0;
const Setup_1 = require("./Setup");
const photoshop_1 = require("photoshop");
const BatchPlayFunctions_1 = require("./BatchPlayFunctions");
const Slicing_1 = require("./Slicing");
const uxp_1 = require("uxp");
async function TestRun(ScalePercent, toPowerOfTwo) {
    try {
        const pluginFolder = await uxp_1.storage.localFileSystem.getPluginFolder();
        const theTemplate = await pluginFolder.getEntry("SliceTest.psd");
        // @ts-ignore
        await photoshop_1.app.open(theTemplate);
        await (0, Setup_1.Setup)();
        //@ts-ignore
        const sliceDocID = photoshop_1.app.activeDocument._id;
        const w = photoshop_1.app.activeDocument.width;
        const h = photoshop_1.app.activeDocument.height;
        await ClearGuides();
        await (0, BatchPlayFunctions_1.CreateGuide)(sliceDocID, 70, "horizontal" /* horizontal */);
        await (0, BatchPlayFunctions_1.CreateGuide)(sliceDocID, 50, "vertical" /* vertical */);
        await (0, BatchPlayFunctions_1.CreateGuide)(sliceDocID, 210, "horizontal" /* horizontal */);
        await (0, BatchPlayFunctions_1.CreateGuide)(sliceDocID, 165, "vertical" /* vertical */);
        const Slices = await (0, Slicing_1.ReadGuides)(sliceDocID);
        const CanvasWidth = photoshop_1.app.activeDocument.width;
        const CanvasHeight = photoshop_1.app.activeDocument.height;
        await (0, Slicing_1.ExecuteSlice)(Slices, CanvasWidth, CanvasHeight, sliceDocID, ScalePercent, toPowerOfTwo);
    }
    catch (e) {
        console.error(e);
    }
}
exports.TestRun = TestRun;
async function ClearGuides() {
    await photoshop_1.action.batchPlay([
        // @ts-ignore
        {
            "_obj": "clearAllGuides",
            "_isCommand": false,
            "_options": { "dialogOptions": "dontDisplay" }
        }
    ], {
        "synchronousExecution": false,
        "modalBehavior": "fail"
    });
}
//# sourceMappingURL=Test.js.map