import React, { useState } from "react"
import Slider1 from "./Sliders/Slider1"
import Slider2 from "./Sliders/Slider2"
import Slider3 from "./Sliders/Slider3"
import Slider4 from "./Sliders/Slider4"
import Banner1 from "./Banners/Banner1"
import Banner2 from "./Banners/Banner2"
import Banner3 from "./Banners/Banner3"
import Banner4 from "./Banners/Banner4"

// List of imported images
import Img1 from "../../../../public/Assets/Dashboard/Slider/img1.jpg";
import Img2 from "../../../../public/Assets/Dashboard/Slider/img2.jpg";
import Img3 from "../../../../public/Assets/Dashboard/Slider/img3.jpg";
import Img4 from "../../../../public/Assets/Dashboard/Slider/img4.jpg";


export default function Slider() {
    // Array of data
    const data = [
        Img1,
        Img2,
        Img3,
        Img4,
    ]

    // Array of component
    const components = [
        <Slider1 data={data}/>,
        <Slider2 data={data}/>,
        <Slider3 data={data}/>,
        <Slider4 data={data}/>

    ];

    // Array of banner
    const banner = [
        <Banner1 />,
        <Banner2 />,
        <Banner3/>,
        <Banner4/>
    ]

    // slider component state
    const [currentIndex, setCurrentIndex] = useState(0);

    // Previous function
    const prevComponent = () => {
        setCurrentIndex((prev) => {
          const newIndex = prev === 0 ? components.length - 1 : prev - 1;

          // Validate previous
          console.log('Previous Slider activated ---> ', prev)
          return newIndex;
        });
      };

    // Next function
    const nextComponent = () => {
        setCurrentIndex((prev) => {
            const newIndex = prev === components.length - 1 ? 0 : prev + 1;

            // Validate previous
            console.log('Next Slider activated ---> ', prev)
            return newIndex;
        });
    };

    return(
        <>
        <div className="bg-white shadow-md rounded-xl  w-full flex flex-row justify-center items-center mt-20">

            <div className=" flex flex-row justify-center items-center m-4">
                {/* button previous */}
                <button
                    onClick={prevComponent}
                >
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
            </div>

            {/* --- CONTENT --- */}
            {components[currentIndex]}

            {/* --- NEXT --- */}
            <div className="flex flex-row justify-center items-center m-4">
                {/* next button */}
                <button
                    onClick={nextComponent}
                >
                    <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </div>

        {/* --- BANNER --- */}
        {banner[currentIndex % banner.length]}
        </>
    )
}
