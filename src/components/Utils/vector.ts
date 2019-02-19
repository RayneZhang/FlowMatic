import * as AFRAME from 'aframe'
declare const THREE:any;

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

        this.setAxis();
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
            height: 0.1,
            radius: 0.005,
        }); 
    },

    setAxis: function(): void {
        const xAxis: any = document.createElement('a-entity');
        const yAxis: any = document.createElement('a-entity');
        const zAxis: any = document.createElement('a-entity');
        this.el.appendChild(xAxis);
        this.el.appendChild(yAxis);
        this.el.appendChild(zAxis);

        xAxis.setAttribute('geometry', {
            primitive: 'cylinder',
            height: 0.1,
            radius: 0.005,
        });
        xAxis.object3D.position.set(0.05, 0, 0);
        xAxis.object3D.rotation.set(0, 0, THREE.Math.degToRad(90));

        yAxis.setAttribute('geometry', {
            primitive: 'cylinder',
            height: 0.1,
            radius: 0.005,
        });
        yAxis.object3D.position.set(0, 0.05, 0);

        zAxis.setAttribute('geometry', {
            primitive: 'cylinder',
            height: 0.1,
            radius: 0.005,
        });
        zAxis.object3D.position.set(0, 0, 0.05);
        zAxis.object3D.rotation.set(THREE.Math.degToRad(90), 0, 0);
    }
});

export default vector;