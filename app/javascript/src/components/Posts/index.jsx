/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { Tag } from "@bigbinary/neetoui";
import { Link, useLocation } from "react-router-dom";

import categoriesApi from "../../apis/categories";
import postsApi from "../../apis/posts";
import { PageLoader } from "../../common/PageLoader";

const Posts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category_ids");
  const selectedCategoryIds = categoryParam
    ? categoryParam.split(",").map(Number)
    : [];

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  const fetchPosts = async categoryIds => {
    try {
      setLoading(true);
      const {
        data: { posts },
      } = await postsApi.fetch(categoryIds);
      logger.log(posts);
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

  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.fetch();
      setCategories(data.categories || []);
    } catch (err) {
      logger.log(err);
    }
  };

  useEffect(() => {
    fetchPosts(selectedCategoryIds);
    fetchCategories();
  }, [location.search]);

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

  const getSelectedCategoryNames = () => {
    if (!selectedCategoryIds.length) return "";

    const selectedNames = categories
      .filter(category => selectedCategoryIds.includes(category.id))
      .map(category => category.name);

    return selectedNames.join(", ");
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-4 px-4 pb-4" />
      <div className="px-8">
        <div className="flex items-center justify-between">
          <h1 className="mb-8 text-4xl font-bold">
            {selectedCategoryIds.length > 0
              ? `${getSelectedCategoryNames()} Posts`
              : "All Blog Posts"}
          </h1>
          <Link className="bg-black px-4 py-2 text-white" to="/posts/create">
            Add new blog post
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="mt-8 text-center text-gray-500">
            {selectedCategoryIds.length > 0
              ? `No posts found in the selected categories.`
              : "No posts found."}
          </div>
        ) : (
          <div className="divide-y">
            {posts.map(post => (
              <div className="py-6" key={post.id}>
                <Link to={`/posts/${post.slug}/show`}>
                  <h2 className="mb-2 text-xl font-semibold">{post.title}</h2>
                </Link>
                {post.categories && post.categories.length > 0 && (
                  <div className="mb-4 flex items-center gap-2">
                    {post.categories.map(category => (
                      <Tag
                        className="bg-green-200 p-2 font-semibold"
                        key={category.id}
                        label={category.name}
                        style="primary"
                        type="solid"
                      />
                    ))}
                  </div>
                )}
                <p className="mb-1 line-clamp-2 w-[80%] text-gray-700">
                  {post.description}
                </p>
                <div className="mb-2 flex items-center gap-4">
                  {post.user && (
                    <div className="text-sm font-semibold text-gray-600">
                      {post.user.name}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {post.created_at
                    ? formatDate(post.created_at)
                    : "30 September 2024"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
