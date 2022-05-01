import config from 'config';
export const userService = {
    getSession,
    queryToServer,
};
function getHeader(accessToken,type=""){
    let myHeaders = new Headers();

    if(type == "json")
    {
        myHeaders.append("Content-Type", "application/json");
    }
    

    return myHeaders;
}
function getRequestOptions(method,Headers){
    let requestOptions = {
        method: method,
        headers: Headers,
        redirect: 'follow'
    };
    return requestOptions;
}
async function queryToServer(function_name,params){
    let myHeaders = getHeader();
    let formdata = new FormData();
    formdata.append("params",JSON.stringify(params));

    const key = '' //key;
    const PHPSESSID = localStorage.getItem('PHPSESSID');

    formdata.append("keySession",PHPSESSID);

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };   
    try {
        const userData = await fetch(`${config.apiUrl}/api/vtiger.php?HTTP_AUTH=${key}&keySession=${PHPSESSID}&type=${function_name}`, requestOptions)
        const data = await userData.json();
        return data;
    } catch (error) {
        console.log(error);
        return [null,error];
    }
}
