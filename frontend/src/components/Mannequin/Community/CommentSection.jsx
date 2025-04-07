"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthenticationContex"
import AlertBox from "../../AlertBox"
import PersonIcon from "@mui/icons-material/Person"
import "../../../styles/CommentSection.css"

export default function CommentSection({ outfitId, comments, onCommentAdded }) {
    const [newComment, setNewComment] = useState("")
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const { user } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleCommentSubmit = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return

        setIsSubmitting(true)
        setError("")

        try {
            const response = await fetch(`http://localhost:5005/api/outfits/${outfitId}/comment`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: newComment }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Comment failed")
            }

            const data = await response.json()
            setNewComment("")
            setSuccessMessage("Comment posted successfully")

            const addedComment = data.comments[data.comments.length - 1]

            if (onCommentAdded && addedComment) {
                onCommentAdded(addedComment)
            }

            setTimeout(() => {
                setSuccessMessage("")
            }, 3000)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="comment-section">
            {error && <AlertBox message={error} type="error" />}
            {successMessage && <AlertBox message={successMessage} type="success" />}
            <h3>Comments ({comments.length})</h3>
            {user && (
                <form onSubmit={handleCommentSubmit}>
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
                    <button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Posting..." : "Post Comment"}
                    </button>
                </form>
            )}
            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment._id} className="comment">
                        <div className="comment-author">
                            {comment.userId?.avatar ? (
                                <img src={comment.userId.avatar || "/placeholder.svg"} alt={comment.userId.username} />
                            ) : (
                                <PersonIcon />
                            )}
                            <span>{comment.userId?.username}</span>
                        </div>
                        <p>{comment.text}</p>
                        <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
                    </div>
                ))}
            </div>
        </div>
    )
}

