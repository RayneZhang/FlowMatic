import * as $ from 'jquery';
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
            });
        },
        function(error) {
            console.error(error);
        }
    );
};

export function ParseContent(fileUrl: string, content: string): void {
    var json = JSON.parse(content);

    console.log(json);
    // Replace original buffers and images by blob URLs
    if (json.hasOwnProperty('buffers')) {
        for (var i = 0; i < json.buffers.length; i++) {
            json.buffers[i].uri = fileUrl[json.buffers[i].uri];
        }
    }
    
    if (json.hasOwnProperty('images')) {
        for (var i = 0; i < json.images.length; i++) {
            json.images[i].uri = fileUrl[json.images[i].uri];
        }
    }
    
    var updatedSceneFileContent = JSON.stringify(json, null, 2);
    var updatedBlob = new Blob([updatedSceneFileContent], { type: 'text/plain' });
    var updatedUrl = window.URL.createObjectURL(updatedBlob);
}

export const sketchfab = new SketchFab();