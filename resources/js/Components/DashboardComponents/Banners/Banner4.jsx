import react from "react";

export default function Banner4(){
    return(
        <>
            <div className="relative flex items-center justify-between bg-black text-white px-[3%] py-4 rounded-xl shadow-md">
                {/* --- TEXT --- */}
                <div className="flex flex-row justify-between w-full">
                    <h1 className="text-6xl font-bold">Study Smarter Starter Pack!</h1>
                    <button className="bg-white text-black py-2 px-[4%] rounded-full m-1">SHOP NOW</button>
                </div>
            </div>
        </>
    )
}
