import * as AFRAME from 'aframe';
import { Math as THREEMath, ShaderMaterial, Mesh, TextureLoader } from 'three';
import { objects } from '../../Objects';
import { Item } from './Canvas';
import { resize } from '../../utils/SizeConstraints';
import { setAppStatus } from '../../utils/App';
declare const THREE:any;

// The sub-menu elements' names in the 3D obj.
const subEntitiesNames: string[] = ['huecursor', 'hue', 'currentcolor', 'description', 'button1', 'button2', 'button3', 'button4', 'button5', 'button6', 'button7', 'button8', 'button9', 'run', 'stop', 'prev', 'next'];
const NotReactUI: string[] = ["hue", "huecursor", "currentcolor", "menu", "description", "run", "stop"];

const paletteMenu = AFRAME.registerComponent('palette-menu', {
    schema: {
        selectedButtonId: {type: 'number', default: 0},
        pageNumber: {type: 'number', default: 0}
    },

    init: function(): void {        
        // Create a menu entity and append it to the controller.
        const menuEntity: any = this.menuEl = document.createElement('a-entity');
        menuEntity.setAttribute('id', 'palette-menu');
        this.el.appendChild(menuEntity);
        
        // Set the visibility of the menu entity as false at the beginning.
        // menuEntity.object3D.visible = false;

        // Adjust the position offset of the palette menu.
        menuEntity.object3D.position.set(0, 0, -0.15);
        
        this.createSubEntity();
        this.initTextLabel();
        this.initInstanceDescription();
        this.loadItems(0);

        // Event Listener to open and close menu.
        const listeningEl = document.querySelector('#leftHand');
        listeningEl.addEventListener('xbuttondown', this.onXButtonDown.bind(this));
    },

    // ==========For internal call only.==========

    // Create sub entities, setting geometry and material. 
    createSubEntity(): void {
        for (const subEntityName of subEntitiesNames) {
            // Create sub-menu entity.
            const subMenuEl: any = document.createElement('a-entity');
            this.menuEl.appendChild(subMenuEl);
            subMenuEl.setAttribute('id', subEntityName);
            subMenuEl.setAttribute('class', 'ui');
            subMenuEl.setAttribute('gltf-part', {
                src: '#palette-menu-gltf',
                part: subEntityName
            });

            
            // Initiate material according to widget name.
            switch (subEntityName) {
                case 'currentcolor': {
                    subMenuEl.setAttribute('material', {
                        color: '#ffffff',
                        flatShading: true,
                        shader: 'flat',
                        transparent: true
                    });
                    break;
                }

                case 'huecursor': {
                    subMenuEl.setAttribute('material', {
                        color: '#ffffff',
                        flatShading: true,
                        shader: 'flat',
                        transparent: true,
                        fog: false,
                        src: '#uinormal'
                    });
                    subMenuEl.addEventListener('object3dset', (event) => {
                        var texture = new THREE.TextureLoader().load('#uinormal');
                        const material = new THREE.MeshStandardMaterial({
                            color: '#ffffff',
                            flatShading: true,
                            transparent: true,
                            fog: false,
                            map: '#uinormal'
                          });
                      
                          const mesh = subMenuEl.getObject3D('mesh');
                          if (mesh) {
                              mesh.material = material;
                              console.log(material);
                              console.log(mesh);
                          }
                    });
                    
                    break;
                }

                case 'hue': {
                    subMenuEl.addEventListener('object3dset', (event) => {
                        subMenuEl.setAttribute('material', {
                            flatShading: true,
                            shader: 'flat',
                            transparent: true,
                            src: '#uinormal'
                        }); 
                        initColorWheel(subMenuEl);
                    });
                    break;
                }

                case 'stop': {
                    subMenuEl.setAttribute('material', 'color', '#F10310');

                    subMenuEl.addEventListener('clicked', () => {
                        // When run button is clicked
                        subMenuEl.setAttribute('material', 'color', '#F10310');

                        // Set run button back to normal
                        const runEl: any = document.querySelector('#run');
                        runEl.setAttribute('material', 'color', '#22313f');

                        // Set App status
                        setAppStatus(false);
                    });
                    break;
                }

                case 'run': {
                    subMenuEl.setAttribute('material', 'color', '#22313f');

                    subMenuEl.addEventListener('clicked', () => {
                        // When run button is clicked
                        subMenuEl.setAttribute('material', 'color', '#00B800');

                        // Set stop button back to normal
                        const stopEl: any = document.querySelector('#stop');
                        stopEl.setAttribute('material', 'color', '#22313f');

                        // Set App status
                        setAppStatus(true);
                    });
                    break;
                }

                default: {
                    subMenuEl.setAttribute('material', 'color', '#22313f');
                    break;
                }
            }

            if (subEntityName.indexOf('button') != -1) 
                subMenuEl.classList.add('instance');
            
            subMenuEl.addEventListener('raycaster-intersected', (event) => {
                event.stopPropagation();
                
                if (NotReactUI.indexOf(subEntityName) === -1) {
                    // Set responsive color.
                    subMenuEl.setAttribute('material', 'color', '#22a7f0'); 
                    // Set description value.
                    if (subMenuEl.classList.contains('instance')) {
                        const buttonId: number = Number(subEntityName.substr(-1, 1)) - 1;
                        this.setInstanceDescription(buttonId);
                    }
                }
            })

            subMenuEl.addEventListener('raycaster-intersected-cleared', (event) => {
                event.stopPropagation();
                
                const selectedButtonId: number = this.data.selectedButtonId;
                if (NotReactUI.indexOf(subEntityName) === -1 && 
                subEntityName != 'button' + String(selectedButtonId+1)) {
                    subMenuEl.setAttribute('material', 'color', '#22313f');
                    this.setInstanceDescription(selectedButtonId);
                }
            })
        }
    },

    // Load description of run & stop button.
    initTextLabel(): void {
        const runLabel: any = document.createElement('a-entity');
        const runEl: any = document.querySelector("#run");
        const stopLabel: any = document.createElement('a-entity');
        const stopEl: any = document.querySelector("#stop");
        runEl.appendChild(runLabel);
        stopEl.appendChild(stopLabel);

        // Initiate tht panel content.
        runLabel.setAttribute('text', {
            value: 'Run',
            wrapCount: 150,
            align: 'center'
        });
        // Initiate tht panel content.
        stopLabel.setAttribute('text', {
            value: 'Stop',
            wrapCount: 150,
            align: 'center'
        });

        // Set the description rotation.
        runLabel.object3D.rotation.x += THREEMath.degToRad(-90);
        stopLabel.object3D.rotation.x += THREEMath.degToRad(-90);
        // Set the description position.
        runLabel.object3D.position.set(-0.21, 0, 0.1);
        stopLabel.object3D.position.set(-0.125, 0, 0.1);
    },

    // Load description of thumbnails panel.
    initInstanceDescription(): void {
        // Create thumbnail description entity.
        const descripText: any = document.createElement('a-entity');
        const descripEl: any = document.querySelector("#description");
        descripEl.appendChild(descripText);
        descripText.setAttribute('id', "description_text");

        // Initiate tht panel content.
        descripText.setAttribute('text', {
            value: '',
            wrapCount: 120,
            align: 'center'
        });

        // Set the description rotation.
        descripText.object3D.rotation.x += THREEMath.degToRad(-90);
        // Set the description position.
        descripText.object3D.position.set(-0.167, 0, -0.1);

        // Set the value of the description.
        this.setInstanceDescription(this.data.selectedButtonId);
    },

    // Load the thumbnails of the items to chose from.
    loadItems(pageNum: number): void {
        // Remove previous items.
        let listEl: any = document.querySelector('#items-list');
        if (listEl) {
            listEl.parentNode.removeChild(listEl);
            listEl.destroy();
        }

        // Put all items under one entity for the sake of deleting and regenerating.
        listEl = document.createElement('a-entity');
        this.menuEl.appendChild(listEl);
        listEl.setAttribute('id', "items-list");

        const xOffset: number = 0.05;
        const yOffset: number = 0;
        const zOffset: number = 0.05;
        for (let i=0; i<9; i++) {
            if (this.data.pageNumber == Math.floor(objects['Models'].length/9) && (pageNum*9 + i) >= objects['Models'].length%9) {
                break;
            }
            // Create the item.
            const itemEl: any = document.createElement('a-entity');
            listEl.appendChild(itemEl);
            itemEl.object3D.position.set(-0.217 + xOffset*(i%3), 0.025 + yOffset*(i%3), -0.05 + zOffset*Math.floor(i/3));
            itemEl.setAttribute('id', 'instance-'+i);
            this.loadModelInstance(itemEl, pageNum*9 + i);
        }

    },

    // Load the model thumbnail of the model i to be displayed in containers.
    loadModelInstance(_itemEl: any, _itemId: number): void {
        const instance: Item = objects['Models'][_itemId];

        if (instance.type === 'primitive') {
            _itemEl.setAttribute('geometry', 'primitive', instance.name);
            _itemEl.object3D.scale.set(0.02, 0.02, 0.02);
        }
        else {
            _itemEl.setAttribute('obj-model', 'obj', instance.itemUrl);
            // Resize the model into item size
            _itemEl.addEventListener('model-loaded', () => {
                resize(_itemEl, 0.05);
            });
        }
        
        _itemEl.object3D.rotation.set(THREEMath.degToRad(-90), 0, 0);
        _itemEl.setAttribute('material', {
            color: '#87ceeb',
            transparent: true,
            fog: false,
            opacity: 0.8
        });
    },

    // The listener when x-button is down.
    onXButtonDown(event): void {
        this.menuEl.object3D.visible = !this.menuEl.object3D.visible;
    },

    // ==========Also for external call.==========
    // Set description of the panel.
    setInstanceDescription(_buttonId: number): void {
        const thumbDescripEl: any = document.querySelector('#description_text');
        const instance: Item = objects['Models'][_buttonId + this.data.pageNumber];
        if (!instance) {
            return;
        }
        else
            thumbDescripEl.setAttribute('text', 'value', instance.name);
    },
    
    // Set the selected button id.
    setSelectedButtonId: function(_buttonId: number): void {
        // Check if selected button id is out of range.
        if (this.data.pageNumber == objects['Models'].length/9 && _buttonId >= objects['Models'].length%9) {
            return;
        }

        if (this.data.selectedButtonId >= 0) {
            // Manually raycaster intersected cleared.
            const lastSelectedButton: any = document.querySelector('#button' + String(this.data.selectedButtonId+1));
            lastSelectedButton.setAttribute('material', 'color', '#22313f');
        }
        this.data.selectedButtonId = _buttonId;
        this.setInstanceDescription(_buttonId);
        
        // Add responsive color to the button.
        const currentSelectedButton: any = document.querySelector('#button' + String(this.data.selectedButtonId+1));
        currentSelectedButton.setAttribute('material', 'color', '#22a7f0');

        // Pass the id for left hand to create the corresponding object.
        const instance: Item = objects['Models'][this.data.pageNumber * 9 + _buttonId];
        const rightHand: any = document.querySelector('#rightHand');
        rightHand.setAttribute('right-abutton-listener', 'targetModel', instance.name);
    },

    // Set current color for reference (call by other component).
    setCurrentColor(_color: string): void {
        const currentColor: any = document.querySelector('#currentcolor');
        currentColor.setAttribute('material', 'color', _color);
        if (this.data.pageNumber === 0) {
            for (let i: number = 0; i < 6; i++) {
                const ins: any = document.querySelector('#instance-'+i);
                ins.setAttribute('material', 'color', _color);
            }
        }
    }
});

function initColorWheel(hueEl: any): void {
    const vertexShader = '\
      varying vec2 vUv;\
      void main() {\
        vUv = uv;\
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\
        gl_Position = projectionMatrix * mvPosition;\
      }\
      ';

    const fragmentShader = '\
      #define M_PI2 6.28318530718\n \
      uniform float brightness;\
      varying vec2 vUv;\
      vec3 hsb2rgb(in vec3 c){\
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, \
                           0.0, \
                           1.0 );\
          rgb = rgb * rgb * (3.0 - 2.0 * rgb);\
          return c.z * mix( vec3(1.0), rgb, c.y);\
      }\
      \
      void main() {\
        vec2 toCenter = vec2(0.5) - vUv;\
        float angle = atan(toCenter.y, toCenter.x);\
        float radius = length(toCenter) * 2.0;\
        vec3 color = hsb2rgb(vec3((angle / M_PI2) + 0.5, radius, brightness));\
        gl_FragColor = vec4(color, 1.0);\
      }\
      ';

    const material = new THREE.ShaderMaterial({
      uniforms: { brightness: { type: 'f', value: 1.0 } },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
    });

    const mesh = hueEl.getObject3D('mesh');

    if (mesh) {
        mesh.material = material;
    }
}

export default paletteMenu;