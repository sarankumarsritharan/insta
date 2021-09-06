import React,{ useState, useEffect } from 'react';
import './App.css';
import Post from './Post'
import { db,auth } from './firebase';
import { makeStyles }   from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button,Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50; 

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);


  const[posts,setPosts] = useState([])
  const[open,setOpen] = useState(false);
  const[openSignIn,setOpenSignIn] = useState(false);
  const[username,setUsername] = useState('');
  const[password,setPassword] = useState('');
  const[email,setEmail] = useState('');
  const[user,setUser] = useState(null);


    //useEffect -->Runs the Piece of code based on specific conditions

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((authUser) => {
        if(authUser){
          //user has loged in....
          console.log(authUser);
          setUser(authUser);

          // if(authUser.displayName){
          //   //dont update username
          // }else{
          //   // if we just created some user
          //   return authUser.updateProfile({
          //     displayName: username,
          //   })
          // }


        }else{
          //user has logged out...
          setUser(null);
        }
      })

      return ()=>{
        // Perform some cleanup action before refiring useEffect
        unsubscribe();
      }

    },[user,setUser]);

    useEffect(() => {
      db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot=>{
        // every time new post is created, this code fires...
        setPosts(snapshot.docs.map(doc=>({
          id: doc.id,
          post:doc.data()})));
      })
    }, [])

    const signUp = (event) => {
      event.preventDefault();

      auth.createUserWithEmailAndPassword(email,password)
      .then((authUser)=>{
        return authUser.user.updateProfile({
           displayName: username,
        })
      })
      .catch((error) => alert(error.message))
      setOpen(false);
    }


    const signIn = (event)=>{
      event.preventDefault();

      auth.signInWithEmailAndPassword(email, password)
      .catch(error => alert(error.message))
      setOpenSignIn(false);
    }


  return (
    <div className="app">
      
       <Modal
        open={open}
        onClose={()=>setOpen(false)}
        >
           <div style={modalStyle} className={classes.paper}>
             <form className="app__signup">
             <center>
              <img className="app__headerImage"
              src="http://2.bp.blogspot.com/-4pBaE9sDqjg/UYNzlT_tL9I/AAAAAAAAZck/PhzqPJx3le8/s200/Instragram+logo.png"
              alt=""/>
              </center>
              <Input placeholder="username" type="text" value={username} onChange={(e)=> setUsername(e.target.value)}/>
              <Input placeholder="email" type="text" value={email} onChange={(e)=> setEmail(e.target.value)}/>
              <Input placeholder="password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/> 
              <Button type="submit" onClick ={signUp} >Sign Up</Button>              
             </form>

            </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
        >
           <div style={modalStyle} className={classes.paper}>
             <form className="app__signup">
             <center>
              <img className="app__headerImage"
              src="http://2.bp.blogspot.com/-4pBaE9sDqjg/UYNzlT_tL9I/AAAAAAAAZck/PhzqPJx3le8/s200/Instragram+logo.png"
              alt=""/>
              </center>
              <Input placeholder="email" type="text" value={email} onChange={(e)=> setEmail(e.target.value)}/>
              <Input placeholder="password" type="password" value={password} onChange={(e)=> setPassword(e.target.value)}/>  
              <Button type="submit" onClick ={signIn} >Sign In</Button>            
             </form>

            </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerImage"
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/200px-Instagram_logo.svg.png"
        alt="ig"/>
          {user ?(
            <Button type="submit" onClick ={()=>auth.signOut()} >Logout</Button>
              ):(
                <div className="app__container">
                  <Button onClick ={() => setOpenSignIn (true)} >Sign In</Button>
                  <Button onClick ={() => setOpen (true)} >Sign Up</Button>
                </div>
                
              )} 
    </div>

    {/* <h1>Instagram Clone......</h1> */}

     <div className="app__posts">    
     <div className="app__postsLeft">
     {
      posts.map(({id,post}) => (
        <Post key={id} postId={id}  username={post.username} user={user} caption={post.caption} imageUrl={post.imageUrl}/>
      ))
    }
    {user?.displayName ?(
         <ImageUpload username={user.displayName}/>
      ): (
        <h3>Sorry, Login to your account to upload</h3>
      )}
      </div>

      <div className="app__postsRight">
            <InstagramEmbed
                url='https://instagr.am/p/Zw9o4/'
                clientAccessToken='123|456'
                maxWidth={320}
                hideCaption={false}
                containerTagName='div'
                protocol=''
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
                />  
        </div>
       
       
      </div>     
    
    

    </div>
  );
}

export default App;
