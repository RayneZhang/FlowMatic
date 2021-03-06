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

let updatedUrl: string = '';
let animationList: Array<string> = new Array<string>();

class SketchFab {
    url: string = '';

    constructor() {
        this.url = 'https://api.sketchfab.com/v3/search';
    };

    getGLTFUrl(uid: string): string {
        let options: RequestInit = {
            method: 'GET',
            headers: {
                //Authorization: `Token 7378591d3b564fb796e4d0976749e59e`,
                Authorization: `Token 24d1ea04e3dd4a2a9d6cf2b8e3aee942`,
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

    updatedUrl = '';
    animationList = [];
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
                updatedUrl = window.URL.createObjectURL(updatedBlob);
                // console.log(updatedUrl);
                // console.log(json);

                // Fetch animations
                const animations: Array<any> = json.animations;
                animations.forEach((animation: any) => {
                    const animation_name: string = animation.name;
                    animationList.push(animation_name);
                });

                CreatePreview();
                // CreateGLTFModel(updatedUrl, animationList);
            }
        });
    });
    
};

export function CreatePreview(): void {
    const preModelEl: any = document.getElementById('preview-model');
    if (!preModelEl) {
        console.warn('Cannot find preview element when creating model preview.');
        return;
    }

    preModelEl.removeAttribute('gltf-model');
    preModelEl.removeObject3D('mesh');
    preModelEl.setAttribute('gltf-model', `url(${updatedUrl})`);
}

export function CreateGLTFModel(): void {
    const polyEl: any = document.createElement('a-entity');

    // Attach the gltf model.
    polyEl.setAttribute('gltf-model', 'url(' + updatedUrl + ')');

    const redux: any = document.querySelector('#redux');
    redux.appendChild(polyEl);

    // Resize the model.
    polyEl.addEventListener('model-loaded', () => {
        resize(polyEl, 1.0);
        recenter(polyEl);
    });

    // Set the position of the model.
    const rightHand: any = document.querySelector('#rightHand');
    rightHand.object3D.updateMatrix();
    rightHand.object3D.updateMatrixWorld();
    const position = rightHand.object3D.localToWorld(new Vector3(0, -0.4, -0.5));
    polyEl.object3D.position.copy(position.clone());

    // Set movable of the model.
    polyEl.classList.add('movable');

    const attrList: Array<string> = ['class', 'object', 'position', 'rotation', 'scale'];
    const typeList: Array<string> = ['class', 'object', 'vector3', 'vector3', 'vector3'];
    const behaviorList: Array<string> = ['signal', 'signal', 'signal', 'signal', 'signal'];
    
    // Create a object node in frp-backend, attribute updates are front-end driven. Also extract all properties from object file
    const props: any = [{ name: 'class', default: updatedUrl }, { name: 'object', default: `node-${Node.getNodeCount()}` }];
    for (let i = 2; i < attrList.length; i++) {
        const attr: object = {};
        attr['name'] = attrList[i];
        attr['type'] = behaviorList[i];
        attr['behavior'] = behaviorList[i];
        attr['default'] = '';
        props.push(attr);
    }
    animationList.forEach((animationName: string) => {
        const attr: object = {};
        attr['name'] = animationName;
        attr['type'] = 'string';
        attr['behavior'] = 'signal';
        attr['default'] = animationName; 
        props.push(attr);
        attrList.push(animationName);
        behaviorList.push('signal');
        typeList.push('string');
    });

    // Using JSON does not seem efficient
    const objNode = scene.addObj(`node-${Node.getNodeCount()}`, props);
    polyEl.setAttribute('id', objNode.getID()); // Set up node ID
    
    // Add list of attributes next to the model.
    polyEl.setAttribute('attribute-list', {
        attrList: attrList,
        behaviorList: behaviorList,
        typeList: typeList
    });

    // For edge drawing.
    polyEl.classList.add('data-receiver');

    // Set up update for input/output when there is stream updates.
    polyEl.setAttribute('obj-node-update', {
        name: 'anime',
        animeList: animationList
    }); 
};

export const sketchfab = new SketchFab();