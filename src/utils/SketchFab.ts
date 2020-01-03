import * as $ from 'jquery';

/*
 *data - contains the resulting data from the request
 *status - contains the status of the request ("success", "notmodified", "error", "timeout", or "parsererror")
 *xhr - contains the XMLHttpRequest object
*/
class SketchFab {
    url: string = '';

    constructor() {
        this.url = 'https://api.sketchfab.com/v3/search';

        // const param = {
        //     grant_type: 'password',
        //     username: 'raynez',
        //     password: 'Aut3mFPyVFMQQ9A'
        // };
        // $.post('https://sketchfab.com/oauth2/token/', param, function (data, status, xhr) {
        //     console.log(status);
        // });
    };

    getGLTFUrl(uid: string): string {
        let options: RequestInit = {
            method: 'GET',
            headers: {
                Authorization: 'Bearer 7378591d3b564fb796e4d0976749e59e',
            },
            mode: 'cors'
        };
        
        fetch('https://api.sketchfab.com/v3/models/' + uid + '/download', options).then(function(response){
            return response.json();
        }).then(function(data){
            console.log("GLTF URL ready:");
            console.log(data);
        });

        return '';
    }

    getUrl(): string {
        return this.url;
    };
};

export const sketchfab = new SketchFab();