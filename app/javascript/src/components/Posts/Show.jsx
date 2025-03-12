/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { Edit } from "@bigbinary/neeto-icons";
import { Avatar, Tag, Button } from "@bigbinary/neetoui";
import { useHistory, useParams } from "react-router-dom";

import postsApi from "apis/posts";

import { PageLoader } from "../../common/PageLoader";

const Show = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const history = useHistory();

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

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const {
        data: { post },
      } = await postsApi.show(slug);
      setPost(post);
    } catch (error) {
      logger.error(error);
      history.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    history.push(`/posts/${slug}/edit`);
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="flex w-full flex-col gap-y-8">
      <div className="mt-8 flex w-full items-start justify-between gap-x-6">
        <div className="flex w-full flex-col gap-y-2 p-8">
          {post.categories && post.categories.length > 0 && (
            <div className="flex w-full items-center gap-2">
              <div className="flex flex-wrap gap-1">
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
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <div className="mb-4 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{post.title}</h1>
              <Tag
                label={post.status === "published" ? "Published" : "Draft"}
                size="small"
                style={post.status === "published" ? "success" : "danger"}
              />
            </div>
            <Button icon={Edit} style="text" onClick={handleEdit} />
          </div>
          <div className="mb-4 flex items-center gap-x-3">
            <Avatar size="medium" user={{ name: "User" }} />
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center">
                {post.user && (
                  <div className="text-sm font-semibold text-gray-600">
                    {post.user.name}
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500">
                {getDisplayDate(post)}
              </div>
            </div>
          </div>
          <p className="text-base text-gray-700">{post.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Show;
