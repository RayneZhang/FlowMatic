declare const THREE:any;

const dataReceiver = {
    schema: {
        dataType: {type: 'string', default: 'color'},
        dataValue: {type: 'string', default: 'blue'},
        targetEntities: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("data-receiver");

        this.sourceInitPos = null;
        this.objInitPos = null;

        this.el.addEventListener('attribute-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: string = event.detail.dataValue;

            if (dataType === 'color') {
                this.data.dataValue = dataValue;
                this.el.setAttribute('material', 'color', dataValue);
            }
            if (dataType === 'position') {
                const vDistance: number = event.detail.vDistance;
                const aDistance: number = event.detail.aDistance;

                const currentPos = new THREE.Vector3();
                currentPos.copy(this.el.object3D.position);
                const sourcePos = new THREE.Vector3();
                sourcePos.copy(dataValue);
                if (!this.sourceInitPos) {
                    this.sourceInitPos = sourcePos.clone();
                    this.objInitPos = currentPos.clone();

                }
                if (vDistance == 0 && aDistance == 0) {
                    const updatedPos = sourcePos.add(this.objInitPos.clone().sub(this.sourceInitPos));
                    this.el.object3D.position.copy(updatedPos);
                }
                else {
                    const dir = (sourcePos.clone().sub(currentPos.clone())).normalize();
                    const updatedPos = currentPos.add(dir.clone().multiplyScalar(vDistance)).add(dir.clone().multiplyScalar(aDistance));
                    this.el.object3D.position.copy(updatedPos);
                }
            }
            if (dataType === 'vector') {
                const attribute: string = event.detail.attribute;
                if (attribute === 'position') {
                    this.el.object3D.position.copy(dataValue);
                }
            }
        });
    },

    // Even receivers can emit events.
    tick: function(time, timeDelta): void {
        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        switch (this.data.dataType) {
            case "color": default: {
                break;
            }
            case "position": {
                const val: string = this.el.object3D.position as string;
                this.data.dataValue = val;
                break;
            }
        }

        for (const curId of this.data.targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                if (this.data.dataType === "color")
                    curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue}, false);
                if (this.data.dataType === "position") {
                    curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue, vDistance: 0, aDistance: 0, sourceEntityId: this.el.getAttribute('id')}, false);
                }
            }
        }
    },

    update: function (oldDate): void {
        
    }
}

export default dataReceiver;