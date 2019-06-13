import * as AFRAME from 'aframe'
declare const THREE:any;

const conditionalEvent = AFRAME.registerComponent('conditional-event', {
    schema: {
        operatorName: {type: 'string', default: 'Conditional Event'},
        condition: {type: 'boolean', default: false},
        falseEntities: {type: 'array', default: []},
        falseTargetEvents: {type: 'array', default: []},
        trueTargetEntities: {type: 'array', default: []},
        trueTargetEvents: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("event-filter");
        this.dataValue = new THREE.Vector3();

        this.el.addEventListener('target-update', (event) => {
            const targetEntity: string = event.detail.targetEntity;
            const targetCondition: any = event.detail.targetCondition;
            const targetEvent: string = event.detail.targetEvent;
            
            if (targetCondition) {
                // If the targetEntities is null, we need to reset the type.
                if (!Array.isArray(this.data.trueTargetEntities) || !this.data.trueTargetEntities.length) {
                    this.data.trueTargetEntities = [];
                }
                if (!Array.isArray(this.data.trueTargetEvents) || !this.data.trueTargetEvents.length) {
                    this.data.trueTargetEvents = [];
                }

                this.data.trueTargetEntities.push(targetEntity);
                this.data.trueTargetEvents.push(targetEvent);
            }
            else {
                // If the targetEntities is null, we need to reset the type.
                if (!Array.isArray(this.data.falseTargetEntities) || !this.data.falseTargetEntities.length) {
                    this.data.falseTargetEntities = [];
                }
                if (!Array.isArray(this.data.falseTargetEvents) || !this.data.falseTargetEvents.length) {
                    this.data.falseTargetEvents = [];
                }

                this.data.falseTargetEntities.push(targetEntity);
                this.data.falseTargetEvents.push(targetEvent);
            }
        });

        this.el.addEventListener('condition-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: any = event.detail.dataValue;
            if (dataType === 'boolean') {
                this.data.condition = dataValue;
            }
        });
    },

    tick: function(time, timeDelta): void {
        
    },

    update: function (oldData): void {
        if (this.data.condition === oldData.condition)
            return;

        

        if (this.data.condition) {
            const trueTargetEntities = this.data.trueTargetEntities;
            // Check if there is target object.
            if (!Array.isArray(trueTargetEntities) || !trueTargetEntities.length) {
                return;
            }

            let i: number = 0;
            for (const curId of this.data.trueTargetEntities) {
                const curTarget: any = document.querySelector('#' + curId);
                if (curTarget) {
                    curTarget.emit('event-triggered', {eventName: this.data.trueTargetEvents[i], sourceEntityId: this.el.getAttribute('id')}, false);
                }
                i++;
            }
        }
        else {
            const falseTargetEntities = this.data.falseTargetEntities;
            // Check if there is target object.
            if (!Array.isArray(falseTargetEntities) || !falseTargetEntities.length) {
                return;
            }

            let i: number = 0;
            for (const curId of this.data.falseTargetEntities) {
                const curTarget: any = document.querySelector('#' + curId);
                if (curTarget) {
                    curTarget.emit('event-triggered', {eventName: this.data.falseTargetEvents[i], sourceEntityId: this.el.getAttribute('id')}, false);
                }
                i++;
            }
        }
        
    }
});

export default conditionalEvent;