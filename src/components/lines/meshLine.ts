// This file provides bindings between states and components.
// This component subscribes to the store to update the scene on every change.

import * as AFRAME from 'aframe'
import { MeshLine, MeshLineMaterial} from 'three.meshline'
declare const THREE:any;

const meshLine = AFRAME.registerComponent('meshline', {
    schema: {
        objects: {type: 'array', default: []}
    },

    init: function(): void {
        var geo = new Float32Array( 6 * 3 );
        for( var j = 0; j < geo.length; j += 3 ) {
            geo[ j ] = geo[ j + 1 ] = geo[ j + 2 ] = j;
        }

        var g = new MeshLine();
        g.setGeometry( geo, function( p ) { return p; } );

        var material = new MeshLineMaterial({
            color: new THREE.Color( new THREE.Color( 'red' ) ),
		    lineWidth: 2
        });

        var mesh = new THREE.Mesh( g.geometry, material ); // this syntax could definitely be improved!
        mesh.geo = geo;
	    mesh.g = g;


        this.el.setObject3D('mesh', mesh); 
    }
});

export default meshLine;