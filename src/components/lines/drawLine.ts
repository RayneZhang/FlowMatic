import * as MeshLine from "three.meshline";

declare const THREE:any;

// import * as LineSegmentsGeometry from "../../libs/lines/LineSegmentsGeometry";
// import * as LineGeometry from "../../libs/lines/LineGeometry";
// import * as WireframeGeometry2 from "../../libs/lines/WireframeGeometry2";
// import * as LineMaterial from "../../libs/lines/LineMaterial";
// import * as LineSegments2 from "../../libs/lines/LineSegments2";
// import * as Line2 from "../../libs/lines/Line2";


const drawLine = {
    init: function(): void {
        // const geometry = new THREE.Geometry();
        // geometry.vertices.push(new THREE.Vector3(-1.0, 1.0, -3.0));
        // geometry.vertices.push(new THREE.Vector3(1.0, 1.0, -3.0));
        // const line = new MeshLine.MeshLine();
        // line.setGeometry(geometry, function( p ) { return 2; } );

        // const material = new MeshLine.MeshLineMaterial({
        //     color: new THREE.Color(0xff0000),
        //     lineWidth: 5.0
        // });
        // const linemesh = new THREE.Mesh(line.geometry, material);


        // const materialregular = new THREE.LineBasicMaterial({
        //     color: 0x0000ff
        // });
        // const lineregular = new THREE.Line(geometry, materialregular);

        // this.el.setObject3D('mesh', linemesh);

        // console.log(this.el.getObject3D('mesh'));
        
        
        // this.resolution = new THREE.Vector2 ( window.innerWidth, window.innerHeight ) ;
    
	    // var sceneEl = this.el.sceneEl;
	    // sceneEl.addEventListener( 'loaded', (event) => {
        //     var canvas = this.el.sceneEl.canvas;
        //     this.resolution.set( canvas.width,  canvas.height );
        //     var line = new THREE.Geometry();
        //     line.vertices.push( new THREE.Vector3( -1, 1, -3 ) );
        //     line.vertices.push( new THREE.Vector3( 1, 1, -3 ) );

        //     var g = new MeshLine.MeshLine();
        //     g.setGeometry( line );
        
        //     var material = new MeshLine.MeshLineMaterial( {
        //         useMap: false,
        //         color: new THREE.Color(0x000000),
        //         opacity: 1,
        //         resolution: this.resolution,
        //         lineWidth: 1
        //     });
        //     var mesh = new THREE.Mesh( g.geometry, material );
        //     this.el.setObject3D('mesh', mesh);        
        // });




        // Position and Color Data
        var positions = [];
        var colors = [];
        // var points = THREE.hilbert3D( new THREE.Vector3( 0, 0, 0 ), 20.0, 1, 0, 1, 2, 3, 4, 5, 6, 7 );
        // var spline = new THREE.CatmullRomCurve3( points );
        // var divisions = Math.round( 12 * points.length );
        // var color = new THREE.Color();
        // for ( var i = 0, l = divisions; i < l; i ++ ) {
        //     var point = spline.getPoint( i / l );
        //     positions.push( point.x, point.y, point.z );
        //     color.setHSL( i / l, 1.0, 0.5 );
        //     colors.push( color.r, color.g, color.b );
        // }

        positions.push(-1, 1, -3);
        positions.push(1, 1, -3);
        colors.push(0, 0, 0);
        colors.push(0, 0, 0);

        // THREE.Line2 ( LineGeometry, LineMaterial )
        var geometry = new THREE.LineGeometry();
        geometry.setPositions( positions );
        geometry.setColors( colors );
        var matLine = new THREE.LineMaterial( {
            color: 0xffffff,
            linewidth: 5, // in pixels
            vertexColors: THREE.VertexColors,
            //resolution:  // to be set by renderer, eventually
            dashed: false
        } );
        var line = new THREE.Line2( geometry, matLine );
        line.computeLineDistances();
        line.scale.set( 1, 1, 1 );
        this.el.setObject3D('mesh', line); 
    },

    tick: function(time, timeDelta): void {
        
    }
}



export default drawLine;