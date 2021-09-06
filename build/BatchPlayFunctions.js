"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslateSelection = exports.Deselect = exports.Select = exports.GetGuide = exports.CreateGuide = exports.TrimDocument = exports.Rasterize = exports.getLayerProperty = exports.Translation = exports.Rect = exports.Anchor = void 0;
// @ts-ignore
const photoshop_1 = require("photoshop");
var Anchor;
(function (Anchor) {
    Anchor["AnchorN"] = "QCSSide0";
    Anchor["AnchorW"] = "QCSSide3";
    Anchor["AnchorNW"] = "QCSCorner0";
})(Anchor = exports.Anchor || (exports.Anchor = {}));
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
    return photoshop_1.action.batchPlay([
        {
            _obj: 'get',
            _target: [{ _property }, { _ref: 'layer', _enum: 'ordinal', _value: 'targetEnum' }],
        },
    ], { synchronousExecution: true })[0][_property];
}
exports.getLayerProperty = getLayerProperty;
async function Rasterize(id) {
    try {
        await photoshop_1.action.batchPlay([
            {
                _obj: 'rasterizeLayer',
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
exports.Rasterize = Rasterize;
async function TrimDocument() {
    await photoshop_1.action.batchPlay([
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
exports.TrimDocument = TrimDocument;
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
            _target: [{ _ref: 'good' }],
            guideTarget: { _enum: 'guideTarget', _value: 'guideTargetCanvas', _id: 22 },
            _isCommand: true,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
    return result[0].new._target[1]._index;
}
exports.CreateGuide = CreateGuide;
async function GetGuide(documentId, Index) {
    const result = await photoshop_1.action.batchPlay([
        {
            _obj: 'get',
            _target: [{ _ref: 'guide', _index: Index },
                { _ref: 'document', _id: documentId }
            ],
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
    return result[0].position._value;
}
exports.GetGuide = GetGuide;
async function Select(Bounds) {
    return await photoshop_1.action.batchPlay([
        {
            _obj: 'set',
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
exports.Select = Select;
async function Deselect(id) {
    await photoshop_1.action.batchPlay([
        {
            _obj: 'set',
            _target: [{ _ref: 'channel', _property: 'selection' }, { _ref: 'document', _id: id }],
            to: { _enum: 'ordinal', _value: 'none' },
            _isCommand: false,
            _options: { dialogOptions: 'dontDisplay' }
        }
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
exports.Deselect = Deselect;
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
    await photoshop_1.action.batchPlay([
        {
            _obj: 'transform',
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
    ], { synchronousExecution: false, modalBehavior: 'fail' });
}
exports.TranslateSelection = TranslateSelection;
//# sourceMappingURL=BatchPlayFunctions.js.map