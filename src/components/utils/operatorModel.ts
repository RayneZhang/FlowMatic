import * as AFRAME from 'aframe'
declare const THREE:any;

const operatorModel = AFRAME.registerComponent('operator-model', {
    schema: {
        functionInputs: {type: 'array', default: []},
        functionOutputs: {type: 'array', default: []},
        behaviorInputs: {type: 'array', default: []},
        behaviorOutputs: {type: 'array', default: []},
        typeInputs: {type: 'array', default: []},
        typeOutputs: {type: 'array', default: []},
        functionName: {type: 'string', default: "Example Function"}
    },

    init: function(): void {
        // Parameters.
        this.lineHeight = 0.1;
        this.boxHeight = this.lineHeight * Math.max(this.data.functionInputs.length, this.data.functionOutputs.length);
        this.boxWidth = 0.3;

        // Add to the entity's class list.
        this.el.setAttribute('geometry', {
            primitive: 'box',
            width: this.boxWidth,
            height: this.boxHeight,
            depth: 0.1
        });

        this.el.setAttribute('material', {
            color: '#FCA044',
            transparent: true,
            opacity: 0.8
        });

        // Initiate plugs.
        let i: number = 0;
        for (const inputName of this.data.functionInputs) {
            const behavior: string = this.data.behaviorInputs[i];
            const type: string = this.data.typeInputs[i];
            this.createOnePlug(inputName, type, behavior, this.boxHeight/2 - this.lineHeight*(i+0.5), true);
            if (this.data.functionInputs.length >= 1)
                this.createPipe(new THREE.Vector3(-this.boxWidth/2, this.boxHeight/2 - this.lineHeight*(i+0.5), 0), new THREE.Vector3(this.boxWidth/2, this.boxHeight/2 - this.lineHeight/2, 0));
            i++;
        }

        // Initiate output.
        let j: number = 0;
        for (const outputName of this.data.functionOutputs) {
            const behavior: string = this.data.behaviorOutputs[j];
            const type: string = this.data.typeOutputs[j];
            this.createOnePlug(outputName, type, behavior, this.boxHeight/2 - this.lineHeight*(j+0.5), false);
            if (this.data.functionOutputs.length >= 1)
                this.createPipe(new THREE.Vector3(-this.boxWidth/2, this.boxHeight/2 - this.lineHeight/2, 0), new THREE.Vector3(this.boxWidth/2, this.boxHeight/2 - this.lineHeight*(j+0.5), 0));
            j++;
        }

        // Initiate operator name.
        const textEntity: any = document.createElement('a-entity');
        this.el.appendChild(textEntity);
        this.createTextEntity(textEntity, this.data.functionName, new THREE.Vector3(0, this.boxHeight/2 + 0.05, 0));
    },

    // Create a plug for a certain input
    createOnePlug: function(_inputName: string, _type: string, _behavior: string,  _yOffset: number, _input: boolean): void {
        // Create a plug first.
        const plug: any = document.createElement('a-entity');
        this.el.appendChild(plug);
        plug.classList.add('connectable');

        console.log(_type);
        switch (_type) {
            case 'boolean': {
                plug.setAttribute('geometry', {
                    primitive: 'cone',
                    height: 0.03,
                    radiusTop: 0,
                    radiusBottom: 0.05
                });
                if (_input)
                    plug.object3D.rotation.set(0, 0, THREE.Math.degToRad(90));
                else 
                    plug.object3D.rotation.set(0, 0, THREE.Math.degToRad(-90));
                break;
            }
            case 'object': {
                plug.setAttribute('geometry', {
                    primitive: 'sphere',
                    radius: 0.02,
                });
                break;
            }
            case 'vector3': {
                plug.setAttribute('geometry', {
                    primitive: 'cylinder',
                    height: 0.03,
                    radius: 0.02
                });
                if (_input)
                    plug.object3D.rotation.set(0, 0, THREE.Math.degToRad(90));
                else 
                    plug.object3D.rotation.set(0, 0, THREE.Math.degToRad(-90));
                break;
            }
            case 'number': {
                plug.setAttribute('geometry', {
                    primitive: 'box',
                    width: 0.03,
                    height: 0.03,
                    depth: 0.03
                });
                break;
            }
            case 'any': {
                plug.setAttribute('geometry', {
                    primitive: 'box',
                    width: 0.03,
                    height: 0.03,
                    depth: 0.15
                });
                break;
            }
        }

        let unselectedColor: string = '#ffffff';
        let hoveredColor: string = 'yellow';

        if (_behavior === 'signal') {
            unselectedColor = '#78C13B';
            hoveredColor = '#3A940E';
        }
            
        if (_behavior === 'event') {
            unselectedColor = '#FC7391';
            hoveredColor = '#FB3862';
        }
            
        plug.setAttribute('material', 'color', unselectedColor);
        plug.addEventListener('raycaster-intersected', (event) => {
            plug.setAttribute('material', 'color', hoveredColor);
        });

        plug.addEventListener('raycaster-intersected-cleared', (event) => {
            plug.setAttribute('material', 'color', unselectedColor);
        });
        // Set up plug position.
        if (_input)
            plug.object3D.position.set(-this.boxWidth/2, _yOffset, 0);
        else
            plug.object3D.position.set(this.boxWidth/2, _yOffset, 0);

        // Create plug description.
        const plugDescription: any = document.createElement('a-entity');
        plug.appendChild(plugDescription);

        plugDescription.setAttribute('text', {
            value: _inputName,
            side: 'double',
            wrapCount: 70,
            align: 'center',
            color: '#ffffff'
        });

        if (_input)
            plugDescription.object3D.position.set(0.06, 0, 0.05);
        else 
            plugDescription.object3D.position.set(-0.06, 0, 0.05);
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
            geometry.center();
            const b_geometry = new THREE.BufferGeometry().fromGeometry( geometry );
            const material = new THREE.MeshBasicMaterial({color: 0xffffff, opacity: 0.8, transparent: true});
            var mesh = new THREE.Mesh( b_geometry, material );
            _textEntity.setObject3D('mesh', mesh);
            _textEntity.object3D.position.copy(_pos.clone());

        } );
    }

});

export default operatorModel;