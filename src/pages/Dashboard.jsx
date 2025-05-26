import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "../services/postService";
import { getEnabledPlatforms, getPlatforms } from "../services/platformService";
import { Settings, CheckCircle, XCircle } from "lucide-react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Dashboard = ({ showAlert }) => {
  const [posts, setPosts] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [enabledPlatforms, setEnabledPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("list"); // 'list' or 'calendar'
  const [filters, setFilters] = useState({
    status: "",
    date: "",
  });
  const [calendarDate, setCalendarDate] = useState(new Date());

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postsResult, platformsResult, enabledPlatformsResult] =
        await Promise.all([
          getPosts(filters),
          getPlatforms(),
          getEnabledPlatforms(),
        ]);

      if (postsResult.success) {
        setPosts(postsResult.posts);
      } else {
        showAlert("error", postsResult.error || "Failed to load posts");
      }

      if (platformsResult.success) {
        setPlatforms(platformsResult.platforms);
      } else {
        showAlert("error", "Failed to load platforms");
      }

      if (enabledPlatformsResult.success) {
        setEnabledPlatforms(enabledPlatformsResult.platforms);
      } else {
        showAlert("error", "Failed to load enabled platforms");
      }
    } catch (error) {
      showAlert("error", "Error loading dashboard data");
    }
    setLoading(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    return new Date(dateString).toLocaleString();
  };

  const getPostsForDate = (date) => {
    return posts.filter(post => {
      if (post.status !== "scheduled" || !post.scheduled_at) return false;
      const postDate = new Date(post.scheduled_at);
      return (
        postDate.getFullYear() === date.getFullYear() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getDate() === date.getDate()
      );
    });
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayPosts = getPostsForDate(date);
      if (dayPosts.length > 0) {
        return (
          <div className="calendar-posts">
            {dayPosts.slice(0, 3).map(post => (
              <div 
                key={post.id} 
                className="calendar-post-indicator"
                style={{
                  backgroundColor: '#238DFF',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  margin: '1px auto',
                }} 
              />
            ))}
            {dayPosts.length > 3 && (
              <div 
                className="calendar-post-more"
                style={{
                  color: '#238DFF',
                  fontSize: '10px',
                  fontWeight: '600',
                  marginTop: '2px'
                }}
              >
                +{dayPosts.length - 3}
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      const classes = [];
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        classes.push('highlight-today');
      }
      
      if (
        calendarDate &&
        date.getDate() === calendarDate.getDate() &&
        date.getMonth() === calendarDate.getMonth() &&
        date.getFullYear() === calendarDate.getFullYear()
      ) {
        classes.push('highlight-selected');
      }
      
      const dayPosts = getPostsForDate(date);
      if (dayPosts.length > 0) {
        classes.push('has-posts');
      }
      return classes.length > 0 ? classes.join(' ') : null;
    }
    return null;
  };

  if (loading) {
    return <div className="text-center">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="flex-between mb-10">
        <h1>Dashboard</h1>
        <Link to="/create-post" className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>Create New Post
        </Link>
      </div>

      <div className="mb-10">
        <button
          className={`btn ${view === "list" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setView("list")}
          style={{ marginRight: "10px" }}
        >
          <i className="bi bi-list-ul me-2"></i>List View
        </button>
        <button
          className={`btn ${view === "calendar" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setView("calendar")}
        >
          <i className="bi bi-calendar me-2"></i>Calendar View
        </button>
      </div>

      {view === "calendar" && (
        <div className="calendar-view mb-20">
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            <Calendar
              onChange={setCalendarDate}
              value={calendarDate}
              tileContent={tileContent}
              tileClassName={tileClassName}
              className="modern-calendar"
              navigationLabel={({ date, label }) => (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontWeight: '600',
                  color: '#1f2937',
                  fontSize: '16px'
                }}>
                  <span>{label}</span>
                </div>
              )}
              formatShortWeekday={(locale, date) => 
                ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]
              }
            />
          </div>

          <div className="calendar-posts-list mt-6" style={{
            marginTop: 6,
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>Scheduled Posts for {calendarDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </h3>
            
            {getPostsForDate(calendarDate).length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#f3f4fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <i className="bi bi-calendar" style={{ color: '#6b7280', fontSize: '24px' }}></i>
                </div>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '16px',
                  marginBottom: '16px'
                }}>No posts scheduled for this date</p>
                <Link 
                  to="/create-post" 
                  className="btn btn-primary"
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  <i className="bi bi-plus-lg me-2"></i>Create New Post
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {getPostsForDate(calendarDate).map(post => (
                  <div
                    key={post.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '20px',
                      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.2s ease'
                    }}
                    >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ 
                        margin: 0,
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#1f2937'
                      }}>{post.title}</h4>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#dbeafe',
                        color: '#238DFF',
                        textTransform: 'uppercase'
                      }}>
                        Scheduled
                      </span>
                    </div>
                    
                    <p style={{ 
                      color: '#6b7280', 
                      margin: '8px 0 12px',
                      fontSize: '14px'
                    }}>{post.content.substring(0, 120)}{post.content.length > 120 ? '...' : ''}</p>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '12px'
                    }}>
                      <i className="bi bi-clock" style={{ color: '#6b7280', fontSize: '14px' }}></i>
                      <span style={{
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        {formatDate(post.scheduled_at)}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <i className="bi bi-share" style={{ color: '#6b7280', fontSize: '14px' }}></i>
                      <span style={{
                        fontSize: '13px',
                        color: '#6b7280'
                      }}>
                        {post.platforms?.map(p => p.type).join(', ') || 'No platforms'}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px',
                      borderTop: '1px solid #f3f4f6',
                      paddingTop: '16px',
                      marginTop: '8px'
                    }}>
                      <Link 
                        to={`/edit-post/${post.id}`} 
                        style={{
                          padding: '8px 14px',
                          backgroundColor: '#f3f4f6',
                          color: '#238DFF',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '500',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#dbeafe';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f3f4f6';
                        }}
                      >
                        <i className="bi bi-pencil" style={{ fontSize: '12px' }}></i>
                        Edit
                      </Link>
                      <Link 
                        to={`/post/${post.id}`} 
                        style={{
                          padding: '8px 14px',
                          backgroundColor: '#238DFF',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '500',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1e7ae6';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#238DFF';
                        }}
                      >
                        <i className="bi bi-eye" style={{ fontSize: '12px' }}></i>
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="grid grid-2">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Recent Posts</h3>
            </div>

            <div style={{ display: "flex", gap: "10px", padding: "1rem" }}>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="published">Published</option>
              </select>

              <input
                type="date"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                }}
              />
            </div>

            <div
              className="scrollable-container"
              style={{
                padding: "1rem",
                maxHeight: "500px",
                overflowY: "auto",
              }}
            >
              {posts.length === 0 ? (
                <p className="text-center">
                  No posts found.{" "}
                </p>
              ) : (
                posts.map((post) => {
                  const isPublished = post.status === "published";
                  const isDraft = post.status === "draft";
                  const isScheduled = post.status === "scheduled";

                  let statusColor, statusText;

                  if (isPublished) {
                    statusColor = "#22c55e";
                    statusText = "Published";
                  } else if (isDraft) {
                    statusColor = "#f59e0b";
                    statusText = "Draft";
                  } else if (isScheduled) {
                    statusColor = "#238DFF";
                    statusText = "Scheduled";
                  } else {
                    statusColor = "#6b7280";
                    statusText = "Unknown";
                  }

                  return (
                    <div
                      key={post.id}
                      style={{
                        backgroundColor: "#ffffff",
                        border: `2px solid ${statusColor}33`,
                        borderRadius: "12px",
                        padding: "20px",
                        marginBottom: "16px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = `0 4px 16px ${statusColor}44`;
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0, 0, 0, 0.06)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <h4 style={{ margin: 0, fontSize: '16px', color: '#1f2937' }}>{post.title}</h4>
                        <span
                          style={{
                            padding: "6px 14px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: `${statusColor}22`,
                            color: statusColor,
                            border: `1px solid ${statusColor}55`,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {statusText}
                        </span>
                      </div>

                      <p style={{ color: "#6b7280", margin: "10px 0 5px", fontSize: '14px' }}>
                        {post.content}
                      </p>

                      <p style={{ fontSize: "13px", color: "#6b7280" }}>
                        Platforms:{" "}
                        {post.platforms?.map((p) => p.type).join(", ") ||
                          "None"}
                      </p>
                      {post.status === "scheduled" && (
                        <p style={{ fontSize: "13px", color: "#6b7280" }}>
                          {post.scheduled_at
                            ? `Scheduled: ${formatDate(post.scheduled_at)}`
                            : "Not scheduled"}
                        </p>
                      )}
                      <div
                        style={{
                          marginTop: "10px",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <Link
                          to={`/edit-post/${post.id}`}
                          style={{
                            padding: "8px 14px",
                            backgroundColor: "#f3f4f6",
                            color: "#238DFF",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#dbeafe";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#f3f4f6";
                          }}
                        >
                          <i className="bi bi-pencil me-2"></i>Edit
                        </Link>
                        <Link
                          to={`/post/${post.id}`}
                          style={{
                            padding: "8px 14px",
                            backgroundColor: "#238DFF",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "12px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#1e7ae6";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#238DFF";
                          }}
                        >
                          <i className="bi bi-eye me-2"></i>View
                        </Link>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="card scrollable-container" style={{ 
            maxHeight: "600px", 
            overflowY: "auto", 
            display: "flex", 
            flexDirection: "column" 
          }}>
            <div className="card-header">
              <h3 className="card-title">Platform Status</h3>
            </div>

            <div style={{ 
              padding: "1rem", 
              flex: 1, 
              display: "flex", 
              flexDirection: "column",
              gap: "12px"
            }}>
              {platforms.length === 0 ? (
                <p style={{ 
                  textAlign: "center", 
                  color: "#6b7280", 
                  padding: "1rem" 
                }}>
                  No platforms found.
                </p>
              ) : (
                platforms.map((platform) => {
                  const isActive = enabledPlatforms.some(
                    (ep) => ep.id === platform.id
                  );

                  return (
                    <div
                      key={platform.id}
                      style={{
                        backgroundColor: "#ffffff",
                        border: `2px solid ${isActive ? "#238DFF" : "#e5e7eb"}`,
                        borderRadius: "12px",
                        padding: "20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.3s ease",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                        cursor: "pointer",
                        position: "relative",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.boxShadow =
                          "0 4px 16px rgba(0, 123, 255, 0.15)";
                        e.target.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.boxShadow =
                          "0 2px 8px rgba(0, 0, 0, 0.06)";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          width: "100px",
                          height: "100%",
                          background: `linear-gradient(90deg, transparent 0%, ${
                            isActive
                              ? "rgba(35, 141, 255, 0.03)"
                              : "rgba(108, 117, 125, 0.03)"
                          } 100%)`,
                          pointerEvents: "none",
                        }}
                      />

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "16px",
                          zIndex: 1,
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            backgroundColor: isActive ? "#238DFF" : "#6b7280",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "600",
                            boxShadow: `0 4px 12px ${
                              isActive
                                ? "rgba(35, 141, 255, 0.3)"
                                : "rgba(108, 117, 125, 0.3)"
                            }`,
                            transition: "all 0.3s ease",
                          }}
                        >
                          {platform.name.charAt(0)}
                        </div>

                        <div>
                          <h3
                            style={{
                              margin: 0,
                              fontSize: "18px",
                              fontWeight: "600",
                              color: "#1f2937",
                              marginBottom: "4px",
                            }}
                          >
                            {platform.name}
                          </h3>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              lineHeight: "1.4",
                              color: '#6b7280'
                            }}
                          >
                            {platform.type}
                          </p>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              marginTop: "8px",
                            }}
                          >
                            {isActive ? (
                              <CheckCircle
                                size={14}
                                style={{ color: "#22c55e" }}
                              />
                            ) : (
                              <XCircle size={14} style={{ color: "#ef4444" }} />
                            )}
                            <span
                              style={{
                                fontSize: "12px",
                                color: isActive ? "#22c55e" : "#ef4444",
                                fontWeight: "500",
                              }}
                            >
                              {isActive
                                ? "Connected & Active"
                                : "Not Connected"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          zIndex: 1,
                        }}
                      >
                        <div
                          style={{
                            padding: "8px 16px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            backgroundColor: isActive ? "#dcfce7" : "#fee2e2",
                            color: isActive ? "#15803d" : "#b91c1c",
                            border: `1px solid ${
                              isActive ? "#bbf7d0" : "#fecaca"
                            }`,
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              <div
                style={{
                  marginTop: "24px",
                  display: "flex",
                  justifyContent: "center",
                  paddingBottom: "1rem",
                }}
              >
                <Link
                  to="/settings"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#6b7280",
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
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#4b5563";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#6b7280";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 2px 8px rgba(0, 0, 0, 0.15)";
                  }}
                >
                  <Settings size={16} />
                  Manage Platforms
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;