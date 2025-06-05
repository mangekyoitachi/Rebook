import React, { useEffect, useState } from "react"
import { Link, useForm } from "@inertiajs/react"
import logo from "../../../../public/Assets/logo.png"

export default function Register() {

    // State to manage validation errors
    const [errors, setErrors] = useState({})

    // Inertia's useForm hook to manage form state and submission
    const { data, setData, post, processing } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    })

    // Enhanced validation: validate on field change and on submit
    useEffect(() => {
        // Validate all fields when any field changes, but only after initial mount
        if (
            data.name !== '' ||
            data.email !== '' ||
            data.password !== '' ||
            data.password_confirmation !== ''
        ) {
            validateAllFields()
        }
        // eslint-disable-next-line
    }, [data])

    // Validate all fields at once
    const validateAllFields = () => {
        const newErrors = {}
        let isValid = true

        // Name validation
        if (!data.name.trim()) {
            newErrors.name = 'Name is required'
            isValid = false
        }

        // Email validation
        if (!data.email.trim()) {
            newErrors.email = 'Email is required'
            isValid = false
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            newErrors.email = 'Email is invalid'
            isValid = false
        }

        // Password validation
        if (!data.password.trim()) {
            newErrors.password = 'Password is required'
            isValid = false
        } else if (data.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            isValid = false
        }

        // Password confirmation validation
        if (!data.password_confirmation.trim()) {
            newErrors.password_confirmation = 'Confirm your password'
            isValid = false
        } else if (data.password_confirmation !== data.password) {
            newErrors.password_confirmation = 'Passwords do not match'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    // Validate a single field on change and always keep errors fresh
    const validateField = (field, value) => {
        let error = ''
        switch (field) {
            case 'name':
                if (!value.trim()) error = 'Name is required'
                break
            case 'email':
                if (!value.trim()) error = 'Email is required'
                else if (!/\S+@\S+\.\S+/.test(value)) error = 'Email is invalid'
                break
            case 'password':
                if (!value.trim()) error = 'Password is required'
                else if (value.length < 6) error = 'Password must be at least 6 characters'
                break
            case 'password_confirmation':
                if (!value.trim()) error = 'Confirm your password'
                else if (value !== data.password) error = 'Passwords do not match'
                break
            default:
                break
        }
        setErrors(prev => ({ ...prev, [field]: error }))
    }

    // Always validate field on input change
    const handleChange = (e) => {
        const { name, value } = e.target
        setData(name, value)
        validateField(name, value)
    }

    const submit = (e) => {
        e.preventDefault()
        if (validateAllFields()) {
            post("/register", {
                onSuccess: () => {
                    console.log("Registration successful")
                    // Optionally redirect or show a success message
                },
                onError: (errors) => {
                    console.log("Registration failed", errors)
                    setErrors(errors)
                }
            })
        }
    }

    return (
        <>
            <div className="border flex flex-col justify-center items-center h-screen">
                <img
                    src={logo}
                    alt="Re:Book"
                    className="w-[15%] m-4"
                />

                {/* inertia useform */}
                <form
                    onSubmit={submit}
                    noValidate
                    className="bg-white shadow-xl flex flex-col w-[25%] p-6 pt-8 pb-8 rounded-xl space-y-4 mb-40"
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                        </label>
                        <input
                            type="name"
                            id="name"
                            name="name"
                            value={data.name}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-red-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.name && (
                            <div className="text-sm text-red-500">{errors.name}</div>
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
                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            onChange={handleChange}
                            className="mt-1 w-full px-4 py-2 border border-red-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password_confirmation && (
                            <div className="text-sm text-red-500">{errors.password_confirmation}</div>
                        )}
                    </div>
                    <button
                        type="submit"
                        className="shadow-md w-full bg-red-800 text-white py-2 rounded-md hover:bg-red-400 transition duration-300"
                        disabled={processing}
                    >
                        Sign In
                    </button>
                    <Link
                        href="/login"
                        className="shadow-md border-2 border-blue-500 hover:bg-blue-500 hover:text-white rounded-md p-2 block text-center text-blue-500 font-bold"
                    >
                        Back to login
                    </Link>
                </form>
            </div>
        </>
    )
}
