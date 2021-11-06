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

function parseMatch(characterId: number, characterClass: string, cache: any, a: any): Match {
    var aDesc = cache.Activity[a.activityDetails.referenceId];
    return {
        characterId,
        characterClass,
        name: aDesc.activityName,
        date: a.period,
        humanDate: new Date(a.period).toLocaleString().replace(',',' '),
        hash: a.activityDetails.instanceId,
        kills: a.values.kills.basic.value,
        assists: a.values.assists.basic.value,
        deaths: a.values.deaths.basic.value,
        result: a.values.completed.basic.displayValue,
        humanDuration: a.values.activityDurationSeconds.basic.displayValue,
        durationSeconds: a.values.activityDurationSeconds.basic.value,
    };
}

function csvHeader(): string {
    return `characterId,characterClass,name,date,humanDate,hash,kills,assists,deaths,completed,humanDuration,durationSeconds`;
}

function matchToCsv(match: Match): string {
    return `${match.characterId},${match.characterClass},${match.name.replace(","," ")},${match.date},${match.humanDate},${match.hash},${match.kills},${match.assists},${match.deaths},${match.result},${match.humanDuration},${match.durationSeconds}`;
}

async function run() {
    const sJson = await fs.readFileSync('./destiny.json', 'utf8');
    const cache = JSON.parse(sJson);
    
    const data = await makeRequest(`/Platform/Destiny/${process.env.D1_PLATFORM}/Account/${process.env.D1_ACCOUNT_ID}/Summary/`);
    
    const matches: Match[] = [];
    for (const charData of data.characters) {
        const characterId = charData.characterBase.characterId;        
        const className = cache.Class[charData.characterBase.classHash].className;
        console.log(`Fetching PVP matches for ${className}`);
        console.log(`${characterId} ${className}`);

        // http://www.bungie.net/Platform/Destiny/Stats/ActivityHistory/1/4611686018434964640/2305843009219816265/?count=100&mode=AllPvE 
        let pageCntr = 0;
        while (true) {
            console.log(`    - Fetching ${className} page ${pageCntr}`)
            const matchData = await makeRequest(`/Platform/Destiny/Stats/ActivityHistory/${process.env.D1_PLATFORM}/${process.env.D1_ACCOUNT_ID}/${characterId}/?count=100&mode=AllPve&page=${pageCntr}`);
            pageCntr++;
            if (!matchData?.activities || (matchData?.activities?.length === 0)) {
                break;
            }
            // for testing if (pageCntr>1) break;
            for (const matchRaw of matchData.activities) {
                const match = parseMatch(characterId, className, cache, matchRaw);
                matches.push(match);
            }
        }
       


    }
     // sort matches by date
     matches.sort((a,b) => {
        if (a.date < b.date) return -1;
        if (a.date > b.date) return 1;
        return 0;
    });
    // generate csv list from matches
    const csv = matches.map(match => matchToCsv(match)).join('\n');
    // write csv to file
    
    await fs.writeFileSync("matches.csv", csvHeader() + '\n' + csv);
    await fs.writeFileSync("matches.json", csvHeader() + '\n' + csv);
    
    // console.dir(data);
}


run();

interface Match {
    characterId: number;
    characterClass: string;
    name: string;
    date: string;
    humanDate: string;
    hash: number;
    kills: number;
    assists: number;
    deaths: number;
    result: string;
    durationSeconds: number;
    humanDuration: string;
}