import {
    Anchor,
    Deselect,
    GetGuide,
    Rect,
    Select,
    TranslateSelection,
    Translation,
    TrimDocument
} from './BatchPlayFunctions';


export async function ReadGuides(documentID: number): Promise<Rect> {
    let Top: number = Math.floor(await GetGuide(documentID, 1));
    let Left: number = Math.floor(await GetGuide(documentID, 2));
    let Bottom: number = Math.floor(await GetGuide(documentID, 3));
    let Right: number = Math.floor(await GetGuide(documentID, 4));
    return new Rect(Top, Left, Bottom, Right)
}

const ScalePercent = 33

export async function ExecuteSlice(Slices: Rect, CanvasWidth: number, CanvasHeight: number, DocID: number) {
    const ZO = 0
    const ST = Slices.Top
    const SL = Slices.Left
    const SR = Slices.Right
    const SB = Slices.Bottom
    const CH = CanvasHeight
    const CW = CanvasWidth

    const NN = new Rect(ZO, SL, ST, SR)
    const WW = new Rect(ST, ZO, SB, SL)
    const SW = new Rect(SB, ZO, CH, SL)
    const SS = new Rect(SB, SL, CH, SR)
    const SE = new Rect(SB, SR, CH, CW)
    const EE = new Rect(ST, SR, SB, CW)
    const NE = new Rect(ZO, SR, ST, CW)
    const CB = new Rect(ST, SL, SB, SR)

    const NTranslation = new Translation(ScalePercent, 100, 0, 0, Anchor.AnchorW);
    const WTranslation = new Translation(100,ScalePercent, 0, 0, Anchor.AnchorN);
    const CTranslation = new Translation(ScalePercent, ScalePercent, 0,0, Anchor.AnchorNW)

    const CenterWidth = SR - SL
    const CenterHeight = SB - ST
    const XMove = -((CenterWidth) - (CenterWidth) * (ScalePercent / 100))
    const YMove = -((CenterHeight) - (CenterHeight) * (ScalePercent / 100))

    const ETranslation = new Translation(100,  ScalePercent, XMove, 0, Anchor.AnchorNW)
    const STranslation = new Translation(ScalePercent,100, 0, YMove, Anchor.AnchorNW)
    const NETranslation = new Translation(100,100, XMove,  0, Anchor.AnchorW)
    const SWTranslation = new Translation(100, 100, 0, YMove, Anchor.AnchorN)
    const SETranslation = new Translation(100, 100,XMove, YMove, Anchor.AnchorNW)

    await SelectAndTranslate(NN, NTranslation, DocID)
    await SelectAndTranslate(WW, WTranslation, DocID)
    await SelectAndTranslate(CB, CTranslation, DocID)

    await SelectAndTranslate(EE, ETranslation, DocID)
    await SelectAndTranslate(SS, STranslation, DocID)

    await SelectAndTranslate(NE, NETranslation, DocID)
    await SelectAndTranslate(SW, SWTranslation, DocID)
    await SelectAndTranslate(SE, SETranslation, DocID)
    await TrimDocument()

}

async function SelectAndTranslate (Bounds: Rect, Translation: Translation, DocID: number) {
    await Select(Bounds)
    await TranslateSelection(Translation)
    await Deselect(DocID)
}



