import React from 'react';
import { RotatingLines } from 'react-loader-spinner'

const Loading = () => {
    return (
        <div className='min-h-[60vh] flex items-center justify-center'>
            <RotatingLines
                visible={true}
                height="110"
                width="110"
                color="grey"
                strokeWidth="5"
                animationDuration="0.75"
                ariaLabel="rotating-lines-loading"
                wrapperStyle={{}}
                wrapperClass=""
            />
        </div>
    );
};

export default Loading;