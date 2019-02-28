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
        this.el.classList.add("plus");
        this.dataValue = new THREE.Vector3();

        this.el.addEventListener('attribute-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: any = event.detail.dataValue;
            const sourceEntityId: string = event.detail.sourceEntityId;
            if (dataType === 'vector' || dataType === 'position') {
                const entityIndex = this.data.sourceEntities.indexOf(sourceEntityId);
                if ( entityIndex === -1 ) {
                    this.data.sourceEntities.push(sourceEntityId);
                    this.data.sourceValues.push(dataValue);
                    this.dataValue.add(new THREE.Vector3().copy(dataValue));
                }
                else {
                    const oldValue = this.data.sourceValues[entityIndex];
                    if (oldValue === dataValue) return;
                    this.dataValue.sub(new THREE.Vector3().copy(oldValue));
                    this.data.sourceValues[entityIndex] = dataValue;
                    this.dataValue.add(new THREE.Vector3().copy(dataValue));
                }
            }
            this.data.dataValue = this.dataValue as string;
        });
    },

    tick: function(time, timeDelta): void {
        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        let i: number = 0;
        for (const curId of this.data.targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue, attribute: this.data.targetAttributes[i]}, false);
            }
            i++;
        }
    },

    update: function (oldDate): void {
        
    }
});

export default plusOperator;