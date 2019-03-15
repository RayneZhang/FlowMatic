import * as AFRAME from 'aframe'
declare const THREE:any;

const spotLight = AFRAME.registerComponent('spotlight', {
    schema: {
        color: {type: 'string', default: 'white'},
        direction: {type: 'string', default: ''}
    },

    init: function(): void {
        // Private properties.
        this.offset = new THREE.Vector3();

        // Set up light type for the entity.
        this.initLight();
    },

    // ==========For internal call only.==========
    initLight: function(): void {
        // Create light entity.
        const lightEntity: any = document.createElement('a-entity');
        this.el.appendChild(lightEntity);

        // Set up parameters.
        lightEntity.setAttribute('light', 'type', 'spot');
        lightEntity.setAttribute('light', 'angle', 45);
    }
});

export default spotLight;