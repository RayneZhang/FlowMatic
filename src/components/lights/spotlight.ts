import * as AFRAME from 'aframe';
import { scene } from 'frp-backend'
declare const THREE:any;
declare const THREEx:any;

const spotLight = AFRAME.registerComponent('spotlight', {
    schema: {
        color: {type: 'string', default: 'white'},
        direction: {type: 'string', default: ''},
        switch: {type: 'boolean', default: true},
    },

    init: function(): void {
        this.node = scene.getNode(this.el.getAttribute('id'));

        // Set up light type for the entity.
        this.initLight();        
        this.el.addEventListener('attribute-update', (event) => {
            const dataType: string = event.detail.dataType;
            const dataValue: string = event.detail.dataValue;

            if (dataValue === undefined || dataValue === null || dataValue === '')
                return;

            if (dataType === 'vector') {
                const attribute: string = event.detail.attribute;
                if (attribute === 'light_direction') {
                    this.el.setAttribute('spotlight', 'direction', dataValue);
                    if (this.data.switch) {
                        const Dir = new THREE.Vector3().copy(dataValue);
                        Dir.add(this.el.object3D.position.clone());
                        this.el.object3D.lookAt(Dir);
                        this.el.object3D.rotateX(THREE.Math.degToRad(15));
                    }
                }
            }
            if (dataType === 'Color') {
                const attribute: string = event.detail.attribute;
                if (attribute === 'Light Color') {
                    this.el.setAttribute('spotlight', 'color', dataValue);
                    if (this.data.switch) {
                        // Set up color.
                        this.spotLightEntity.setAttribute('light', 'color', this.data.color);
                        this.lightBulbEntity.setAttribute('material', 'color', this.data.color);
                        this.setVolumetricLightColor(this.data.color);
                    }
                }
            }
            if (dataType === 'boolean') {
                const attribute: string = event.detail.attribute;
                if (attribute === 'light_on_off') {
                    this.el.setAttribute('spotlight', 'switch', dataValue);
                    // Set up switch.
                    this.spotLightEntity.setAttribute('visible', dataValue);
                    this.lightBulbEntity.setAttribute('visible', dataValue);
                    this.volumetricEntity.setAttribute('visible', dataValue);
                }
            }
        });
    },

    // ==========For internal call only.==========
    initLight: function(): void {
        // Create spotlight entity.
        const spotLightEntity: any = this.spotLightEntity = document.createElement('a-entity');
        this.el.appendChild(spotLightEntity);

        // Set up parameters.
        spotLightEntity.setAttribute('light', 'type', 'spot');
        spotLightEntity.setAttribute('light', 'angle', 15);
        spotLightEntity.object3D.rotation.set(THREE.Math.degToRad(165), 0, 0);

        // Create light bulb entity.
        const lightBulbEntity: any = this.lightBulbEntity = document.createElement('a-entity');
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
        lightBulbEntity.object3D.position.set(0, 0.05, 0.1);
        lightBulbEntity.object3D.rotation.set(THREE.Math.degToRad(70), 0, 0);
        lightBulbEntity.object3D.scale.set(2.5, 2.5, 2.5);

        // Create a volumetric entity.
        const volumetricEntity: any = this.volumetricEntity = document.createElement('a-entity');
        this.el.appendChild(volumetricEntity);
        // CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
        var geometry = new THREE.CylinderGeometry( 0.045, 1.045, 5, 32*2, 20, true);
        geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -geometry.parameters.height/2, 0 ) );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );

        var material = new THREEx.VolumetricSpotLightMaterial();
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0.02, 0.04);
        const {x, y, z} = this.el.getAttribute('position');
        material.uniforms.spotPosition.value = new THREE.Vector3(x, y + 0.02, z + 0.04);
        volumetricEntity.setObject3D('mesh', mesh);
        volumetricEntity.object3D.rotation.set(THREE.Math.degToRad(-15), 0, 0);
        this.setVolumetricLightColor('white');
        volumetricEntity.object3D.scale.set(2.5, 2.5, 2.5);
    },

    setVolumetricLightColor: function(_color: string): void {
        const material = this.volumetricEntity.getObject3D('mesh').material;
        material.uniforms.lightColor.value.set(_color);
    }
});

export default spotLight;