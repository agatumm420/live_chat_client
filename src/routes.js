import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import{ Routes} from 'react-router-dom';
import Login from './components/Login';
import Chats from './components/LiveChats';

const Routez = () => {
    
    return <BrowserRouter className='site'>
               <Routes>
                   
                   <Route path="*" element={<Login/>}/>
                   <Route path="chats/*" element={<Chats/>}/>
                  
               </Routes>
           </BrowserRouter>
   };
   export default Routez;