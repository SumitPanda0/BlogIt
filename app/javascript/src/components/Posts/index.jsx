import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import postsApi from "../../apis/posts";
import { PageLoader } from "../../common/PageLoader";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      const {
        data: { posts },
      } = await postsApi.fetch();

      const sortedPosts = [...posts].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );

      setPosts(sortedPosts);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="rounded-md bg-red-100 p-4 text-red-700">
        Error loading posts: {error.message}
      </div>
    );
  }

  const formatDate = dateString => {
    const date = new Date(dateString);

    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-4 px-4 pb-4" />
      <div className="px-8">
        <div className="flex items-center justify-between">
          <h1 className="mb-8 text-4xl font-bold">Blog posts</h1>
          <Link className="bg-black px-4 py-2 text-white" to="/posts/create">
            Add new blog post
          </Link>
        </div>
        <div className="divide-y">
          {posts.map(post => (
            <div className="py-6" key={post.id}>
              <Link to={`/posts/${post.slug}/show`}>
                <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
              </Link>
              <p className="mb-1 line-clamp-2 w-[80%] text-gray-700">
                {post.description}
              </p>
              <div className="text-xs text-gray-500">
                {post.created_at
                  ? formatDate(post.created_at)
                  : "30 September 2024"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Posts;
