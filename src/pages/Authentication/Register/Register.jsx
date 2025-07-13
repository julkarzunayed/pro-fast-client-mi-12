import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useLocation, useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import useAxios from '../../../hooks/useAxios';
import SocialLogin from '../../shared/SocialLogin/SocialLogin';

const Register = () => {
    const { createUser, updateUserProfile } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [profilePic, setProfilePic] = useState('');
    const axiosInstance = useAxios()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = data => {
        createUser(data.email, data.password)
            .then(async (res) => {
                // console.log(res.user)
                res

                //Create user in the DB
                const userInfo = {
                    email: data.email,
                    role: 'user',
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString(),
                };
                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data)

                const profileInfo = {
                    displayName: data.name,
                    photoURL: profilePic,
                };
                // update user info from firebase
                updateUserProfile(profileInfo)
                    .then(() => {

                    }).catch(error => {
                        console.log(error)
                    }); // -- profile update end

                navigate(location.state?.from || '/');
                console.log(profileInfo)
            })
            .catch(err => {
                console.error(err)
                if (err.code === 'auth/email-already-in-use') {
                    Swal.fire({
                        title: "Email already registered!",
                        icon: "error",
                        
                    });
                }

            })
    }
    const onImageFileSelect = async (e) => {
        const image = e.target.files[0];
        console.log(image)
        const formData = new FormData();
        formData.append('image', image);

        const url = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imagebb_key}`

        const imageBBRes = await axios.post(url, formData)
        if (imageBBRes.data.status === 200) {
            setProfilePic(imageBBRes.data.data.url);
        }
        else if (!imageBBRes.data.status === 200) {
            Swal.fire({
                icon: "error",
                title: "Image upload failed",
                text: 'There might some error while uploading image',
                showConfirmButton: true,
            });
        }

    }
    return (
        <div className=' w-full flex items-center justify-center'>
            <div className="card-body bg-base-300 rounded-2xl shadow-[0_0px_15px_20px_rgba(80,247,255,0.05),0_0px_5px_5px_rgba(202,235,102,0.1)] max-w-sm w-full">
                <h1 className='text-4xl font-bold'>Create an account</h1>
                <p className="text-lg font-semibold">Register withe Profast</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">

                        {/* Name field */}
                        <label className="label">Your Name</label>
                        <input
                            type="text"
                            {
                            ...register("name", {
                                required: 'Name is required',

                            })
                            }
                            className="input w-full"
                            placeholder="Email" />
                        {
                            errors?.name?.type === 'required' &&
                            <p role='alert' className="text-red-500 ">Name is required</p>
                        }

                        {/* Photo */}
                        <label className="label">Photo</label>
                        <input
                            onChange={onImageFileSelect}
                            type="file"
                            className="file-input file-input-success" />


                        {/* Email */}
                        <label className="label">Email</label>
                        <input
                            type="email"
                            {
                            ...register("email", {
                                required: 'Email is required',

                            })
                            }
                            className="input w-full"
                            placeholder="Email" />
                        {
                            errors?.email?.type === 'required' &&
                            <p role='alert' className="text-red-500 ">Email is required</p>
                        }

                        {/* Password */}
                        <label className="label">Password</label>
                        <input
                            type="password"
                            {
                            ...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 6,
                                    message: 'Password must be at least 6 character long.'
                                },
                                pattern: {
                                    value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
                                    message: "Password must contain : - a number, - an uppercase letter, - a lowercase letter, - and a special character"
                                }
                            })
                            }
                            className="input w-full"
                            placeholder="Abc123@" />
                        {
                            errors?.password &&
                            <p className="text-red-500" dangerouslySetInnerHTML={{ __html: errors?.password?.message.replace(/ - /g, '  <br/> -- ') }} />
                        }

                        <div>
                            <p className="">Already have an account? go to
                                <Link className='btn btn-link text-blue-400' to={`/login`}>Login</Link>
                            </p>
                        </div>
                        <button className="btn btn-primary text-black mt-4">Register</button>
                    </fieldset>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Register;