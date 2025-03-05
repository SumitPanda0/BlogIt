import React, { useEffect, useState } from "react";

import FormikEditor from "@bigbinary/neeto-editor/FormikEditor";
import { Button } from "@bigbinary/neetoui";
import {
  Form as NeetoUIForm,
  Input,
  Select as FormikSelect,
} from "@bigbinary/neetoui/formik";

import categoriesApi from "../../apis/categories";
import { FORM_VALIDATION_SCHEMA } from "../utils/validationSchema";

const Form = ({
  onSubmit,
  onCancel,
  title,
  description,
  setTitle,
  // setDescription,
  selectedCategories = [],
  setSelectedCategories,
}) => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <NeetoUIForm
        formProps={{ noValidate: true }}
        formikProps={{
          initialValues: {
            title,
            description,
            category_ids: selectedCategories.map(category => category.value),
          },
          validationSchema: FORM_VALIDATION_SCHEMA,
          onSubmit,
          validateOnChange: true,
          validateOnBlur: true,
        }}
      >
        {({ values, handleChange, handleBlur, setFieldValue }) => (
          <>
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
            {/* <Textarea
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
            /> */}
            <FormikEditor required label="Description" name="description" />
            <div className="mt-4 flex justify-end gap-x-4">
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
            </div>
          </>
        )}
      </NeetoUIForm>
    </div>
  );
};

export default Form;
