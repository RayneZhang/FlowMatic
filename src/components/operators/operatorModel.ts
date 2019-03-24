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

        // Set up plug geometry
        // plug.setAttribute('obj-model', 'obj', '#plug-obj');
        // plug.object3D.rotation.set(0, 0, THREE.Math.degToRad(90));
        // plug.object3D.scale.set(2, 2, 2);

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
    }

});

export default operatorModel;