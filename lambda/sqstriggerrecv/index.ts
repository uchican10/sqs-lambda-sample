export const handler = async (event: any) => {
    console.log(JSON.stringify(event, null, 2))

    const sleepTime = process.env?.["SLEEP_TIME"]

   // throw new Error("dummy");
    

    if (sleepTime) {
        console.log(`--- sleep(${sleepTime})`)
        await sleep(sleepTime)
        
    }


    return {
        statusCode: 200,
        body: 'OK'
    }

}

async function sleep(ms: any) {
    return new Promise(r => setTimeout(r, ms));
}