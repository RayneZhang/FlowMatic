declare const THREE:any;

const dataSource = {
    schema: {
        dataType: {type: 'string', default:'color'},
        dataValue: {type: 'string', default: ''},
        targetEntities: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("data-source");

        this.colorSet = ['white', 'blue', 'yellow', 'green', 'black', 'purple'];
        // The delta time for updating color (milliseconds).
        this.timeOffset = 2000;
        this.globalTimeDelta = 0;
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

            for (const curId of this.data.targetEntities) {
                const curTarget: any = document.querySelector('#' + curId);
                if (curTarget) {
                    curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue}, false);
                }
            }
        }
    }
}

export default dataSource;