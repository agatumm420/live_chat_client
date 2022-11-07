export function PostData(endpoint, data) {
    let BaseURL = 'http://127.0.0.1:8000/api/';
    return new Promise((resolve, reject) =>{
    
    fetch(BaseURL+endpoint,
    {
    
    method: 'POST',
    headers:
    {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body:JSON.stringify(data)
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