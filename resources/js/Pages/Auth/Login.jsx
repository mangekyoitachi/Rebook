import React, { useEffect, useState } from "react"
import { Link, useForm } from "@inertiajs/react"
import logo from "../../../../public/Assets/logo.png"

export default function Login() {

    // State to manage form data and validation errors
    const [errors, setErrors] = useState({})
    // Inertia's useForm hook to manage form state and submission
    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
    })

    // Effect to validate fields when data changes
    useEffect(() => {
        if (data.email || data.password) {
            validateField('email', data.email)
            validateField('password', data.password)
        }
    }, [data])

    // Function to validate individual fields
    const validateField = (field, value) => {
        let error = ''

        // Check if the field is empty or invalid
        if (field === 'email') {
            if (!value.trim()) {
                // If the email field is empty, set an error message
                error = 'Email is required'
            } else if (!/\S+@\S+\.\S+/.test(value)) {
                // If the email format is invalid, set an error message
                error = 'Email is invalid'
            }
        } else if (field === 'password') {
            if (!value.trim()) {
                // If the password field is empty, set an error message
                error = 'Password is required'
            } else if (value.length < 6) {
                // If the password is less than 6 characters, set an error message
                error = 'Password must be at least 6 characters'
            }
        }

        // Update the errors state for the specific field
        setErrors(prev => ({ ...prev, [field]: error }))
        // If there's no error, return true, otherwise return false
        return !error
    };

    const handleGoogleLogin = (e) => {
        // IMPORTANT: Prevent form submission
        e.preventDefault()
        e.stopPropagation()

        // Use window.location for OAuth redirects, not AJAX
        window.location.href = '/auth/google/'
    }

    const validate = () => {
        const isEmailValid = validateField('email', data.email)
        const isPasswordValid = validateField('password', data.password)
        return isEmailValid && isPasswordValid
    }

    const handleChange = (e) => {
        // Log the change event for debugging
        console.log('--- Handling Change Event ---')
        const { name, value } = e.target
        setData(name, value)
    }

    const submit = (e) => {
        e.preventDefault()

        if (validate()) {
            post("/login", {
                onSuccess: () => {
                    console.log("<=== SUBMIT SUCCESS ===>")
                    // Optionally, you can redirect or show a success message here
                },
                onError: (errors) => {
                    console.log("Backend Errors: ", errors)
                    console.log('<=== SUBMIT FAILED ===>')
                    setErrors(errors)
                    // Optionally, you can show an error message or handle errors here
                }
            })
        } else {
            // If validation fails, log the error and prevent submission
            console.log('Abort submission: Form data validation failed')
        }
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">

                <img
                    src={logo}
                    alt="Re:Book"
                    className="w-[15%] m-8"
                />

                {/* Form to submit by inertia useForm */}
                <form
                    onSubmit={submit}
                    noValidate
                    className="bg-white rounded-xl shadow-xl flex flex-col w-[25%] p-6 pt-8 pb-8 space-y-4 mb-40"
                >

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-red-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                            <div className="text-sm text-red-500">{errors.email}</div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-red-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                            <div className="text-sm text-red-500">{errors.password}</div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="shadow-md w-full bg-red-800 text-white py-2 rounded-md hover:bg-red-400 transition duration-300"
                        disabled={processing}
                    >
                        Log In
                    </button>

                    {/* fix dapat iba type value nito */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded flex justify-center items-center space-x-2 hover:bg-gray-100 w-full"
                        >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        <span className="text-sm font-medium">Login with Google</span>
                    </button>


                    <Link
                        href="/register"
                        className="shadow-md border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-md p-2 block text-center text-blue-500 font-bold"
                    >
                        Register here
                    </Link>

                </form>
            </div>
        </>
    )
}
