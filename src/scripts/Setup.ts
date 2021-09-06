// @ts-ignore
import {action, app, Direction, Document, Layer} from 'photoshop'
import {CreateGuide, Rasterize, TrimDocument} from "./BatchPlayFunctions";

export async function Setup() {

    const activeLayer: Layer = app.activeDocument.activeLayers[0];

    let sliceDoc: Document = await app.createDocument({
        width: app.activeDocument.width,
        height: app.activeDocument.height,
        resolution: app.activeDocument.resolution,
        mode: 'RGBColorMode',
        name: 'SlicingDoc',
        fill: 'transparent'
    });

    let sliceLayer: Layer = await activeLayer.duplicate(sliceDoc)

    await Rasterize(sliceLayer._id);
    await TrimDocument();
    await CreateSetupGuides(sliceDoc);

}

async function CreateSetupGuides(document: Document) {
    const width: number = document.width
    const height: number = document.height
    const id: number = document._id

    await CreateGuide(id, 0, "horizontal");
    await CreateGuide(id, 0, "vertical");
    await CreateGuide(id, height, "horizontal");
    await CreateGuide(id, width, "vertical");

}
