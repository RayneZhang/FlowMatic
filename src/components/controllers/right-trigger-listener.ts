import Line from "../../modules/Line";
import store from '../../store'
import { ActionCreators as UndoActionCreators } from 'redux-undo'
declare const THREE:any;

const rightTriggerListener = {
    schema: {
        selectedEl: {type: 'selector', default: null}
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

        this.sourceObjects = [];
        this.sourceObjectsConnected = [];
        this.sourceObjectsConnectedId = [];

        const listeningEl = document.querySelector('#rightHand');
        // Handle trigger down.
        listeningEl.addEventListener('triggerdown', (event) => {
            this.triggering = true;

            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;

            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                // console.log('Nothing is intersected when triggering');
                return;
            }

            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];

            // Retrieve all intersections through raycaster.
            const intersections = this.el.components.raycaster.intersections;
            if (!Array.isArray(intersections) || !intersections.length) {
                // console.log('There is NO intersections when triggering');
                return;
            }

            // console.log(intersectedEl); // For debugging.

            // Check if the intersected object is ui.
            if (intersectedEl.classList.contains('ui')) {
                const id = intersectedEl.getAttribute('id');

                if (intersectedEl.classList.contains('instance')) {
                    const globalMenu: any = document.querySelector('[global-menu]');
                    const globalMenuComponent = globalMenu.components['global-menu'];
                    const buttonId: number = Number(id.substr(-1, 1)) - 1;
                    globalMenuComponent.setSelectedButtonId(buttonId);
                }

                if (intersectedEl.classList.contains('submenu')) {
                    const globalMenu: any = document.querySelector('[global-menu]');
                    const globalMenuComponent = globalMenu.components['global-menu'];
                    const buttonId: number = Number(id.substr(-1, 1)) - 1;
                    globalMenuComponent.setSelectedSubMenuId(buttonId);
                }
                
                switch(id) {
                    case 'hue': case 'huecursor': {
                        this.hueDown = true;
                        // Fetch the intersection point of the first intersected object.
                        const {x, y, z} = intersections[0].point;
                        const WorldPos = new THREE.Vector3(x, y, z);
                        this.onHueDown(WorldPos.clone());
                        break;
                    }
                    case 'undo': {
                        store.dispatch(UndoActionCreators.undo());
                        break;
                    }
                    case 'redo': {
                        store.dispatch(UndoActionCreators.redo());
                        break;
                    }
                }

                return;
            }
            
            // Check if we're about to draw a line.
            if (intersectedEl.classList.contains('connectable')) {
                this.curLine = new Line();
                const LinesEntity: any = document.querySelector("#lines");
                const theHand: any = document.querySelector("#rightHand");
                const SP = {x: intersections[0].point.x, y: intersections[0].point.y, z: intersections[0].point.z};
                const EP = {x: theHand.object3D.position.x, y: theHand.object3D.position.y, z: theHand.object3D.position.z};
                LinesEntity.setAttribute('draw-line', 'startPoint', SP);
                LinesEntity.setAttribute('draw-line', 'endPoint', EP);

                // input/output -> operator.
                LinesEntity.setAttribute('draw-line', 'currentSource', intersectedEl.parentNode);
                if (intersectedEl.parentNode && intersectedEl.parentNode.classList.contains('data-filter')) {
                    if (intersectedEl.firstChild.getAttribute('text')) {
                        LinesEntity.setAttribute('draw-line', 'dataType', intersectedEl.firstChild.getAttribute('text').value);
                    }
                }
                // Dot -> prompt -> bottle. For data sources such as bottles.
                if (intersectedEl.parentNode.parentNode && intersectedEl.parentNode.parentNode.classList.contains('data-source')) {
                    LinesEntity.setAttribute('draw-line', 'currentSource', intersectedEl.parentNode.parentNode);
                }
                // Dot -> prompt -> attributeName -> objects.
                if (intersectedEl.parentNode.parentNode.parentNode && intersectedEl.parentNode.parentNode.parentNode.classList.contains('data-receiver')) {
                    LinesEntity.setAttribute('draw-line', 'currentSource', intersectedEl.parentNode.parentNode.parentNode);
                    LinesEntity.setAttribute('draw-line', 'dataType', intersectedEl.parentNode.getAttribute('text').value);
                }
                // Dot -> prompt -> attributeName -> utils. For data sources such as switch.
                if (intersectedEl.parentNode.parentNode.parentNode && intersectedEl.parentNode.parentNode.parentNode.classList.contains('data-source')) {
                    LinesEntity.setAttribute('draw-line', 'currentSource', intersectedEl.parentNode.parentNode.parentNode);
                }
            }

            // Check if the intersected object is a movable object.
            if (intersectedEl.classList.contains('movable')) {
                if (this.data.selectedEl) {
                    this.showOrHideWireframe(this.data.selectedEl, false);
                    if (this.data.selectedEl == intersectedEl) {
                        this.data.selectedEl = null;
                        return;
                    }
                }
                this.data.selectedEl = intersectedEl;
                this.showOrHideWireframe(intersectedEl, true);
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

        listeningEl.addEventListener('triggerup', (event) => {
            this.triggering = false;
            this.hueDown = false;
            this.sliding = false;
            this.vector = false;

            // Conditions when the intersected target is not connectable.
            // Retrieve all intersected Elements through raycaster.
            const intersectedEls = this.el.components.raycaster.intersectedEls;
            // Check if there is intersected object.
            if (!Array.isArray(intersectedEls) || !intersectedEls.length) {
                // console.log('Nothing is intersected when drawing lines');
                if(this.curLine) {
                    this.curLine.destroyLine();
                    this.curLine = null;
                }
                return;
            }

            // Retrieve all intersections through raycaster.
            const intersections = this.el.components.raycaster.intersections;
            if (!Array.isArray(intersections) || !intersections.length) {
                console.log('There is NO intersections when triggering');
                if(this.curLine) {
                    this.curLine.destroyLine();
                    this.curLine = null;
                }
                return;
            }

            // Fetch the intersected object.
            const intersectedEl = intersectedEls[0];
            if (intersectedEl.classList.contains('connectable')) {
                const linesEntity: any = document.querySelector('#lines');
                const EP = {x: intersections[0].point.x, y: intersections[0].point.y, z: intersections[0].point.z};
                linesEntity.setAttribute('draw-line', 'endPoint', EP);

                // Push the id into target entities.
                const sourceEntity: any = linesEntity.getAttribute('draw-line').currentSource;
                const sourceDataType: string = linesEntity.getAttribute('draw-line').dataType;
                let targetEntity: any = null;
                let targetAttribute: string = null;

                // input/output->Object
                if (intersectedEl.parentNode.classList.contains('data-source')) {
                    targetEntity = intersectedEl.parentNode;
                }
                else if (intersectedEl.parentNode.classList.contains('data-filter')) {
                    targetEntity = intersectedEl.parentNode;
                    if (intersectedEl.firstChild.getAttribute('text')) {
                        targetAttribute = intersectedEl.firstChild.getAttribute('text').value;
                    }
                }
                // Dot->Description->ListEntity->Object
                else {
                    targetEntity = intersectedEl.parentNode.parentNode.parentNode;
                    const attrNameEntity: any = intersectedEl.parentNode;
                    targetAttribute = attrNameEntity.getAttribute('text').value;
                }

                // delete the line if connecting the same entity.
                if (targetEntity.getAttribute('id') == sourceEntity.getAttribute('id')) {
                    if (this.curLine) {
                        this.curLine.destroyLine();
                        this.curLine = null;
                        return;
                    }
                }

                // const sourceId: string = sourceEntity.getAttribute('id');
                // const targetId: string = sourceEntity.getAttribute('id');
                // let lineId: string = this.checkLineExist(sourceId, targetId);
                // if (!lineId)
                //     lineId = this.checkLineExist(targetId, sourceId);

                // if (lineId) {
                //     if (this.curLine) {
                //         this.curLine.destroyLine();
                //         this.curLine = null;
                //     }

                //     // If the line exists, we should delete line geometry.
                //     const selectedLine: any = document.querySelector('#' + lineId);
                //     selectedLine.parentNode.removeChild(selectedLine);

                //     return;
                // }
                // else {
                //     // If the line does not exist, we should add it to the data structure.
                //     const sourceObjectsIndex: number = this.sourceObjects.indexOf(sourceId);
                //     if (sourceObjectsIndex >= 0) {
                //         this.sourceObjectsConnected[sourceObjectsIndex].push(targetId);
                //         this.sourceObjectsConnectedId[sourceObjectsIndex].push(['line' + this.lineId]);
                //     }
                //     else {
                //         this.sourceObjects.push(sourceId);
                //         this.sourceObjectsConnected.push([targetId]);
                //         this.sourceObjectsConnectedId.push(['line' + this.lineId]);
                //     }
                // }


                // Set target objects of source entity.
                if (sourceEntity.classList.contains('data-source')){
                    sourceEntity.emit('source-update', {targetEntity: targetEntity.getAttribute('id'), targetAttribute: targetAttribute}, false);
                }
                if (sourceEntity.classList.contains('data-filter')){
                    sourceEntity.emit('operator-update', {targetEntity: targetEntity.getAttribute('id'), targetAttribute: targetAttribute, sourceAttribute: sourceDataType}, false);
                }
                if (sourceEntity.classList.contains('data-receiver')){
                    sourceEntity.emit('target-update', {targetEntity: targetEntity.getAttribute('id'), targetAttribute: targetAttribute, sourceAttribute: sourceDataType}, false);
                }

                // Set the connected two entities in the current line entity.
                const currentLineEntity:any = linesEntity.getAttribute('draw-line').currentLine;
                currentLineEntity.setAttribute('line-properties', 'targetEntity', targetEntity);
                currentLineEntity.setAttribute('line-properties', 'sourceEntity', sourceEntity);
                currentLineEntity.setAttribute('id', 'line' + this.lineId);
                // Handle data for next line.
                this.lineId++;
                linesEntity.setAttribute('draw-line', 'currentLine', null);
                this.curLine = null;
            }
            else {
                if (this.curLine) {
                    this.curLine.destroyLine();
                    this.curLine = null;
                }
            }
        });
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

            const lineEntity: any = document.querySelector('#lines');

            // Update line end point to controller position.
            const controllerPos: any = this.el.object3D.position;
            const cameraRig: any = document.querySelector("#cameraRig");
            const controllerWorldPos = {x: cameraRig.object3D.position.x + controllerPos.x, y: cameraRig.object3D.position.y + controllerPos.y, z: cameraRig.object3D.position.z + controllerPos.z};
            lineEntity.setAttribute('draw-line', 'endPoint', controllerWorldPos);

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
                lineEntity.setAttribute('draw-line', 'endPoint', EP);
            }
        }
    },

    checkLineExist(_sourceEntityId: string, _targetEntityId: string): string {
        let lineId: string = '';
        const sourceObjectIndex: number = this.sourceObjects.indexOf(_sourceEntityId);

        if (sourceObjectIndex >= 0) {
            const targetObjectIndex = this.sourceObjectsConnected[sourceObjectIndex].indexOf(_targetEntityId);
            if ( targetObjectIndex >= 0) {
                
                this.sourceObjects.splice(sourceObjectIndex, 1);
                this.sourceObjectsConnected[sourceObjectIndex].splice(targetObjectIndex, 1);
                lineId = this.sourceObjectsConnectedId[sourceObjectIndex][targetObjectIndex];
                this.sourceObjectsConnectedId[sourceObjectIndex].splice(targetObjectIndex, 1);
                if (targetObjectIndex == 0) {
                    this.sourceObjectsConnected.splice(sourceObjectIndex, 1);
                    this.sourceObjectsConnectedId.splice(sourceObjectIndex, 1);
                }
            }
        }
        return lineId;
    },

    showOrHideWireframe: function(_targetObj: any, _show: boolean) {
        const mesh: any = _targetObj.getObject3D('mesh');
        if (!mesh) {
            console.log("The mesh of the selected object is null!");
            return;
        }
        // console.log(mesh); // For debugging
        if (mesh.type == "Mesh") {
            if (_show) {
                const geometry: any = mesh.geometry;
                if (!geometry) {
                    console.log("The geometry of the selected object is null");
                    return;
                }
    
                const wireframe: any = new THREE.WireframeGeometry(geometry);
                this.line = new THREE.LineSegments(wireframe);
                this.line.material.depthTest = false;
                mesh.add(this.line);
            }
            else {
                mesh.remove(this.line);
            }
        }
        
        if (mesh.type == "Group") {
            if (_show) {
                this.lines = [];
                for (const child of mesh.children) {
                    const geometry: any = child.geometry;
                    if (!geometry) {
                        console.log("The geometry of the selected object is null");
                        continue;
                    }
                    else {
                        if (geometry.type != "BufferGeometry" || child.type != "Mesh")
                            continue;
                        const wireframe: any = new THREE.EdgesGeometry(geometry);
                        const line = new THREE.LineSegments(wireframe);
                        line.material.depthTest = false;
                        mesh.add(line);
                        this.lines.push(line);
                    }
                }
            }
            else {
                for (const line of this.lines) {
                    mesh.remove(line);
                }
            }
        }
    },

    onHueDown: function(position: any) {
        const hueWheel: any = document.querySelector('#hue');
        const hueCursor: any = document.querySelector('#huecursor');

        if (!hueWheel.getAttribute('model-subset').raycasted) {
            return;
        }
            

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
        
        const leftHandInfo: any = document.querySelector('#leftHandInfo');
        leftHandInfo.setAttribute('left-trigger-listener', 'color', color);

        const globalMenu: any = document.querySelector('[global-menu]');
        const globalMenuComponent = globalMenu.components['global-menu'];
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