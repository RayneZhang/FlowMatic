import { getIntersectedEl, getIntersections } from '../../utils/raycast';
import { Object3D, Mesh, Math as THREEMath, Vector3 } from 'three';
import { canvasConstraint } from '../ui/Canvas';
import * as AFRAME from 'aframe';
import { getRadius } from '../../utils/SizeConstraints';

export const rightGripListener = AFRAME.registerComponent('right-grip-listener', {
    schema: {
        grabbedEl: {type: 'selector', default: null},
        gripping: {type: 'boolean', default: false},
        weaponEl: {type: 'selector', default: null}
    },

    init(): void {
        const grabbingTips: any = document.querySelector('#grabbing-tips');
        const nonGrabbingTips: any = document.querySelector('#non-grabbing-tips');

        this.el.addEventListener('gripdown', (event) => {
            this.data.gripping = true;
            
           // Fetch the intersected object and intersections
           const intersectedEl = getIntersectedEl(this.el);
           if (!intersectedEl || !intersectedEl.classList.contains('movable')) return;

            if (intersectedEl.classList.contains('weapon')) {
                if (intersectedEl.classList.contains('sword')) {
                    this.data.weaponEl = intersectedEl;
                    intersectedEl.setAttribute('entity-follow', {
                        targetEntity: '#rightHand'
                    });
                    
                    // Access children meshes and modify the opacity.
                    const meshObj: Object3D = this.el.getObject3D('mesh');
                    if (meshObj) {
                        meshObj.children.forEach((child: Mesh) => {
                            const m: any = child.material;
                            m.transparent = true;
                            m.opacity = 0.3;
                        });
                    }
                }
                return;
            }

            this.el.object3D.updateMatrix();
            this.el.object3D.updateMatrixWorld();
            intersectedEl.object3D.updateMatrix();
            intersectedEl.object3D.updateMatrixWorld();
            this.localPosition = this.el.object3D.worldToLocal(intersectedEl.object3D.localToWorld(new Vector3(0, 0, 0)));

            // Set the intersected object as the following object.
            this.data.grabbedEl = intersectedEl;

            // Check if the intersected object is a movable object.
            if (intersectedEl.classList.contains('movable')) {
                const rotateScaleTip: any = document.querySelector('#rotate-scale-tip');
                grabbingTips.setAttribute('visible', true);
                nonGrabbingTips.setAttribute('visible', false);
                if (intersectedEl.classList.contains('canvasObj')) rotateScaleTip.setAttribute('visible', false);
                else {
                    rotateScaleTip.setAttribute('visible', true);
                    showOrHideWireframe(intersectedEl, true);
                }
            }
        });

        this.el.addEventListener('gripup', (event) => {
            if (this.data.grabbedEl && this.data.grabbedEl.classList.contains('movable') && !this.data.grabbedEl.classList.contains('canvasObj')) {
                showOrHideWireframe(this.data.grabbedEl, false);
            }

            grabbingTips.setAttribute('visible', false);
            nonGrabbingTips.setAttribute('visible', true);

            // If the user is holding a weapon...
            if (this.data.weaponEl) {
                this.data.weaponEl.setAttribute('entity-follow', {
                    targetEntity: null
                });
                // Access children meshes and modify the opacity.
                const meshObj: Object3D = this.el.getObject3D('mesh');
                if (meshObj) {
                    meshObj.children.forEach((child: Mesh) => {
                        const m: any = child.material;
                        m.transparent = false;
                        m.opacity = 1;
                    });
                }
            }

            
            this.el.setAttribute('right-grip-listener', {'gripping': false, 'grabbedEl': null, 'weaponEl': null});
        });
    },

    tick(time, timeDelta): void {
        const gripping = this.data.gripping;
        const followingEl = this.data.grabbedEl;

        if (gripping && followingEl) {
            this.el.object3D.updateMatrix();
            this.el.object3D.updateMatrixWorld();
            const updatedTargetPosition: any = this.el.object3D.localToWorld(this.localPosition.clone());

            if (followingEl.classList.contains('canvasObj')) {
                const canvasWorld: any = document.querySelector('#canvas-world');
                canvasWorld.object3D.updateMatrix();
                canvasWorld.object3D.updateMatrixWorld();
                const localCanvasPosition: any = canvasWorld.object3D.worldToLocal(updatedTargetPosition);
                // console.log(localCanvasPosition);
                followingEl.object3D.position.set(THREEMath.clamp(localCanvasPosition.x, canvasConstraint.negx, canvasConstraint.posx), 
                    THREEMath.clamp(localCanvasPosition.y, canvasConstraint.negy, canvasConstraint.posy), 
                    canvasConstraint.constz);
            }
            else {
                followingEl.object3D.position.set(updatedTargetPosition.x, updatedTargetPosition.y, updatedTargetPosition.z);
            }       
        }

    }
});

function showOrHideWireframe(targetEl: any, _show: boolean): void {
    const mesh: Mesh = targetEl.getObject3D('mesh');
    if (!mesh) {
        console.log("The mesh of the selected object is null!");
        return;
    }

    if (_show) {
        const selectionRing: any = document.createElement('a-entity');
        selectionRing.setAttribute('id', 'selection-ring');
        targetEl.appendChild(selectionRing);
        const radius: number = getRadius(targetEl);
        const outerRadius: number = 1.2 * radius / targetEl.object3D.scale.y;
        selectionRing.setAttribute('geometry', {
            primitive: 'torus',
            radiusTubular: 0.001 / targetEl.object3D.scale.y,
            radius: outerRadius
        });
        selectionRing.object3D.rotation.set(THREEMath.degToRad(-90), 0, 0);
    }
    else {
        const selectionRing: any = document.querySelector('#selection-ring');
        selectionRing.parentNode.removeChild(selectionRing);
        selectionRing.destroy();
    }
}