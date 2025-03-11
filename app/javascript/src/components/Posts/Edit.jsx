import React, { useState, useEffect } from "react";

import { useHistory, useParams } from "react-router-dom";

import Form from "./Form";

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

  const fetchPostDetails = async () => {
    try {
      setLoading(true);
      const {
        data: { post },
      } = await postsApi.show(slug);
      setTitle(post.title);
      setDescription(post.description);

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
      <h1 className="mb-6 text-3xl font-bold">Edit blog post</h1>
      <Form
        description={description}
        selectedCategories={selectedCategories}
        setDescription={setDescription}
        setSelectedCategories={setSelectedCategories}
        setTitle={setTitle}
        title={title}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditPost;
