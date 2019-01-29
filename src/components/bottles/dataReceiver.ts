declare const THREE:any;

const dataReceiver = {
    schema: {
        sourceName: {type: 'string', default: 'color'},
        sourceValue: {type: 'string', default: 'blue'},
        targetEntities: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("data-receiver");

        this.sourceInitPos = null;
        this.objInitPos = null;

        this.el.addEventListener('attribute-update', (event) => {
            const sourceName: string = event.detail.sourceName;
            const sourceValue: string = event.detail.sourceValue;

            if (sourceName === 'color') {
                this.data.sourceValue = sourceValue;
                this.el.setAttribute('material', 'color', sourceValue);
            }
            if (sourceName === 'position') {
                const vDistance: number = event.detail.vDistance;
                const aDistance: number = event.detail.aDistance;

                const currentPos = new THREE.Vector3();
                currentPos.copy(this.el.object3D.position);
                const sourcePos = new THREE.Vector3();
                sourcePos.copy(sourceValue);
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
        });
    },

    // Even receivers can emit events.
    tick: function(time, timeDelta): void {
        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        switch (this.data.sourceName) {
            case "color": default: {
                break;
            }
            case "position": {
                const val: string = this.el.object3D.position as string;
                this.data.sourceValue = val;
                break;
            }
        }

        for (const curId of this.data.targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                if (this.data.sourceName === "color")
                    curTarget.emit('attribute-update', {sourceName: this.data.sourceName, sourceValue: this.data.sourceValue}, false);
                if (this.data.sourceName === "position") {
                    curTarget.emit('attribute-update', {sourceName: this.data.sourceName, sourceValue: this.data.sourceValue, vDistance: 0, aDistance: 0}, false);
                }
            }
        }
    },

    update: function (oldDate): void {
        
    }
}

export default dataReceiver;