import * as AFRAME from 'aframe'
declare const THREE:any;

const numToVec = AFRAME.registerComponent('num2vec', {
    schema: {
        operatorName: {type: 'string', default: ''},
        dataType: {type: 'string', default: 'vector'},
        dataValue: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        targetEntities: {type: 'array', default: []},
        targetAttributes: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("data-filter");
        this.dataValue = new THREE.Vector3();

        this.el.addEventListener('operator-update', (event) => {
            const targetEntity: string = event.detail.targetEntity;
            const targetAttribute: string = event.detail.targetAttribute;
            // If the targetEntities is null, we need to reset the type.
            if (!Array.isArray(this.data.targetEntities) || !this.data.targetEntities.length) {
                this.data.targetEntities = [];
            }
            if (!Array.isArray(this.data.targetAttributes) || !this.data.targetAttributes.length) {
                this.data.targetAttributes = [];
            }
            this.data.targetEntities.push(targetEntity);
            this.data.targetAttributes.push(targetAttribute);
        });

        this.el.addEventListener('attribute-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: any = event.detail.dataValue;
            const attribute: string = event.detail.attribute;
            if (dataType === 'number') {
                if (dataValue === undefined || dataValue === null) return;
                if (attribute === 'X')
                    this.data.dataValue.x = dataValue;
                if (attribute === 'Y')
                    this.data.dataValue.y = dataValue;
                if (attribute === 'Z')
                    this.data.dataValue.z = dataValue;
            }
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
                curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: new THREE.Vector3(this.data.dataValue.x, this.data.dataValue.y, this.data.dataValue.z) as string, attribute: this.data.targetAttributes[i]}, false);
            }
            i++;
        }
    }
});

export default numToVec;