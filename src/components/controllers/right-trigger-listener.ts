import store from '../../store'
import { scene } from 'frp-backend'
import { Node } from 'frp-backend'
import { getIntersectedEl, getIntersections } from '../../utils/raycast'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
import { getTypeByColor, getBehaviorByShape, getColorsByType } from '../Utils/typeVis'
import { disableConnectors, enableConnectors } from '../Utils/typeConstraint'
declare const THREE:any;

const rightTriggerListener = {
    schema: {
        
    },

    init: function(): void {
        this.triggering = false;
        this.hueDown = false;
        this.sliding = false;
        this.slidingEl = null;
        this.vector = false;
        this.vectorId = 0;
        this.line = null;
        this.lineId = 0;
        this.curEdgeEntity = null;

        this.clickedEntity = null;

        // Handle trigger down.
        this.el.addEventListener('triggerdown', (event) => {
            this.triggering = true;

            // Fetch the intersected object and intersections
            const intersectedEl = getIntersectedEl(this.el);
            const intersections = getIntersections(this.el);
            if (!intersectedEl || !intersections) return;

            // Emit a "clicked" event on target entity.
            intersectedEl.emit('clicked');
            this.clickedEntity = intersectedEl;

            // Check if the intersected object is ui.
            if (intersectedEl.classList.contains('ui')) {
                const id = intersectedEl.getAttribute('id');
                
                switch(id) {
                    case 'hue': case 'huecursor': {
                        this.hueDown = true;
                        // Fetch the intersection point of the first intersected object.
                        const {x, y, z} = intersections[0].point;
                        const WorldPos = new THREE.Vector3(x, y, z);
                        this.onHueDown(WorldPos.clone());
                        break;
                    }
                }

                return;
            }
            
            // Check if we're about to draw a line.
            if (intersectedEl.classList.contains('connectable')) {
                // Create an edge entity
                const EdgesEntity: any = document.querySelector("#edges");
                this.curEdgeEntity = document.createElement('a-entity');
                EdgesEntity.appendChild(this.curEdgeEntity);
                this.curEdgeEntity.setAttribute('id', 'line-tmp');
                this.curEdgeEntity.setAttribute('line-component');
                
                // Default drawing hand is the right hand
                const rightHand: any = document.querySelector("#rightHand");
                const startP = {x: intersections[0].point.x, y: intersections[0].point.y, z: intersections[0].point.z};
                const endP = {x: rightHand.object3D.position.x, y: rightHand.object3D.position.y, z: rightHand.object3D.position.z};
                this.curEdgeEntity.setAttribute('line-component', 'startPoint', startP);
                this.curEdgeEntity.setAttribute('line-component', 'endPoint', endP);

                // Next we need to find out the from and to entity
                let fromEntity: any = null;
                let fromProp: string = null;
                
                // input/output -> operator.
                if (intersectedEl.parentNode && (intersectedEl.parentNode.classList.contains('operator') || intersectedEl.parentNode.classList.contains('data-filter'))) {
                    fromEntity = intersectedEl.parentNode;
                    if (intersectedEl.firstChild.getAttribute('text')) {
                        fromProp = intersectedEl.firstChild.getAttribute('text').value;
                    }
                }
                // Dot -> prompt -> bottle. For data sources such as bottles.
                if (intersectedEl.parentNode.parentNode && intersectedEl.parentNode.parentNode.classList.contains('data-source')) {
                    fromEntity = intersectedEl.parentNode.parentNode;
                }
                if (intersectedEl.parentNode.parentNode && intersectedEl.parentNode.parentNode.classList.contains('data-receiver')) {
                    fromEntity = intersectedEl.parentNode.parentNode;
                    fromProp = intersectedEl.parentNode.getAttribute('text').value;
                }
                // Dot -> prompt -> attributeName -> objects.
                if (intersectedEl.parentNode.parentNode.parentNode && intersectedEl.parentNode.parentNode.parentNode.classList.contains('data-receiver')) {
                    fromEntity = intersectedEl.parentNode.parentNode.parentNode;
                    fromProp = intersectedEl.parentNode.getAttribute('text').value;
                }
                // Dot -> prompt -> attributeName -> utils. For data sources such as switch.
                if (intersectedEl.parentNode.parentNode.parentNode && intersectedEl.parentNode.parentNode.parentNode.classList.contains('data-source')) {
                    fromEntity = intersectedEl.parentNode.parentNode.parentNode;
                }

                this.curEdgeEntity.setAttribute('line-component', 'sourceEntity', fromEntity);
                this.curEdgeEntity.setAttribute('line-component', 'sourcePropEl', intersectedEl);
                this.curEdgeEntity.setAttribute('line-component', 'sourceProp', fromProp);
                const sourceType: string = getTypeByColor(intersectedEl.getAttribute('material').color);
                const sourceBehavior: string = getBehaviorByShape(intersectedEl.getAttribute('geometry').primitive);
                this.curEdgeEntity.setAttribute('line-component', 'sourceType', sourceType);
                this.curEdgeEntity.setAttribute('line-component', 'sourceBehavior', sourceBehavior);
                disableConnectors(sourceType, sourceBehavior);
            }
            
            // Check if the intersected object is an arrow of a vector system.
            if (intersectedEl.classList.contains('Arrow')) {
                const parentId: string = intersectedEl.parentNode.getAttribute('id');
                this.vectorId = Number(parentId.substr(-1, 1));
                this.vector = true;
            }

            // Check if the intersected object is a Switch.
            if (intersectedEl.classList.contains('Switch')) {
                intersectedEl.components['swtch'].switchClicked();
            }

            // Check if the intersected object is a Switch.
            if (intersectedEl.classList.contains('Slider')) {
                // Set current position as lastPosition.
                this.lastPosition = new THREE.Vector3();
                this.lastPosition = this.el.object3D.position.clone();

                // Set the intersected object as the following object.
                this.slidingEl = intersectedEl;
                this.sliding = true;

                // Leave it to tick.
            }
        });

        this.el.addEventListener('triggerup', (event) => {
            this.triggering = false;
            this.hueDown = false;
            this.sliding = false;
            this.vector = false;
            enableConnectors();

            if (this.clickedEntity) {
                this.clickedEntity.emit('clicked-cleared');
                this.clickedEntity = null;
            }

            const intersectedEl = getIntersectedEl(this.el);
            const intersections = getIntersections(this.el);
            // If there is no intersection, delete the currrent edge
            if (!intersectedEl || !intersections || !intersectedEl.classList.contains('connectable') || !this.curEdgeEntity) {
                if (this.curEdgeEntity) {
                    this.curEdgeEntity.parentNode.removeChild(this.curEdgeEntity);
                    this.curEdgeEntity = null;
                }
                return;
            }

            const endP = {x: intersections[0].point.x, y: intersections[0].point.y, z: intersections[0].point.z};
            this.curEdgeEntity.setAttribute('line-component', 'endPoint', endP);

            

            // Push the id into target entities.
            const fromEntity: any = this.curEdgeEntity.getAttribute('line-component').sourceEntity;
            const fromProp: string = this.curEdgeEntity.getAttribute('line-component').sourceProp;
            let toEntity: any;
            let toProp: string;

            // input/output->Object
            if (intersectedEl.parentNode.classList.contains('operator')) {
                toEntity = intersectedEl.parentNode;
                if (intersectedEl.firstChild.getAttribute('text')) {
                    toProp = intersectedEl.firstChild.getAttribute('text').value;
                }
            }
            // Dot->Description->ListEntity->Object
            if (intersectedEl.parentNode.parentNode.parentNode && intersectedEl.parentNode.parentNode.parentNode.classList.contains('data-receiver')) {
                toEntity = intersectedEl.parentNode.parentNode.parentNode;
                toProp = intersectedEl.parentNode.getAttribute('text').value;
            }
            if (intersectedEl.parentNode.classList.contains('collision-detector')) {
                toEntity = intersectedEl.parentNode;
                if (intersectedEl.firstChild.getAttribute('text')) {
                    toProp = intersectedEl.firstChild.getAttribute('text').value;
                }
                // Handle everything within collision detector.
                // toEntity.emit('entity-update', {entityId: fromEntity.getAttribute('id'), targetAttribute: toProp}, false);
            }

            // delete the line if connecting the same entity.
            if (toEntity.getAttribute('id') === fromEntity.getAttribute('id')) {
                this.curEdgeEntity.parentNode.removeChild(this.curEdgeEntity);
                this.curEdgeEntity = null;
                return;
            }

            if (getTypeByColor(intersectedEl.getAttribute('material').color) == 'any') {
                const unselectedColor: string = getColorsByType(this.curEdgeEntity.getAttribute('line-component').sourceType)[0];
                intersectedEl.setAttribute('material', 'color', unselectedColor);
                
                const connectors = toEntity.querySelectorAll('.connectable');
                connectors.forEach((connector: any) => {
                    if (getTypeByColor(connector.getAttribute('material').color) == 'any') {
                        connector.setAttribute('material', 'color', unselectedColor);
                    }
                });
            }

            // Set the connected two entities in the current line entity.
            this.curEdgeEntity.setAttribute('line-component', 'targetEntity', toEntity);
            this.curEdgeEntity.setAttribute('line-component', 'targetPropEl', intersectedEl);
            this.curEdgeEntity.setAttribute('line-component', 'targetProp', toProp);
            this.curEdgeEntity.setAttribute('id', 'line' + this.lineId);

            const outgoingEdges = fromEntity.getAttribute('stored-edges') ? fromEntity.getAttribute('stored-edges').outgoingEdges : [];
            fromEntity.setAttribute('stored-edges', 'outgoingEdges', [...outgoingEdges, `line${this.lineId}`]);
            const incomingEdges = toEntity.getAttribute('stored-edges') ? toEntity.getAttribute('stored-edges').incomingEdges : [];
            toEntity.setAttribute('stored-edges', 'incomingEdges', [...incomingEdges, `line${this.lineId}`]);

            // Handle data for next line.
            this.curEdgeEntity = null;
            this.lineId++;

            // Add an edge in frp-backend
            this.addEdge(fromEntity, fromProp, toEntity, toProp);
        });
    },

    addEdge: function(fromEntity: any, fromProp: string, toEntity: any, toProp: string): void {
        console.log(fromEntity.getAttribute('id'));
        console.log(toEntity.getAttribute('id'));
        const fromNode: Node = scene.getNode(fromEntity.getAttribute('id'));
        const toNode: Node = scene.getNode(toEntity.getAttribute('id'));
        scene.addEdge({node: fromNode, prop: fromProp}, {node: toNode, prop: toProp});
    },

    tick: function(time, timeDelta): void {
        if (this.triggering) {

            // Process hue cursor and then return.
            if (this.hueDown) {
                // Retrieve all intersected Elements through raycaster.
                const intersectedEls = this.el.components.raycaster.intersectedEls;

                // Check if there is intersected object.
                if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                    this.hueDown = false;
                    return;
                }

                // Fetch the intersected object.
                const intersectedEl = intersectedEls[0];

                // Retrieve all intersections through raycaster.
                const intersections = this.el.components.raycaster.intersections;
                if (!Array.isArray(intersections) || !intersections.length) {
                    this.hueDown = false;
                    return;
                }

                const id = intersectedEl.getAttribute('id');
                if (id == "hue" || id == "huecursor") {
                    // Fetch the intersection point of the first intersected object.
                    const {x, y, z} = intersections[0].point;
                    const WorldPos = new THREE.Vector3(x, y, z);
                    this.onHueDown(WorldPos.clone());
                }
                else {
                    this.hueDown = false;
                }
                return;
            }

            if (this.sliding && this.slidingEl) {
                const lastPosition: any = this.lastPosition.clone();
                const currentPosition: any = this.el.object3D.position.clone();

                // Store this frame's position in oldPosition.
                this.lastPosition = currentPosition.clone();

                // Calculate target object's position.
                const currentTargetPosition = this.slidingEl.getAttribute('position');
                const updatedTargetPosition: any = currentTargetPosition.add(currentPosition.sub(lastPosition));

                // Modify position at three.js level for better performance. (Better than setAttribute)
                const valueRange: number = this.slidingEl.components['slider'].getValueRange();
                this.slidingEl.object3D.position.set(THREE.Math.clamp(updatedTargetPosition.x, -valueRange, valueRange), 0, 0);
                this.slidingEl.components['slider'].setSliderValueByPosX(this.slidingEl.object3D.position.x);
                return;
            }

            if (this.vector) {
                const vector: any = document.querySelector('#vector' + this.vectorId);
                vector.components['vector'].updateVector(timeDelta);
                return;
            }

            if (!this.curEdgeEntity) return;

            // Update line end point to controller position.
            const controllerPos: any = this.el.object3D.position;
            const cameraRig: any = document.querySelector("#cameraRig");
            const controllerWorldPos = {x: cameraRig.object3D.position.x + controllerPos.x, y: cameraRig.object3D.position.y + controllerPos.y, z: cameraRig.object3D.position.z + controllerPos.z};
            this.curEdgeEntity.setAttribute('line-component', 'endPoint', controllerWorldPos);

            // Check if there is another dot to connect.
            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;
            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                return;
            }
            // Retrieve all intersections through raycaster.
            const intersections = this.el.components.raycaster.intersections;
            if (!Array.isArray(intersections) || !intersections.length) {
                return;
            }

            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];

            if (intersectedEl.classList.contains('connectable')) {
                const EP = {x: intersections[0].point.x, y: intersections[0].point.y, z: intersections[0].point.z};
                this.curEdgeEntity.setAttribute('line-component', 'endPoint', EP);
            }
        }
    },

    onHueDown: function(position: any) {
        const hueWheel: any = document.querySelector('#hue');
        const hueCursor: any = document.querySelector('#huecursor');

        const radius: number = this.calRadius(hueWheel);

        hueWheel.object3D.updateMatrixWorld();
        const LocalPos = hueWheel.object3D.worldToLocal(position);

        // console.log(LocalPos.x + ',' + LocalPos.y + ',' + LocalPos.z);       
        hueCursor.object3D.position.set(position.x, hueCursor.object3D.position.y, position.z);

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
        const size = new THREE.Vector3();
        box.getSize(size);
        const extent = Math.max(size.x, size.y, size.z) / 2;
        const radius = Math.sqrt(2) * extent;
        
        return radius;
    },

    updateColor: function(hsv) {
        const rgb: any = this.hsv2rgb(hsv);
        const color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
        
        const rightHand: any = document.querySelector('#rightHand');
        rightHand.setAttribute('right-abutton-listener', 'color', color);

        const globalMenu: any = document.querySelector('[palette-menu]');
        const globalMenuComponent = globalMenu.components['palette-menu'];
        globalMenuComponent.setCurrentColor(color);
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