import * as Yup from "yup";

export const postSchema = Yup.object({
  title: Yup.string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters")
    .required("Title is required"),

  image: Yup.string()
    .url("Please enter a valid image URL")
    .required("Image URL is required")
    .test("image-url", "Please enter a valid image URL", (value) => {
      if (!value) return true;
      return (
        value.match(/\.(jpeg|jpg|gif|png|webp)$/i) !== null ||
        value.includes("picsum.photos")
      );
    }),

  description: Yup.string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description cannot exceed 1000 characters")
    .required("Description is required"),
});
