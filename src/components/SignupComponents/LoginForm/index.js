import React, { useState } from 'react';
import InputComponent from '../../common/Input';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from '../../../slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../common/Button/Button';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
   
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin=async()=>{
        console.log("Handle Login")
        setLoading(true)
        if (email && password){
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            const user = userCredential.user;
    
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.data();
            console.log("userData", userData);
    
            dispatch(
              setUser({
                name: userData.name,
                email: user.email,
                uid: user.uid,
                profileImage: userData.profileImage,
              })
            );
          toast.success("Login Successfull!");
  
            setLoading(false)
            // Navigate to the profile page
            navigate("/profile");
          } catch (error) {
            console.error("Error signing in:", error);
            setLoading(false)
            toast.error(error.message)
          }
        }else {
          toast.error("Make sure email and password are not empty");
          setLoading(false);
        }
        
      }
  return (
    <>
       
        <InputComponent
          type="email"
          state={email}
          setState={setEmail}
          placeholder="Email"
          required={true}
        />
          <InputComponent
          type="password"
          state={password}
          setState={setPassword}
          placeholder="Password"
          required={true}
        />
        
        <Button text={loading? "Loading..." : "Login"} disabled={loading}  onClick={handleLogin}/>
    </>
  )
}

export default LoginForm