import { getIntersectedEl, getIntersections } from '../../utils/raycast'
import { Object3D, Mesh, Material, MeshBasicMaterial} from 'three'

const rightGripListener = {
    schema: {
        followingEl: {type: 'selector', default: null},
        gripping: {type: 'boolean', default: false},
        weaponEl: {type: 'selector', default: null}
    },

    init(): void {

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
            this.localPosition = this.el.object3D.worldToLocal(intersectedEl.object3D.position.clone());

            // Set the intersected object as the following object.
            this.data.followingEl = intersectedEl;
        });

        this.el.addEventListener('gripup', (event) => {
            this.data.gripping = false;

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

            this.el.setAttribute('right-grip-listener', {followingEl: null, gripping: 'false', weaponEl: null});
        });
    },

    tick(time, timeDelta): void {
        const gripping = this.data.gripping;
        const followingEl = this.data.followingEl;

        if (gripping && followingEl) {
            this.el.object3D.updateMatrix();
            this.el.object3D.updateMatrixWorld();
            const updatedTargetPosition: any = this.el.object3D.localToWorld(this.localPosition.clone());

            // Modify position at three.js level for better performance. (Better than setAttribute)
            followingEl.object3D.position.set(updatedTargetPosition.x, updatedTargetPosition.y, updatedTargetPosition.z);
        }

    }
}

export default rightGripListener;