import * as AFRAME from 'aframe'
declare const THREE:any;

const switchSource = AFRAME.registerComponent('switch-source', {
    schema: {
        dataType: {type: 'string', default:'boolean'},
        dataValue: {type: 'boolean', default: false},
        targetEntities: {type: 'array', default: []},
        targetAttributes: {type: 'array', default: []}
    },

    init: function(): void {
        // Private properties.
        // The delta time for updating data (milliseconds).
        this.timeOffset = 2000;
        this.globalTimeDelta = 0;

        // Add to the entity's class list.
        this.el.classList.add('data-source');
        this.el.addEventListener('source-update', (event) => {
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
    },

    tick: function(time, timeDelta): void {
        this.globalTimeDelta += timeDelta;
        if (this.globalTimeDelta < this.timeOffset) {
            return;
        }
        else {
            this.globalTimeDelta = 0;
            // Fetch the vector value from swtch component.
            if (this.el.firstChild.classList.contains('Switch')) {
                this.data.dataValue = this.el.firstChild.components['swtch'].getSwitchStatus();
            }
            else
                return;

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

        }
    }
});

export default switchSource;