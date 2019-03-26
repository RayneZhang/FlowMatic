import * as AFRAME from 'aframe'
declare const THREE:any;

const sliderSource = AFRAME.registerComponent('slider-source', {
    schema: {
        dataType: {type: 'string', default:'number'},
        dataValue: {type: 'string', default: ''},
        targetEntities: {type: 'array', default: []},
        targetAttributes: {type: 'array', default: []},
        targetSlider: {type: 'selector', default: null}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.classList.add('data-source');
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
        this.el.addEventListener('attribute-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: string = event.detail.dataValue;
            if (dataType === 'number') {
                this.data.dataValue = dataValue;
                this.data.targetSlider.components['slider'].setSliderValue(dataValue);
            }
        });
    },

    tick: function(time, timeDelta): void {
        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        // Fetch the vector value from vector component.
        this.data.dataValue = this.data.targetSlider.components['slider'].getSliderValue();

        let i: number = 0;
        for (const curId of this.data.targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                curTarget.emit('attribute-update', {dataType: this.data.dataType, dataValue: this.data.dataValue, attribute: this.data.targetAttributes[i], sourceEntityId: this.el.getAttribute('id')}, false);
                i++;
            }
        }
    }
});

export default sliderSource;