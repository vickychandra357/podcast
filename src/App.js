import { BrowserRouter as  Router,Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import { useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { setUser } from './slices/userSlice';
import PrivateRouthes from './components/common/PrivateRoutes';
import CreateAPodcastPage from './pages/CreateAPodcast';
import Podcasts from './pages/Podcasts';
import PodcastDetails from './pages/PodcastDetails';
import CreateAnEpisode from './pages/CreateAnEpisode';

function App() {
  const dispatch=useDispatch();
  useEffect(()=>{
    const unsubscribeAuth=onAuthStateChanged(auth,(user)=>{
      if(user){
        const unsubscribeSnapshot=onSnapshot(
          doc(db,"users",user.uid),
          (userDoc)=>{
            if(userDoc.exists()){
              const userData=userDoc.data();
              dispatch(
                setUser({
                  name:userData.name,
                  email:userData.email,
                  uid:user.uid,
                })
              );
            }
          },
          (error)=>{
            console.error("Error fetching user data:",error);
          }
        );
        return ()=>{
          unsubscribeSnapshot();
        };
      }
    });
    return ()=>{
      unsubscribeAuth();
    };
  },[])
  return (
    <div className='App'>
      <ToastContainer/>
      <Router>
        <Routes>
          <Route path='/' element={<SignUp/>}/>
          <Route element={<PrivateRouthes/>}>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/create-a-podcast' element={<CreateAPodcastPage/>}/>
          <Route path='/podcasts' element={<Podcasts/>}/>
          <Route path='/podcast/:id' element={<PodcastDetails/>}/>
          <Route path='/podcast/:id/create-episode' element={<CreateAnEpisode/>}/>
         
          </Route> 
        </Routes>
      </Router>
    </div>
  );
}

export default App;
