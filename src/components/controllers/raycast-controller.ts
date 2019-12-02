import * as AFRAME from 'aframe'
import {Vector3} from 'three'

export const raycastController = AFRAME.registerComponent('raycast-controller', {
    schema: {
        hand: {type: 'string', default: ''}
    },

    init: function(): void {
        if (this.data.hand == 'right') {
            this.el.setAttribute('raycaster', {
                origin: new Vector3(0, -0.01, 0),
                direction: new Vector3(0, -0.8, -1), 
                showLine: true,
                objects: '.movable, .ui, .line, .canvasObj, .connectable, .Arrow, .Switch, .Slider',
                far: 5
            });
        }
        if (this.data.hand == 'left') {
            this.el.setAttribute('raycaster', {
                origin: new Vector3(0, -0.01, 0),
                direction: new Vector3(0, -0.8, -1), 
                showLine: true,
                objects: '.movable, .ui, .line, .canvasObj, .connectable, .Arrow, .Switch, .Slider',
                far: 5
            });
        }
        
        this.el.setAttribute('line', 'color', 'red');
    }
});