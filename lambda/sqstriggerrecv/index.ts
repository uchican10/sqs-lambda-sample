export const handler=async (event:any) => {
    console.log(JSON.stringify(event,null,2))

    return {
        statusCode:200,
        body: 'OK'
    }

} 