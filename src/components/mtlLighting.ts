import * as AFRAME from 'aframe'

const mtlLighting = AFRAME.registerComponent('mtl-lighting', {
    init: function(): void {
        this.el.addEventListener('model-loaded', (event) => {
            const loadedModel: any = event.detail.model;
            console.log(loadedModel);
        });        
    }
});

export default mtlLighting;