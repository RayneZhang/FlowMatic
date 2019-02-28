import * as AFRAME from 'aframe'
declare const THREE:any;

const plusOperator = AFRAME.registerComponent('plus', {
    schema: {
        operatorName: {type: 'string', default: 'plus'},
        dataType: {type: 'string', default: 'vector'},
        dataValue: {type: 'string', default: ''},
        sourceEntities: {type: 'array', default: []},
        sourceValues: {type: 'array', default: []},
        targetEntities: {type: 'array', default: []},
        targetAttributes: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("data-filter");

        this.el.addEventListener('attribute-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: any = event.detail.dataValue;
            if (dataType === 'vector') {
                
            }
        });
    },

    tick: function(time, timeDelta): void {
        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        for (const curId of this.data.targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue}, false);
            }
        }
    },

    update: function (oldDate): void {
        
    }
});

export default plusOperator;