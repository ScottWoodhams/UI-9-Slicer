"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteSlice = exports.ReadGuides = exports.CalculatePowerOfSize = exports.nearestPowerOf2 = void 0;
const BatchPlayFunctions_1 = require("./BatchPlayFunctions");
function nearestPowerOf2(n) {
    return 1 << 31 - Math.clz32(n);
}
exports.nearestPowerOf2 = nearestPowerOf2;
async function CalculatePowerOfSize(documentID) {
    const guides = await ReadGuides(documentID);
    const widthDelta = guides.Right - guides.Left;
    const heightDelta = guides.Bottom - guides.Top;
    let newWidth = nearestPowerOf2(widthDelta);
    let newHeight = nearestPowerOf2(heightDelta);
    return { newWidth, newHeight };
}
exports.CalculatePowerOfSize = CalculatePowerOfSize;
async function ReadGuides(documentID) {
    let Top = Math.floor(await (0, BatchPlayFunctions_1.GetGuide)(documentID, 1));
    let Left = Math.floor(await (0, BatchPlayFunctions_1.GetGuide)(documentID, 2));
    let Bottom = Math.floor(await (0, BatchPlayFunctions_1.GetGuide)(documentID, 3));
    let Right = Math.floor(await (0, BatchPlayFunctions_1.GetGuide)(documentID, 4));
    return new BatchPlayFunctions_1.Rect(Top, Left, Bottom, Right);
}
exports.ReadGuides = ReadGuides;
async function ExecuteSlice(Slices, CanvasWidth, CanvasHeight, DocID, ScalePercent, po2) {
    const ZO = 0;
    const ST = Slices.Top;
    const SL = Slices.Left;
    const SR = Slices.Right;
    const SB = Slices.Bottom;
    const CH = CanvasHeight;
    const CW = CanvasWidth;
    let ScaleWidth = ScalePercent;
    let ScaleHeight = ScalePercent;
    if (po2) {
        let newSize = await CalculatePowerOfSize(DocID);
        ScaleWidth = CW / newSize.newWidth;
        ScaleHeight = CW / newSize.newHeight;
    }
    const NN = new BatchPlayFunctions_1.Rect(ZO, SL, ST, SR);
    const WW = new BatchPlayFunctions_1.Rect(ST, ZO, SB, SL);
    const SW = new BatchPlayFunctions_1.Rect(SB, ZO, CH, SL);
    const SS = new BatchPlayFunctions_1.Rect(SB, SL, CH, SR);
    const SE = new BatchPlayFunctions_1.Rect(SB, SR, CH, CW);
    const EE = new BatchPlayFunctions_1.Rect(ST, SR, SB, CW);
    const NE = new BatchPlayFunctions_1.Rect(ZO, SR, ST, CW);
    const CB = new BatchPlayFunctions_1.Rect(ST, SL, SB, SR);
    const NTranslation = new BatchPlayFunctions_1.Translation(ScaleWidth, 100, 0, 0, BatchPlayFunctions_1.Anchor.AnchorW);
    const WTranslation = new BatchPlayFunctions_1.Translation(100, ScaleHeight, 0, 0, BatchPlayFunctions_1.Anchor.AnchorN);
    const CTranslation = new BatchPlayFunctions_1.Translation(ScaleWidth, ScaleHeight, 0, 0, BatchPlayFunctions_1.Anchor.AnchorNW);
    const CenterWidth = SR - SL;
    const CenterHeight = SB - ST;
    const XMove = -((CenterWidth) - (CenterWidth) * (ScaleWidth / 100));
    const YMove = -((CenterHeight) - (CenterHeight) * (ScaleHeight / 100));
    const ETranslation = new BatchPlayFunctions_1.Translation(100, ScaleHeight, XMove, 0, BatchPlayFunctions_1.Anchor.AnchorNW);
    const STranslation = new BatchPlayFunctions_1.Translation(ScaleWidth, 100, 0, YMove, BatchPlayFunctions_1.Anchor.AnchorNW);
    const NETranslation = new BatchPlayFunctions_1.Translation(100, 100, XMove, 0, BatchPlayFunctions_1.Anchor.AnchorW);
    const SWTranslation = new BatchPlayFunctions_1.Translation(100, 100, 0, YMove, BatchPlayFunctions_1.Anchor.AnchorN);
    const SETranslation = new BatchPlayFunctions_1.Translation(100, 100, XMove, YMove, BatchPlayFunctions_1.Anchor.AnchorNW);
    await SelectAndTranslate(NN, NTranslation, DocID);
    await SelectAndTranslate(WW, WTranslation, DocID);
    await SelectAndTranslate(CB, CTranslation, DocID);
    await SelectAndTranslate(EE, ETranslation, DocID);
    await SelectAndTranslate(SS, STranslation, DocID);
    await SelectAndTranslate(NE, NETranslation, DocID);
    await SelectAndTranslate(SW, SWTranslation, DocID);
    await SelectAndTranslate(SE, SETranslation, DocID);
    await (0, BatchPlayFunctions_1.TrimDocument)();
}
exports.ExecuteSlice = ExecuteSlice;
async function SelectAndTranslate(Bounds, Translation, DocID) {
    await (0, BatchPlayFunctions_1.Select)(Bounds);
    await (0, BatchPlayFunctions_1.TranslateSelection)(Translation);
    await (0, BatchPlayFunctions_1.Deselect)(DocID);
}
//# sourceMappingURL=Slicing.js.map