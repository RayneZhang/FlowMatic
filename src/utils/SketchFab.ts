import * as $ from 'jquery';
import { resize, recenter } from './SizeConstraints';
import { Vector3 } from 'three';
import { scene, Node, ObjNode } from 'frp-backend';
declare const zip: any;
/*
 *data - contains the resulting data from the request
 *status - contains the status of the request ("success", "notmodified", "error", "timeout", or "parsererror")
 *xhr - contains the XMLHttpRequest object
*/
class SketchFab {
    url: string = '';

    constructor() {
        this.url = 'https://api.sketchfab.com/v3/search';
    };

    getGLTFUrl(uid: string): string {
        let options: RequestInit = {
            method: 'GET',
            headers: {
                Authorization: `Token 7378591d3b564fb796e4d0976749e59e`,
            },
            mode: 'cors'
        };
        
        fetch('https://api.sketchfab.com/v3/models/' + uid + '/download', options).then(function(response){
            return response.json();
        }).then(function(data){
            console.log(data);
            const downloadURL: string = data.gltf.url;
            downloadArchive(downloadURL);
        });

        return '';
    };

    getUrl(): string {
        return this.url;
    };
};

export function downloadArchive(url: string): void {
    zip.workerScriptsPath = '/vendor/';
    var reader = new zip.HttpReader(url);
    zip.createReader(
        reader,
        function(zipReader) {
            zipReader.getEntries(function(entries){
                console.log(entries);
                ParseContent(entries);
            });
        },
        function(error) {
            console.error(error);
        }
    );
};

export function ParseContent(entries: Array<any>): void {

    let content: any;
    let fileUrls: Object = {};
    entries.forEach((entry: any, i: number) => {
        entry.getData(new zip.BlobWriter('text/plain'), function onEnd(data) {
            var url = window.URL.createObjectURL(data);
            fileUrls[entry.filename] = url;
        });
        entry.getData(new zip.TextWriter('text/plain'), function onEnd(data) {
            // Look at filename
            const entryNames: Array<string> = entry.filename.split(".");
            const entryName: string = entryNames[entryNames.length - 1];
            if (entryName == "gltf") {
                content = data;
            }

            // Wait till all the entry data are read.
            if (i === (entries.length - 1)) {
                // console.log(content);
                // console.log(fileUrls);
            
                var json = JSON.parse(content);
                // Replace original buffers and images by blob URLs
                if (json.hasOwnProperty('buffers')) {
                    for (var j = 0; j < json.buffers.length; j++) {
                        json.buffers[j].uri = fileUrls[json.buffers[j].uri];
                    }
                }
                
                if (json.hasOwnProperty('images')) {
                    for (var j = 0; j < json.images.length; j++) {
                        json.images[j].uri = fileUrls[json.images[j].uri];
                    }
                }
                
                var updatedSceneFileContent = JSON.stringify(json, null, 2);
                var updatedBlob = new Blob([updatedSceneFileContent], { type: 'text/plain' });
                var updatedUrl = window.URL.createObjectURL(updatedBlob);
                // console.log(updatedUrl);
                // console.log(json);

                // Fetch animations
                const animations: Array<any> = json.animations;
                const animationList: Array<string> = [];
                animations.forEach((animation: any) => {
                    const animation_name: string = animation.name;
                    animationList.push(animation_name);
                });

                CreateGLTFModel(updatedUrl, animationList);
            }
        });
    });
    
};

export function CreateGLTFModel(url: string, animationList: Array<string>): void {
    const polyEl: any = document.createElement('a-entity');
    const redux: any = document.querySelector('#redux');
    redux.appendChild(polyEl);

    // Attach the gltf model.
    polyEl.setAttribute('gltf-model', 'url(' + url + ')');

    // Resize the model.
    polyEl.addEventListener('model-loaded', () => {
        resize(polyEl, 1.0);
        recenter(polyEl);
        // resize(polyEl, 1.0);
    });

    // Set the position of the model.
    const rightHand: any = document.querySelector('#rightHand');
    rightHand.object3D.updateMatrix();
    rightHand.object3D.updateMatrixWorld();
    const position = rightHand.object3D.localToWorld(new Vector3(0, -0.4, -0.5));
    polyEl.object3D.position.copy(position.clone());

    // Set movable of the model.
    polyEl.classList.add('movable');

    const attrList: Array<string> = ['object', 'position', 'rotation'];
    const behaviorList: Array<string> = ['event', 'signal', 'signal'];
    const typeList: Array<string> = ['object', 'vector3', 'vector3'];
    
    // Create a object node in frp-backend, attribute updates are front-end driven. Also extract all properties from object file
    const props: any = [{ name: 'object', default: `node-${Node.getNodeCount()}` }, { name: 'position', default: position }];
    animationList.forEach((animationName: string) => {
        const attr: object = {};
        attr['name'] = animationName;
        attr['type'] = 'boolean';
        attr['behavior'] = 'event';
        attr['default'] = ''; 
        props.push(attr);
        attrList.push(animationName);
        behaviorList.push('event');
        typeList.push('boolean');
    });

    // Using JSON does not seem efficient
    const objNode = scene.addObj(`node-${Node.getNodeCount()}`, props);
    polyEl.setAttribute('id', objNode.getID()); // Set up node ID
    
    polyEl.setAttribute('obj-attributes-list', {
        attrList: attrList,
        behaviorList: behaviorList,
        typeList: typeList
    });
    polyEl.classList.add('data-receiver');
    polyEl.setAttribute('obj-node-update', 'name', 'anime'); // Set up node update for frp
};

export const sketchfab = new SketchFab();