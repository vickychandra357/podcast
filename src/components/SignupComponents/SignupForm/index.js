import React, { useState } from "react";
import InputComponent from "../../common/Input";
import { auth, db, storage } from "../../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FileInput from "../../common/Input/FileInput";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Button from "../../common/Button/Button";

const SignupForm = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = async () => {
    console.log("Handle Signup...");
    setLoading(true)
    if (password == confirmPassword && password.length >= 6 && fullName && email && profileImage) {
      try {
        //creating user's account
        
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;
        console.log("user", user);

        const profileImageRef = ref(
          storage,
          `podcasts/${auth.currentUser.uid}/${Date.now()}`
        );
        await uploadBytes(profileImageRef, profileImage);

        const profileImageUrl = await getDownloadURL(profileImageRef);
        // Saving user's details.
        await setDoc(doc(db, "users", user.uid), {
          name: fullName,
          email: user.email,
          uid: user.uid,
          profileImage: profileImageUrl,
        });
        // save data in the redux
        dispatch(
          setUser({
            name: fullName,
            email: user.email,
            uid: user.uid,
            profileImage: profileImageUrl,
          })
        );
        toast.success("User Has Been Created!");
        setLoading(false)
        navigate("/profile");
        setProfileImage(null);
      } catch (error) {
        console.log("error", error);
        toast.error(error.message)
        setLoading(false)
      }
    } else {
      if (password != confirmPassword) {
        toast.error("Please Make Sure Password and Confirm Password Matches!");
      } else if (password.length < 6) {
        toast.error("Please Make Sure Password is More Than 6 Digits Long!");
      }
      setLoading(false)
    }
  };

  const profileImageHandle = (file) => {
    setProfileImage(file);
  };

  return (
    <>
      <InputComponent
        type="text"
        state={fullName}
        setState={setFullName}
        placeholder="Full Name"
        required={true}
      />
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
      <InputComponent
        type="password"
        state={confirmPassword}
        setState={setConfirmPassword}
        placeholder="Confirm Password"
        required={true}
      />
      <FileInput
      accept={"image/*"}
      id="profile-image-input"
      fileHandleFnc={profileImageHandle}
      text={"Profile Image Upload"}
    />
      <Button text={loading? "Loading..." : "Signup"} disabled={loading} onClick={handleSignup} />
    </>
  );
};

export default SignupForm;