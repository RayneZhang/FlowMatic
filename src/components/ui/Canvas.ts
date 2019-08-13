import * as AFRAME from 'aframe';

export const canvasSize = {
    width: 1.6, 
    height: 1
};

export const canvasColor = {
    background: '#292827',
    unselected: '#252423',
    hovered: '#979593',
    selected: '#0078d4'
};

export const canvasGenerator = AFRAME.registerComponent('canvas-generator', {
    schema: {
        
    },

    init: function(): void {
        initCanvasSize(this.el);
    }
});

/**
 * Initiate a plane and specify parameters
 */
function initCanvasSize(el: any): void {
    el.setAttribute('geometry', {
        primitive: 'plane',
        width: canvasSize.width,
        height: canvasSize.height
    });
    el.setAttribute('material', {
        color: canvasColor.background,
        side: 'double'
    });
}
