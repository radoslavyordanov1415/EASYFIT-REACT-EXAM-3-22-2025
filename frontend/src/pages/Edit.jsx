"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../components/context/AuthenticationContex"
import Create from "./Create"

export default function Edit() {
    const { outfitId } = useParams()
    const { isLoggedIn } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [outfitData, setOutfitData] = useState(null)

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login")
            return
        }

        let isMounted = true

        const verifyAndFetchOutfit = async () => {
            try {
                const response = await fetch(`http://localhost:5005/api/outfits/${outfitId}`, {
                    credentials: "include",
                })

                if (!response.ok) {
                    throw new Error("Outfit not found or no permission")
                }

                if (isMounted) {
                    const data = await response.json()
                    setOutfitData(data)
                    setLoading(false)
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.message)
                    setLoading(false)
                }
            }
        }

        verifyAndFetchOutfit()

        return () => {
            isMounted = false
        }
    }, [outfitId, isLoggedIn, navigate])

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return (
            <div>
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={() => navigate("/profile")}>Back to Profile</button>
            </div>
        )
    }
    return <Create editMode outfitId={outfitId} initialData={outfitData} />
}

