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
        // Create spotlight entity.
        const spotLightEntity: any = document.createElement('a-entity');
        this.el.appendChild(spotLightEntity);

        // Set up parameters.
        spotLightEntity.setAttribute('light', 'type', 'spot');
        spotLightEntity.setAttribute('light', 'angle', 45);
        spotLightEntity.object3D.rotation.set(THREE.Math.degToRad(165), 0, 0);

        // Create light bulb entity.
        const lightBulbEntity: any = document.createElement('a-entity');
        this.el.appendChild(lightBulbEntity);

        // Set up parameters.
        lightBulbEntity.setAttribute('geometry', {
            primitive: 'cylinder',
            radius: 0.045,
            height: 0.02
        });
        lightBulbEntity.setAttribute('material', {
            color: '#fff',
            shader: 'flat'
        });
        lightBulbEntity.object3D.position.set(0, 0.02, 0.04);
        lightBulbEntity.object3D.rotation.set(THREE.Math.degToRad(70), 0, 0);
    }
});

export default spotLight;