// @ts-ignore
import {action, app, Direction, Document, DocumentCreateOptions, Layer, Orientation} from 'photoshop'
import {CreateGuide, Rasterize, TrimDocument} from "./BatchPlayFunctions";

export async function Setup() {

    const activeLayer: Layer = app.activeDocument.activeLayers[0];

    let sliceDoc: Document = <Document>await app.createDocument({
        width: app.activeDocument.width,
        height: app.activeDocument.height,
        resolution: app.activeDocument.resolution,
        // @ts-ignore
        mode: 'RGBColorMode',
        name: 'SlicingDoc',
        fill: 'transparent'

    });

    let sliceLayer: Layer = await activeLayer.duplicate(sliceDoc)

    // @ts-ignore
    await Rasterize(sliceLayer._id);

    await TrimDocument();
    await CreateSetupGuides(sliceDoc);
}

async function CreateSetupGuides(document: Document) {
    const width: number = document.width
    const height: number = document.height

    // @ts-ignore
    const id: number = document._id

    await CreateGuide(id, 0, Orientation.horizontal);
    await CreateGuide(id, 0, Orientation.vertical);
    await CreateGuide(id, height, Orientation.horizontal);
    await CreateGuide(id, width, Orientation.vertical);

}
