import * as fs from 'fs';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';



const result = dotenv.config();

if (!process.env.D1_API_KEY) {
    console.error('API_KEY is not defined');
    process.exit(1);
}
if (!process.env.D1_PLATFORM) {
    console.error('D1_PLATFORM is not defined');
    process.exit(1);
}
if (!process.env.D1_ACCOUNT_ID) {
    console.error('D1_ACCOUNT_ID is not defined');
    process.exit(1);
}

const ax = axios.create({
    baseURL: 'https://www.bungie.net/',
    timeout: 10000,
    headers: { 'x-api-key': process.env.D1_API_KEY as string }
  });


async function makeRequest(url: string) : Promise<any> {
    try {
        const response = await ax.get(url);
        if (!response.data) {
            throw new Error('No data returned');
        }
        if (!response.data.Response) {
            throw new Error('No response returned');
        }
        if (response.data.ErrorCode!==1) {
            throw new Error(`Error code ${response.data.ErrorCode}, msg ${response.data.Message}`);
        }
        return response.data.Response.data;
    } catch (error) {
        console.log(`Failed request on url ${url} with ${error}`);
        process.exit(1);
    }

}

async function run() {
    const sJson = await fs.readFileSync('./assets/destiny.json', 'utf8');
    console.log(sJson.length);
    const cache = JSON.parse(sJson);
    console.log(cache.length);
    
    const data = await makeRequest(`/Platform/Destiny/${process.env.D1_PLATFORM}/Account/${process.env.D1_ACCOUNT_ID}/Summary/`);
    
    
    console.dir(data);
}


run();
