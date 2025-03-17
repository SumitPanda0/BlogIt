import React, { useState, useEffect } from "react";

import { Tag, Avatar, Button } from "@bigbinary/neetoui";
import { useHistory, useParams } from "react-router-dom";

import postsApi from "../../apis/posts";
import { PageLoader } from "../../common/PageLoader";
import { getFromLocalStorage } from "../../utils/storage";

const FullPagePreview = () => {
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState(null);
  const history = useHistory();
  const { slug } = useParams();
  const userName = getFromLocalStorage("authUserName");
  useEffect(() => {
    const storedData = localStorage.getItem("postPreviewData");

    if (storedData) {
      setPreviewData(JSON.parse(storedData));
      setLoading(false);
    } else if (slug) {
      fetchPostDetails();
    } else {
      history.push("/posts");
    }
  }, []);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const {
        data: { post },
      } = await postsApi.show(slug);

      setPreviewData({
        title: post.title,
        description: post.description,
        status: post.status || "draft",
        categories: post.categories.map(category => ({
          value: category.id,
          label: category.name,
        })),
      });
    } catch (error) {
      logger.error(error);
      history.push("/posts");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = () => {
    const date = new Date();

    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;
  };

  const handleBackToEdit = () => {
    window.close();
  };

  if (loading) return <PageLoader />;

  return (
    <div className="mx-auto py-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Preview Mode</h1>
        <Button
          label="Back to Editor"
          style="secondary"
          onClick={handleBackToEdit}
        />
      </div>
      <div className="mt-8 flex w-full items-start justify-between gap-x-6">
        <div className="flex w-full flex-col gap-y-2 rounded-lg p-8">
          {previewData.categories && previewData.categories.length > 0 && (
            <div className="flex w-full items-center gap-2">
              <div className="flex flex-wrap gap-1">
                {previewData.categories.map(category => (
                  <Tag
                    className="bg-green-200 p-2 font-semibold"
                    key={category.value}
                    label={category.label}
                    style="primary"
                    type="solid"
                  />
                ))}
              </div>
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <div className="mb-4 flex items-center gap-2">
              <h1 className="text-3xl font-bold">{previewData.title}</h1>
              <Tag
                size="small"
                label={
                  previewData.status === "published" ? "Published" : "Draft"
                }
                style={
                  previewData.status === "published" ? "success" : "danger"
                }
              />
            </div>
          </div>
          <div className="mb-4 flex items-center gap-x-3">
            <Avatar size="medium" user={{ name: "User" }} />
            <div className="flex flex-col gap-y-1">
              <div className="flex items-center">
                <div className="text-sm font-semibold text-gray-600">
                  {userName}
                </div>
              </div>
              <div className="text-xs text-gray-500">{formatDate()}</div>
            </div>
          </div>
          <p className="text-base text-gray-700">{previewData.description}</p>
        </div>
      </div>
    </div>
  );
};

export default FullPagePreview;
