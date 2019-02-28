import * as AFRAME from 'aframe'
declare const THREE:any;

const vectorSource = AFRAME.registerComponent('vector-source', {
    schema: {
        dataType: {type: 'string', default:'vector'},
        dataValue: {type: 'string', default: ''},
        targetEntities: {type: 'array', default: []},
        targetAttributes: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        // this.el.classList.add("data-source");
        this.el.classList.add('vector-source');
    },

    tick: function(time, timeDelta): void {
        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        // Fetch the vector value from vector component.
        this.data.dataValue = this.el.components['vector'].getVector();

        let i: number = 0;
        for (const curId of this.data.targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue, attribute: this.data.targetAttributes[i]}, false);
                i++;
            }
        }
    }
});

export default vectorSource;