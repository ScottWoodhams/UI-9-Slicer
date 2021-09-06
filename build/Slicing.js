"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecuteSlice = exports.ReadGuides = void 0;
const BatchPlayFunctions_1 = require("./BatchPlayFunctions");
async function ReadGuides(documentID) {
    let Top = Math.floor(await (0, BatchPlayFunctions_1.GetGuide)(documentID, 1));
    let Left = Math.floor(await (0, BatchPlayFunctions_1.GetGuide)(documentID, 2));
    let Bottom = Math.floor(await (0, BatchPlayFunctions_1.GetGuide)(documentID, 3));
    let Right = Math.floor(await (0, BatchPlayFunctions_1.GetGuide)(documentID, 4));
    return { Top, Left, Bottom, Right };
}
exports.ReadGuides = ReadGuides;
const ScalePercent = 33;
async function ExecuteSlice(Slices, CanvasWidth, CanvasHeight, DocID) {
    const ZO = 0;
    const ST = Slices.Top;
    const SL = Slices.Left;
    const SR = Slices.Right;
    const SB = Slices.Bottom;
    const CH = CanvasHeight;
    const CW = CanvasWidth;
    const NN = new BatchPlayFunctions_1.Rect(ZO, SL, ST, SR);
    const WW = new BatchPlayFunctions_1.Rect(ST, ZO, SB, SL);
    const SW = new BatchPlayFunctions_1.Rect(SB, ZO, CH, SL);
    const SS = new BatchPlayFunctions_1.Rect(SB, SL, CH, SR);
    const SE = new BatchPlayFunctions_1.Rect(SB, SR, CH, CW);
    const EE = new BatchPlayFunctions_1.Rect(ST, SR, SB, CW);
    const NE = new BatchPlayFunctions_1.Rect(ZO, SR, ST, CW);
    const CB = new BatchPlayFunctions_1.Rect(ST, SL, SB, SR);
    const NTranslation = new BatchPlayFunctions_1.Translation(ScalePercent, 100, 0, 0, BatchPlayFunctions_1.Anchor.AnchorW);
    const WTranslation = new BatchPlayFunctions_1.Translation(100, ScalePercent, 0, 0, BatchPlayFunctions_1.Anchor.AnchorN);
    const CTranslation = new BatchPlayFunctions_1.Translation(ScalePercent, ScalePercent, 0, 0, BatchPlayFunctions_1.Anchor.AnchorNW);
    const CenterWidth = SR - SL;
    const CenterHeight = SB - ST;
    const XMove = -((CenterWidth) - (CenterWidth) * (ScalePercent / 100));
    const YMove = -((CenterHeight) - (CenterHeight) * (ScalePercent / 100));
    const ETranslation = new BatchPlayFunctions_1.Translation(100, ScalePercent, XMove, 0, BatchPlayFunctions_1.Anchor.AnchorNW);
    const STranslation = new BatchPlayFunctions_1.Translation(ScalePercent, 100, 0, YMove, BatchPlayFunctions_1.Anchor.AnchorNW);
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