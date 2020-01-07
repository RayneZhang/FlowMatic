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
                console.log(updatedUrl);
                // console.log(json);

                const animations: Array<any> = json.animations;
                animations.forEach((animation: any) => {
                    const animation_name: string = animation.name;
                    console.log(animation_name);
                });

                CreateGLTFModel(updatedUrl);
            }
        });
    });
    
};

export function CreateGLTFModel(url: string): void {
    const displayName: string = 'test'; // asset.displayName
    const polyEl: any = document.createElement('a-entity');
    polyEl.setAttribute('id', displayName);
    const redux: any = document.querySelector('#redux');
    redux.appendChild(polyEl);
    polyEl.setAttribute('gltf-model', 'url(' + url + ')');

    polyEl.addEventListener('model-loaded', () => {
        resize(polyEl, 1.0);
        recenter(polyEl);
        // resize(polyEl, 1.0);
    });

    const rightHand: any = document.querySelector('#rightHand');
    rightHand.object3D.updateMatrix();
    rightHand.object3D.updateMatrixWorld();
    const position = rightHand.object3D.localToWorld(new Vector3(0, -0.4, -0.5));
    polyEl.object3D.position.copy(position.clone());
    polyEl.classList.add('movable');

    polyEl.setAttribute('obj-attributes-list', {
        attrList: ['position', 'rotation'],
        behaviorList: ['signal', 'signal'],
        typeList: ['vector3', 'vector3']
    });

    // Create a object node in frp-backend, attribute updates are front-end driven. Also extract all properties from object file
    const props: any = [{ name: 'object', default: `node-${Node.getNodeCount()}` }, { name: 'position', default: position }];

    // Using JSON does not seem efficient
    const objNode = scene.addObj(displayName, props);
    polyEl.setAttribute('id', objNode.getID()); // Set up node ID
    polyEl.setAttribute('obj-node-update', 'name', displayName); // Set up node update for frp
    polyEl.classList.add('data-receiver');
};

export const sketchfab = new SketchFab();