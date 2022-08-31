import events from 'node:events';
import axios from 'axios';

export default class WamyCloudAPI extends events {

    static get URL(){
        return `https://testing-cloud-api-4pc35blioa-uc.a.run.app`;
    }

    static factory(api_token) {

        const fetch_api = axios;

        return new WamyCloudAPI(api_token, fetch_api);
    }

    constructor(api_token, fetch_api){
        super();

        this.api_token = api_token;
        this.fetch_api = fetch_api;
    }

    async getTestCases(projectId){

        const test_cases = await this.getRequest(`/test_cases/${projectId}`);

        return test_cases;
    }

    async getHello(name){

        name = encodeURIComponent(name);

        const greeting = await this.getRequest(`/hello`);

        return greeting;
    }

    async getRequest(path){

        return await this.apiRequest(path, `GET`);

    }

    async apiRequest(url, httpMethod, body = null){

        const parameters = {
            baseURL: WamyCloudAPI.URL,
            url: url,
            headers: {
                authorization: this.api_token
            }
        };

        const response = await this.fetch_api(parameters)
            .catch((error) => {

                let error_message = `Internal error!`;

                if( error.response.data.error ){

                    error_message = error.response.data.error;

                }

                const parameters = {
                    error: true,
                    message: error_message
                }

                return {data: parameters};
            });

        return response.data;
    }

}