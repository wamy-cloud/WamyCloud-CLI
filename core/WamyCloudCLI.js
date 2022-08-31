import events from 'node:events';
import WamyCloudAPI from './WamyCloudAPI.js';
import ora from 'ora';
import chalk from 'chalk';

export default class WamyCloudCli extends events {

    static factory() {

        return new WamyCloudCli();
    }

    constructor(wamyCloudAPI){
        super();
    }

    async start(api_token){

        if( !await this.connect(api_token) ){
            return null;
        }

        this.welcome();

        this.validateToken();

        // await this.getTestCases(`Test_Project`);

    }

    async connect(api_token){

        if( !api_token ){
            
            this.error(`No token found. Please create an environment variable named WAMY_CLOUD_TOKEN containing it.`);

            return false;
        }

        this.wamyCloudAPI = WamyCloudAPI.factory(api_token);

        return true;
    }

    welcome(){

        const wamy = chalk.bgHex(`#1B4079`).white(`                                    
   Wamy Cloud CLI     v1.0          
                                    `);

        this.output(``);
        this.output(wamy);
        this.output(``);

    }

    async validateToken(){

        const spinner = ora('Validating your API token').start();

        const greeting = await this.wamyCloudAPI.getHello(`Daniel`);

        spinner.stop();

        if( greeting.error ){

            this.error(greeting.message);

        }else{

            const greeting_message = chalk.white(`Token is valid, welcome `)
                + chalk.green(greeting.name)
                + `\n`;

            this.rawOutput(greeting_message);

            this.output(``);

        }


    }

    async getTestCases(project_id) {

        const spinner = ora('Loading test cases').start();

        const test_cases = await this.wamyCloudAPI.getTestCases(project_id);

        spinner.stop();

        this.output(`Test cases for project: ` + chalk.yellow(project_id));

        test_cases.forEach((test_case) => {

            this.output(`  ` + test_case.name);

        });

    }

    error(message){

        const apiError = chalk.bgHex(`#cf0000`).white(`   API Error!   `);
        const errorText = chalk.hex(`#cf0000`)(message);

        this.output(apiError);
        this.output(``);
        this.rawOutput(chalk.bgHex(`#cf0000`)(` `));
        this.rawOutput(chalk.white(`  `));
        this.output(errorText);
        this.output(``);

    }

    output(message){

        this.rawOutput(message + `\n`);

    }
    
    rawOutput(message){

        process.stdout.write(message);

    }

}
