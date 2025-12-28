import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";

import "./postForm.scss";
import {
  createPost as createPostAPI,
  updatePost as updatePostAPI,
  type PostMeta,
  type PostResponse,
} from "../../api/posts";
import { useMutation } from "@tanstack/react-query";

// Types
interface PostFormValues {
  title: string;
  image: string;
  description: string;
}

interface PostFormPageProps {
  isEdit: boolean;
  postDetail?: PostMeta;
}

// Yup validation schema
const validationSchema = Yup.object<PostFormValues>({
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

const PostForm: React.FC<PostFormPageProps> = ({ isEdit, postDetail }) => {
  const {
    data: createPostData,
    isPending: isCreatePostLoading,
    isSuccess: isCreatePostSuccess,
    mutateAsync: createPostMutateAsync,
  } = useMutation<
    PostResponse,
    Error,
    {
      title: string;
      image: string;
      description: string;
    }
  >({
    mutationKey: ["createPost"],
    mutationFn: createPostAPI,
  });
  const {
    data: updatePostData,
    isPending: isUpdatePostLoading,
    isSuccess: isUpdatePostSuccess,
    mutateAsync: updatePostMutateAsync,
  } = useMutation<
    PostResponse,
    Error,
    {
      postId: string;
      title: string;
      image: string;
      description: string;
    }
  >({
    mutationKey: ["updatePost"],
    mutationFn: updatePostAPI,
  });

  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const [imageError, setImageError] = useState<boolean>(false);

  // Formik setup
  const formik = useFormik<PostFormValues>({
    initialValues: {
      title: postDetail?.title || "",
      image: postDetail?.image || "",
      description: postDetail?.description || "",
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await (isEdit
          ? updatePostMutateAsync({
              postId: id!,
              title: values.title,
              image: values.image,
              description: values.description,
            })
          : createPostMutateAsync({
              title: values.title,
              image: values.image,
              description: values.description,
            }));
        navigate("/me/posts");
      } catch (error) {
        console.error("Failed to save post:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle image load error
  const handleImageError = (): void => {
    setImageError(true);
  };

  // Handle image load success
  const handleImageLoad = (): void => {
    setImageError(false);
  };

  // Handle cancel button
  const handleCancel = (): void => {
    navigate("/me/posts");
  };

  // Handle form reset
  const handleReset = (): void => {
    formik.resetForm();
    setImageError(false);
  };

  // Validate image URL and show preview
  const isValidImageUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (
      (!isCreatePostLoading &&
        isCreatePostSuccess &&
        createPostData?.data.id) ||
      (!isUpdatePostLoading && isUpdatePostSuccess && updatePostData?.data.id)
    ) {
      navigate("/me/posts");
    }
  }, [
    isCreatePostLoading,
    isCreatePostSuccess,
    createPostData,
    navigate,
    isUpdatePostLoading,
    isUpdatePostSuccess,
    updatePostData?.data.id,
  ]);

  return (
    <div className="post-form-container">
      <div className="post-form-card">
        <div className="form-header">
          <h1 className="form-title">
            {isEditing ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="form-subtitle">
            {isEditing
              ? "Update your post content"
              : "Share your thoughts with the community"}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Post Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-input ${
                formik.errors.title && formik.touched.title ? "error" : ""
              }`}
              placeholder="Enter an engaging title for your post"
              disabled={formik.isSubmitting}
            />
            {formik.errors.title && formik.touched.title && (
              <span className="error-message">{formik.errors.title}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Image URL <span className="required">*</span>
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formik.values.image}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-input ${
                formik.errors.image && formik.touched.image ? "error" : ""
              }`}
              placeholder="https://example.com/image.jpg"
              disabled={formik.isSubmitting}
            />
            {formik.errors.image && formik.touched.image && (
              <span className="error-message">{formik.errors.image}</span>
            )}
          </div>

          {/* Image Preview */}
          {formik.values.image && isValidImageUrl(formik.values.image) && (
            <div className="image-preview-section">
              <label className="form-label">Image Preview</label>
              <div className="image-preview-container">
                <img
                  src={formik.values.image}
                  alt="Preview"
                  className="image-preview"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
                {imageError && (
                  <div className="image-error-overlay">
                    <span>Failed to load image</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Post Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`form-textarea ${
                formik.errors.description && formik.touched.description
                  ? "error"
                  : ""
              }`}
              placeholder="Write a detailed description of your post..."
              rows={8}
              disabled={formik.isSubmitting}
            />
            {formik.errors.description && formik.touched.description && (
              <span className="error-message">{formik.errors.description}</span>
            )}
            <span className="character-count">
              {formik.values.description.length}/1000
            </span>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={formik.isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline"
              disabled={formik.isSubmitting || !formik.dirty}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                formik.isSubmitting ||
                !formik.isValid ||
                !formik.dirty ||
                imageError
              }
            >
              {formik.isSubmitting
                ? "Saving..."
                : isEditing
                ? "Update Post"
                : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
