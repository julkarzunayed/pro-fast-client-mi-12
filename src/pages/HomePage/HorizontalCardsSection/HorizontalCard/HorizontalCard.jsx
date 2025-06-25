import React from 'react';

const HorizontalCard = ({ card }) => {
    const {
        title,
        image,
        description
    } = card;
    return (
        <div
            className="flex bg-white rounded-2xl shadow-md p-6 mb-7">
            <div className="p-4 max-w-[250px] flex items-center justify-center">
                <img src={image} alt={title} className=" mr-4" />
            </div>
            {/* Vertical line */}
            {/* <div className="h-full border-l-2 border-dashed border-gray-300"></div> */}

            <div className="flex flex-col justify-center border-l-2 border-dashed border-gray-300 pl-5">
                <h3 className="text-xl text-secondary font-bold mb-3">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
};

export default HorizontalCard;
