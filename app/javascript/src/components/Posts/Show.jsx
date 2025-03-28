/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import { Download, Edit } from "@bigbinary/neeto-icons";
import { Avatar, Tag, Button, Alert, Modal } from "@bigbinary/neetoui";
import { useHistory, useParams } from "react-router-dom";

import postsApi from "apis/posts";

import DownloadReport from "./DownloadReport";

import { PageLoader } from "../../common/PageLoader";
import { getDisplayDate } from "../../utils/dateUtils";
import { getFromLocalStorage } from "../../utils/storage";

const Show = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { slug } = useParams();
  const history = useHistory();

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

  const isEditButtonDisabled =
    getFromLocalStorage("authUserId") !== post?.user?.id;

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
            <div className="flex items-center gap-x-6">
              <Button
                icon={Download}
                style="text"
                onClick={() => setIsModalOpen(true)}
              />
              <Button
                icon={Edit}
                style="text"
                onClick={
                  isEditButtonDisabled ? () => setIsAlertOpen(true) : handleEdit
                }
              />
            </div>
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
      <Alert
        cancelButtonLabel="Cancel"
        isOpen={isAlertOpen}
        message="You are not authorized to edit this post. This action is restricted to the author of the post."
        submitButtonLabel="Ok"
        title="Unauthorized Action"
        onClose={() => setIsAlertOpen(false)}
        onSubmit={() => setIsAlertOpen(false)}
      />
      <Modal
        isOpen={isModalOpen}
        size="large"
        title="Download Report"
        onClose={() => setIsModalOpen(false)}
      >
        <DownloadReport postId={post.id} />
      </Modal>
    </div>
  );
};

export default Show;
