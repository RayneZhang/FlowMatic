declare const THREE:any;

const dataFilter = {
    schema: {
        sourceName: {type: 'string', default: 'color'},
        sourceValue: {type: 'string', default: 'red'},
        filterName: {type: 'string', default: 'darkness'},
        filterValue: {type: 'number', default: 1},
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

        this.el.addEventListener('filter-update', (event) => {
            if (this.data.filterName == "darkness") {
                const filterValue: any = event.detail.filterValue;
                this.data.filterValue = (filterValue + this.maxValue)/(this.maxValue * 2);
                const color = new THREE.Color(this.initColorValue);
                color.multiplyScalar(this.data.filterValue);
                this.data.sourceValue = color;
            }
            if (this.data.filterName == "velocity") {
                const filterValue: any = event.detail.filterValue;
                this.data.filterValue = filterValue * (1/this.maxValue);
                this.velocity = this.data.filterValue * this.maxVelocity;
            }
            if (this.data.filterName == "acceleration") {
                const filterValue: any = event.detail.filterValue;
                this.data.filterValue = filterValue * (1/this.maxValue);
                this.acceleration = this.data.filterValue * this.maxAcceleration;
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
                if (this.data.sourceName === "color")
                    curTarget.emit('attribute-update', {sourceName: this.data.sourceName, sourceValue: this.data.sourceValue}, false);
                if (this.data.sourceName === "position") {
                    const secondsDelta = timeDelta/1000;
                    const vDistance: number = this.velocity * secondsDelta + this.vDistance;
                    const aDistance: number = 1/2 * this.acceleration * secondsDelta * secondsDelta + this.aDistance;
                    this.velocity += this.acceleration * secondsDelta;
                    curTarget.emit('attribute-update', {sourceName: this.data.sourceName, sourceValue: this.data.sourceValue, vDistance: vDistance, aDistance: aDistance}, false);
                }
            }
        }
    },

    update: function (oldDate): void {
        
    }
}

export default dataFilter;