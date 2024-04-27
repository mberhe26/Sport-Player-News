import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fyequndvlsysxgmheucy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZXF1bmR2bHN5c3hnbWhldWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1MDA3MjIsImV4cCI6MjAyOTA3NjcyMn0.AXWJ6fmCQnczn-qtZjGWSq2sjpdDKcJu2-9Al8czlJY';
const supabase = createClient(supabaseUrl, supabaseKey);

const PostPage = () => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();
  // const [post, setPost] = useState(null);
  // const [error, setError] = useState(null);
  // const [commentText, setCommentText] = useState('');
  // const { postId } = useParams();
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: postData, error: postError } = await supabase
          .from('Table2')
          .select('id, title, created_at, upvote_count, content, imageurl')
          .eq('id', postId)
          .single();
        if (postError) {
          throw new Error(postError.message);
        }
  
        const { data: commentsData, error: commentsError } = await supabase
          .from('comments')
          .select('id, comment_text, created_at')
          .eq('post_id', postId);
        if (commentsError) {
          throw new Error(commentsError.message);
        }
  
        setPost({ ...postData, comments: commentsData || [] });
      } catch (error) {
        setError('An error occurred while fetching the post.');
      }
    };
    fetchPost();
  }, [postId]);
  

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('comments').insert([
        { post_id: postId, comment_text: commentText },
      ]);
      if (error) {
        throw error;
      }
      if (data && data.length > 0) {
        setPost((prevPost) => ({
          ...prevPost,
          comments: [
            ...prevPost.comments,
            {
              id: data[0].id,
              comment_text: commentText,
              created_at: new Date().toISOString(),
            },
          ],
        }));
        setCommentText('');
      } else {
        console.error('Unexpected response structure or empty data:', data);
      }
    } catch (error) {
      console.error('Error submitting comment:', error.message);
    }
  };
  

  const handleUpvote = async () => {
    try {
      const { data, error } = await supabase
        .from('Table2')
        .update({ upvote_count: post.upvote_count + 1 })
        .eq('id', postId);
      if (error) {
        throw error;
      }
      setPost({ ...post, upvote_count: post.upvote_count + 1 });
    } catch (error) {
      console.error('Error updating upvote count:', error.message);
    }
  };


  
  const handleEditPost = (postId) => {
    setEditingPostId(postId);
  };




  const handleUpdatePost = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('Table2')
        .update({
          title: post.title,
          content: post.content
        })
        .eq('id', postId);
      if (error) {
        throw error;
      }
      setEditingPostId(null);
    } catch (error) {
      console.error('Error updating post:', error.message);
    }
  };
  
  const handleTitleChange = (e) => {
    setPost((prevPost) => ({
      ...prevPost,
      title: e.target.value,
    }));
  };
  
  const handleContentChange = (e) => {
    setPost((prevPost) => ({
      ...prevPost,
      content: e.target.value,
    }));
  };
  

  const handleDeletePost = async () => {
    try {
      const { error } = await supabase.from('Table2').delete().eq('id', postId);
      if (error) {
        throw error;
      }
     
      navigate('/');
    } catch (error) {
      console.error('Error deleting post:', error.message);
    }
  };

  

  if (!post) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Post Page</h1>
      {error && <div>Error: {error}</div>}
      {post ? (
        <div key={post.id}>
          {editingPostId === post.id ? (
            <form onSubmit={handleUpdatePost}>
              <h2>Edit post</h2>
              <input
                type="text"
                value={post.title}
                onChange={handleTitleChange}
              />
              <textarea
                value={post.content}
                onChange={handleContentChange}
              ></textarea>
              <button type="submit">Save</button>
              <button onClick={() => setEditingPostId(null)}>Cancel</button>
            </form>
          ) : (
            
            <div>
              <div className="post-card">
                <h3>{post.title}</h3>
                {post.imageurl && (
                  <img
                    src={post.imageurl}
                    alt={post.title}
                    className="post-image"
                  />
                )}
                <p>{post.content}</p>
                <p>Created: {formatDate(post.created_at)}</p>
                <div className="button-container">
                  <button onClick={handleUpvote}>
                    👍 {post.upvote_count}
                  </button>
                  <button onClick={() => handleEditPost(post.id)}>📝</button>
                  <button onClick={handleDeletePost}>🗑</button>
                </div>
                

<div className="comments-container">
            <h3>Comments</h3>
            {post.comments && Array.isArray(post.comments) && post.comments.map((comment) => (
  <div key={comment.id} className="comment-container">
    <p>{comment.comment_text}</p>
    <p>Created: {formatDate(comment.created_at)}</p>
  </div>
))}

            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                type="text"
                placeholder="Leave a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <button type="submit">Post</button>
            </form>
          </div>

            
        </div>
              </div>
            
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default PostPage;