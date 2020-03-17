import { Vector3 as THREEVector3 } from 'three';
import * as AFRAME from 'aframe';
import { ctnWidth, ctnDepth } from '../frp/operators/container';

const offsetScale: number = 4;

export const absorbController = AFRAME.registerComponent('absorb-controller', {
    schema: {

    },

    init: function(): void {
        this.originPos = null;
        this.targetEntity = null;
        this.containerEl = null;
        this.containList = [];
        this.offsets = [];

        const rightHand: any = document.querySelector("#rightHand");
        this.el.addEventListener('thumbupstart', (event) => {
            this.targetEntity = rightHand.components['right-grip-listener'].data.grabbedEl;
            if (this.targetEntity && this.targetEntity.classList.contains('container')) {
                // Move back
                this.targetEntity.object3D.updateMatrix();
                this.targetEntity.object3D.updateWorldMatrix();
                const localFromPos = this.targetEntity.object3D.position.clone();

                this.targetEntity.setAttribute('animation', {
                    property: "position",
                    from: {x: localFromPos.x, y: localFromPos.y, z: localFromPos.z},
                    to: {x: this.originPos.x, y: this.originPos.y, z: this.originPos.z},
                    dur: 2000
                });

                this.containList.forEach((el: any, i: number) => {
                    el.object3D.updateMatrix();
                    el.object3D.updateWorldMatrix();
                    const fromPos = el.object3D.position.clone();
                    el.setAttribute('animation__3', {
                        property: "position",
                        from: {x: fromPos.x, y: fromPos.y, z: fromPos.z},
                        to: {x: this.originPos.x + this.offsets[i].x / offsetScale, y: this.originPos.y + this.offsets[i].y / offsetScale, z: this.originPos.z + this.offsets[i].z / offsetScale},
                        dur: 2000
                    });
                });

                this.targetEntity.addEventListener('animationcomplete', (event) => {
                    this.originPos = null;
                    this.targetEntity = null;
                    this.containerEl = null;
                    this.containList = [];
                    this.offsets = [];
                });
            }
        });

        this.el.addEventListener('thumbdownstart', (event) => {
            this.targetEntity = rightHand.components['right-grip-listener'].data.grabbedEl;
            if (this.targetEntity && this.targetEntity.classList.contains('canvasObj')) {
                // this.containList is used for pushing back.
                this.containList.push(this.targetEntity);
                
                // Start absorbing with the first operator
                if (!this.containerEl) {
                    const localFromPos = this.targetEntity.object3D.position.clone();
                    this.originPos = localFromPos.clone();
                    this.offsets.push({x: 0, y: 0, z: 0});

                    // Get the end position - the right hand.
                    rightHand.object3D.updateMatrix();
                    rightHand.object3D.updateWorldMatrix();
                    const worldToPos: any = rightHand.object3D.localToWorld(new THREEVector3(0, 0, 0));
                    const localToPos = this.targetEntity.parentNode.object3D.worldToLocal(worldToPos);

                    // Start moving.
                    this.targetEntity.setAttribute('animation', {
                        property: "position",
                        from: {x: localFromPos.x, y: localFromPos.y, z: localFromPos.z},
                        to: {x: localToPos.x, y: localToPos.y, z: localToPos.z},
                        dur: 2000
                    });
                    // Start scaling.
                    this.targetEntity.setAttribute('animation__2', {
                        property: "scale",
                        from: {x: 1, y: 1, z: 1},
                        to: {x: 0.3, y: 0.3, z: 0.3},
                        dur: 2000
                    });

                    this.targetEntity.classList.remove('canvasObj');
                    this.targetEntity.classList.remove('movable');

                    this.containerEl = document.createElement("a-entity");
                    this.targetEntity.parentNode.appendChild(this.containerEl);
                    this.containerEl.setAttribute('geometry', {
                        primitive: 'box',
                        width: ctnWidth,
                        height: 0.3,
                        depth: ctnDepth
                    });
                    this.containerEl.setAttribute('material', {
                        color: '#FCA044',
                        transparent: true,
                        opacity: 0.5
                    });
                    this.containerEl.object3D.position.copy(localToPos.clone());

                    // Set opList in the op-container.
                    this.containerEl.setAttribute('op-container', null);
                    const opList = this.containerEl.getAttribute('op-container') ? this.containerEl.getAttribute('op-container').opList: [];
                    opList.push(this.targetEntity.getAttribute('id'));
                    this.containerEl.setAttribute('op-container', 'opList', opList);

                    const promise = new Promise( resolver => {
                        const start_time: number = Date.now();
                        const containerEl: any = this.containerEl;
                        const targetEl: any = this.targetEntity;
                        function fetchAttribute() {
                            if (containerEl.getAttribute('op-container')) {
                                // console.log(`Container component got!`);
                                containerEl.emit('opList-update', {el: targetEl}, false);
                                resolver();
                            }
                            else if (Date.now() > start_time + 3000) {
                                console.log(`Time out fetching the container component`);
                            }
                            else {
                                setTimeout(fetchAttribute, 1000);
                            }
                        };
                        fetchAttribute();
                    });

                    this.containerEl.classList.add('container');
                    this.containerEl.classList.add('canvasObj');
                    this.containerEl.classList.add('movable');
                }
                // Start absorbing the next operator
                else {
                    const localFromPos = this.targetEntity.object3D.position.clone();
                    const offset = localFromPos.clone().sub(this.originPos);
                    this.offsets.push({x: offset.x, y: offset.y, z: offset.z});

                    rightHand.object3D.updateMatrix();
                    rightHand.object3D.updateWorldMatrix();
                    const toPos: any = rightHand.object3D.localToWorld(new THREEVector3(0, 0, 0));
                    const localToPos = this.targetEntity.parentNode.object3D.worldToLocal(toPos);

                    // Start moving
                    this.targetEntity.setAttribute('animation', {
                        property: "position",
                        from: {x: localFromPos.x, y: localFromPos.y, z: localFromPos.z},
                        to: {x: localToPos.x + offset.x / offsetScale, y: localToPos.y + offset.y / offsetScale, z: localToPos.z + offset.z / offsetScale},
                        dur: 2000
                    });
                    // Start scaling
                    this.targetEntity.setAttribute('animation__2', {
                        property: "scale",
                        from: {x: 1, y: 1, z: 1},
                        to: {x: 0.3, y: 0.3, z: 0.3},
                        dur: 2000
                    });

                    this.targetEntity.classList.remove('canvasObj');
                    this.targetEntity.classList.remove('movable');

                    const opList = this.containerEl.getAttribute('op-container') ? this.containerEl.getAttribute('op-container').opList: [];
                    opList.push(this.targetEntity.getAttribute('id'));
                    this.containerEl.setAttribute('op-container', 'opList', opList);
                    this.containerEl.emit('opList-update', {el: this.targetEntity}, false);
                }
            }
        });
    }
});