declare const THREE:any;

const dataFilter = {
    schema: {
        dataType: {type: 'string', default: 'color'},
        dataValue: {type: 'string', default: 'red'},
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

        this.initColorValue = this.data.dataValue;

        this.velocity = 0;
        this.maxVelocity = 1;
        this.acceleration = 0;
        this.maxAcceleration = 0.5;
        this.vDistance = 0;
        this.aDistance = 0;

        this.el.addEventListener('attribute-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: any = event.detail.dataValue;
            if (dataType === 'color') {
                this.initColorValue = dataValue;
                const color = new THREE.Color(dataValue);
                color.multiplyScalar(this.data.filterValue);
                this.data.dataValue = color;
            }
            if (dataType === 'position') {
                this.data.dataType = dataType;
                this.data.dataValue = dataValue;
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
                this.data.dataValue = color;
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
                if (this.data.dataType === "color")
                    curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue}, false);
                if (this.data.dataType === "position") {
                    const secondsDelta = timeDelta/1000;
                    const vDistance: number = this.velocity * secondsDelta + this.vDistance;
                    const aDistance: number = 1/2 * this.acceleration * secondsDelta * secondsDelta + this.aDistance;
                    this.velocity += this.acceleration * secondsDelta;
                    curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue, vDistance: vDistance, aDistance: aDistance}, false);
                }
            }
        }
    },

    update: function (oldDate): void {
        
    }
}

export default dataFilter;