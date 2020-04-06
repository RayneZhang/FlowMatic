import * as AFRAME from 'aframe'
declare const THREE:any;

const entityFollow = AFRAME.registerComponent('entity-follow', {
    schema: {
        targetEntity: {type: 'selector', default: null},
    },

    init: function(): void {
        this.curPos = this.data.targetEntity.object3D.position.clone();
        // this.el.object3D.position.copy(this.data.targetEntity.object3D.position);
    },

    tick: function(time, timeDelta): void {
        if (this.data.targetEntity){
            this.el.object3D.position.add(this.data.targetEntity.object3D.position.clone().sub(this.curPos));
            this.el.object3D.rotation.copy(this.data.targetEntity.object3D.rotation);
            this.curPos = this.data.targetEntity.object3D.position.clone();
            if (this.el.getAttribute('id') == 'sword') {
                this.data.targetEntity.object3D.updateMatrix();
                this.data.targetEntity.object3D.updateWorldMatrix();
                const worldPos = this.data.targetEntity.object3D.localToWorld(new THREE.Vector3(0, 0, 0));
                this.el.object3D.position.copy(worldPos.clone());
                this.el.object3D.rotateX(THREE.Math.degToRad(-90));
                this.el.object3D.rotateZ(THREE.Math.degToRad(45));
            }
        }
        // else
        //     console.log("Target empty!");
    }
});

export default entityFollow;