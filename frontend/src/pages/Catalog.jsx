import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../styles/Catalog.css"



export default function Catalog() {
    const [outfits, setOutfits] = useState([])
    const [loading, setLoading] = useState(true)
    const [deleteConfirmation, setDeleteConfirmation] = useState({ show: false, outfitId: null });
    const navigate = useNavigate()

    useEffect(() => {
        const fetchOutfits = async () => {
            try {
                const outfitsResponse = await fetch("http://localhost:5005/api/outfits/all", {
                    credentials: "include",
                })
                const outfitsData = await outfitsResponse.json()
                setOutfits(outfitsData.outfits)
            } catch (err) {
                console.error("Error fetching data:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchOutfits()
    }, [])

    const handleDelete = async (outfitId) => {
        try {
            await fetch(`http://localhost:5005/api/outfits/delete/${outfitId}`, {
                method: "DELETE",
                credentials: "include",
            })
            setOutfits((prev) => prev.filter((o) => o._id !== outfitId))
        } catch (err) {
            console.error("Error deleting outfit:", err)
        }
    };

    const handleEdit = (outfitId) => {
        navigate(`/edit/${outfitId}`)
    };

    const handleViewDetails = (outfitId) => {
        navigate(`/outfit/${outfitId}`)
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    };

    const handleDeleteClick = (outfitId) => {
        setDeleteConfirmation({ show: true, outfitId });
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5005/api/outfits/delete/${deleteConfirmation.outfitId}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (response.ok) {
                setOutfits((prev) => prev.filter((outfit) => outfit._id !== deleteConfirmation.outfitId));
                setAlert({ message: "Outfit deleted successfully", type: "success" });
            }
        } catch (err) {
            setAlert({ message: "Failed to delete outfit", type: "error" });
        } finally {
            setDeleteConfirmation({ show: false, outfitId: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation({ show: false, outfitId: null });
    };

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <h2>Outfit Catalog</h2>
                <Link to="/create" className="new-outfit-btn">
                    Create New Outfit
                </Link>
            </div>

            {loading ? (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading outfits...</p>
                </div>
            ) : outfits.length === 0 ? (
                <div className="no-outfits">
                    <p>No outfits found. Create your first outfit!</p>
                </div>
            ) : (
                <div className="outfits-grid">
                    {outfits.map((outfit) => (
                        <div key={outfit._id} className="outfit-card">
                            <div className="outfit-header">
                                <h3>{outfit.name || "Unnamed Outfit"}</h3>
                                <p>Created: {formatDate(outfit.createdAt)}</p>
                            </div>
                            <div className="outfit-content">
                                <div
                                    className="outfit-preview"
                                    onClick={() => handleViewDetails(outfit._id)}
                                    style={{ position: "relative", aspectRatio: "2/3", overflow: "hidden" }}
                                >
                                    <img
                                        src={outfit.mannequinImage || "/placeholder.svg"}
                                        alt="Mannequin"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                    />
                                    {Object.entries(outfit.appliedClothing || {}).map(([key, item]) => {
                                        return (
                                            <img
                                                key={key}
                                                src={item.imageUrl || "/placeholder.svg"}
                                                alt={`Clothing item ${key}`}
                                                style={{
                                                    position: "absolute",
                                                    left: item.x ? `${item.x}px` : "50%",
                                                    top: item.y ? `${item.y}px` : "50%",
                                                    width: item.width ? `${item.width}px` : "100px",
                                                    height: item.height ? `${item.height}px` : "100px",
                                                    objectFit: "cover",
                                                    zIndex: 10,
                                                    transform: item.x ? "none" : "translate(-50%, -50%)",
                                                }}
                                            />
                                        )
                                    })}
                                </div>
                                <div className="outfit-summary">
                                    <p>Season: {outfit.season || "Not specified"}</p>
                                    <p>Occasion: {outfit.occasion || "Not specified"}</p>
                                    <p>Comfort Level: {outfit.comfortLevel || "Not specified"}</p>
                                    <p>Budget: {outfit.budget || "Not specified"}</p>
                                    <p>Fit Type: {outfit.fitType || "Not specified"}</p>

                                    <button onClick={() => handleViewDetails(outfit._id)} className="view-details-btn">
                                        View Details
                                    </button>
                                </div>
                            </div>
                            <div className="outfit-actions">
                                <button
                                    onClick={() => handleDeleteClick(outfit._id)}
                                    className="delete-button"
                                >
                                    Delete
                                </button>
                                <button onClick={() => handleEdit(outfit._id)} className="edit-btn">
                                    Edit
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {deleteConfirmation.show && (
                <div className="confirmation-overlay">
                    <div className="confirmation-dialog">
                        <h3>Confirm Delete</h3>
                        <p>Are you sure you want to delete this outfit?</p>
                        <div className="confirmation-buttons">
                            <button onClick={handleConfirmDelete} className="delete-btn">Delete</button>
                            <button onClick={handleCancelDelete} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}