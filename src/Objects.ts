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
            url: "#processor-obj",
            inputs: [
                {name: "input", type: "any"}
            ],
            outputs: [
                {name: "output", type: "any"}
            ]
        },
        {
            name: SUB,
            type: "obj",
            url: "#processor-obj",
            inputs: [
                {name: "input", type: "any"}
            ],
            outputs: [
                {name: "output", type: "any"}
            ]
        },
        {
            name: SNAPSHOT,
            type: "obj",
            url: "#processor-obj",
            inputs: [
                {name: "signal", type: "any"},
                {name: "event", type: "any"}
            ],
            outputs: [
                {name: "output", type: "any"}
            ]
        },
        {
            name: CREATE,
            type: "obj",
            url: "#processor-obj",
            inputs: [
                {name: "object", type: "object"},
                {name: "event", type: "any"}
            ],
            outputs: [
                {name: "output", type: "object"}
            ]
        },
        {
            name: DESTROY,
            type: "obj",
            url: "#processor-obj",
            inputs: [
                {name: "object", type: "object"},
                {name: "event", type: "any"}
            ],
            outputs: [
                {name: "output", type: "object"}
            ]
        },
        {
            name: TRANSLATE,
            type: "obj",
            url: "#processor-obj",
            inputs: [
                {name: "object", type: "object"},
                {name: "from", type: "vector3"},
                {name: "to", type: "vector3"},
                {name: "speed", type: "number"}
            ],
            outputs: [
                {name: "output", type: "object"}
            ]
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
                {name: "object", type: "object" },
                {name: "gripdown", type: "boolean" }, 
                {name: "triggerdown", type: "boolean" },
                {name: "xbuttondown", type: "boolean" },
                {name: "ybuttondown", type: "boolean" },
                {name: "position", type: "vector3" }
            ]
        },
        {
            name: R_CONTROLLER,
            type: "obj",
            url: "#controller-right-obj",
            inputs: [],
            outputs: [
                {name: "object", type: "object" },
                {name: "gripdown", type: "boolean" }, 
                {name: "triggerdown", type: "boolean" },
                {name: "abuttondown", type: "boolean" },
                {name: "bbuttondown", type: "boolean" },
                {name: "position", type: "vector3" }
            ]
        }
    ]
}