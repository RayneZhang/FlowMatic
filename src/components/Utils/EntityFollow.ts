import * as AFRAME from 'aframe'

const entityFollow = AFRAME.registerComponent('entity-follow', {
    schema: {
        targetEntity: {type: 'selector', default: null},
    },

    init: function(): void {
        this.el.object3D.position.copy(this.data.targetEntity.object3D.position);
    },

    tick: function(time, timeDelta): void {
        if (this.data.targetEntity.object3D.position){
            this.el.object3D.position.copy(this.data.targetEntity.object3D.position);
            this.el.object3D.rotation.copy(this.data.targetEntity.object3D.rotation);
        }
        else
            console.log("Target empty!");
    }
});

export default entityFollow;