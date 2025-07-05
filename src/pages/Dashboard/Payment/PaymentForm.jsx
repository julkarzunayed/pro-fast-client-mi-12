import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../Loading/Loading';
import useAuth from '../../../hooks/useAuth';

const PaymentForm = () => {
    const stripe = useStripe();
    const { user } = useAuth()
    const elements = useElements();
    const [cardError, setCardError] = useState('');
    const { parcelId } = useParams();
    const axiosSecure = useAxiosSecure()
    console.log(parcelId)
    // const [parcelData] = useLoaderData();

    const { data = [], error, isLoading } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels?parcelId=${parcelId}`);
            return res.data;
        }
    })
    const [parcelData = {}] = data


    if (error) {
        return <Error></Error>
    }
    if (isLoading) {
        return <Loading />
    }
    const amount = parcelData?.cost
    const amountInCents = parseInt(amount) * 100;
    console.log(amountInCents)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        };

        const card = elements.getElement(CardElement);

        if (!card) {
            return;
        }

        const { error : paymentError, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        })

        if (paymentError) {
            setCardError(paymentError.message)
            console.log('Error', paymentError)
            return;
        }
        else {
            setCardError('')
            console.log('PaymentMethod', paymentMethod)
        }

        //step-2 create payment intent
        const res = await axiosSecure.post(`/create-checkout-session`, {
            amountInCents,
            parcelId,
        });
        console.log("res From the intent", res)
        const clientSecret = await res.data?.clientSecret

        //step-3 
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user.displayName,
                    email: user.email
                },
            },
        });

        if (result.error) {
            console.log(result.error.message)
            // setError(result.error.message);
        } else {
            if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded')
                console.log(result)
            }
        }

    }
    return (
        <div>
            <form
                className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto '
                onSubmit={handleSubmit}>
                <CardElement />
                <p className="text-red-500">{cardError}</p>
                <button
                    type='submit'
                    className='btn btn-primary w-full text-gray-700'
                    disabled={!stripe}
                >
                    Pay ৳ {amount}
                </button>
            </form>
        </div>
    );
};

export default PaymentForm;