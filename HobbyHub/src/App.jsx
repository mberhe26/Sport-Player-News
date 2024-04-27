import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './App.css';

import PostFeed from './PostFeed';
import PostForm from './PostForm';
import PostPage from './PostPage';

const supabaseUrl = 'https://fyequndvlsysxgmheucy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZXF1bmR2bHN5c3hnbWhldWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1MDA3MjIsImV4cCI6MjAyOTA3NjcyMn0.AXWJ6fmCQnczn-qtZjGWSq2sjpdDKcJu2-9Al8czlJY';
const supabase = createClient(supabaseUrl, supabaseKey);

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from('Table2').select('*');
        if (error) {
          console.error('Error fetching posts:', error.message);
        } else {
          setPosts(data);
        }
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      }
    };
    fetchPosts();
  }, []);

  const handlePostCreation = (post) => {
    setPosts([...posts, post]);
  };

  return (
    <Router>
      <div className="app-container">
        <div className="left-container">
          <nav>
            <ul>
              <li>
                <Link to="/">Post Feed</Link>
              </li>
              <li>
                <Link to="/postform">Post Form</Link>
              </li>
              <li>
                <Link to={`/posts/${posts.length > 0 ? posts[posts.length - 1].id : ''}`}>Post Page</Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="right-container">
          <Routes>
            <Route path="/posts/:postId" element={<PostPage posts={posts} />} />
            <Route path="/postform" element={<PostForm onPostCreation={handlePostCreation} />} />
            <Route path="/" element={<PostFeed posts={posts} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;