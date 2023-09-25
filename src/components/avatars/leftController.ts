import * as AFRAME from 'aframe'
declare const THREE:any;

const leftController = AFRAME.registerComponent('left-controller', {
    schema: {
        sourceAttributes: {type: 'array', default: []},
        targetEntities: {type: 'array', default: []},
        targetAttributes: {type: 'array', default: []}
    },

    init: function(): void {
        this.el.classList.add('data-receiver');

        this.el.addEventListener('target-update', (event) => {
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
    },

    // Even receivers can emit events.
    tick: function(time, timeDelta): void {
        const leftHand: any = document.querySelector('#leftHand');
        const handRot = leftHand.getAttribute('rotation');
        const cameraRig: any = document.querySelector('#cameraRig');
        const handPos = {x: cameraRig.getAttribute('position').x + leftHand.getAttribute('position').x, 
        y: cameraRig.getAttribute('position').y + leftHand.getAttribute('position').y,
        z: cameraRig.getAttribute('position').z + leftHand.getAttribute('position').z};
        this.el.setAttribute('rotation', {x: handRot.x, y: handRot.y, z: handRot.z});

        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        let i: number = 0;
        for (const curId of targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                switch (this.data.sourceAttributes[i]) {
                    case "Position": {
                        this.dataType = 'vector';
                        // Pass the actual headset position.
                        const val: string = new THREE.Vector3(handPos.x, handPos.y, handPos.z) as string;
                        this.dataValue = val;
                        break;
                    }
                }
                curTarget.emit('attribute-update', {dataType: this.dataType, dataValue: this.dataValue, attribute: this.data.targetAttributes[i], sourceEntityId: this.el.getAttribute('id')}, false);
                i++;
            }
        }
    }
});

export default leftController;