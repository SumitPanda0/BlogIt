import React, { useState } from "react";

import { useHistory } from "react-router-dom";

import Form from "./Form";

import postsApi from "../../apis/posts";
import { POSTS } from "../constants";

const CreatePost = () => {
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [status, setStatus] = useState("draft");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await postsApi.create({
        title,
        description,
        category_ids: values.category_ids,
        status,
      });
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
      <Form
        showPreview
        description={description}
        selectedCategories={selectedCategories}
        setDescription={setDescription}
        setSelectedCategories={setSelectedCategories}
        setStatus={setStatus}
        setTitle={setTitle}
        status={status}
        title={title}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreatePost;
