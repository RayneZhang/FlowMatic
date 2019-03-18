import * as AFRAME from 'aframe'
declare const THREE:any;
declare const THREEx:any;

const spotLight = AFRAME.registerComponent('spotlight', {
    schema: {
        color: {type: 'string', default: 'white'},
        direction: {type: 'string', default: ''},
        sourceAttributes: {type: 'array', default: []},
        targetEntities: {type: 'array', default: []},
        targetAttributes: {type: 'array', default: []}
    },

    init: function(): void {
        // Set up light type for the entity.
        this.initLight();

        this.el.classList.add('data-receiver');
        this.el.addEventListener('target-update', (event) => {
            const targetEntity: string = event.detail.targetEntity;
            const targetAttribute: string = event.detail.targetAttribute;
            const sourceAttribute: string = event.detail.sourceAttribute;
            // If the targetEntities is null, we need to reset the type.
            if (!Array.isArray(this.data.targetEntities) || !this.data.targetEntities.length) {
                this.data.targetEntities = [];
            }
            if (!Array.isArray(this.data.targetAttributes) || !this.data.targetAttributes.length) {
                this.data.targetAttributes = [];
            }
            if (!Array.isArray(this.data.sourceAttributes) || !this.data.sourceAttributes.length) {
                this.data.sourceAttributes = [];
            }
            this.data.targetEntities.push(targetEntity);
            this.data.targetAttributes.push(targetAttribute);
            this.data.sourceAttributes.push(sourceAttribute);
        });
        
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
            if (dataType === 'Color') {
                const attribute: string = event.detail.attribute;
                if (attribute === 'Light Color') {
                    this.spotLightEntity.setAttribute('light', 'color', dataValue);
                    this.lightBulbEntity.setAttribute('material', 'color', dataValue);
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
        spotLightEntity.setAttribute('light', 'angle', 45);
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
        lightBulbEntity.object3D.position.set(0, 0.02, 0.04);
        lightBulbEntity.object3D.rotation.set(THREE.Math.degToRad(70), 0, 0);

        // Create a volumetric entity.
        const volumetricEntity: any = this.volumetricEntity = document.createElement('a-entity');
        this.el.appendChild(volumetricEntity);
        // CylinderGeometry(radiusTop : Float, radiusBottom : Float, height : Float, radialSegments : Integer, heightSegments : Integer, openEnded : Boolean, thetaStart : Float, thetaLength : Float)
        var geometry = new THREE.CylinderGeometry( 0.045, 5.045, 5, 32*2, 20, true);
        geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, -geometry.parameters.height/2, 0 ) );
        geometry.applyMatrix( new THREE.Matrix4().makeRotationX( -Math.PI / 2 ) );

        var material = new THREEx.VolumetricSpotLightMaterial();
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0.02, 0.04);
        material.uniforms.lightColor.value.set('white');
        material.uniforms.spotPosition.value = mesh.position;
        volumetricEntity.setObject3D('mesh', mesh);
        volumetricEntity.object3D.rotation.set(THREE.Math.degToRad(-15), 0, 0);
    },

    // Even receivers can emit events.
    tick: function(time, timeDelta): void {
        const targetEntities = this.data.targetEntities;
        // Check if there is target object.
        if (!Array.isArray(targetEntities) || !targetEntities.length) {
            return;
        }

        let i: number = 0;
        for (const curId of targetEntities) {
            const curTarget: any = document.querySelector('#' + curId);
            if (curTarget) {
                switch (this.data.sourceAttributes[i]) {
                    case "Position": {
                        this.dataType = 'vector';
                        const val: string = this.el.object3D.position as string;
                        this.dataValue = val;
                        break;
                    }
                }
                curTarget.emit('attribute-update', {dataType: this.dataType, dataValue: this.dataValue, attribute: this.data.targetAttributes[i], sourceEntityId: this.el.getAttribute('id')}, false);
                i++;
            }
        }
    }
});

export default spotLight;