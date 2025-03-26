import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AlertBox from "../components/AlertBox";
import CommentSection from "../components/Mannequin/Community/CommentSection";
import "../styles/OutfitDetails.css";
import { useAuth } from "../components/context/AuthenticationContex";

export default function OutfitDetails() {
    const { outfitId } = useParams();
    const [outfit, setOutfit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ message: "", type: "" });
    const [deleteConfirmation, setDeleteConfirmation] = useState(false);
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchOutfitDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5005/api/outfits/${outfitId}`, {
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Error fetching outfit details");
                }

                const data = await response.json();
                setOutfit(data);
            } catch (err) {
                console.error("Error fetching outfit details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (outfitId) {
            fetchOutfitDetails();
        }
    }, [outfitId]);

    const handleEdit = () => {
        navigate(`/edit/${outfitId}`);
    };

    const handleDeleteClick = () => {
        setDeleteConfirmation(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5005/api/outfits/delete/${outfitId}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (response.ok) {
                setAlert({ message: "Outfit deleted successfully", type: "success" });
                setDeleteConfirmation(false);
                setTimeout(() => navigate("/catalog"), 1500);
            }
        } catch (err) {
            setAlert({ message: "Failed to delete outfit", type: "error" });
            setDeleteConfirmation(false);
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation(false);
    };

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleCommentAdded = (newComment) => {
        setOutfit(prevOutfit => {
            if (!prevOutfit) return null;
            return {
                ...prevOutfit,
                comments: [...prevOutfit.comments, newComment]
            };
        });
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading outfit details...</p>
            </div>
        );
    }

    if (!outfit) {
        return (
            <div className="error-container">
                <p>Outfit not found or an error occurred.</p>
                <Link to="/catalog" className="back-btn">
                    Back to Catalog
                </Link>
            </div>
        );
    }

    const isOwner = user && outfit && outfit.userId === user.userId;

    return (
        <div className="outfit-details-container">
            <div className="outfit-details-header">
                <h2>{outfit.name || "Unnamed Outfit"}</h2>
                <div className="outfit-details-meta">
                    <p>Created: {formatDate(outfit.createdAt)}</p>
                    <p>Last Updated: {formatDate(outfit.updatedAt)}</p>
                </div>
            </div>

            {alert.message && <AlertBox message={alert.message} type={alert.type} />}

            <div className="outfit-details-content">
                <div
                    className="outfit-details-preview"
                    style={{
                        position: "relative",
                        width: "520px",
                        height: "600px",
                        maxWidth: "100%",
                        margin: "0 auto",
                        overflow: "hidden",
                    }}
                >
                    <img src={outfit.mannequinImage || "/placeholder.svg"} alt="Mannequin" className="mannequin-image" />
                    {Object.entries(outfit.appliedClothing || {}).map(([key, item]) => {
                        return (
                            <img
                                key={key}
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={`Clothing item ${key}`}
                                style={{
                                    position: "absolute",
                                    left: `${item.x}px`,
                                    top: `${item.y}px`,
                                    width: `${item.width}px`,
                                    height: `${item.height}px`,
                                    objectFit: "cover",
                                    zIndex: 10,
                                }}
                            />
                        );
                    })}
                </div>

                <div className="outfit-details-info">
                    <h3>Outfit Information</h3>
                    <div className="outfit-details-specs">
                        <div className="spec-item">
                            <span className="spec-label">Season:</span>
                            <span className="spec-value">{outfit.season || "Not specified"}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Occasion:</span>
                            <span className="spec-value">{outfit.occasion || "Not specified"}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Comfort Level:</span>
                            <span className="spec-value">{outfit.comfortLevel || "Not specified"}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Budget:</span>
                            <span className="spec-value">{outfit.budget || "Not specified"}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-label">Fit Type:</span>
                            <span className="spec-value">{outfit.fitType || "Not specified"}</span>
                        </div>
                    </div>

                    <div className="outfit-details-description">
                        <h4>Description</h4>
                        <p>{outfit.description || "No description provided."}</p>
                    </div>
                </div>
            </div>

            <div className="outfit-details-actions">
                {isOwner && (
                    <>
                        <button onClick={handleEdit} className="edit-btn">
                            Edit Outfit
                        </button>
                        <button onClick={handleDeleteClick} className="delete-btn">
                            Delete Outfit
                        </button>
                    </>
                )}
                <Link to="/catalog" className="back-btn">
                    Back to Catalog
                </Link>
            </div>
            <div className="comments-section">
                <CommentSection
                    outfitId={outfitId}
                    comments={outfit.comments || []}
                    onCommentAdded={handleCommentAdded}
                />
            </div>
            {deleteConfirmation && (
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
    );
}