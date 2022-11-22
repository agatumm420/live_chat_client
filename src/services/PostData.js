export function PostData(endpoint, data) {
    let BaseURL = 'http://127.0.0.1:8000/api/';
    return new Promise((resolve, reject) =>{
        let prepered;
        switch(endpoint){
            case 'login':
                prepered= {
                    'data':{
                        'email':data.email,
                        'password':data.password
                    }
                }

                break;
            
        }
    
    fetch(BaseURL+endpoint,
    {
    
    method: 'POST',
    // mode:'cors',
    // //credentials:'include',
    headers:
    {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body:JSON.stringify(data)
    
               
        
    
    })
    .then((response) =>
     
     response.json()
    
    
    .then((res) => {
        console.log(res);
        resolve(res);
    }))
    .catch((error) => {
        console.log(error)
        reject(error);
    });
    });
}