import * as AFRAME from 'aframe'
import { scene, Node, ObjNode } from 'frp-backend'
import { objects, L_CONTROLLER, R_CONTROLLER, HEADSET } from '../../Objects';
import { Vector3 as THREEVector3} from 'three'

export const avatarNodeUpdate = AFRAME.registerComponent('avatar-node-update', {
    schema: {
        name: {type: 'string', default: ''},
    },

    init: function(): void {
        if (this.data.name === R_CONTROLLER) { this.targetEntity = document.querySelector('#rightHand'); this.props = objects.Avatars[2].outputs; }
        else if (this.data.name === L_CONTROLLER) { this.targetEntity = document.querySelector('#leftHand'); this.props = objects.Avatars[1].outputs; }
        else if (this.data.name === HEADSET) { this.targetEntity = document.querySelector('#head'); this.props = objects.Avatars[0].outputs; }
        else { console.log(`AvatarNodeUpdate initiation cannot find target entity.`); return; }

        this.targetEntity.object3D.updateMatrix();
        this.targetEntity.object3D.updateWorldMatrix();
        const worldPos = this.targetEntity.object3D.localToWorld(new THREEVector3(0, 0, 0));
        
        const initOutputs = this.props.map((o) => {
            if (o.name === 'object')
                o['default'] = `node-${Node.getNodeCount()}`;
            if (o.name === 'position')
                o['default'] = worldPos;
            return o;
        });
        const objNode = scene.addObj(this.data.name, initOutputs);
        this.el.setAttribute('id', objNode.getID());

        // Read label and bind button events to updates.
        if (this.data.name === R_CONTROLLER) {
            this.targetEntity.addEventListener('triggerdown', (event) => {
                objNode.update('triggerdown', true);
                objNode.update('triggerdown', false);
            });
            // objNode.pluckOutput('triggerdown').subscribe((value) => {
            //     console.log(`${objNode.getLabel()} trigger is now: `, value);
            // });
        }
    },

    tick: function(time, timeDelta): void {
        
    }
});