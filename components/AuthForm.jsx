import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'


// firebase imports
import { storage } from '@/firebase/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

import { enqueueSnackbar, SnackbarProvider } from 'notistack'


const AuthForm = ({ loginWithGoogle, AuthType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [authLoad, setAuthLoad] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  console.log("Uploading...", uploadProgress, "%");

  const router = useRouter();


  async function handleSubmitForSignin(e) {
    e.preventDefault();
    setAuthLoad(true);

    const data = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    setAuthLoad(false);

    //need to be fix
    if (data.error == "CredentialsSignin") {
      enqueueSnackbar("Credentials Error", { variant: 'error' })
    } else {
      enqueueSnackbar('Login Success!', { variant: 'success' })

    }


  }

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRef = ref(storage, `profilePictures/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(storageRef);
          setProfilePicture(downloadURL);
          setUploadProgress(0);
        }
      );
    }
  };


  async function handleSubmitForRegister(e) {
    e.preventDefault();
    setAuthLoad(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email,
          username,
          password,
          image: profilePicture
        })
      })
      setAuthLoad(false);


      if (response.ok) {
        router.push('/')
      }

    } catch (error) {
      console.log(error);
    } finally {
      setAuthLoad(false);
    }
  }

  return (
    <form className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      onSubmit={AuthType == "Register" ? handleSubmitForRegister : handleSubmitForSignin}>
      <h1 className="head_text text-center">
        <span className="raspberry_gradient text-center">{AuthType}</span>
      </h1>
      {
        AuthType === "Register" ? (
          <>
            <div className="flex flex-row justify-center gap-3 items-center">
              <label htmlFor="profile-picture" className="cursor-pointer relative">
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                  {profilePicture ? (
                    <Image
                      src={profilePicture}
                      alt="Profile"
                      className="object-cover w-full h-full"
                      width={150}
                      height={150}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex justify-center items-center">
                      <span className="text-3xl text-gray-500">
                        {uploadProgress > 0 ? `${uploadProgress}%` : '+'}
                      </span>
                      {uploadProgress > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-16 h-16">
                            <div className="absolute top-0 left-0 right-0 bottom-0 m-auto">
                              <div className="w-16 h-16 border-t-2 border-gray-200 rounded-full animate-spin" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                />
              </label>

              <label className="font-satoshi font-semibold text-base text-gray-700">
                Add Profile Picture
              </label>
            </div>

            <label>
              <span className="font-satoshi font-semibold text-base text-gray-700">Email</span>
              <input
                className="form_input"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>




          </>
        ) : <></>
      }

      <label>
        <span className="font-satoshi font-semibold text-base text-gray-700">Username</span>
        <input
          className="form_input"
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </label>


      <label>
        <span className="font-satoshi font-semibold text-base text-gray-700">Password</span>
        <input
          className="form_input"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>



      <button className="px-5 py-1.5 text-sm bg-red-600 hover:bg-red-400 rounded-full text-white" type="submit">
        {authLoad ? <>{'Loading...'}</> : <>{AuthType}</>}
      </button>

      <div className="text-center">
        <p>
          {AuthType === 'Register' ? (
            <>
              already have an account? <Link href="/login">login</Link>
            </>
          ) : (
            <>
              Not a member? <Link href="/register">Register</Link>
            </>
          )}
        </p>
        <p>Or {AuthType === 'Register' ? <>sign in with</> : <>sign up with</>}</p>

        <button
          type="button"
          className="px-5 py-1.5 text-sm bg-white border-2 rounded-lg hover:bg-gray-300 text-black"
          onClick={loginWithGoogle}
        >
          <Image src="/assets/images/google.svg" alt="logo" width={30} height={30} className="object-contain" />


        </button>


      </div>
    </form>
  );
};

export default AuthForm;
