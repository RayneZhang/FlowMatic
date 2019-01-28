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
        let i: number = 0;

        this.el.addEventListener('attribute-update', (event) => {
            const sourceName: string = event.detail.sourceName;
            const sourceValue: string = event.detail.sourceValue;
            if (sourceName === 'color') {
                this.data.sourceValue = sourceValue;
                this.el.setAttribute('material', 'color', sourceValue);
            }
            if (sourceName === 'position') {
                const sourcePos = new THREE.Vector3();
                sourcePos.copy(sourceValue);
                if (!this.sourceInitPos)
                    this.sourceInitPos = sourcePos.clone();

                const currentPos = new THREE.Vector3();
                currentPos.copy(this.el.object3D.position);

                if (i > 3) {return;}
                //i++;
                console.log(sourcePos);
                console.log(this.sourceInitPos);
                // Calculate the new position of this object.
                const updatedPos = sourcePos.add(currentPos.sub(this.sourceInitPos));
                this.el.object3D.position.copy(updatedPos);
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

            }
            case "position": {
                const val: string = this.el.object3D.position as string;
                this.data.sourceValue = val;
            }
        }

        for (const curId of this.data.targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                curTarget.emit('attribute-update', {sourceName: this.data.sourceName, sourceValue: this.data.sourceValue}, false);
            }
        }
    },

    update: function (oldDate): void {
        
    }
}

export default dataReceiver;