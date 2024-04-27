import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fyequndvlsysxgmheucy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5ZXF1bmR2bHN5c3hnbWhldWN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM1MDA3MjIsImV4cCI6MjAyOTA3NjcyMn0.AXWJ6fmCQnczn-qtZjGWSq2sjpdDKcJu2-9Al8czlJY';
const supabase = createClient(supabaseUrl, supabaseKey);

const PostForm = ({ onPostCreation }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageurl, setImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('Table2').insert([{ title, content, imageurl }]);
      if (error) {
        throw error;
      }
      console.log('Post submitted successfully:', data);
      if (data && data.length > 0) {
        onPostCreation(data[0]);
      }
      setTitle('');
      setContent('');
      setImageUrl('');
    } catch (error) {
      console.error('Error submitting post:', error.message);
    }
  };

  return (
    <>
    <h1>Create a Post</h1>
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-row">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Image URL:
          
          <input
            type="text"
            value={imageurl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Copy the image address (URL)"
          
            className='imageurl'
/>
        </label>
      </div>
      <label>
        Content:
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="content-textarea"
        />
      </label>
      <button type="submit">Post</button>
    </form>
    </>
  );
};

export default PostForm;