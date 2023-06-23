import Image from "next/image"


const Profile = ({ name, desc, profilePicture }) => {
  return (
    <section className="w-full ">
      <h1 className="head_text text-left">

        <div className="flex flex-row justify-between items-center">
          <span className="blue_gradient">
            {name} Profile
          </span>

          <div className="relative cursor-pointer">
            <div className="absolute inset-0  md:w-[150px] md:h-[150px] bg-black opacity-0 rounded-full hover:opacity-50 transition-opacity duration-300 flex justify-center items-center">
             
             <div className="text-xs md:text-sm text-white">
             Edit Profile
             </div>
           

            </div>
            <Image
              src={profilePicture}
              width={150}
              height={150}
              className='border-2 border-black rounded-full z-20'
              alt='profile'
            />
        

          </div>



        </div>




      </h1>





      <p className="desc text-left">
        {desc}
      </p>



    


    </section>
  )
}

export default Profile