import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import SocialLogin from '../../shared/SocialLogin/SocialLogin';

const Login = () => {
    const { signInUser } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const onSubmit = data => {
        signInUser(data.email, data.password)
            .then(res => {
                console.log(res.user);
                navigate(location.state || '/')
            })
            .catch(err => {
                console.log(err)
            })
    }
    console.log('error', errors)
    return (
        <div className=' w-full flex items-center justify-center'>
            <div className="card-body shadow-[0_0px_15px_20px_rgba(80,247,255,0.05),0_0px_5px_5px_rgba(202,235,102,0.1)] rounded-2xl max-w-sm w-full">
                <h1 className='text-5xl font-bold'>Welcome Back</h1>
                <p className="text-lg font-semibold">Login withe Profast</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">
                        <label className="label">Email</label>
                        {/* Email */}
                        <input
                            type="email"
                            {...register(
                                'email',
                                { required: true }
                            )
                            }
                            className="input w-full"
                            placeholder="example@email.com" />
                        {
                            errors?.email?.type === 'required' &&
                            <p role='alert' className="text-red-500 ">Email is required</p>
                        }

                        {/* Password */}
                        <label className="label">Password</label>
                        <input
                            type="password"
                            {...register(
                                'password',
                                {
                                    required: 'Password is required',
                                    minLength: {
                                        value: 6,
                                        message: 'Password must be 6 characters long'
                                    },
                                    pattern: {
                                        value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])/,
                                        message: "Password must contain : - a number, - an uppercase letter, - a lowercase letter, - and a special character"
                                    }
                                }
                            )
                            }
                            className="input w-full"
                            placeholder="Abc123@" />
                        {
                            errors?.password &&
                            <p
                                role='alert'
                                className="text-red-500"
                                // Use dangerouslySetInnerHTML to render HTML from the string
                                dangerouslySetInnerHTML={{ __html: errors.password.message.replace(/ - /g, '  <br/> -- ') }}
                            />
                            // <p role='alert' className="text-red-500 ">
                            //     {errors?.password?.message.replace(/ - /g, ' - <br/> ')}
                            // </p>
                        }
                        {/* {
                            errors?.password?.type === 'minLength' &&
                            <p role='alert' className="text-red-500 ">Password must be at least 6 characters long</p>
                        } */}
                        {/* {
                            errors?.password?.type === 'pattern' &&
                            <pre role='alert' className="text-red-500 ">
                                Password must contain :
                                <br />
                                - a number,
                                <br />
                                - an uppercase letter,
                                <br />
                                - a lowercase letter,
                                <br /> - and a special character
                            </pre>
                        } */}

                        <div>
                            <a className="link link-hover">Forgot password?</a>
                        </div>
                        <div>
                            <p className="">Don't have an account? go to
                                <Link className='btn btn-link text-blue-400' to={`/register`}>Register</Link>
                            </p>
                        </div>
                        <button className="btn btn-primary text-black mt-4">Login</button>
                    </fieldset>
                </form>
                <SocialLogin></SocialLogin>
            </div>
        </div>
    );
};

export default Login;