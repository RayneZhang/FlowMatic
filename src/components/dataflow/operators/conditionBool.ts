import * as AFRAME from 'aframe'
declare const THREE:any;

const conditionBool = AFRAME.registerComponent('condition-bool', {
    schema: {
        operatorName: {type: 'string', default: 'Condition: Bool'},
        condition: {type: 'boolean', default: false},
        trueDataType: {type: 'string', default: 'vector'},
        trueDataValue: {type: 'string', default: ''},
        falseDataType: {type: 'string', default: 'vector'},
        falseDataValue: {type: 'string', default: ''},
        sourceEntities: {type: 'array', default: []},
        sourceValues: {type: 'array', default: []},
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
            if (attribute === "Condition" && dataType === 'boolean') {
                this.data.condition = dataValue;
            }
            else if (attribute === "when Condition\n is True") {
                this.data.trueDataType = dataType;
                this.data.trueDataValue = dataValue;
            }
            else if (attribute === "when Condition\n is False") {
                this.data.falseDataType = dataType;
                this.data.falseDataValue = dataValue;
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
                if (this.data.condition)
                    curTarget.emit('attribute-update', {dataType: this.data.trueDataType, dataValue: this.data.trueDataValue, attribute: this.data.targetAttributes[i], sourceEntityId: this.el.getAttribute('id')}, false);
                else
                    curTarget.emit('attribute-update', {dataType: this.data.falseDataType, dataValue: this.data.falseDataValue, attribute: this.data.targetAttributes[i], sourceEntityId: this.el.getAttribute('id')}, false);
            }
            i++;
        }
    },

    update: function (oldDate): void {
        
    }
});

export default conditionBool;