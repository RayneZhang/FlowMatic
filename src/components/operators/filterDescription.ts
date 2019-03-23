import Dot from "../../modules/Dot";

declare const THREE:any;

const filterDescription = {
    schema: {
        functionInputs: {type: 'array', default: ['Position', 'Rotation']},
        functionName: {type: 'string', default: ""}
    },

    init: function(): void {
        const length = this.data.functionInputs.length;
        this.lineHeight = 0.2;
        this.planeWidth = 1;
        this.planeHeight = this.lineHeight * (length + 1);

        this.createOperatorPlane();

        let i: number = 0;
        for (const inputName of this.data.functionInputs) {
            this.createOneInput(inputName, this.planeHeight/2 - this.lineHeight*(i+1.5));
            i++;
        }
    },

    tick: function(time, timeDelta): void {
        
    },

    // Create a line for a certain input
    createOneInput: function(_inputName: string, _yOffset: number): void {
        // Create a ring first.
        const ring: any = document.createElement('a-entity');
        this.el.appendChild(ring);
        ring.setAttribute('geometry', {
            primitive: 'torus',
            radius: 0.02,
            radiusTubular: 0.001
        });

        ring.setAttribute('material', {
            color: '#ffffff'
        });

        // Create an inputName.
        const textEntity: any = document.createElement('a-entity');
        this.el.appendChild(textEntity);
        this.createTextEntity(textEntity, _inputName);
        
        // Set up position of the ring.
        ring.object3D.position.set(-this.planeWidth/2, _yOffset, 0);
        textEntity.object3D.position.set(-this.planeWidth/2 + 0.04, _yOffset - 0.04, 0);
    },

    // Create a text geometry given by the entity and name.
    createTextEntity(_textEntity: any, _inputName: string): void {
        var loader = new THREE.FontLoader();
        loader.load( '../vendor/fonts/helvetiker_regular.typeface.json', function ( font ) {

            var geometry = new THREE.TextGeometry( _inputName, {
                font: font,
                size: 0.06,
                height: 0.01,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 1,
                bevelSize: 0.5,
                bevelSegments: 3
            } );
            geometry.computeBoundingBox();
            geometry.computeVertexNormals();
            const b_geometry = new THREE.BufferGeometry().fromGeometry( geometry );
            const material = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.5, transparent: true});
            var mesh = new THREE.Mesh( b_geometry, material );
            _textEntity.setObject3D('mesh', mesh);
        } );
    },

    // Create a plane of an operator.
    createOperatorPlane(): void {
        this.el.setAttribute('geometry', {
            primitive: 'plane',
            width: this.planeWidth,
            height: this.planeHeight
        });

        this.el.setAttribute('material', {
            color: '#7befb2', 
            shader: 'standard',
            emissive: '#7befb2',
            emissiveIntensity: 0.35,
            side: 'double',
            transparent: true,
            opacity: 0.9,
            fog: true
        });
    }  
}

export default filterDescription;