import * as AFRAME from 'aframe'
declare const THREE:any;

const spotLight = AFRAME.registerComponent('spotlight', {
    schema: {
        color: {type: 'string', default: 'white'},
        direction: {type: 'string', default: ''}
    },

    init: function(): void {
        // Set up light type for the entity.
        this.initLight();

        this.el.classList.add('data-receiver');
        this.el.addEventListener('attribute-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: string = event.detail.dataValue;

            if (dataType === 'vector') {
                const attribute: string = event.detail.attribute;
                if (attribute === 'Light Direction') {
                    const Dir = new THREE.Vector3().copy(dataValue);
                    Dir.add(this.el.object3D.position.clone());
                    this.el.object3D.lookAt(Dir);
                }
            }
        });
    },

    // ==========For internal call only.==========
    initLight: function(): void {
        // Create light entity.
        const lightEntity: any = document.createElement('a-entity');
        this.el.appendChild(lightEntity);

        // Set up parameters.
        lightEntity.setAttribute('light', 'type', 'spot');
        lightEntity.setAttribute('light', 'angle', 45);
        lightEntity.object3D.rotation.set(THREE.Math.degToRad(180), 0, 0);
    }
});

export default spotLight;