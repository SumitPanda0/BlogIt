import React, { useState } from "react";

import { useHistory } from "react-router-dom";

import Form from "./Form";

import postsApi from "../../apis/posts";
import { POSTS } from "../constants";

const CreatePost = () => {
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (_, { setSubmitting }) => {
    try {
      await postsApi.create({ title, description });
      history.push(POSTS);
    } catch (error) {
      logger.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    history.push(POSTS);
  };

  return (
    <div className="container mx-auto">
      <h1 className="mb-6 text-3xl font-bold">New blog post</h1>
      <Form
        description={description}
        setDescription={setDescription}
        setTitle={setTitle}
        title={title}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreatePost;
