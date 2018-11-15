declare const THREE:any;

const attributeUpdate = {
    init: function(): void {
        this.el.addEventListener('attribute-update', (event) => {
            const sourceName: string = event.detail.sourceName;
            const sourceValue: any = event.detail.sourceValue;
            if (sourceName === 'color') {
                this.el.setAttribute('material', 'color', sourceValue);
            }
        });
    },

    tick: function(time, timeDelta): void {
        
    }
}

export default attributeUpdate;