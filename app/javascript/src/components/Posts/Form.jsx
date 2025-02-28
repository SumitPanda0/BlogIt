import React from "react";

import { Button, Input, Textarea } from "@bigbinary/neetoui";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .max(15, "Title must be less than 125 characters"),
  description: Yup.string()
    .required("Description is required")
    .max(10000, "Description must be less than 10000 characters"),
});

const Form = ({
  initialValues = { title: "", description: "" },
  onSubmit,
  onCancel,
}) => (
  <div className="flex flex-col gap-y-4 rounded-md border border-gray-300 p-14">
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        handleChange,
        handleSubmit,
        isSubmitting,
        errors,
        touched,
      }) => (
        <FormikForm className="mb-4 w-full space-y-2" onSubmit={handleSubmit}>
          <Input
            error={touched.title && errors.title}
            label="Title"
            name="title"
            placeholder="Enter title"
            value={values.title}
            onChange={handleChange}
          />
          <Textarea
            className="mt-4 h-auto"
            error={touched.description && errors.description}
            label="Description"
            name="description"
            placeholder="Enter description"
            rows={20}
            size="large"
            value={values.description}
            onChange={handleChange}
          />
          <div className="flex justify-end gap-x-4">
            <Button
              className="text-black"
              label="Cancel"
              style="tertiary"
              type="button"
              onClick={onCancel}
            />
            <Button
              className="bg-black text-white"
              disabled={isSubmitting}
              label="Submit"
              loading={isSubmitting}
              style="tertiary"
              type="submit"
            />
          </div>
        </FormikForm>
      )}
    </Formik>
  </div>
);

export default Form;
