import * as AFRAME from 'aframe'
declare const THREE:any;

const plusOperator = AFRAME.registerComponent('plus', {
    schema: {
        value1: {type: 'string'},
        value2: {type: 'string'},
        operatorName: {type: 'string', default: 'plus'},
        dataType: {type: 'string', default: 'position'},
        dataValue: {type: 'string', default: ''},
        targetEntities: {type: 'array', default: []}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add("data-filter");
        
        this.timeOffset = 2000;
        this.globalTimeDelta = 0;
        this.maxValue = 0.03;

        this.initColorValue = this.data.sourceValue;
        

        this.velocity = 0;
        this.maxVelocity = 1;
        this.acceleration = 0;
        this.maxAcceleration = 0.5;
        this.vDistance = 0;
        this.aDistance = 0;

        this.el.addEventListener('attribute-update', (event) => {
            const sourceName: string = event.detail.sourceName;
            const sourceValue: any = event.detail.sourceValue;
            if (sourceName === 'color') {
                this.initColorValue = sourceValue;
                const color = new THREE.Color(sourceValue);
                color.multiplyScalar(this.data.filterValue);
                this.data.sourceValue = color;
            }
            if (sourceName === 'position') {
                this.data.sourceName = sourceName;
                this.data.sourceValue = sourceValue;
                this.vDistance = event.detail.vDistance;
                this.aDistance = event.detail.aDistance;
            }
        });
    },

    tick: function(time, timeDelta): void {
        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        for (const curId of this.data.targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                const secondsDelta = timeDelta/1000;
                const vDistance: number = this.velocity * secondsDelta + this.vDistance;
                const aDistance: number = 1/2 * this.acceleration * secondsDelta * secondsDelta + this.aDistance;
                this.velocity += this.acceleration * secondsDelta;
                curTarget.emit('attribute-update', {sourceName: this.data.sourceName, sourceValue: this.data.sourceValue, vDistance: vDistance, aDistance: aDistance}, false);
            }
        }
    },

    update: function (oldDate): void {
        
    }
});

export default plusOperator;