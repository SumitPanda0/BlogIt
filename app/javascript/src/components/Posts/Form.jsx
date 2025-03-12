import React, { useEffect, useState } from "react";

import { MenuHorizontal, ExternalLink } from "@bigbinary/neeto-icons";
import { ActionDropdown, Button, Dropdown } from "@bigbinary/neetoui";
import {
  Form as NeetoUIForm,
  Input,
  Textarea,
  Select as FormikSelect,
} from "@bigbinary/neetoui/formik";
import { useHistory } from "react-router-dom";

import categoriesApi from "../../apis/categories";
import postsApi from "../../apis/posts";
import { FORM_VALIDATION_SCHEMA } from "../utils/validationSchema";

const Form = ({
  onSubmit,
  onCancel,
  title,
  description,
  setTitle,
  setDescription,
  selectedCategories = [],
  setSelectedCategories,
  status = "draft",
  setStatus,
  isEdit = false,
  slug,
  showPreview,
  setShowPreview,
}) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const { Menu } = ActionDropdown;
  const fetchCategories = async () => {
    try {
      const { data } = await categoriesApi.fetch();
      const formattedCategories = data.categories.map(category => ({
        value: category.id,
        label: category.name,
      }));
      setCategories(formattedCategories);
    } catch (error) {
      logger.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await postsApi.destroy(slug, true);
      history.push("/posts");
    } catch (error) {
      logger.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handlePublish = () => {
    setStatus("published");
  };

  const handleSaveAsDraft = () => {
    setStatus("draft");
  };

  return (
    <div className="flex flex-col gap-y-4">
      <NeetoUIForm
        formProps={{ noValidate: true }}
        formikProps={{
          initialValues: {
            title,
            description,
            category_ids: selectedCategories.map(category => category.value),
            status,
          },
          validationSchema: FORM_VALIDATION_SCHEMA,
          onSubmit,
          validateOnChange: true,
          validateOnBlur: true,
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue, submitForm }) => (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h1 className="text-3xl font-bold">
                {isEdit ? "Edit blog post" : "New blog post"}
              </h1>
              <div className="flex items-center gap-x-2">
                {!showPreview && (
                  <Button
                    className="text-gray-800 hover:text-gray-500"
                    icon={ExternalLink}
                    label="Preview"
                    style="tertiary"
                    onClick={() => setShowPreview(true)}
                  />
                )}
                <Button
                  className="bg-black text-white"
                  label="Cancel"
                  style="secondary"
                  type="submit"
                  onClick={onCancel}
                />
                <ActionDropdown
                  buttonStyle="secondary"
                  label={status === "published" ? "Publish" : "Save as draft"}
                  onClick={submitForm}
                >
                  <Menu>
                    <li>
                      <Button
                        label="Save as draft"
                        style="tertiary"
                        type="submit"
                        onClick={handleSaveAsDraft}
                      />
                    </li>
                    <li>
                      <Button
                        label="Publish"
                        style="tertiary"
                        type="submit"
                        onClick={handlePublish}
                      />
                    </li>
                  </Menu>
                </ActionDropdown>
                <Dropdown buttonStyle="tertiary" icon={MenuHorizontal}>
                  <Button
                    className="border-none bg-white text-red-500"
                    label="Delete"
                    style="danger"
                    onClick={handleDelete}
                  />
                </Dropdown>
              </div>
            </div>
            <Input
              label="Title*"
              name="title"
              placeholder="Enter title"
              value={values.title}
              onBlur={handleBlur}
              onChange={e => {
                setTitle(e.target.value);
                handleChange(e);
              }}
            />
            <div className="mt-2">
              <FormikSelect
                isMulti
                isSearchable
                className="basic-multi-select"
                classNamePrefix="select"
                id="category_ids"
                isLoading={isLoading}
                label="Category*"
                name="category_ids"
                noOptionsMessage={() => "No categories found"}
                options={categories}
                placeholder="Search and select categories"
                value={selectedCategories}
                onBlur={handleBlur}
                onChange={selectedOptions => {
                  setSelectedCategories(selectedOptions);
                  setFieldValue(
                    "category_ids",
                    selectedOptions.map(option => option.value)
                  );
                }}
              />
            </div>
            <Textarea
              className="mt-4 h-auto"
              label="Description*"
              name="description"
              placeholder="Enter description"
              rows={20}
              size="large"
              value={values.description}
              onBlur={handleBlur}
              onChange={e => {
                setDescription(e.target.value);
                handleChange(e);
              }}
            />
            {/* <div className="mt-4 flex justify-end gap-x-4">
              <Button
                className="text-black"
                label="Cancel"
                style="tertiary"
                type="button"
                onClick={onCancel}
              />
              <Button
                className="bg-black text-white"
                label="Submit"
                style="tertiary"
                type="submit"
              />
            </div> */}
          </>
        )}
      </NeetoUIForm>
    </div>
  );
};

export default Form;
