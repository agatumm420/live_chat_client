import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import{ Routes} from 'react-router-dom';
import Login from './components/Login';
import Chats from './components/LiveChats';
import Registration from './components/Registration';

const Routez = () => {
    
    return <BrowserRouter className='site'>
               <Routes>
                   
                   <Route path="*" element={<Login/>}/>
                   <Route path="register/*" element={<Registration/>}/>
                   <Route path="chats/*" element={<Chats/>}/>
                  
               </Routes>
           </BrowserRouter>
   };
   export default Routez;