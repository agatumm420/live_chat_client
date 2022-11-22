export function GetData(endpoint) {
    let BaseURL = 'http://127.0.0.1:8000/api/';
    return new Promise((resolve, reject) =>{
    
    fetch(BaseURL+endpoint,
    {
    
    method: 'GET',
    headers:
    {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    
    })
    .then((response) => response.json()
    .then((res) => {
    resolve(res);
    }))
    .catch((error) => {
    reject(error);
    });
    });
}