/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { Down, Up } from "@bigbinary/neeto-icons";
import { Button, Tag } from "@bigbinary/neetoui";
import { Link, useLocation, useHistory } from "react-router-dom";

import categoriesApi from "../../apis/categories";
import postsApi from "../../apis/posts";
import votesApi from "../../apis/votes";
import { PageLoader } from "../../common/PageLoader";
import { getFromLocalStorage } from "../../utils/storage";

const Posts = () => {
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category_ids");
  const selectedCategoryIds = categoryParam
    ? categoryParam.split(",").map(Number)
    : [];

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const isLoggedIn = !!getFromLocalStorage("authToken");
  const [userVotes, setUserVotes] = useState({});

  const fetchPosts = async categoryIds => {
    try {
      setLoading(true);
      const {
        data: { posts },
      } = await postsApi.fetch(categoryIds);

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

  const handleVote = async (slug, voteType) => {
    if (!isLoggedIn) {
      history.push("/login");

      return;
    }

    try {
      const { data } = await votesApi.vote({
        payload: { postSlug: slug, voteType },
      });

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.slug === slug ? { ...post, ...data.post } : post
        )
      );

      setUserVotes(prev => {
        const newVote = prev[slug] === voteType ? null : voteType;

        return { ...prev, [slug]: newVote };
      });
    } catch (err) {
      logger.error("Error voting:", err);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");

      return;
    }

    fetchPosts(selectedCategoryIds);
    fetchCategories();
  }, [location.search, isLoggedIn]);

  if (!isLoggedIn) {
    return null;
  }

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
    })} ${date.getFullYear()}, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const getDisplayDate = post => {
    if (post.status === "published") {
      return post.updated_at
        ? formatDate(post.updated_at)
        : formatDate(post.created_at);
    }

    return post.created_at ? formatDate(post.created_at) : "Date unavailable";
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
              : "No posts found in your organization."}
          </div>
        ) : (
          <div className="divide-y">
            {posts.map(post => (
              <div
                className="flex items-center justify-between py-6"
                key={post.id}
              >
                <div>
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
                    {getDisplayDate(post)}
                  </div>
                  <div className="post-meta">
                    {post.status === "draft" && (
                      <span className="status-badge draft">Draft</span>
                    )}
                    {post.status === "published" && (
                      <span className="status-badge published">Published</span>
                    )}
                  </div>
                </div>
                <div className="mr-8 mt-2 flex flex-col items-center gap-2">
                  <Button
                    icon={Up}
                    size="large"
                    style="link"
                    className={`flex items-center gap-1 rounded-md border px-2 py-1 text-2xl text-green-600 hover:bg-green-200 ${
                      userVotes[post.slug] === "upvote"
                        ? "bg-green-800 text-green-100"
                        : ""
                    }`}
                    onClick={e => {
                      e.preventDefault();
                      handleVote(post.slug, "upvote");
                    }}
                  />
                  <span className="text-xl font-bold text-gray-500">
                    {post.upvotes - post.downvotes}
                  </span>
                  <Button
                    icon={Down}
                    size="large"
                    style="link"
                    className={`flex items-center gap-1 rounded-md border px-2 py-1 text-2xl text-red-800 hover:bg-red-200 ${
                      userVotes[post.slug] === "downvote"
                        ? "bg-red-800 text-red-100"
                        : ""
                    }`}
                    onClick={e => {
                      e.preventDefault();
                      handleVote(post.slug, "downvote");
                    }}
                  />
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
