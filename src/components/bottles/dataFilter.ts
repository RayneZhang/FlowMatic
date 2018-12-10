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

        this.el.addEventListener('attribute-update', (event) => {
            const sourceName: string = event.detail.sourceName;
            const sourceValue: any = event.detail.sourceValue;
            if (sourceName === 'color') {
                const color = new THREE.Color(sourceValue);
                color.multiplyScalar(this.data.filterValue);
                this.data.sourceValue = color;
            }
        });

        this.el.addEventListener('filter-update', (event) => {
            const filterValue: any = event.detail.filterValue;
            this.data.filterValue = (filterValue + 0.06409)/(0.06409 * 2);
            const color = new THREE.Color(this.data.sourceValue);
            color.multiplyScalar(this.data.filterValue);
            this.data.sourceValue = color;
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
                curTarget.emit('attribute-update', {sourceName: this.data.sourceName, sourceValue: this.data.sourceValue}, false);
            }
        }
    },

    update: function (oldDate): void {
        
    }
}

export default dataFilter;