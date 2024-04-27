import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import PostForm from './PostForm';

const supabaseUrl = 'https://fyequndvlsysxgmheucy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZXF1bmR2bHN5c3hnbWhldWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1MDA3MjIsImV4cCI6MjAyOTA3NjcyMn0.AXWJ6fmCQnczn-qtZjGWSq2sjpdDKcJu2-9Al8czlJY';
const supabase = createClient(supabaseUrl, supabaseKey);

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let query = supabase.from('Table2').select('id, title, created_at, upvote_count, content, imageurl');

        if (sortOrder === 'created_at') {
          query = query.order('created_at', { ascending: false });
        } else if (sortOrder === 'upvote_count') {
          query = query.order('upvote_count', { ascending: false });
        }

        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery.toLowerCase()}%`);
        }

        const { data, error } = await query;
        if (error) {
          throw new Error(error.message);
        } else {
          setPosts(data);
        }
      } catch (error) {
        setError('An error occurred while fetching posts.');
      }
    };
    fetchPosts();
  }, [sortOrder, searchQuery]);

  const handlePostClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  return (
    <div>
      <h1>Sport Player News</h1>
      <div className="sort-and-search">
        <div>
          <label htmlFor="sort-order">Sort by:</label>
          <select id="sort-order" value={sortOrder} onChange={handleSortOrderChange}>
            <option value="created_at">Created Date</option>
            <option value="upvote_count">Upvotes</option>
          </select>
        </div>
        <div>
          <label htmlFor="search-query">Search:</label>
          <input
            id="search-query"
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </div>
      </div>
      {error && <div>Error: {error}</div>}
      {posts.map((post) => (
        <div
          key={post.id}
          onClick={() => handlePostClick(post.id)}
          style={{ cursor: 'pointer' }}
          className="feed-list"
        >
          <div className="post-header">
            <h3>{post.title}</h3>
            <div className="post-header2">
              <p>Created: {formatDate(post.created_at)}</p>
            </div>
          </div>
          <div className="post-footer">
            <p>Upvotes: {post.upvote_count}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;