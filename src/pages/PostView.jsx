import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPost } from "../services/postService";

const PostView = ({ showAlert }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    setLoading(true);
    try {
      const result = await getPost(id);
      if (result.success) {
        setPost(result.post);
      } else {
        showAlert("error", "Failed to load post");
        navigate("/dashboard");
      }
    } catch (error) {
      showAlert("error", "Error loading post");
      navigate("/dashboard");
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "published":
        return {
          color: "#28a745",
          text: "Published",
          bgColor: "#d4edda",
          borderColor: "#c3e6cb",
          textColor: "#155724"
        };
      case "scheduled":
        return {
          color: "#007BFF",
          text: "Scheduled",
          bgColor: "#d1ecf1",
          borderColor: "#bee5eb",
          textColor: "#0c5460"
        };
      case "draft":
        return {
          color: "#ffc107",
          text: "Draft",
          bgColor: "#fff3cd",
          borderColor: "#ffeaa7",
          textColor: "#856404"
        };
      default:
        return {
          color: "#6c757d",
          text: "Unknown",
          bgColor: "#f8f9fa",
          borderColor: "#dee2e6",
          textColor: "#495057"
        };
    }
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "50vh",
        fontSize: "18px",
        color: "#6c757d"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #007BFF",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px"
          }}></div>
          Loading post...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Post not found</h2>
        <Link to="/dashboard" style={{ color: "#007BFF" }}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const statusConfig = getStatusConfig(post.status);

  return (
    <div style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "0 20px"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        flexWrap: "wrap",
        gap: "16px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              padding: "10px 16px",
              backgroundColor: "#f8f9fa",
              border: "1px solid #dee2e6",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#495057",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#e9ecef";
              e.target.style.borderColor = "#adb5bd";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#f8f9fa";
              e.target.style.borderColor = "#dee2e6";
            }}
          >
            <i className="bi bi-arrow-left"></i>
            Back
          </button>
          <h1 style={{ 
            margin: 0, 
            fontSize: "28px", 
            fontWeight: "600",
            color: "#2d3748"
          }}>
            Post Details
          </h1>
        </div>

        <Link
          to={`/edit-post/${post.id}`}
          style={{
            padding: "12px 24px",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)"
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#0069d9";
            e.target.style.transform = "translateY(-1px)";
            e.target.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#007BFF";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 2px 8px rgba(0, 123, 255, 0.2)";
          }}
        >
          <i className="bi bi-pencil-square"></i>
          Edit Post
        </Link>
      </div>

      {/* Main Content */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "30px"
      }}>
        {/* Post Content Card */}
        <div style={{
          backgroundColor: "#ffffff",
          border: `2px solid ${statusConfig.color}33`,
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          transition: "all 0.3s ease"
        }}>
          {/* Status Badge */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            <div>
              <h2 style={{
                margin: "0 0 8px 0",
                fontSize: "32px",
                fontWeight: "700",
                color: "#2d3748",
                lineHeight: "1.2"
              }}>
                {post.title}
              </h2>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "8px"
              }}>
                <span  style={{
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600",
                  backgroundColor: statusConfig.bgColor,
                  color: statusConfig.textColor,
                  border: `1px solid ${statusConfig.borderColor}`,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  <i className={`pe-1 bi bi-${post.status === 'published' ? 'check-circle' : post.status === 'scheduled' ? 'clock' : 'file-text'}`}></i>
                  {statusConfig.text}
                </span>
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div style={{
            marginBottom: "30px",
            padding: "24px",
            backgroundColor: "#f8f9fa",
            borderRadius: "12px",
            border: "1px solid #e9ecef"
          }}>
            <h3 style={{
              margin: "0 0 16px 0",
              fontSize: "18px",
              fontWeight: "600",
              color: "#495057",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="bi bi-file-text"></i>
              Content
            </h3>
            <div style={{
              fontSize: "16px",
              lineHeight: "1.6",
              color: "#495057",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word"
            }}>
              {post.content || "No content provided."}
            </div>
          </div>

          {/* Image Preview */}
          {post.image && (
            <div style={{
              marginBottom: "30px",
              padding: "24px",
              backgroundColor: "#f8f9fa",
              borderRadius: "12px",
              border: "1px solid #e9ecef"
            }}>
              <h3 style={{
                margin: "0 0 16px 0",
                fontSize: "18px",
                fontWeight: "600",
                color: "#495057",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <i className="bi bi-image"></i>
                Attached Image
              </h3>
              <div style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}>
                {!imageError ? (
                  <img
                    src={`http://127.0.0.1:8000/storage/${post.image}`}
                    alt={post.title}
                    style={{
                      width: "100%",
                      maxWidth: "600px",
                      height: "auto",
                      display: "block",
                      borderRadius: "8px"
                    }}
                    onError={() => setImageError(true)}
                    onLoad={() => console.log("Image loaded successfully")}
                  />
                ) : (
                  <div style={{
                    width: "100%",
                    maxWidth: "600px",
                    height: "300px",
                    backgroundColor: "#e9ecef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    color: "#6c757d",
                    fontSize: "16px",
                    flexDirection: "column",
                    gap: "8px"
                  }}>
                    <i className="bi bi-image" style={{ fontSize: "48px" }}></i>
                    <p>Image could not be loaded</p>
                    <small>{post.image}</small>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "30px"
          }}>
            {/* Platforms */}
            <div style={{
              padding: "20px",
              backgroundColor: "#ffffff",
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
            }}>
              <h4 style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "#495057",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <i className="bi bi-share"></i>
                Platforms ({post.platforms?.length || 0})
              </h4>
              <div style={{ fontSize: "14px", color: "#6c757d" }}>
                {post.platforms && post.platforms.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {post.platforms.map((platform) => (
                      <span
                        key={platform.id}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "#007BFF22",
                          color: "#007BFF",
                          borderRadius: "16px",
                          fontSize: "12px",
                          fontWeight: "500",
                          border: "1px solid #007BFF44",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <i className="bi bi-check-circle-fill" style={{ fontSize: "10px" }}></i>
                        {platform.name} ({platform.type})
                      </span>
                    ))}
                  </div>
                ) : (
                  <span style={{ fontStyle: "italic", color: "#868e96" }}>No platforms selected</span>
                )}
              </div>
            </div>

            {/* Schedule Info */}
            {post.status === "scheduled" && post.scheduled_time && (
              <div style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
              }}>
                <h4 style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#495057",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <i className="bi bi-calendar-event"></i>
                  Scheduled For
                </h4>
                <div style={{ fontSize: "14px", color: "#6c757d" }}>
                  {formatDate(post.scheduled_time)}
                </div>
              </div>
            )}

            {/* Creation Date */}
            <div style={{
              padding: "20px",
              backgroundColor: "#ffffff",
              border: "1px solid #e9ecef",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
            }}>
              <h4 style={{
                margin: "0 0 12px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "#495057",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <i className="bi bi-calendar-plus"></i>
                Created
              </h4>
              <div style={{ fontSize: "14px", color: "#6c757d" }}>
                {formatDate(post.created_at)}
              </div>
            </div>

            {/* Last Updated */}

              <div style={{
                padding: "20px",
                backgroundColor: "#ffffff",
                border: "1px solid #e9ecef",
                borderRadius: "12px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
              }}>
                <h4 style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#495057",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <i className="bi bi-pencil-square"></i>
                  Last Updated
                </h4>
                <div style={{ fontSize: "14px", color: "#6c757d" }}>
                 {
                    formatDate(post.updated_at)
                 }
                </div>
              </div>
            
          </div>
        </div>
      </div>

      {/* Inline Styles for Animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .post-view-container {
              padding: 0 16px;
            }
            
            .post-view-header {
              flex-direction: column;
              align-items: stretch;
            }
            
            .post-view-title {
              font-size: 24px !important;
            }
            
            .post-view-content {
              padding: 20px !important;
            }
            
            .post-view-metadata {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PostView;