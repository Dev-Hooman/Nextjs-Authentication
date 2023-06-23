'use client'
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { signIn, signOut, useSession, getProviders } from 'next-auth/react'
import { usePathname } from 'next/navigation';


const Nav = () => {
    const { data: session } = useSession();
    const [providers, setProviders] = useState(null)
    const [toggleDropdown, setToggleDropdown] = useState(false)
    const pathname = usePathname();

    console.log(pathname);


    useEffect(() => {
        (async () => {
            const res = await getProviders();
            setProviders(res);
        })();
    }, []);

    return (
        <div className="flex-between w-full mb-16 pt-3">
            <Link href='/' className='flex gap-2 flex-center'>
                <Image
                    src='/assets/images/logo.svg'
                    alt='logo'
                    width={30}
                    height={30}
                    className='object-contain'
                />
                <p className='logo_text'>NEXTJS 13 Authentication</p>
            </Link>


            {/* Desktop Navigation  */}
            <div className='sm:flex hidden'>
                {
                    session?.user ?
                        (<div className='flex gap-3 md:gap-5'>
                

                            <button type="button" onClick={signOut} className="outline_btn">
                                Sign Out
                            </button>


                            <Link href={"/profile"}>
                                <Image
                                    src={session.user.image}
                                    width={37}
                                    height={37}
                                    className='rounded-full'
                                    alt='profile'
                                />
                            </Link>

                        </div>

                        )
                        :
                        (<>
                            <Link
                                href={"/login"}
                                className={` ${pathname == "/login" ? "black_btn" : "outline_btn"}`}

                            // className='black_btn'
                            >
                               Login
                            </Link>

                        </>)

                }

            </div>


            {/* Mobile Navigation */}
            <div className='sm:hidden flex relative'>
                {
                    session?.user ? (<>

                        <div className='flex'>
                            <Image
                                src={session.user.image}
                                width={37}
                                height={37}
                                className='rounded-full'
                                alt='profile'
                                onClick={() => { setToggleDropdown((prev) => !prev) }}
                            />
                        </div>

                        {
                            toggleDropdown && (
                                <div className="dropdown">
                                    <Link
                                        href='/profile'
                                        className='dropdown_link'
                                        onClick={() => setToggleDropdown(false)}
                                    >
                                        My Profile
                                    </Link>

                                    <Link
                                        href='/create-prompt'
                                        className='dropdown_link'
                                        onClick={() => setToggleDropdown(false)}
                                    >
                                        Create Prompt
                                    </Link>
                                    <button
                                        type='button'
                                        onClick={() => {
                                            setToggleDropdown(false);
                                            signOut();
                                        }}
                                        className='mt-5 w-full black_btn'
                                    >
                                        Logout
                                    </button>


                                </div>
                            )
                        }


                    </>) : (<>
                        <Link
                                href={"/login"}
                                className={` ${pathname == "/login" ? "black_btn" : "outline_btn"}`}

                            // className='black_btn'
                            >
                                Login 
                            </Link>
                      </>)
                }
            </div>




        </div>
    )
}

export default Nav