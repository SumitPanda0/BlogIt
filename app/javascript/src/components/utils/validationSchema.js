import * as Yup from "yup";

export const FORM_VALIDATION_SCHEMA = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  category_ids: Yup.array()
    .min(1, "Select at least one category")
    .required("At least one category is required"),
});
