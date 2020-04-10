import * as AFRAME from 'aframe'
declare const THREE:any;

const collisionDetector = AFRAME.registerComponent('collision-detector', {
    schema: {
        operatorName: {type: 'string', default: ''},
        entityA: {type: 'selector', default: null},
        entityB: {type: 'selector', default: null},
        condition: {type: 'boolean', default: false},
        targetEntities: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("collision-detector");

        this.el.addEventListener('target-update', (event) => {
            const targetEntity: string = event.detail.targetEntity;
            if (!targetEntity) return;
            // If the targetEntities is null, we need to reset the type.
            if (!Array.isArray(this.data.targetEntities) || !this.data.targetEntities.length) {
                this.data.targetEntities = [];
            }
            this.data.targetEntities.push(targetEntity);
        });

        this.el.addEventListener('entity-update', (event) => {
            const entityId: string = event.detail.entityId;
            const targetAttribute: string = event.detail.targetAttribute;
            
            if (!targetAttribute) return;

            if (targetAttribute == "Entity A")
                this.data.entityA = entityId;
            else if (targetAttribute == "Entity B")
                this.data.entityB = entityId;
            else
                return;

            if (!this.data.entityA || !this.data.entityB) return;
            else {
                const entityA = document.querySelector('#' + this.data.entityA);
                entityA.addEventListener('collisions', (e) => {
                    console.log("Collisions triggered! " + entityA.getAttribute('id'));
                    console.log((<any>e).detail.els);
                    console.log((<any>e).detail.clearedEls);

                    this.data.condition = true;
                    const plant: any = document.querySelector("#plant");
                    plant.emit('event-triggered', {eventName: 'Dying'}, false);
                });
            }
        });
    },

    update: function (oldData): void {
        // console.log(oldData.condition);
        // if (this.data.condition === oldData.condition)
        //     return;

        // console.log("update passed");
        if (!this.data.condition) return;

        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        let i: number = 0;
        for (const curId of this.data.trueTargetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                curTarget.emit('condition-update', {dataType: 'boolean', dataValue: this.data.condition, sourceEntityId: this.el.getAttribute('id')}, false);
            }
            i++;
        }
    }
});

export default collisionDetector;