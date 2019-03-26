import * as AFRAME from 'aframe'
declare const THREE:any;

const vecToNum = AFRAME.registerComponent('vec2num', {
    schema: {
        operatorName: {type: 'string', default: 'Vector to Number'},
        dataType: {type: 'string', default: 'number'},
        dataValue: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
        sourceAttributes: {type: 'array', default: []},
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
            const sourceAttribute: string = event.detail.sourceAttribute;
            // If the targetEntities is null, we need to reset the type.
            if (!Array.isArray(this.data.targetEntities) || !this.data.targetEntities.length) {
                this.data.targetEntities = [];
            }
            if (!Array.isArray(this.data.targetAttributes) || !this.data.targetAttributes.length) {
                this.data.targetAttributes = [];
            }
            if (!Array.isArray(this.data.sourceAttributes) || !this.data.sourceAttributes.length) {
                this.data.sourceAttributes = [];
            }
            this.data.targetEntities.push(targetEntity);
            this.data.targetAttributes.push(targetAttribute);
            this.data.sourceAttributes.push(sourceAttribute);
        });

        this.el.addEventListener('attribute-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: any = event.detail.dataValue;
            if (dataType === 'vector') {
                if (dataValue === undefined || dataValue === null) return;
                this.data.dataValue.x = dataValue.x;
                this.data.dataValue.y = dataValue.y;
                this.data.dataValue.z = dataValue.z;
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
                switch (this.data.sourceAttributes[i]) {
                    case "X": {
                        curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue.x, attribute: this.data.targetAttributes[i]}, false);
                        break;
                    }
                    case "Y": {
                        curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue.y, attribute: this.data.targetAttributes[i]}, false);
                        break;
                    }
                    case "Z": {
                        curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue.z, attribute: this.data.targetAttributes[i]}, false);
                        break;
                    }
                }
            }
            i++;
        }
    }
});

export default vecToNum;