declare const THREE:any;

const dataSource = {
    schema: {
        dataType: {type: 'string', default:'Color'},
        dataValue: {type: 'string', default: ''},
        targetEntities: {type: 'array', default: []},
        targetAttributes: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("data-source");

        this.colorSet = ['white', 'blue', 'yellow', 'green', 'purple'];
        // The delta time for updating color (milliseconds).
        this.timeOffset = 2000;
        this.globalTimeDelta = 0;

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
            const colorPos: number = Math.floor(Math.random() * 6);
            this.data.dataValue = this.colorSet[colorPos];

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
}

export default dataSource;