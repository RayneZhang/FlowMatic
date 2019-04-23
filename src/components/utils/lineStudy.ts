import * as AFRAME from 'aframe'
declare const THREE:any;

const lineStudy = AFRAME.registerComponent('line-study', {
    schema: {
        color: {type: 'string', default: 'blue'}
    },

    init: function(): void {
        // Private properties.
        // Add geometry component to the entity.
        this.el.setAttribute('geometry', {
            primitive: 'box',
            height: 0.2,
            width: 0.2,
            depth: 0.2
        }); 

        // Set the color of the primitive.
        this.el.setAttribute('material', 'color', this.data.color);
        this.el.setAttribute('data-receiver', 'targetEntities', []);
        this.el.setAttribute('data-receiver', 'dataValue', this.data.color);
        this.el.setAttribute('obj-attributes-list', 'attrNames', ['Color']);

        this.el.classList.add("movable");

    }
});

export default lineStudy;