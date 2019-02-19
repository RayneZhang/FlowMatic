import * as AFRAME from 'aframe'

const vector = AFRAME.registerComponent('vector', {
    schema: {
        seqId: {type: 'number', default: 0}
    },

    init: function(): void {
        // Create an entity and append it to the scene.
        let subEntityHead: any = document.createElement('a-entity');
        let subEntityBody: any = document.createElement('a-entity');
        this.el.appendChild(subEntityHead);
        this.el.appendChild(subEntityBody);
        
        // Set up id for the sub-entities.
        subEntityHead.setAttribute('id', 'vector-head' + this.data.seqId);
        subEntityBody.setAttribute('id', 'vector-body' + this.data.seqId);

        this.setGeometry(subEntityHead, subEntityBody);
    },
    
    setGeometry: function(_subEntityHead, _subEntityBody): void {
        _subEntityHead.setAttribute('geometry', {
            primitive: 'cone',
            height: 0.025,
            radiusBottom: 0.01,
            radiusTop: 0
        }); 

        _subEntityBody.setAttribute('geometry', {
            primitive: 'cylinder',
            height: 0.05,
            radius: 0.005,
        }); 
    }
});

export default vector;