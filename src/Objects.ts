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
export const COLLIDE = 'collide';


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

// Values
export const VECTOR = 'Vector';
export const SWITCH = 'Switch';
export const SLIDER = 'Slider';
export const NUM = 'Number';
export const STR = 'String';
export const BOOL = 'Boolean';

// Models
export const LIGHT = 'Light';
export const GUN = 'gun';
export const GIFT = 'gift';

// Avatars
export const HEADSET = 'headset';
export const L_CONTROLLER = 'left controller';
export const R_CONTROLLER = 'right controller';

export const objects = {
    Models:[
        {
            name: BOX,
            type: "primitive",
            itemUrl: "",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "color", type: "string", behavior: "signal"}, 
                {name: "position", type: "vector3", behavior: "signal"}
            ]
        },
        {
            name: SPHERE,
            type: "primitive",
            itemUrl: "",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "color", type: "string", behavior: "signal"}, 
                {name: "position", type: "vector3", behavior: "signal"}
            ]
        },
        {
            name: CONE,
            type: "primitive",
            itemUrl: "",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "color", type: "string", behavior: "signal"}, 
                {name: "position", type: "vector3", behavior: "signal"}
            ]
        },
        {
            name: CYLINDER,
            type: "primitive",
            itemUrl: "",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "color", type: "string", behavior: "signal"}, 
                {name: "position", type: "vector3", behavior: "signal"}
            ]
        },
        {
            name: CIRCLE,
            type: "primitive",
            itemUrl: "",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "color", type: "string", behavior: "signal"}, 
                {name: "position", type: "vector3", behavior: "signal"}
            ]
        },
        {
            name: PLANE,
            type: "primitive",
            itemUrl: "",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "color", type: "string", behavior: "signal"}, 
                {name: "position", type: "vector3", behavior: "signal"}
            ]
        },
        {
            name: GUN,
            type: "gltf",
            itemUrl: "#gun-obj",
            url: "#gun-gltf",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "position", type: "vector3", behavior: "signal"},
                {name: "tip_position", type: "vector3", behavior: "signal"},
                {name: "gun_direction", type: "vector3", behavior: "signal"}
            ]
        },
        {
            name: LIGHT,
            type: "gltf",
            itemUrl: "#light-01-obj",
            url: "#light-01-glb",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "position", type: "vector3", behavior: "signal"},
                {name: "light_direction", type: "vector3", behavior: "signal"},
                {name: "light_color", type: "string", behavior: "signal"},
                {name: "light_on", type: "boolean", behavior: "event"},
                {name: "light_off", type: "boolean", behavior: "event"}
            ]
        },
        {
            name: GIFT,
            type: "gltf",
            itemUrl: "#gift-obj",
            url: "#gift-gltf",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "position", type: "vector3", behavior: "signal"},
                {name: "open", type: "boolean", behavior: "event"}
            ]
        }
    ],
    Data:[
        {
            name: STR,
            type: "data",
            itemUrl: "",
            inputs: [],
            outputs: []
        },
        {
            name: NUM,
            type: "data",
            itemUrl: "",
            inputs: [],
            outputs: []
        },
        {
            name: BOOL,
            type: "data",
            itemUrl: "",
            inputs: [],
            outputs: []
        },
        {
            name: VECTOR,
            type: "data",
            itemUrl: "",
            inputs: [],
            outputs: []
        }
    ],
    Operators:[
        {
            name: PLUS,
            type: "obj",
            itemUrl: "#processor-obj",
            inputs: [
                {name: "input", type: "vector3", behavior: "signal"}
            ],
            outputs: [
                {name: "output", type: "vector3", behavior: "signal"}
            ]
        },
        {
            name: SUB,
            type: "obj",
            itemUrl: "#processor-obj",
            inputs: [
                {name: "+", type: "vector3", behavior: "signal"},
                {name: "-", type: "vector3", behavior: "signal"}
            ],
            outputs: [
                {name: "output", type: "vector3", behavior: "signal"}
            ]
        },
        {
            name: SNAPSHOT,
            type: "obj",
            itemUrl: "#processor-obj",
            inputs: [
                {name: "signal", type: "any", behavior: "signal"},
                {name: "event", type: "boolean", behavior: "event"}
            ],
            outputs: [
                {name: "output", type: "any", behavior: "event"}
            ]
        },
        {
            name: CREATE,
            type: "obj",
            itemUrl: "#processor-obj",
            inputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "position", type: "vector3", behavior: "event"}
            ],
            outputs: [
                {name: "object", type: "object", behavior: "event"}
            ]
        },
        {
            name: DESTROY,
            type: "obj",
            itemUrl: "#processor-obj",
            inputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "event", type: "boolean", behavior: "event"}
            ],
            outputs: [
                {name: "end", type: "object", behavior: "event"}
            ]
        },
        {
            name: TRANSLATE,
            type: "obj",
            itemUrl: "#processor-obj",
            inputs: [
                {name: "object", type: "object", behavior: "event"},
                {name: "from", type: "vector3", behavior: "event"},
                {name: "to", type: "vector3", behavior: "event"},
                {name: "speed", type: "number", behavior: "event"}
            ],
            outputs: [
                {name: "end", type: "boolean", behavior: "event"}
            ]
        },
        {
            name: COLLIDE,
            type: "obj",
            itemUrl: "#processor-obj",
            inputs: [
                {name: "object-1", type: "object", behavior: "event"},
                {name: "object-2", type: "object", behavior: "event"}
            ],
            outputs: [
                {name: "collision-start", type: "boolean", behavior: "event"},
                {name: "collision-end", type: "boolean", behavior: "event"}
            ]
        }
    ],
    Avatars:[
        {
            name: HEADSET,
            type: "obj",
            itemUrl: "#headset-obj",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event" },
                {name: "position", type: "vector3", behavior: "signal" }
            ]
        },
        {
            name: L_CONTROLLER,
            type: "obj",
            itemUrl: "#controller-left-obj",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event" },
                {name: "triggerup", type: "boolean", default: false, behavior: "event" },
                {name: "triggerdown", type: "boolean", default: false, behavior: "event" },
                {name: "position", type: "vector3", behavior: "signal" }
            ]
        },
        {
            name: R_CONTROLLER,
            type: "obj",
            itemUrl: "#controller-right-obj",
            inputs: [],
            outputs: [
                {name: "object", type: "object", behavior: "event" },
                {name: "triggerup", type: "boolean", default: false, behavior: "event" }, 
                {name: "triggerdown", type: "boolean", default: false, behavior: "event"},
                {name: "position", type: "vector3", behavior: "signal" }
            ]
        }
    ],
    Poly:[]
}