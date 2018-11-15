declare const THREE:any;

const dataSource = {
    schema: {
        sourceName: {type: 'string', default:'color'},
        sourceValue: {type: 'string', default: ''},
        targetEntities: {type: 'array', default: []}
    },

    init: function(): void {
        this.colorSet = ['white', 'blue', 'yellow', 'green', 'black', 'purple'];
        // The delta time for updating color (milliseconds).
        this.timeOffset = 2000;
        this.globalTimeDelta = 0;

        this.data.targetEntities.push('box');
    },

    tick: function(time, timeDelta): void {
        this.globalTimeDelta += timeDelta;
        if (this.globalTimeDelta < this.timeOffset) {
            return;
        }
        else {
            this.globalTimeDelta = 0;
            const colorPos: number = Math.floor(Math.random() * 6);
            this.data.sourceValue = this.colorSet[colorPos];

            const targetEntities = this.data.targetEntities;
            // Check if there is target object.
            if (!Array.isArray(targetEntities) || !targetEntities.length) {
                return;
            }

            const curId: string = this.data.targetEntities[0];
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                curTarget.emit('attribute-update', {sourceName: this.data.sourceName, sourceValue: this.data.sourceValue}, false);
            }
        }
    }
}

export default dataSource;