/*
 * object labels
 */

// Data
export const RANDOM_COLOR = 'Random Color';

// Operators
export const PLUS = 'plus';
export const SUB = 'subtract';
export const SNAPSHOT = 'snapshot';
export const CREATE = 'create';
export const DESTROY = 'destroy';
export const TRANSLATE = 'translate';

export const COLLISION_DETECTOR = 'Collision Detector';
export const CONDITIONAL_EVENT = 'Conditional Event';
export const VELOCITY = 'Velocity';
export const VEC2NUM = 'Vector2Number';
export const NUM2VEC = 'Number2Vector';
export const COND_BOOL = 'Condition: Bool';
export const COND_LARGER = 'Condition: A >= B';

// Primitives
export const BOX = 'box';
export const SPHERE = 'sphere';
export const CONE = 'cone';
export const CYLINDER = 'cylinder';
export const CIRCLE = 'circle';
export const PLANE = 'plane';


export const VECTOR = 'Vector';
export const SWITCH = 'Switch';
export const SLIDER = 'Slider';

// Lights
export const LIGHT = 'Light';

// Avatars
export const HEADSET = 'headset';
export const L_CONTROLLER = 'left controller';
export const R_CONTROLLER = 'right controller';

export const objects = {
    Models:[
        {
            name: BOX,
            type: "primitive",
            url: "",
            attributes: [
                {name: "object", type: "object"},
                {name: "color", type: "string"}, 
                {name: "position", type: "vector3"}
            ]
        },
        {
            name: SPHERE,
            type: "primitive",
            url: "",
            attributes: [
                {name: "object", type: "object"},
                {name: "color", type: "string"}, 
                {name: "position", type: "vector3"}
            ]
        },
        {
            name: CONE,
            type: "primitive",
            url: "",
            attributes: [
                {name: "object", type: "object"},
                {name: "color", type: "string"}, 
                {name: "position", type: "vector3"}
            ]
        },
        {
            name: CYLINDER,
            type: "primitive",
            url: "",
            attributes: [
                {name: "object", type: "object"},
                {name: "color", type: "string"}, 
                {name: "position", type: "vector3"}
            ]
        },
        {
            name: CIRCLE,
            type: "primitive",
            url: "",
            attributes: [
                {name: "object", type: "object"},
                {name: "color", type: "string"}, 
                {name: "position", type: "vector3"}
            ]
        },
        {
            name: PLANE,
            type: "primitive",
            url: "",
            attributes: [
                {name: "object", type: "object"},
                {name: "color", type: "string"}, 
                {name: "position", type: "vector3"}
            ]
        }
    ],
    Data:[],
    Operators:[
        {
            name: PLUS,
            type: "obj",
            url: "#processor-obj"
        },
        {
            name: SUB,
            type: "obj",
            url: "#processor-obj"
        },
        {
            name: SNAPSHOT,
            type: "obj",
            url: "#processor-obj"
        },
        {
            name: CREATE,
            type: "obj",
            url: "#processor-obj"
        },
        {
            name: DESTROY,
            type: "obj",
            url: "#processor-obj"
        },
        {
            name: TRANSLATE,
            type: "obj",
            url: "#processor-obj"
        }
    ],
    Avatars:[
        {
            name: HEADSET,
            type: "obj",
            url: "#headset-obj"
        },
        {
            name: L_CONTROLLER,
            type: "obj",
            url: "#controller-left-obj",
            inputs: [],
            outputs: [
                {name: "object", type: "object", observable: false},
                {name: "gripdown", type: "boolean", observable: true}, 
                {name: "triggerdown", type: "boolean", observable: true},
                {name: "xbuttondown", type: "boolean", observable: true},
                {name: "ybuttondown", type: "boolean", observable: true},
                {name: "position", type: "vector3", observable: true}
            ]
        },
        {
            name: R_CONTROLLER,
            type: "obj",
            url: "#controller-right-obj",
            inputs: [],
            outputs: [
                {name: "object", type: "object", observable: false},
                {name: "gripdown", type: "boolean", observable: true}, 
                {name: "triggerdown", type: "boolean", observable: true},
                {name: "abuttondown", type: "boolean", observable: true},
                {name: "bbuttondown", type: "boolean", observable: true},
                {name: "position", type: "vector3", observable: true}
            ]
        }
    ]
}