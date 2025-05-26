// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { getPost, updatePost, deletePost } from '../services/postService';
// import { getEnabledPlatforms } from '../services/platformService';

// const EditPost = ({ showAlert }) => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [platforms, setPlatforms] = useState([]);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     image: null,
//     platforms: [],
//     scheduled_at: '',
//     status: 'draft'
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [characterCount, setCharacterCount] = useState(0);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [currentImage, setCurrentImage] = useState(null);
//   const [removeImage, setRemoveImage] = useState(false);

//   useEffect(() => {
//     loadData();
//   }, [id]);

//   useEffect(() => {
//     setCharacterCount(formData.content.length);
//   }, [formData.content]);

//   const loadData = async () => {
//     try {
//       const [postResult, platformsResult] = await Promise.all([
//         getPost(id),
//         getEnabledPlatforms()
//       ]);

//       if (postResult.success) {
//         const post = postResult.post;

//         let scheduledAt = '';
//         if (post.scheduled_at && post.status === 'scheduled') {
//           const date = new Date(post.scheduled_at);
//           if (!isNaN(date.getTime())) {
//             scheduledAt = date.toISOString().slice(0, 16);
//           }
//         }
        
//         setFormData({
//           title: post.title || '',
//           content: post.content || '',
//           image: null,
//           platforms: post.platforms ? post.platforms.map(p => p.id) : [],
//           scheduled_at: scheduledAt,
//           status: post.status || 'draft'
//         });
        
//         setCurrentImage(post.image);
//       } else {
//         showAlert('error', 'Post not found');
//         navigate('/dashboard');
//         return;
//       }

//       if (platformsResult.success) {
//         setPlatforms(platformsResult.platforms);
//       } else {
//         showAlert('error', 'Failed to load platforms');
//       }
//     } catch (error) {
//       showAlert('error', 'Error loading post data');
//       navigate('/dashboard');
//     }
//     setLoading(false);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const platforms = Array.isArray(formData.platforms) ? formData.platforms : [];
    
//     if (platforms.length === 0) {
//       showAlert('error', 'Please select at least one platform');
//       return;
//     }

//     if (formData.status === 'scheduled' && !formData.scheduled_at) {
//       showAlert('error', 'Please set a schedule date and time for scheduled posts');
//       return;
//     }

//     setSaving(true);

//     try {
//       const updatedData = new FormData();
      
//       updatedData.append('title', formData.title || '');
//       updatedData.append('content', formData.content || '');
//       updatedData.append('status', formData.status || 'draft');
      
//       const platformTypes = platforms.map(platformId => {
//         const platform = platforms.find(p => p.id === platformId);
//         return platform ? platform.type : null;
//       }).filter(Boolean);
      
//       platformTypes.forEach(platformType => {
//         updatedData.append('platforms[]', platformType);
//       });
      
//       if (formData.status === 'scheduled' && formData.scheduled_at) {
//         updatedData.append('scheduled_time', new Date(formData.scheduled_at).toISOString());
//       }
      
//       if (removeImage) {
//         updatedData.append('remove_image', 'true');
//       } else if (formData.image && formData.image instanceof File) {
//         updatedData.append('image', formData.image);
//       }

//       const result = await updatePost(id, updatedData);
      
//       if (result.success) {
//         showAlert('success', 'Post updated successfully!');
//         navigate('/dashboard');
//       } else {
//         const errorMessage = result.error || 
//           (result.errors ? Object.values(result.errors).flat().join(', ') : 'Failed to update post');
//         showAlert('error', errorMessage);
//       }
//     } catch (error) {
//       console.error('Update error:', error);
//       showAlert('error', `Error updating post: ${error.message || 'Unknown error'}`);
//     }

//     setSaving(false);
//   };

//   const handleDelete = async () => {
//     try {
//       const result = await deletePost(id);
      
//       if (result.success) {
//         showAlert('success', 'Post deleted successfully!');
//         navigate('/dashboard');
//       } else {
//         showAlert('error', result.error || 'Failed to delete post');
//       }
//     } catch (error) {
//       showAlert('error', 'Error deleting post');
//     }
//     setShowDeleteConfirm(false);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, files } = e.target;
    
//     if (type === 'file') {
//       const file = files[0];
//       setFormData({
//         ...formData,
//         [name]: file
//       });
      
//       if (file) {
//         const reader = new FileReader();
//         reader.onload = (e) => setImagePreview(e.target.result);
//         reader.readAsDataURL(file);
//       } else {
//         setImagePreview(null);
//       }
//       setRemoveImage(false);
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };

//   const handlePlatformChange = (platformId) => {
//     setFormData(prev => ({
//       ...prev,
//       platforms: prev.platforms.includes(platformId)
//         ? prev.platforms.filter(p => p !== platformId)
//         : [...prev.platforms, platformId]
//     }));
//   };

//   const handleRemoveImage = () => {
//     setFormData(prev => ({
//       ...prev,
//       image: null
//     }));
//     setImagePreview(null);
//     setRemoveImage(true);
//   };

//   const getCharacterCountColor = () => {
//     if (characterCount > 280) return '#dc3545';
//     if (characterCount > 200) return '#ffc107';
//     return '#28a745';
//   };

//   const getCharacterCountBg = () => {
//     if (characterCount > 280) return '#f8d7da';
//     if (characterCount > 200) return '#fff3cd';
//     return '#d4edda';
//   };

//   if (loading) {
//     return (
//       <div style={{ 
//         display: "flex", 
//         justifyContent: "center", 
//         alignItems: "center", 
//         minHeight: "50vh",
//         fontSize: "18px",
//         color: "#6c757d"
//       }}>
//         <div style={{ textAlign: "center" }}>
//           <div style={{
//             width: "40px",
//             height: "40px",
//             border: "4px solid #f3f3f3",
//             borderTop: "4px solid #007BFF",
//             borderRadius: "50%",
//             animation: "spin 1s linear infinite",
//             margin: "0 auto 16px"
//           }}></div>
//           Loading post...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
//       <div style={{
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: "30px",
//         flexWrap: "wrap",
//         gap: "16px"
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
//           <button
//             onClick={() => navigate("/dashboard")}
//             style={{
//               padding: "10px 16px",
//               backgroundColor: "#f8f9fa",
//               border: "1px solid #dee2e6",
//               borderRadius: "8px",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               fontSize: "14px",
//               fontWeight: "500",
//               color: "#495057",
//               transition: "all 0.3s ease"
//             }}
//             onMouseEnter={(e) => {
//               e.target.style.backgroundColor = "#e9ecef";
//               e.target.style.borderColor = "#adb5bd";
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.backgroundColor = "#f8f9fa";
//               e.target.style.borderColor = "#dee2e6";
//             }}
//           >
//             <i className="bi bi-arrow-left"></i>
//             Back
//           </button>
//           <h1 style={{ 
//             margin: 0, 
//             fontSize: "28px", 
//             fontWeight: "600",
//             color: "#2d3748"
//           }}>
//             Edit Post
//           </h1>
//         </div>
//       </div>

//       <div style={{
//         backgroundColor: "#ffffff",
//         border: "2px solid #e9ecef",
//         borderRadius: "16px",
//         padding: "30px",
//         boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
//       }}>
//         <form onSubmit={handleSubmit}>
//           <div style={{ marginBottom: "24px" }}>
//             <label style={{
//               display: "block",
//               marginBottom: "12px",
//               fontSize: "16px",
//               fontWeight: "600",
//               color: "#2d3748",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px"
//             }}>
//               <i className="bi bi-card-heading"></i>
//               Post Title
//             </label>
//             <input
//               type="text"
//               name="title"
//               value={formData.title}
//               onChange={handleChange}
//               required
//               placeholder="Enter an engaging title..."
//               style={{
//                 width: "100%",
//                 padding: "16px 20px",
//                 border: "2px solid #e9ecef",
//                 borderRadius: "12px",
//                 fontSize: "16px",
//                 transition: "all 0.3s ease",
//                 outline: "none",
//                 backgroundColor: "#ffffff"
//               }}
//               onFocus={(e) => {
//                 e.target.style.borderColor = "#007BFF";
//                 e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
//               }}
//               onBlur={(e) => {
//                 e.target.style.borderColor = "#e9ecef";
//                 e.target.style.boxShadow = "none";
//               }}
//             />
//           </div>

//           <div style={{ marginBottom: "24px" }}>
//             <label style={{
//               display: "block",
//               marginBottom: "12px",
//               fontSize: "16px",
//               fontWeight: "600",
//               color: "#2d3748",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px"
//             }}>
//               <i className="bi bi-file-text"></i>
//               Content
//             </label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               required
//               placeholder="What's on your mind?"
//               rows="6"
//               style={{
//                 width: "100%",
//                 padding: "16px 20px",
//                 border: "2px solid #e9ecef",
//                 borderRadius: "12px",
//                 fontSize: "16px",
//                 transition: "all 0.3s ease",
//                 outline: "none",
//                 backgroundColor: "#ffffff",
//                 resize: "vertical",
//                 minHeight: "120px"
//               }}
//               onFocus={(e) => {
//                 e.target.style.borderColor = "#007BFF";
//                 e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
//               }}
//               onBlur={(e) => {
//                 e.target.style.borderColor = "#e9ecef";
//                 e.target.style.boxShadow = "none";
//               }}
//             />
//             <div style={{
//               display: "flex",
//               justifyContent: "flex-end",
//               marginTop: "8px"
//             }}>
//               <span style={{
//                 padding: "4px 12px",
//                 borderRadius: "20px",
//                 fontSize: "12px",
//                 fontWeight: "600",
//                 color: getCharacterCountColor(),
//                 backgroundColor: getCharacterCountBg(),
//                 border: `1px solid ${getCharacterCountColor()}33`
//               }}>
//                 {characterCount} characters
//               </span>
//             </div>
//           </div>

//           <div style={{ marginBottom: "24px" }}>
//             <label style={{
//               display: "block",
//               marginBottom: "12px",
//               fontSize: "16px",
//               fontWeight: "600",
//               color: "#2d3748",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px"
//             }}>
//               <i className="bi bi-toggle-on"></i>
//               Post Status
//             </label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               style={{
//                 width: "100%",
//                 padding: "16px 20px",
//                 border: "2px solid #e9ecef",
//                 borderRadius: "12px",
//                 fontSize: "16px",
//                 transition: "all 0.3s ease",
//                 outline: "none",
//                 backgroundColor: "#ffffff"
//               }}
//               onFocus={(e) => {
//                 e.target.style.borderColor = "#007BFF";
//                 e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
//               }}
//               onBlur={(e) => {
//                 e.target.style.borderColor = "#e9ecef";
//                 e.target.style.boxShadow = "none";
//               }}
//             >
//               <option value="draft">Draft</option>
//               <option value="scheduled">Scheduled</option>
//             </select>
//           </div>

//           <div style={{ marginBottom: "24px" }}>
//             <label style={{
//               display: "block",
//               marginBottom: "12px",
//               fontSize: "16px",
//               fontWeight: "600",
//               color: "#2d3748",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px"
//             }}>
//               <i className="bi bi-image"></i>
//               Update Image (optional)
//             </label>
            
//             {(imagePreview || (currentImage && !removeImage)) && (
//               <div style={{
//                 marginBottom: "16px",
//                 padding: "16px",
//                 backgroundColor: "#f8f9fa",
//                 borderRadius: "12px",
//                 border: "1px solid #e9ecef"
//               }}>
//                 <p style={{
//                   margin: "0 0 12px 0",
//                   fontSize: "14px",
//                   fontWeight: "500",
//                   color: "#495057"
//                 }}>
//                   {imagePreview ? "New image preview:" : "Current image:"}
//                 </p>
//                 <img
//                   src={imagePreview || `http://127.0.0.1:8000/storage/${currentImage}`}
//                   alt="Preview"
//                   style={{
//                     maxWidth: "300px",
//                     maxHeight: "200px",
//                     borderRadius: "8px",
//                     border: "1px solid #dee2e6"
//                   }}
//                 />
//                 <button
//                   type="button"
//                   onClick={handleRemoveImage}
//                   style={{
//                     marginTop: "12px",
//                     padding: "8px 16px",
//                     backgroundColor: "#dc3545",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "8px",
//                     fontSize: "14px",
//                     fontWeight: "600",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease"
//                   }}
//                   onMouseEnter={(e) => {
//                     e.target.style.backgroundColor = "#c82333";
//                   }}
//                   onMouseLeave={(e) => {
//                     e.target.style.backgroundColor = "#dc3545";
//                   }}
//                 >
//                   <i className="bi bi-trash"></i> Remove Image
//                 </button>
//               </div>
//             )}

//             <input
//               type="file"
//               id="image"
//               name="image"
//               onChange={handleChange}
//               accept="image/*"
//               style={{
//                 width: "100%",
//                 padding: "16px 20px",
//                 border: "2px dashed #e9ecef",
//                 borderRadius: "12px",
//                 fontSize: "16px",
//                 transition: "all 0.3s ease",
//                 outline: "none",
//                 backgroundColor: "#ffffff",
//                 cursor: "pointer"
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.borderColor = "#007BFF";
//                 e.target.style.backgroundColor = "#f8f9ff";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.borderColor = "#e9ecef";
//                 e.target.style.backgroundColor = "#ffffff";
//               }}
//             />
//           </div>

//           <div style={{ marginBottom: "24px" }}>
//             <label style={{
//               display: "block",
//               marginBottom: "16px",
//               fontSize: "16px",
//               fontWeight: "600",
//               color: "#2d3748",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px"
//             }}>
//               <i className="bi bi-share"></i>
//               Platforms ({formData.platforms.length} selected)
//             </label>
            
//             {platforms.length === 0 ? (
//               <div style={{
//                 padding: "20px",
//                 backgroundColor: "#fff3cd",
//                 border: "1px solid #ffeaa7",
//                 borderRadius: "12px",
//                 textAlign: "center"
//               }}>
//                 <i className="bi bi-exclamation-triangle" style={{ fontSize: "24px", color: "#856404", marginBottom: "8px" }}></i>
//                 <p style={{ margin: "0 0 8px 0", color: "#856404", fontWeight: "500" }}>
//                   No platforms enabled
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => navigate('/settings')}
//                   style={{
//                     padding: "8px 16px",
//                     backgroundColor: "#007BFF",
//                     color: "white",
//                     border: "none",
//                     borderRadius: "6px",
//                     fontSize: "14px",
//                     fontWeight: "500",
//                     cursor: "pointer",
//                     transition: "all 0.3s ease"
//                   }}
//                 >
//                   Enable Platforms in Settings
//                 </button>
//               </div>
//             ) : (
//               <div style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//                 gap: "12px"
//               }}>
//                 {platforms.map(platform => (
//                   <label
//                     key={platform.id}
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "12px",
//                       padding: "16px",
//                       border: `2px solid ${formData.platforms.includes(platform.id) ? '#007BFF' : '#e9ecef'}`,
//                       borderRadius: "12px",
//                       cursor: "pointer",
//                       transition: "all 0.3s ease",
//                       backgroundColor: formData.platforms.includes(platform.id) ? '#f8f9ff' : '#ffffff'
//                     }}
//                     onMouseEnter={(e) => {
//                       if (!formData.platforms.includes(platform.id)) {
//                         e.target.style.borderColor = '#007BFF44';
//                         e.target.style.backgroundColor = '#f8f9ff';
//                       }
//                     }}
//                     onMouseLeave={(e) => {
//                       if (!formData.platforms.includes(platform.id)) {
//                         e.target.style.borderColor = '#e9ecef';
//                         e.target.style.backgroundColor = '#ffffff';
//                       }
//                     }}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={formData.platforms.includes(platform.id)}
//                       onChange={() => handlePlatformChange(platform.id)}
//                       style={{
//                         width: "18px",
//                         height: "18px",
//                         accentColor: "#007BFF"
//                       }}
//                     />
//                     <div>
//                       <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d3748" }}>
//                         {platform.name}
//                       </div>
//                       <div style={{ fontSize: "12px", color: "#6c757d" }}>
//                         Type: {platform.type} • {platform.character_limit} chars
//                       </div>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>

//           {formData.status === 'scheduled' && (
//             <div style={{ marginBottom: "32px" }}>
//               <label style={{
//                 display: "block",
//                 marginBottom: "12px",
//                 fontSize: "16px",
//                 fontWeight: "600",
//                 color: "#2d3748",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px"
//               }}>
//                 <i className="bi bi-calendar"></i>
//                 Schedule Date & Time
//               </label>
//               <input
//                 type="datetime-local"
//                 name="scheduled_at"
//                 value={formData.scheduled_at}
//                 onChange={handleChange}
//                 required
//                 style={{
//                   width: "100%",
//                   padding: "16px 20px",
//                   border: "2px solid #e9ecef",
//                   borderRadius: "12px",
//                   fontSize: "16px",
//                   transition: "all 0.3s ease",
//                   outline: "none",
//                   backgroundColor: "#ffffff"
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "#007BFF";
//                   e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = "#e9ecef";
//                   e.target.style.boxShadow = "none";
//                 }}
//               />
//             </div>
//           )}

//           <div style={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             gap: "16px",
//             flexWrap: "wrap"
//           }}>
//             <button
//               type="button"
//               onClick={() => setShowDeleteConfirm(true)}
//               style={{
//                 padding: "12px 24px",
//                 backgroundColor: "#dc3545",
//                 color: "white",
//                 border: "none",
//                 borderRadius: "8px",
//                 fontSize: "14px",
//                 fontWeight: "600",
//                 cursor: "pointer",
//                 transition: "all 0.3s ease",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)"
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.backgroundColor = "#c82333";
//                 e.target.style.transform = "translateY(-1px)";
//                 e.target.style.boxShadow = "0 4px 12px rgba(220, 53, 69, 0.3)";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.backgroundColor = "#dc3545";
//                 e.target.style.transform = "translateY(0)";
//                 e.target.style.boxShadow = "0 2px 8px rgba(220, 53, 69, 0.2)";
//               }}
//             >
//               <i className="bi bi-trash"></i>
//               Delete Post
//             </button>
            
//             <div style={{ display: "flex", gap: "12px" }}>
//               <button
//                 type="button"
//                 onClick={() => navigate('/dashboard')}
//                 style={{
//                   padding: "12px 24px",
//                   backgroundColor: "#6c757d",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px"
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.backgroundColor = "#5a6268";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.backgroundColor = "#6c757d";
//                 }}
//               >
//                 <i className="bi bi-x-circle"></i>
//                 Cancel
//               </button>
              
//               <button
//                 type="submit"
//                 disabled={saving}
//                 style={{
//                   padding: "12px 24px",
//                   backgroundColor: saving ? "#6c757d" : "#007BFF",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   cursor: saving ? "not-allowed" : "pointer",
//                   transition: "all 0.3s ease",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "8px",
//                   boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)"
//                 }}
//                 onMouseEnter={(e) => {
//                   if (!saving) {
//                     e.target.style.backgroundColor = "#0069d9";
//                     e.target.style.transform = "translateY(-1px)";
//                     e.target.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.3)";
//                   }
//                 }}
//                 onMouseLeave={(e) => {
//                   if (!saving) {
//                     e.target.style.backgroundColor = "#007BFF";
//                     e.target.style.transform = "translateY(0)";
//                     e.target.style.boxShadow = "0 2px 8px rgba(0, 123, 255, 0.2)";
//                   }
//                 }}
//               >
//                 {saving ? (
//                   <>
//                     <div style={{
//                       width: "16px",
//                       height: "16px",
//                       border: "2px solid #ffffff",
//                       borderTop: "2px solid transparent",
//                       borderRadius: "50%",
//                       animation: "spin 1s linear infinite"
//                     }}></div>
//                     Saving...
//                   </>
//                 ) : (
//                   <>
//                     <i className="bi bi-check"></i>
//                     Update Post
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>

//       {showDeleteConfirm && (
//         <div style={{
//           position: 'fixed',
//           top: 0,
//           left: 0,
//           right: 0,
//           bottom: 0,
//           backgroundColor: 'rgba(0,0,0,0.6)',
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           zIndex: 1000,
//           backdropFilter: 'blur(4px)'
//         }}>
//           <div style={{
//             backgroundColor: 'white',
//             padding: '32px',
//             borderRadius: '16px',
//             maxWidth: '450px',
//             width: '90%',
//             textAlign: 'center',
//             boxShadow: '0 20px 64px rgba(0, 0, 0, 0.3)',
//             border: '1px solid #e9ecef'
//           }}>
//             <div style={{
//               width: "64px",
//               height: "64px",
//               backgroundColor: "#2f2e2e",
//               borderRadius: "50%",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               margin: "0 auto 20px"
//             }}>
//               <i className="bi bi-exclamation-triangle" style={{ fontSize: "28px", color: "#dc3545" }}></i>
//             </div>
            
//             <h3 style={{ 
//               margin: "0 0 16px 0", 
//               fontSize: "20px",
//               fontWeight: "600",
//               color: "#2d3748"
//             }}>
//               Confirm Delete
//             </h3>
            
//             <p style={{ 
//               margin: "0 0 24px 0",
//               fontSize: "16px",
//               color: "#6c757d",
//               lineHeight: "1.5"
//             }}>
//               Are you sure you want to delete this post? This action cannot be undone and all data will be permanently removed.
//             </p>
            
//             <div style={{ 
//               display: 'flex', 
//               gap: '12px', 
//               justifyContent: 'center'
//             }}>
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 style={{
//                   padding: "12px 24px",
//                   backgroundColor: "#f8f9fa",
//                   color: "#495057",
//                   border: "1px solid #dee2e6",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease"
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.backgroundColor = "#e9ecef";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.backgroundColor = "#f8f9fa";
//                 }}
//               >
//                 Cancel
//               </button>
              
//               <button
//                 onClick={handleDelete}
//                 style={{
//                   padding: "12px 24px",
//                   backgroundColor: "#dc3545",
//                   color: "white",
//                   border: "none",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   fontWeight: "600",
//                   cursor: "pointer",
//                   transition: "all 0.3s ease",
//                   boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)"
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.backgroundColor = "#c82333";
//                   e.target.style.boxShadow = "0 4px 12px rgba(220, 53, 69, 0.3)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.backgroundColor = "#dc3545";
//                   e.target.style.boxShadow = "0 2px 8px rgba(220, 53, 69, 0.2)";
//                 }}
//               >
//                 Delete Post
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
          
//           @media (max-width: 768px) {
//             .edit-post-container {
//               padding: 0 16px;
//             }
            
//             .edit-post-header {
//               flex-direction: column;
//               alignItems: stretch;
//             }
            
//             .edit-post-actions {
//               flex-direction: column;
//               alignItems: stretch;
//             }
            
//             .edit-post-actions > div {
//               justifyContent: center;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default EditPost;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPost, updatePost, deletePost } from '../services/postService';
import { getEnabledPlatforms } from '../services/platformService';

const EditPost = ({ showAlert }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [platforms, setPlatforms] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    platforms: [],
    scheduled_at: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
    setCharacterCount(formData.content.length);
  }, [formData.content]);

  const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

  const loadData = async () => {
    try {
      const [postResult, platformsResult] = await Promise.all([
        getPost(id),
        getEnabledPlatforms()
      ]);

      if (postResult.success) {
        const post = postResult.post;

        let scheduledAt = '';
        if (post.scheduled_at && post.status === 'scheduled') {
          const date = new Date(post.scheduled_at);
          if (!isNaN(date.getTime())) {
            scheduledAt = date.toISOString().slice(0, 16);
          }
        }
        
        setFormData({
          title: post.title || '',
          content: post.content || '',
          image: null,
          platforms: post.platforms ? post.platforms.map(p => p.id) : [],
          scheduled_at: scheduledAt,
          status: post.status || 'draft'
        });
        
        setCurrentImage(post.image);
      } else {
        showAlert('error', 'Post not found');
        navigate('/dashboard');
        return;
      }

      if (platformsResult.success) {
        setPlatforms(platformsResult.platforms);
      } else {
        showAlert('error', 'Failed to load platforms');
      }
    } catch (error) {
      showAlert('error', 'Error loading post data');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const platforms = Array.isArray(formData.platforms) ? formData.platforms : [];
    
    if (platforms.length === 0) {
      showAlert('error', 'Please select at least one platform');
      return;
    }

    if (formData.status === 'scheduled' && !formData.scheduled_at) {
      showAlert('error', 'Please set a schedule date and time for scheduled posts');
      return;
    }

    setSaving(true);

    try {
      const updatedData = new FormData();
      
      updatedData.append('title', formData.title || '');
      updatedData.append('content', formData.content || '');
      updatedData.append('status', formData.status || 'draft');
      
      // Send platform IDs instead of types
      platforms.forEach(platformId => {
        updatedData.append('platforms[]', platformId);
      });
      
      if (formData.status === 'scheduled' && formData.scheduled_at) {
        updatedData.append('scheduled_time', new Date(formData.scheduled_at).toISOString());
      }
      
      if (removeImage) {
        updatedData.append('remove_image', 'true');
      } else if (formData.image && formData.image instanceof File) {
        updatedData.append('image', formData.image);
      }

      const result = await updatePost(id, updatedData);
      
      if (result.success) {
        showAlert('success', 'Post updated successfully!');
        navigate('/dashboard');
      } else {
        // Customize platform error messages
        let errorMessage = result.error || 'Failed to update post';
        if (result.errors) {
          const platformErrors = Object.keys(result.errors)
            .filter(key => key.startsWith('platforms'))
            .map(key => result.errors[key])
            .flat();
          if (platformErrors.length > 0) {
            errorMessage = 'Invalid platform selection. Please choose valid platforms.';
          } else {
            errorMessage = Object.values(result.errors).flat().join(', ');
          }
        }
        showAlert('error', errorMessage);
      }
    } catch (error) {
      console.error('Update error:', error);
      showAlert('error', `Error updating post: ${error.message || 'Unknown error'}`);
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    try {
      const result = await deletePost(id);
      
      if (result.success) {
        showAlert('success', 'Post deleted successfully!');
        navigate('/dashboard');
      } else {
        showAlert('error', result.error || 'Failed to delete post');
      }
    } catch (error) {
      showAlert('error', 'Error deleting post');
    }
    setShowDeleteConfirm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file
      });
      
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => setImagePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
      setRemoveImage(false);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handlePlatformChange = (platformId) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter(p => p !== platformId)
        : [...prev.platforms, platformId]
    }));
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview(null);
    setRemoveImage(true);
  };

  const getCharacterCountColor = () => {
    if (characterCount > 280) return '#dc3545';
    if (characterCount > 200) return '#ffc107';
    return '#28a745';
  };

  const getCharacterCountBg = () => {
    if (characterCount > 280) return '#f8d7da';
    if (characterCount > 200) return '#fff3cd';
    return '#d4edda';
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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px' }}>
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
            Edit Post
          </h1>
        </div>
      </div>

      <div style={{
        backgroundColor: "#ffffff",
        border: "2px solid #e9ecef",
        borderRadius: "16px",
        padding: "30px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)"
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#2d3748",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="bi bi-card-heading"></i>
              Post Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter an engaging title..."
              style={{
                width: "100%",
                padding: "16px 20px",
                border: "2px solid #e9ecef",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                outline: "none",
                backgroundColor: "#ffffff"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#007BFF";
                e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#2d3748",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="bi bi-file-text"></i>
              Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              placeholder="What's on your mind?"
              rows="6"
              style={{
                width: "100%",
                padding: "16px 20px",
                border: "2px solid #e9ecef",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                outline: "none",
                backgroundColor: "#ffffff",
                resize: "vertical",
                minHeight: "120px"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#007BFF";
                e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px"
            }}>
              <span style={{
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                color: getCharacterCountColor(),
                backgroundColor: getCharacterCountBg(),
                border: `1px solid ${getCharacterCountColor()}33`
              }}>
                {characterCount} characters
              </span>
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#2d3748",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="bi bi-toggle-on"></i>
              Post Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "16px 20px",
                border: "2px solid #e9ecef",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                outline: "none",
                backgroundColor: "#ffffff"
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#007BFF";
                e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "12px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#2d3748",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="bi bi-image"></i>
              Update Image (optional)
            </label>
            
            {(imagePreview || (currentImage && !removeImage)) && (
              <div style={{
                marginBottom: "16px",
                padding: "16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "12px",
                border: "1px solid #e9ecef"
              }}>
                <p style={{
                  margin: "0 0 12px 0",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#495057"
                }}>
                  {imagePreview ? "New image preview:" : "Current image:"}
                </p>
                <img
                  src={imagePreview || `http://127.0.0.1:8000/storage/${currentImage}`}
                  alt="Preview"
                  style={{
                    maxWidth: "300px",
                    maxHeight: "200px",
                    borderRadius: "8px",
                    border: "1px solid #dee2e6"
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  style={{
                    marginTop: "12px",
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#c82333";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#dc3545";
                  }}
                >
                  <i className="bi bi-trash"></i> Remove Image
                </button>
              </div>
            )}

            <input
              type="file"
              id="image"
              name="image"
              onChange={handleChange}
              accept="image/*"
              style={{
                width: "100%",
                padding: "16px 20px",
                border: "2px dashed #e9ecef",
                borderRadius: "12px",
                fontSize: "16px",
                transition: "all 0.3s ease",
                outline: "none",
                backgroundColor: "#ffffff",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = "#007BFF";
                e.target.style.backgroundColor = "#f8f9ff";
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.backgroundColor = "#ffffff";
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block",
              marginBottom: "16px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#2d3748",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <i className="bi bi-share"></i>
              Platforms ({formData.platforms.length} selected)
            </label>
            
            {platforms.length === 0 ? (
              <div style={{
                padding: "20px",
                backgroundColor: "#fff3cd",
                border: "1px solid #ffeaa7",
                borderRadius: "12px",
                textAlign: "center"
              }}>
                <i className="bi bi-exclamation-triangle" style={{ fontSize: "24px", color: "#856404", marginBottom: "8px" }}></i>
                <p style={{ margin: "0 0 8px 0", color: "#856404", fontWeight: "500" }}>
                  No platforms enabled
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                >
                  Enable Platforms in Settings
                </button>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px"
              }}>
                {platforms.map(platform => (
                  <label
                    key={platform.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "16px",
                      border: `2px solid ${formData.platforms.includes(platform.id) ? '#007BFF' : '#e9ecef'}`,
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      backgroundColor: formData.platforms.includes(platform.id) ? '#f8f9ff' : '#ffffff'
                    }}
                    onMouseEnter={(e) => {
                      if (!formData.platforms.includes(platform.id)) {
                        e.target.style.borderColor = '#007BFF44';
                        e.target.style.backgroundColor = '#f8f9ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!formData.platforms.includes(platform.id)) {
                        e.target.style.borderColor = '#e9ecef';
                        e.target.style.backgroundColor = '#ffffff';
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={formData.platforms.includes(platform.id)}
                      onChange={() => handlePlatformChange(platform.id)}
                      style={{
                        width: "18px",
                        height: "18px",
                        accentColor: "#007BFF"
                      }}
                    />
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#2d3748" }}>
                        {platform.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6c757d" }}>
                        Type: {platform.type} • {platform.character_limit} chars
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {formData.status === 'scheduled' && (
            <div style={{ marginBottom: "32px" }}>
              <label style={{
                display: "block",
                marginBottom: "12px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#2d3748",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <i className="bi bi-calendar"></i>
                Schedule Date & Time
              </label>
              <input
                type="datetime-local"
                name="scheduled_at"
                value={formData.scheduled_at}
                onChange={handleChange}
                min={getCurrentDateTime()}
                required
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  border: "2px solid #e9ecef",
                  borderRadius: "12px",
                  fontSize: "16px",
                  transition: "all 0.3s ease",
                  outline: "none",
                  backgroundColor: "#ffffff"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#007BFF";
                  e.target.style.boxShadow = "0 0 0 3px rgba(0, 123, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e9ecef";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          )}

          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap"
          }}>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                padding: "12px 24px",
                backgroundColor: "#dc3545",
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
                boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#c82333";
                e.target.style.transform = "translateY(-1px)";
                e.target.style.boxShadow = "0 4px 12px rgba(220, 53, 69, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#dc3545";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 2px 8px rgba(220, 53, 69, 0.2)";
              }}
            >
              <i className="bi bi-trash"></i>
              Delete Post
            </button>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#5a6268";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#6c757d";
                }}
              >
                <i className="bi bi-x-circle"></i>
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={saving}
                style={{
                  padding: "12px 24px",
                  backgroundColor: saving ? "#6c757d" : "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: saving ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)"
                }}
                onMouseEnter={(e) => {
                  if (!saving) {
                    e.target.style.backgroundColor = "#0069d9";
                    e.target.style.transform = "translateY(-1px)";
                    e.target.style.boxShadow = "0 4px 12px rgba(0, 123, 255, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!saving) {
                    e.target.style.backgroundColor = "#007BFF";
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 2px 8px rgba(0, 123, 255, 0.2)";
                  }
                }}
              >
                {saving ? (
                  <>
                    <div style={{
                      width: "16px",
                      height: "16px",
                      border: "2px solid #ffffff",
                      borderTop: "2px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite"
                    }}></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check"></i>
                    Update Post
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '450px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 64px rgba(0, 0, 0, 0.3)',
            border: '1px solid #e9ecef'
          }}>
            <div style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#2f2e2e",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px"
            }}>
              <i className="bi bi-exclamation-triangle" style={{ fontSize: "28px", color: "#dc3545" }}></i>
            </div>
            
            <h3 style={{ 
              margin: "0 0 16px 0", 
              fontSize: "20px",
              fontWeight: "600",
              color: "#2d3748"
            }}>
              Confirm Delete
            </h3>
            
            <p style={{ 
              margin: "0 0 24px 0",
              fontSize: "16px",
              color: "#6c757d",
              lineHeight: "1.5"
            }}>
              Are you sure you want to delete this post? This action cannot be undone and all data will be permanently removed.
            </p>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              justifyContent: 'center'
            }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#f8f9fa",
                  color: "#495057",
                  border: "1px solid #dee2e6",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#e9ecef";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f8f9fa";
                }}
              >
                Cancel
              </button>
              
              <button
                onClick={handleDelete}
                style={{
                  padding: "12px 24px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 2px 8px rgba(220, 53, 69, 0.2)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#c82333";
                  e.target.style.boxShadow = "0 4px 12px rgba(220, 53, 69, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#dc3545";
                  e.target.style.boxShadow = "0 2px 8px rgba(220, 53, 69, 0.2)";
                }}
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @media (max-width: 768px) {
            .edit-post-container {
              padding: 0 16px;
            }
            
            .edit-post-header {
              flex-direction: column;
              alignItems: stretch;
            }
            
            .edit-post-actions {
              flex-direction: column;
              alignItems: stretch;
            }
            
            .edit-post-actions > div {
              justifyContent: center;
            }
          }
        `}
      </style>
    </div>
  );
};

export default EditPost;