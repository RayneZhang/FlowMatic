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

        this.el.addEventListener('attribute-update', (event) => {
            const sourceName: string = event.detail.sourceName;
            const sourceValue: any = event.detail.sourceValue;
            if (sourceName === 'color') {
                this.data.sourceValue = sourceValue;
                this.el.setAttribute('material', 'color', sourceValue);
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