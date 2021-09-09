import {Setup} from "./Setup";
import {action, app, Orientation} from "photoshop";
import {CreateGuide} from "./BatchPlayFunctions";
import {ExecuteSlice, ReadGuides} from "./Slicing";

import {storage} from "uxp";

export async function TestRun(ScalePercent: number, toPowerOfTwo: boolean) {
   try {

       const pluginFolder = await storage.localFileSystem.getPluginFolder();
       const theTemplate = await pluginFolder.getEntry("SliceTest.psd");
       // @ts-ignore
       await app.open(theTemplate);

       await Setup();
       //@ts-ignore

       const sliceDocID = app.activeDocument._id
       const w = app.activeDocument.width
       const h = app.activeDocument.height
       await ClearGuides()
       await CreateGuide(sliceDocID, 70, Orientation.horizontal)
       await CreateGuide(sliceDocID, 50, Orientation.vertical)
       await CreateGuide(sliceDocID, 210, Orientation.horizontal)
       await CreateGuide(sliceDocID, 165, Orientation.vertical)

       const Slices = await ReadGuides(sliceDocID)
       const CanvasWidth = app.activeDocument.width
       const CanvasHeight = app.activeDocument.height

       await ExecuteSlice(Slices, CanvasWidth, CanvasHeight, sliceDocID, ScalePercent, toPowerOfTwo)
   }
   catch (e){
       console.error(e)
   }
}

async function ClearGuides(){
    await action.batchPlay(
        [
            // @ts-ignore
            {
                "_obj": "clearAllGuides",
                "_isCommand": false,
                "_options": {"dialogOptions": "dontDisplay"}
            }
        ],{
            "synchronousExecution": false,
            "modalBehavior": "fail"
        });

}
