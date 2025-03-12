import React, { useState, useEffect } from "react";

import { useHistory, useParams } from "react-router-dom";

import Form from "./Form";
import PostPreview from "./Preview";

import postsApi from "../../apis/posts";
import { PageLoader } from "../../common/PageLoader";
import { POSTS } from "../constants";

const EditPost = () => {
  const history = useHistory();
  const { slug } = useParams();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [status, setStatus] = useState("draft");
  const [showPreview, setShowPreview] = useState(false);

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const {
        data: { post },
      } = await postsApi.show(slug);
      setTitle(post.title);
      setDescription(post.description);
      setStatus(post.status || "draft");

      if (post.categories && post.categories.length > 0) {
        const formattedCategories = post.categories.map(category => ({
          value: category.id,
          label: category.name,
        }));
        setSelectedCategories(formattedCategories);
      }
    } catch (error) {
      logger.error(error);
      history.push(POSTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await postsApi.update(slug, {
        title,
        description,
        category_ids: values.category_ids,
        status,
      });
      history.push(`/posts/${slug}/show`);
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    history.push(`/posts/${slug}/show`);
  };

  if (loading) return <PageLoader />;

  return (
    <div className="container mx-auto">
      <div
        className={`grid ${showPreview ? "grid-cols-2 gap-4" : "grid-cols-1"}`}
      >
        <div>
          <Form
            isEdit
            description={description}
            selectedCategories={selectedCategories}
            setDescription={setDescription}
            setSelectedCategories={setSelectedCategories}
            setShowPreview={setShowPreview}
            setStatus={setStatus}
            setTitle={setTitle}
            showPreview={showPreview}
            slug={slug}
            status={status}
            title={title}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </div>
        {showPreview && (
          <div className="border-l pl-4">
            <PostPreview
              categories={selectedCategories}
              description={description}
              setShowPreview={setShowPreview}
              status={status}
              title={title}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default EditPost;
