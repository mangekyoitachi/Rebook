import react from "react";

export default function PurchaseNavigation(){
    return(
        <>
                <div className="bg-white mx-4 mt-4 shadow-md rounded-xl flex flex-row">
                    <div className="flex flex-row justify-around m-4 w-full space-x-4">
                        <button
                            className=""
                        >
                            All
                        </button>
                        <button
                            className=""
                        >
                            To Ship
                        </button>
                        <button
                            className=""
                        >
                            To receive
                        </button>
                        <button
                            className=""
                        >
                            Completed
                        </button>
                        <button
                            className=""
                        >
                            Cancaled
                        </button>
                    </div>
                </div>
        </>
    )
}
