import * as $ from 'jquery';

/*
 *data - contains the resulting data from the request
 *status - contains the status of the request ("success", "notmodified", "error", "timeout", or "parsererror")
 *xhr - contains the XMLHttpRequest object
*/
class GooglePoly {
    url: string = '';
    nextPageToken: string = '';

    constructor() {
        this.url = 'https://poly.googleapis.com/v1/assets?key=AIzaSyBXpyLrGL-CW-5N1UAMhAcmrhuxZV4qj4s';
    };

    list(keywords='', format='GLTF', pageSize=9): void {
        const param: object = {
            keywords: keywords,
            format: format,
            pageSize: pageSize
        }
        $.get(this.url, param, function (data,status,xhr) {
            if (status == 'success') {
                console.log(data);
            }
        });
    };
}

export default GooglePoly;