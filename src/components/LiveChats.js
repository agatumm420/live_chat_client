import React, {useState, useEffect} from "react";
import { GetData } from "../services/GetData";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import {PostData}from "../services/PostData";
window.Pusher = Pusher;
 
window.Echo = new Echo({
  broadcaster: 'pusher',
  key: 'local',
  // wsHost: process.env.APP_WEBSOCKET_SERVER,
  wsHost: '127.0.0.1',
  cluster: 'mt1',
  wsPort: 6001,
  forceTLS:false,
  disableStats: true,
  enabledTransports: ['ws', 'wss']
});
let curr_room=3;



  window.Echo.channel(`room${curr_room}`)
  .listen('.message.send',  (e)=>{
      //###   do something with the message for exmaple respond
      const event=new CustomEvent('new_message', {detail:e.data });
      console.log('listened')
      window.dispatchEvent(event);
     

  })
  


const Chats=()=>{
   const [rooms, setRooms]=useState();
   //const [cur_room, setCurRoom]=useState();
   const [messages, setMessages]=useState();
   const [new_message, setNewMessage]=useState();
   const [letter, setLetter]=useState();
   const [user, setUser]=useState();
   const [new_room, setNewRoom]=useState();
   const [clicked, setClicked]=useState('hidden');
   const [users, setUsers]=useState([]);
   const [curr_user, setCurrUser]=useState();
 
   useEffect(()=>{
    let userData=JSON.parse(sessionStorage.getItem('userData'));
    console.log(userData.data.user_id);
    setLetter(userData.data.login.slice(0,1));
    setUser(userData.data.user_id);
    if(sessionStorage.getItem('userData')){
      GetData(`rooms/${userData.data.user_id}`).then((result) => {
        console.log(result);
        let responseJson = result['data'];
        if(responseJson){
              setRooms(responseJson['rooms']);
          }
        else
          console.log(result);
        });
    }
    else{
      console.log('no stuff');
    }
    window.addEventListener('new_message',(e)=>{
        //here message factory
        let newArr=[...messages];
        let controller = new AbortController();
        newArr.push({
          room_id:e.detail.room,
          login:e.detail.user,
          text:e.detail.text,
          date:e.detail.date
        });
        setMessages(newArr);
        controller.abort();
    });
   },[]);
  
   const CheckEnter=(e)=>{
    if(e.keyCode==13){
      if(new_message){
        let userData=JSON.parse(sessionStorage.getItem('userData'));
      PostData(`send/${curr_room}`,{
        'data':{
          'text':new_message,
          'user_id':userData.data.user_id, //image dodaj 
        
        }
            
  
      } ).then((result) => {
        console.log(result['data']);
        let responseJson = result['data'];
        // if(responseJson){
             
        //   }
        // else
        //   console.log(result);
        });
      }
    }

   }
   const CreateRoom=()=>{
      setClicked('');
   }
   const AddUser=()=>{
     let newArr=[...users];
     newArr.push(curr_user);
     setUsers(newArr);
   }
   const onChangeUser=(e)=>{
      setCurrUser(e.target.value);
   }
   const onRoomNameChange=(e)=>{
      setNewRoom(e.target.value)
   }
   const sendCreateRoom=()=>{
    if(users.length>0&& new_room ){
      let userData=JSON.parse(sessionStorage.getItem('userData'));
    PostData(`create_room/${userData.data.user_id}`,{
      'data':{
        'name':new_room,
        'admin':userData.data.user_id, //image dodaj 
       'image':'https://images.unsplash.com/photo-1668628227105-1098e9cde69e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=327&q=80',
        'members':[...users]
      }
          

    } ).then((result) => {
      console.log(result['data']);
      let responseJson = result['data'];
      // if(responseJson){
           
      //   }
      // else
      //   console.log(result);
      });
    }
    
   }
   const onChangeNewMessage=(e)=>{
     setNewMessage(e.target.value);
   }
   const Room=(props)=>{
      const [mess, setMess]=useState();
      const [room_id, setRoomId]=useState();
      const [active, setActive]=useState(false);
      useEffect(()=>{
        setRoomId(props.room_id);
        GetData(`room/${props.room_id}`).then((result) => {
          console.log(result);
          let responseJson = result['data'];
          if(responseJson){
                setMess(responseJson['messages']);
            }
          else
            console.log(result);
          });
          Listen();
      },[])
      const Listen=()=>{
        // window.Echo = new Echo({
        //   broadcaster: 'pusher',
        //   key: 'local',
        //   // wsHost: process.env.APP_WEBSOCKET_SERVER,
        //   wsHost: '127.0.0.1',
        //   cluster: 'mt1',
        //   wsPort: 6001,
        //   forceTLS:false,
        //   disableStats: true,
        //   enabledTransports: ['ws', 'wss']
        // });
        // window.Echo.channel(`private-websockets-dashboard-api-message`)
        // .listen('log-message',  (e)=>{
        //     //###   do something with the message for exmaple respond
        //     console.log('listened')
        //     setMess(mess.push(e.data));
        //     if(active){
        //       setMessages(mess);
        //     }
           

        // })
        
      }
        const OnClick=()=>{
          setActive(true);
          curr_room=props.room_id;
          setMessages(mess);
          
        }
      return <div
              className={ active?"flex flex-row py-4 px-2 items-center border-b-2 border-l-4 border-blue-400" : "flex flex-row py-4 px-2 justify-center items-center border-b-2"}
                  onClick={OnClick.bind(this)}        >
      
      <div className="w-1/4">
        <img
          src={props.src?props.src:null}
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">{mess!=undefined?mess[mess.length-1].login+': '+mess[mess.length-1].text:null}</div>
        <span className="text-gray-500">{mess!=undefined?mess[mess.length-2].login+': '+mess[mess.length-2].text:null}</span>
      </div>
    </div>
   }
    return <div className="container mx-auto shadow-lg rounded-lg">
    {/* <!-- headaer --> */}
<div className="px-5 py-5 flex justify-between items-center bg-white border-b-2">
  <div className="font-semibold text-2xl">GoingChat</div>
  <div className="w-1/2">
    <input
      type="text"
      name=""
      id=""
      placeholder="search IRL"
      className="rounded-2xl bg-gray-100 py-3 px-5 w-full"
    />
  </div>
  <div
    className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center"
  >
    {letter? letter:null}
  </div>
</div>
{/* <!-- end header -->
<!-- Chatting --> */}
<div className="flex flex-row justify-between bg-white">
  {/* <!-- chat list --> */}
  <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto">
    {/* <!-- search compt --> */}
    <div className=" flex flex-row justify-between border-b-2 py-4 px-2">
    <button className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" data-modal-toggle="authentication-modal" onClick={CreateRoom}>
            Create Chat Room
        </button>
      <input
        type="text"
        placeholder="search chatting"
        className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"
      />
    </div>
    {/* <!-- end search compt -->
    <!-- user list --> */}
    {rooms? rooms.map((room ,index)=> {
      return(
      <Room room_id={room.id} src={room.image} key={index}/>)
    }):null }
  <div id="authentication-modal" tabIndex={-1} aria-hidden="true" className={`${clicked} overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full`}>
    <div className="relative w-full max-w-md h-full md:h-auto">
        
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-toggle="authentication-modal">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                <span className="sr-only">Close </span>
            </button>
            <div className="py-6 px-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create a room</h3>
                <form className="space-y-6" action="#">
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name of the room</label>
                        <input type="name" name="name" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="my-room" required onChange={onRoomNameChange}/>
                    </div>
                    <div  className="flex justify-between">
                        <label  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Users invited</label>
                        {users.map((us, index)=>{
                          return( <div class="  bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" key={index}>
                                {us}
                          </div>
                            )
                        })}
                    </div>
                    <div  className="flex flex-row py-4 px-2 items-center">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Invite</label>
                        <input type="users" name="users" id="password" placeholder="login1" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required onChange={onChangeUser}/>
                        </div>
                        <button className="block h-5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-10  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button" data-modal-toggle="authentication-modal" onClick={AddUser}>
                            Invite user
                      </button>
                        
                      </div>
                        
                    </div>
                    
                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={sendCreateRoom}>Create Room</button>
                    
                </form>
            </div>
        </div>
    </div>
</div> 
      {/* {rooms? rooms.map((room )=> {
      return ( <div
      className="flex flex-row py-4 px-2 justify-center items-center border-b-2"
                          >
      
      <div className="w-1/4">
        <img
          src={room.image}
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">Click me </div>
        <span className="text-gray-500">to see messages</span>
      </div>
    </div>)
    }):null } */}
    
    {/* <div className="flex flex-row py-4 px-2 items-center border-b-2">
      <div className="w-1/4">
        <img
          src="https://source.unsplash.com/otT2199XwI8/600x600"
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">Everest Trip 2021</div>
        <span className="text-gray-500">Hi Sam, Welcome</span>
      </div>
    </div>
    <div
      className="flex flex-row py-4 px-2 items-center border-b-2 border-l-4 border-blue-400" ///here's the active one 
    >
      <div className="w-1/4">
        <img
          src="https://source.unsplash.com/L2cxSuKWbpo/600x600"
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">MERN Stack</div>
        <span className="text-gray-500">Lusi : Thanks Everyone</span>
      </div>
    </div>
    <div className="flex flex-row py-4 px-2 items-center border-b-2">
      <div className="w-1/4">
        <img
          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">Javascript Indonesia</div>
        <span className="text-gray-500">Evan : some one can fix this</span>
      </div>
    </div>
    <div className="flex flex-row py-4 px-2 items-center border-b-2">
      <div className="w-1/4">
        <img
          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">Javascript Indonesia</div>
        <span className="text-gray-500">Evan : some one can fix this</span>
      </div>
    </div>

    <div className="flex flex-row py-4 px-2 items-center border-b-2">
      <div className="w-1/4">
        <img
          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
          className="object-cover h-12 w-12 rounded-full"
          alt=""
        />
      </div>
      <div className="w-full">
        <div className="text-lg font-semibold">Javascript Indonesia</div>
        <span className="text-gray-500">Evan : some one can fix this</span>
      </div>
    </div> */}
    {/* <!-- end user list --> */}
  </div>
  {/* <!-- end chat list -->
  <!-- message --> */}
  <div className="w-full px-5 flex flex-col justify-between">
    <div className="flex flex-col mt-5">
      {messages? messages.map((message, index)=>{
          return( message.user_id==user? <div className="flex justify-end mb-4" key={index}>
            <div className="text-lg font-semibold">{message.login}</div>
            <div
              className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
            >
             {message.text}
            </div>
            <img
              src={message.image?message.image:"https://source.unsplash.com/vpOeXr5wmR4/600x600"}
              className="object-cover h-8 w-8 rounded-full"
              alt=""
            />
          </div>: <div className="flex justify-start mb-4" key={index}>
          <div className="text-lg font-semibold">{message.login}</div>
        <img
          src={message.image?message.image:"https://source.unsplash.com/vpOeXr5wmR4/600x600"}
          className="object-cover h-8 w-8 rounded-full"
          alt=""
        />
        <div
          className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
        >
          {message.text}
        </div>
      </div>)
      }):null}
      {/* <div className="flex justify-end mb-4">
        <div
          className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
        >
          Welcome to group everyone !
        </div>
        <img
          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
          className="object-cover h-8 w-8 rounded-full"
          alt=""
        />
      </div>
      <div className="flex justify-start mb-4">
        <img
          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
          className="object-cover h-8 w-8 rounded-full"
          alt=""
        />
        <div
          className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
          at praesentium, aut ullam delectus odio error sit rem. Architecto
          nulla doloribus laborum illo rem enim dolor odio saepe,
          consequatur quas?
        </div>
      </div>
      <div className="flex justify-end mb-4">
        <div>
          <div
            className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
          >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Magnam, repudiandae.
          </div>

          <div
            className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Debitis, reiciendis!
          </div>
        </div>
        <img
          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
          className="object-cover h-8 w-8 rounded-full"
          alt=""
        />
      </div>
      <div class="flex justify-start mb-4">
        <img
          src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
          className="object-cover h-8 w-8 rounded-full"
          alt=""
        />
        <div
          className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
        >
          happy holiday guys!
        </div>
      </div> */}
    </div>
    <div className="py-5">
      <input
        className="w-full bg-gray-300 py-5 px-3 rounded-xl"
        type="text"
        placeholder="type your message here..."
        onChange={onChangeNewMessage}
        onKeyDown={CheckEnter}
      />
    </div>
  </div>
  {/* <!-- end message --> */}
  
  </div>
</div>
// </div>
}
export default Chats;