import React from "react";

import { useHistory } from "react-router-dom";

import Form from "./Form";

import postsApi from "../../apis/posts";

const CreatePost = () => {
  const history = useHistory();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await postsApi.create(values);
      history.push("/posts");
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    history.push("/posts");
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">New blog post</h1>
      <Form onCancel={handleCancel} onSubmit={handleSubmit} />
    </div>
  );
};

export default CreatePost;
