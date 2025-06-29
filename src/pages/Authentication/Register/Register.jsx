import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';

const Register = () => {
    const { createUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = data => {
        createUser(data.email, data.password)
            .then(res => {
                console.log(res.user)
            })
            .catch(err => {
                console.error(err)
            })
        console.log(data, createUser)
    }
    console.log(errors)
    return (
        <div className=' w-full flex items-center justify-center'>
            <div className="card-body border border-gray-400 bg-base-100 rounded-2xl shadow-2xl max-w-sm w-full">
                <h1 className='text-4xl font-bold'>Create an account</h1>
                <p className="text-lg font-semibold">Register withe Profast</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <fieldset className="fieldset">
                        <label className="label">Email</label>
                        {/* Email */}
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

                        <div><a className="link link-hover">Forgot password?</a></div>
                        <button className="btn btn-neutral mt-4">Register</button>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default Register;