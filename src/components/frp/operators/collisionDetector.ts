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
            const entityAId: string = event.detail.entityA;
            const entityBId: string = event.detail.entityB;
            
            if (!entityAId || !entityBId) return;

            this.data.entityA = entityAId;
            this.data.entityB = entityAId;

            const entityA = document.querySelector('#' + entityAId);
            entityA.addEventListener('collisions', (e) => {
                console.log("Collisions started!" + entityA.getAttribute('id'));
    
                console.log(event.e.els);
                console.log(event.e.clearedEls);
            });
        });

        this.el.addEventListener('condition-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: any = event.detail.dataValue;
            if (dataType === 'boolean') {
                this.data.condition = dataValue;
            }
        });
    },

    update: function (oldData): void {
        if (this.data.condition === oldData.condition)
            return;

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