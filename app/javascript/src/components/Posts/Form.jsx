import React from "react";

import { Button } from "@bigbinary/neetoui";
import {
  Form as NeetoUIForm,
  Input,
  Textarea,
} from "@bigbinary/neetoui/formik";

import { FORM_VALIDATION_SCHEMA } from "../utils/validationSchema";

const Form = ({
  onSubmit,
  onCancel,
  title,
  description,
  setTitle,
  setDescription,
}) => (
  <div className="flex flex-col gap-y-4">
    <NeetoUIForm
      formProps={{ noValidate: true }}
      formikProps={{
        initialValues: { title, description },
        validationSchema: FORM_VALIDATION_SCHEMA,
        onSubmit,
        validateOnChange: true,
        validateOnBlur: true,
      }}
    >
      {({ values, handleChange, handleBlur }) => (
        <>
          <Input
            label="Title"
            name="title"
            placeholder="Enter title"
            value={values.title}
            onBlur={handleBlur}
            onChange={e => {
              setTitle(e.target.value);
              handleChange(e);
            }}
          />
          <Textarea
            className="mt-4 h-auto"
            label="Description"
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

export default Form;
