import {action, ActionDescriptor, BatchPlayCommandOptions, LayerDescriptor, Orientation} from "photoshop";

export enum Anchor
{
    AnchorN = 'QCSSide0',
    AnchorW = 'QCSSide3',
    AnchorNW = 'QCSCorner0'
}

export class Rect {
    Top: number;
    Left: number;
    Bottom: number;
    Right: number;
    constructor(Top: number, Left: number, Bottom: number, Right: number) {
        this.Top = Top;
        this.Left = Left;
        this.Bottom = Bottom;
        this.Right = Right;}
}

export class Translation {
    WidthPercent: number = 0
    HeightPercent: number = 0
    XDelta: number = 0
    YDelta: number = 0
    Anchor: Anchor = Anchor.AnchorN

    constructor(WidthPercent: number, HeightPercent:number, XDelta: number, YDelta: number, Anchor: Anchor) {
        this.WidthPercent = WidthPercent
        this.HeightPercent = HeightPercent;
        this.XDelta = XDelta;
        this.YDelta = YDelta;
        this.Anchor = Anchor;
    }
}

export function getLayerProperty <T extends keyof LayerDescriptor>(_property: T): LayerDescriptor[T] {

    let actionDesc: ActionDescriptor = {
        _obj : 'get',
        _target:  { _ref: 'layer', _enum: 'ordinal', _value: 'targetEnum' }}
    let options: BatchPlayCommandOptions = {synchronousExecution: false};


    let result = action.batchPlay([actionDesc], options);
    // @ts-ignore
    return result[0][_property]
}

export async function Rasterize(id: number) {
    try {
        await action.batchPlay([
            {
                _obj: 'rasterizeLayer',
                // @ts-ignore
                _target: [{_ref: 'layer', _id: id}],
                what: {_enum: 'rasterizeItem', _value: 'layerStyle'},
                _isCommand: true,
                _options: {dialogOptions: 'dontDisplay'}
            }
        ], {synchronousExecution: false, modalBehavior: 'fail'})
    } catch (e) {
        console.log(e)
    }
}

export async function TrimDocument() {
    await action.batchPlay([
            // @ts-ignore
            {
                _obj: 'trim',
                trimBasedOn: { _enum: 'trimBasedOn', _value: 'transparency' },
                top: true,
                bottom: true,
                left: true,
                right: true,
                _isCommand: true,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ],
        { synchronousExecution: false, modalBehavior: 'fail' })
}


export async function CreateGuide (documentID: number, position: number, orientation: Orientation) {
    const result = await action.batchPlay([
            {
                _obj: 'make',
                new: {
                    _obj: 'good',
                    position: { _unit: 'pixelsUnit', _value: position },
                    orientation: { _enum: 'orientation', _value: orientation },
                    kind: { _enum: 'kind', _value: 'document' },
                    _target: [{ _ref: 'document', _id: documentID }, { _ref: 'good', _index: 1 }]
                },
                // @ts-ignore
                _target: [{ _ref: 'good' }],
                guideTarget: { _enum: 'guideTarget', _value: 'guideTargetCanvas', _id: 22 },
                _isCommand: true,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ],
        { synchronousExecution: false, modalBehavior: 'fail' })

    return result[0].new._target[1]._index
}

export async function GetGuide (documentId: number, Index: number) {
    const result = await action.batchPlay(
        [
            {
                _obj: 'get',
                // @ts-ignore
                _target: [{ _ref: 'guide', _index: Index },
                    { _ref: 'document', _id: documentId }
                ],
                _options: { dialogOptions: 'dontDisplay' }
            }
        ],
        { synchronousExecution: false, modalBehavior: 'fail' }
    )

    return result[0].position._value
}

export async function Select (Bounds: Rect) {
    return await action.batchPlay(
        [
            {
                _obj: 'set',
                // @ts-ignore
                _target: [{ _ref: 'channel', _property: 'selection' }],
                to: {
                    _obj: 'rectangle',
                    top: { _unit: 'pixelsUnit', _value: Bounds.Top },
                    left: { _unit: 'pixelsUnit', _value: Bounds.Left },
                    bottom: { _unit: 'pixelsUnit', _value: Bounds.Bottom },
                    right: { _unit: 'pixelsUnit', _value: Bounds.Right }
                },
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })
}

export async function Deselect (id: number) {
    await action.batchPlay(
        [
            {
                _obj: 'set',
                // @ts-ignore
                _target: [{ _ref: 'channel', _property: 'selection' }, { _ref: 'document', _id: id }],
                to: { _enum: 'ordinal', _value: 'none' },
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })
}

/* async function GetSelection (id) {
  const result = await batchPlay(
    [
      {
        _obj: 'get',
        _target: [{ _property: 'selection' }, { _ref: 'document', _id: id }],
        _options: { dialogOptions: 'dontDisplay' }
      }
    ], { synchronousExecution: false, modalBehavior: 'fail' })

  return {
    Top: result[0].selection.top._value,
    Left: result[0].selection.left._value,
    Bottom: result[0].selection.bottom._value,
    Right: result[0].selection.right._value
  }
} */

export async function TranslateSelection (Translation: Translation) {
    await action.batchPlay(
        [
            {
                _obj: 'transform',
                // @ts-ignore
                _target: [{ _ref: 'layer', _enum: 'ordinal', _value: 'targetEnum' }],
                freeTransformCenterState: { _enum: 'quadCenterState', _value: Translation.Anchor },
                offset: {
                    _obj: 'offset',
                    horizontal: { _unit: 'pixelsUnit', _value: Translation.XDelta },
                    vertical: { _unit: 'pixelsUnit', _value: Translation.YDelta }
                },
                width: { _unit: 'percentUnit', _value: Translation.WidthPercent },
                height: { _unit: 'percentUnit', _value: Translation.HeightPercent },
                interfaceIconFrameDimmed: { _enum: 'interpolationType', _value: '"nearestNeighbor"' },
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })
}

export async function DeleteHistory () {
    await action.batchPlay(
        [
            {
                _obj: 'select',
                // @ts-ignore

                _target: [{ _ref: 'historyState', _offset: -24 }],
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })

    await action.batchPlay(
        [
            {
                _obj: 'delete',
                // @ts-ignore
                _target: [{ _ref: 'historyState', _property: 'currentHistoryState' }],
                _isCommand: false,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' })
}
