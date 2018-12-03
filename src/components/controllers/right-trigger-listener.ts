declare const THREE:any;

const rightTriggerListener = {
    init: function(): void {
        this.triggering = false;
        this.lined = false;

        // Handle trigger down.
        this.el.addEventListener('triggerdown', (event) => {
            this.triggering = true;

            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;

            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when triggering');
                return;
            }

            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];

            // Retrieve all intersections through raycaster.
            const intersections = this.el.components.raycaster.intersections;
            if (!Array.isArray(intersections) || !intersections.length) {
                console.log('There is NO intersections when triggering');
                return;
            }

            // Check if the intersected object is ui.
            if (intersectedEl.classList.contains('ui')) {
                console.log('The intersected object is ui.');
                const id = intersectedEl.getAttribute('id');
                switch(id) {
                    case 'hue': case 'huecursor': {
                        // Fetch the intersection point of the first intersected object.
                        const {x, y, z} = intersections[0].point;
                        const WorldPos = new THREE.Vector3(x, y, z);
                        this.onHueDown(WorldPos.clone());
                        break;
                    }
                    case 'box_position_slider_x': case 'box_position_cursor_x': {
                        const {x, y, z} = intersections[0].point;
                        const WorldPos = new THREE.Vector3(x, y, z);
                        this.onPosXCursorDown(WorldPos.clone());
                        break;
                    }
                    case 'box_position_slider_y': case 'box_position_cursor_y': {
                        const {x, y, z} = intersections[0].point;
                        const WorldPos = new THREE.Vector3(x, y, z);
                        this.onPosYCursorDown(WorldPos.clone());
                        break;
                    }
                }
                return;
            }
            
            // Check if we're about to draw a line.
            if (intersectedEl.classList.contains('connectable')) {
                const theLine: any = document.querySelector("#lines");
                const theHand: any = document.querySelector("#rightHand");
                const SP = {x: intersections[0].point.x, y: intersections[0].point.y, z: intersections[0].point.z};
                const EP = {x: theHand.object3D.position.x, y: theHand.object3D.position.y, z: theHand.object3D.position.z};

                theLine.setAttribute('draw-line', 'startPoint', SP);
                theLine.setAttribute('draw-line', 'endPoint', EP);
            }
            
        });

        this.el.addEventListener('triggerup', (event) => {
            this.triggering = false;

            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;

            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when drawing lines');
                return;
            }

            // Retrieve all intersections through raycaster.
            const intersections = this.el.components.raycaster.intersections;
            if (!Array.isArray(intersections) || !intersections.length) {
                console.log('There is NO intersections when triggering');
                return;
            }

            const lineEntity: any = document.querySelector('#lines');

            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];
            if (intersectedEl.classList.contains('connectable')) {
                const EP = {x: intersections[0].point.x, y: intersections[0].point.y, z: intersections[0].point.z};
                lineEntity.setAttribute('draw-line', 'endPoint', EP);
                this.lined = true;

                // Push the id into target.
                const dataSource: any = document.querySelector("#green-bottle");
                const targetEntities: any = ['box'];
                //targetEntities.push('box');
                dataSource.setAttribute('data-source', 'targetEntities', targetEntities);
            }
        });
    },

    tick: function(time, timeDelta): void {
        if (this.triggering && !this.lined) {
            const lineEntity: any = document.querySelector('#lines');
            const CP = {x: this.el.object3D.position.x, y: this.el.object3D.position.y, z: this.el.object3D.position.z};
            lineEntity.setAttribute('draw-line', 'endPoint', CP);

            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;

            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                console.log('Nothing is intersected when drawing lines');
                return;
            }

            // Retrieve all intersections through raycaster.
            const intersections = this.el.components.raycaster.intersections;
            if (!Array.isArray(intersections) || !intersections.length) {
                console.log('There is NO intersections when triggering');
                return;
            }

            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];
            if (intersectedEl.classList.contains('connectable')) {
                const EP = {x: intersections[0].point.x, y: intersections[0].point.y, z: intersections[0].point.z};
                lineEntity.setAttribute('draw-line', 'endPoint', EP);
            }
        }
    },

    onPosYCursorDown: function(position:any) {
        const box: any = document.querySelector('#box');
        const cursor: any = document.querySelector('#box_position_cursor_y');
        const slider: any = document.querySelector('#box_position_slider_y');
        // const sliderBoundingBox = slider.geometry.boundingBox;
        // const sliderWidth = sliderBoundingBox.max.x - sliderBoundingBox.min.x;
        slider.object3D.updateMatrixWorld();
        slider.object3D.worldToLocal(position);

        const distance: number = position.x - cursor.object3D.position.x;
        cursor.object3D.position.x = position.x;
        box.object3D.position.y += distance;
    },

    onPosXCursorDown: function(position:any) {
        const box: any = document.querySelector('#box');
        const cursor: any = document.querySelector('#box_position_cursor_x');
        const slider: any = document.querySelector('#box_position_slider_x');
        // const sliderBoundingBox = slider.geometry.boundingBox;
        // const sliderWidth = sliderBoundingBox.max.x - sliderBoundingBox.min.x;
        slider.object3D.updateMatrixWorld();
        slider.object3D.worldToLocal(position);

        const distance: number = position.x - cursor.object3D.position.x;
        cursor.object3D.position.x = position.x;
        box.object3D.position.x += distance;
    },

    onHueDown: function(position: any) {
        const hueWheel: any = document.querySelector('#hue');
        const hueCursor: any = document.querySelector('#huecursor');
        const radius: number = this.calRadius(hueWheel);

        hueWheel.object3D.updateMatrixWorld();
        const LocalPos = hueWheel.object3D.worldToLocal(position);

        // console.log(LocalPos.x + ',' + LocalPos.y + ',' + LocalPos.z);       
        hueCursor.object3D.position.copy(position);

        const polarPosition = {
            r: Math.sqrt(position.x * position.x + position.z * position.z),
            theta: Math.PI + Math.atan2(-position.z, position.x)
        };
        const angle: number = ((polarPosition.theta * (180 / Math.PI)) + 180) % 360;
        const hsv = {h: angle / 360, s: polarPosition.r / radius, v: 1.0};
        this.updateColor(hsv);
    },

    calRadius: function(hueWheel) {
        // console.log(hueWheel.object3DMap);
        const mesh = hueWheel.getObject3D('mesh');
        // console.log(mesh);
        if (!mesh) {return;}

        const box = new THREE.Box3().setFromObject(mesh);
        const size = box.getSize();
        const extent = Math.max(size.x, size.y, size.z) / 2;
        const radius = Math.sqrt(2) * extent;
        
        return radius;
    },

    updateColor: function(hsv) {
        const rgb: any = this.hsv2rgb(hsv);
        const color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
        
        const leftHand: any = document.querySelector('#leftHand');
        leftHand.setAttribute('left-trigger-listener', 'color', color);
    },

    hsv2rgb: function(hsv) {
        var r, g, b, i, f, p, q, t;
        var h = THREE.Math.clamp(hsv.h, 0, 1);
        var s = THREE.Math.clamp(hsv.s, 0, 1);
        var v = hsv.v;

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        }
        return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
        };
    }
}

export default rightTriggerListener;