import React, { useEffect, useState} from 'react'
import Header from '../components/common/Header/Header'
import { collection, onSnapshot, query } from 'firebase/firestore'
import { setPodcasts } from '../slices/podcastSlice'
import { db } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import PodcastCard from '../components/Podcasts/PodcastCard'
import InputComponent from '../components/common/Input'

function Podcasts() {

    const dispatch=useDispatch();
    const [search,setSearch]=useState("");
    const podcasts=useSelector((state)=>state.podcasts.podcasts)
    useEffect(()=>{
        const unsubscribe=onSnapshot(
            query(collection(db,"podcasts")),
            (querySnapshot)=>{
                const podcastsData=[];
                querySnapshot.forEach((doc)=>{
                    podcastsData.push({id:doc.id,...doc.data()});
                });
                dispatch(setPodcasts(podcastsData));
            },
            (error)=>{
                console.error("Error fetching podcasts:",error);
            }
        );
        return ()=>{
            unsubscribe();
        };
    },[dispatch])
    console.log(podcasts);
    var filteredPodcasts=podcasts.filter((item)=>
    item.title.trim().toLowerCase().includes(search.trim().toLowerCase()))
  return (
    <div>
        <Header/>
        <div className='input-wrapper'  >
        <h1>Discover Podcasts</h1>
        <InputComponent
        state={search}
        setState={setSearch}
        placeholder="Search By Title"
        text="text"
        />
        {filteredPodcasts.length>0 ? (
        <div className='podcasts-flex' style={{marginTop:"1.5rem"}}>
        {filteredPodcasts.map((item)=>{
        return (
            <PodcastCard key={item.id}
            id={item.id}
            title={item.title}
            displayImage={item.displayImage}/>
        )
       })}
       </div>
        ):(<p>{search ? "Podcast Not Found" :"No Podcasts On The Platform"}</p>)}
        </div>
        
    </div>
  )
}

export default Podcasts;