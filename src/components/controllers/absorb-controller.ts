import { Vector3 as THREEVector3 } from 'three';
import { canvasConstraint, itemSize } from '../ui/Canvas';
declare const THREE:any;

const absorbController = {
    schema: {
        hand: {type: 'string', default: ''}
    },

    init: function(): void {
        this.originEl = null;
        this.originPos = null;
        this.targetEntity = null;
        this.container = null;
        this.containerList = [];
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

                this.containerList.forEach((el: any) => {
                    el.object3D.updateMatrix();
                    el.object3D.updateWorldMatrix();
                    const fromPos = el.object3D.position.clone();
                    el.setAttribute('animation__3', {
                        property: "position",
                        from: {x: fromPos.x, y: fromPos.y, z: fromPos.z},
                        to: {x: this.originPos.x, y: this.originPos.y, z: this.originPos.z},
                        dur: 2000
                    });
                });

                this.targetEntity.addEventListener('animationcomplete', (event) => {
                    this.originEl = null;
                    this.originPos = null;
                    this.targetEntity = null;
                    this.container = null;
                    this.containerList = [];
                    this.offsets = [];
                });
            }
        });
        this.el.addEventListener('thumbdownstart', (event) => {
            this.targetEntity = rightHand.components['right-grip-listener'].data.grabbedEl;
            if (this.targetEntity && this.targetEntity.classList.contains('canvasObj')) {
                this.containerList.push(this.targetEntity);
                // Start absorbing
                if (!this.originEl) {
                    this.targetEntity.object3D.updateMatrix();
                    this.targetEntity.object3D.updateWorldMatrix();
                    const fromPos = this.targetEntity.object3D.localToWorld(new THREEVector3(0, 0, 0));
                    const localFromPos = this.targetEntity.object3D.position.clone();
                    this.originPos = localFromPos.clone();
                    this.originEl = document.createElement('a-entity');
                    this.el.sceneEl.appendChild(this.originEl);
                    this.originEl.setAttribute('position', {
                        x: fromPos.x,
                        y: fromPos.y,
                        z: fromPos.z
                    });
                    this.offsets.push({x: 0, y: 0, z: 0});
                    // this.targetEntity.parentNode.removeChild(this.targetEntity);
                    // this.originEl.appendChild(this.targetEntity);
                    // this.targetEntity.setAttribute('position', {
                    //     x: 0,
                    //     y: 0,
                    //     z: 0
                    // });

                    rightHand.object3D.updateMatrix();
                    rightHand.object3D.updateWorldMatrix();
                    const toPos: any = rightHand.object3D.localToWorld(new THREEVector3(0, 0, 0));
                    const localToPos = this.targetEntity.parentNode.object3D.worldToLocal(toPos);
                    console.log(fromPos);
                    console.log(toPos);
                    // Start moving
                    this.targetEntity.setAttribute('animation', {
                        property: "position",
                        from: {x: localFromPos.x, y: localFromPos.y, z: localFromPos.z},
                        to: {x: localToPos.x, y: localToPos.y, z: localToPos.z},
                        dur: 2000
                    });
                    this.targetEntity.setAttribute('animation__2', {
                        property: "scale",
                        from: {x: 1, y: 1, z: 1},
                        to: {x: 0.3, y: 0.3, z: 0.3},
                        dur: 2000
                    });

                    this.targetEntity.classList.remove('canvasObj');
                    this.targetEntity.classList.remove('movable');

                    this.container = document.createElement("a-entity");
                    this.targetEntity.parentNode.appendChild(this.container);
                    this.container.setAttribute('geometry', {
                        primitive: 'box',
                        width: 0.5,
                        height: 0.3,
                        depth: 0.1
                    });
                    this.container.setAttribute('material', {
                        color: '#FCA044',
                        transparent: true,
                        opacity: 0.5
                    });
                    this.container.object3D.position.copy(localToPos.clone());
                    this.container.classList.add('container');
                    this.container.classList.add('canvasObj');
                    this.container.classList.add('movable');
                    this.targetEntity.addEventListener('animationcomplete', (event) => {
                        // this.container.attach(this.targetEntity);
                    });
                }
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
                        to: {x: localToPos.x + offset.x / 4, y: localToPos.y + offset.y / 4, z: localToPos.z + offset.z / 4},
                        dur: 2000
                    });
                    this.targetEntity.setAttribute('animation__2', {
                        property: "scale",
                        from: {x: 1, y: 1, z: 1},
                        to: {x: 0.3, y: 0.3, z: 0.3},
                        dur: 2000
                    });
                    this.targetEntity.classList.remove('canvasObj');
                    this.targetEntity.classList.remove('movable');

                    this.targetEntity.addEventListener('animationcomplete', (event) => {
                        // this.container.appendChild(this.targetEntity);
                    });

                }
            }
        });

        this.el.addEventListener('thumbend', (event) => {
            
        });
    }
}

export default absorbController;