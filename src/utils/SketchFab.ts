import * as $ from 'jquery';
import axios from 'axios';
import * as JSZip from 'jszip';

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
    axios.get(url)
        .then(function (response) {
            console.log(response);
            // here we go !
            JSZip.loadAsync(response.data).then(function (zip) {
                return zip.file("content.txt").async("string");
            }).then(function (text) {
                console.log(text);
            });
        })
        .catch(function (error) {
            console.log(error);
        });
};

export const sketchfab = new SketchFab();