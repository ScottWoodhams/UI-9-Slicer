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

export function nearestPowerOf2(n: number) {
    return 1 << 31 - Math.clz32(n);
}

export async function CalculatePowerOfSize(documentID: number)
{
    const guides: Rect = await ReadGuides(documentID)
    const widthDelta =  guides.Right - guides.Left
    const heightDelta =  guides.Bottom - guides.Top

    let newWidth = nearestPowerOf2(widthDelta)
    let newHeight = nearestPowerOf2(heightDelta)

    return { newWidth, newHeight }
}

export async function ReadGuides(documentID: number): Promise<Rect> {
    let Top: number = Math.floor(await GetGuide(documentID, 1));
    let Left: number = Math.floor(await GetGuide(documentID, 2));
    let Bottom: number = Math.floor(await GetGuide(documentID, 3));
    let Right: number = Math.floor(await GetGuide(documentID, 4));
    return new Rect(Top, Left, Bottom, Right)
}

export async function ExecuteSlice(Slices: Rect, CanvasWidth: number, CanvasHeight: number, DocID: number, ScalePercent: number, po2: boolean) {
    const ZO = 0
    const ST = Slices.Top
    const SL = Slices.Left
    const SR = Slices.Right
    const SB = Slices.Bottom
    const CH = CanvasHeight
    const CW = CanvasWidth
    let ScaleWidth = ScalePercent
    let ScaleHeight = ScalePercent

    if(po2) {
        let newSize = await CalculatePowerOfSize(DocID)
        ScaleWidth = CW / newSize.newWidth
        ScaleHeight = CW / newSize.newHeight
    }

    const NN = new Rect(ZO, SL, ST, SR)
    const WW = new Rect(ST, ZO, SB, SL)
    const SW = new Rect(SB, ZO, CH, SL)
    const SS = new Rect(SB, SL, CH, SR)
    const SE = new Rect(SB, SR, CH, CW)
    const EE = new Rect(ST, SR, SB, CW)
    const NE = new Rect(ZO, SR, ST, CW)
    const CB = new Rect(ST, SL, SB, SR)

    const NTranslation = new Translation(ScaleWidth, 100, 0, 0, Anchor.AnchorW);
    const WTranslation = new Translation(100, ScaleHeight, 0, 0, Anchor.AnchorN);
    const CTranslation = new Translation(ScaleWidth, ScaleHeight, 0,0, Anchor.AnchorNW)

    const CenterWidth = SR - SL
    const CenterHeight = SB - ST

    const XMove = -((CenterWidth) - (CenterWidth) * (ScaleWidth / 100))
    const YMove = -((CenterHeight) - (CenterHeight) * (ScaleHeight / 100))

    const ETranslation = new Translation(100, ScaleHeight, XMove, 0, Anchor.AnchorNW)
    const STranslation = new Translation(ScaleWidth,100, 0, YMove, Anchor.AnchorNW)
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



