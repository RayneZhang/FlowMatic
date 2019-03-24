import * as AFRAME from 'aframe'
declare const THREE:any;

const operatorModel = AFRAME.registerComponent('operator-model', {
    schema: {
        functionInputs: {type: 'array', default: ['Position', 'Rotation']},
        functionName: {type: 'string', default: ""}
    },

    init: function(): void {
        // Add to the entity's class list.
        this.el.setAttribute('geometry', {
            primitive: 'box',
            width: 0.3,
            height: 0.2,
            depth: 0.1
        });

        this.el.setAttribute('material', {
            transparent: true,
            opacity: 0.8
        });

        // Initiate plugs.
        let i: number = 0;
        for (const inputName of this.data.functionInputs) {
            this.createOneInput(inputName, 0.1 - 0.1*(i+0.5));
            this.createPipe(new THREE.Vector3(-0.15, 0.1 - 0.1*(i+0.5), 0), new THREE.Vector3(0.15, 0.05, 0));
            i++;
        }

        // Initiate output.
        this.createOutput(0.05);

        // Initiate operator name.
        const textEntity: any = document.createElement('a-entity');
        this.el.appendChild(textEntity);
        this.createTextEntity(textEntity, "Example Function", new THREE.Vector3(-0.15, 0.15, 0));
    },

    // Create a plug for a certain input
    createOneInput: function(_inputName: string, _yOffset: number): void {
        // Create a plug first.
        const plug: any = document.createElement('a-entity');
        this.el.appendChild(plug);

        plug.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.015
        });
        plug.setAttribute('material', 'color', '#ffffff');

        // Set up plug position.
        plug.object3D.position.set(-0.15, _yOffset, 0);
    },

    // Create an output plug.
    createOutput: function(_yOffset: number): void {
        const output: any = document.createElement('a-entity');
        this.el.appendChild(output);

        output.setAttribute('geometry', {
            primitive: 'sphere',
            radius: 0.015
        });
        output.setAttribute('material', 'color', '#ffffff');
        output.object3D.position.set(0.15, _yOffset, 0);
    },

    // Create pipes.
    createPipe: function(_point1: any, _point2: any): void {
        const pipe: any = document.createElement('a-entity');
        this.el.appendChild(pipe);

        const height: number = _point1.distanceTo(_point2);
        const middlePoint: any = _point1.clone().add(_point2).multiplyScalar(0.5);
        const angle: number = new THREE.Vector3(0, 1, 0).angleTo(_point2.clone().sub(middlePoint));
        pipe.setAttribute('geometry', {
            primitive: 'cylinder',
            radius: 0.005,
            height: height
        });
        pipe.setAttribute('material', 'color', '#ffffff');

        pipe.object3D.position.copy(middlePoint);
        pipe.object3D.rotation.set(0, 0, -angle);
    },

    // Create a text geometry given by the entity and name.
    createTextEntity(_textEntity: any, _inputName: string, _pos: any): void {
        var loader = new THREE.FontLoader();
        loader.load( '../vendor/fonts/helvetiker_regular.typeface.json', function ( font ) {

            var geometry = new THREE.TextGeometry( _inputName, {
                font: font,
                size: 0.03,
                height: 0.005,
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
            _textEntity.object3D.position.copy(_pos.clone());

        } );
    }

});

export default operatorModel;