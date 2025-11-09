"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translation = exports.Rect = exports.Anchor = void 0;
exports.getLayerProperty = getLayerProperty;
exports.Rasterize = Rasterize;
exports.TrimDocument = TrimDocument;
exports.CreateGuide = CreateGuide;
exports.GetGuide = GetGuide;
exports.Select = Select;
exports.Deselect = Deselect;
exports.TranslateSelection = TranslateSelection;
exports.DeleteHistory = DeleteHistory;
const photoshop_1 = require("photoshop");
var Anchor;
(function (Anchor) {
    Anchor["AnchorN"] = "QCSSide0";
    Anchor["AnchorW"] = "QCSSide3";
    Anchor["AnchorNW"] = "QCSCorner0";
})(Anchor || (exports.Anchor = Anchor = {}));
class Rect {
    Top;
    Left;
    Bottom;
    Right;
    constructor(Top, Left, Bottom, Right) {
        this.Top = Top;
        this.Left = Left;
        this.Bottom = Bottom;
        this.Right = Right;
    }
}
exports.Rect = Rect;
class Translation {
    WidthPercent = 0;
    HeightPercent = 0;
    XDelta = 0;
    YDelta = 0;
    Anchor = Anchor.AnchorN;
    constructor(WidthPercent, HeightPercent, XDelta, YDelta, Anchor) {
        this.WidthPercent = WidthPercent;
        this.HeightPercent = HeightPercent;
        this.XDelta = XDelta;
        this.YDelta = YDelta;
        this.Anchor = Anchor;
    }
}
exports.Translation = Translation;
function getLayerProperty(_property) {
    let actionDesc = {
        _obj: 'get',
        _target: { _ref: 'layer', _enum: 'ordinal', _value: 'targetEnum' }
    };
    let options = { synchronousExecution: false };
    let result = photoshop_1.action.batchPlay([actionDesc], options);
    // @ts-ignore
    return result[0][_property];
}
async function Rasterize(id) {
    try {
        await photoshop_1.action.batchPlay([
            {
                _obj: 'rasterizeLayer',
                // @ts-ignore
                _target: [{ _ref: 'layer', _id: id }],
                what: { _enum: 'rasterizeItem', _value: 'layerStyle' },
                _isCommand: true,
                _options: { dialogOptions: 'dontDisplay' }
            }
        ], { synchronousExecution: false, modalBehavior: 'fail' });
    }
    catch (e) {
        console.log(e);
    }
}
async function TrimDocument() {
    await photoshop_1.action.batchPlay([
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
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
async function CreateGuide(documentID, position, orientation) {
    const result = await photoshop_1.action.batchPlay([
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
    ], { synchronousExecution: false, modalBehavior: 'fail' });
    return result[0].new._target[1]._index;
}
async function GetGuide(documentId, Index) {
    const result = await photoshop_1.action.batchPlay([
        {
            _obj: 'get',
            // @ts-ignore
            _target: [{ _ref: 'guide', _index: Index },
                { _ref: 'document', _id: documentId }
            ],
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
    return result[0].position._value;
}
async function Select(Bounds) {
    console.log('selecting', Bounds);
    return await photoshop_1.action.batchPlay([
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
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
async function Deselect(id) {
    console.log('deselecting');
    await photoshop_1.action.batchPlay([
        {
            _obj: 'set',
            // @ts-ignore
            _target: [{ _ref: 'channel', _property: 'selection' }, { _ref: 'document', _id: id }],
            to: { _enum: 'ordinal', _value: 'none' },
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
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
async function TranslateSelection(Translation) {
    console.log('translating', Translation);
    await photoshop_1.action.batchPlay([
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
            interfaceIconFrameDimmed: { _enum: 'interpolationType', _value: 'nearestNeighbor' },
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
async function DeleteHistory() {
    await photoshop_1.action.batchPlay([
        {
            _obj: 'select',
            // @ts-ignore
            _target: [{ _ref: 'historyState', _offset: -24 }],
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
    await photoshop_1.action.batchPlay([
        {
            _obj: 'delete',
            // @ts-ignore
            _target: [{ _ref: 'historyState', _property: 'currentHistoryState' }],
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
//# sourceMappingURL=BatchPlayFunctions.js.map