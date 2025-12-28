import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./postDetail.scss";
import {
  managePostReactions as managePostReactionsAPI,
  type PostMeta,
  type PostResponse,
} from "../../api/posts";
import { PostReaction } from "../../constants/enum";
import { useAppSelector } from "../../store/hooks";
import { useMutation } from "@tanstack/react-query";

const PostDetail = ({ postDetail }: { postDetail?: PostMeta }) => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [userReaction, setUserReaction] = useState<PostReaction | null>(
    postDetail?.likedByMe ? PostReaction.LIKE : null
  );
  const [likeCount, setLikeCount] = useState<number>(
    postDetail?.likes.totalLikes || 0
  );
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
    mutateAsync,
    // isError,
    // error,
  } = useMutation<
    PostResponse,
    Error,
    {
      postId: string;
      post_reaction: PostReaction | null;
    }
  >({
    mutationKey: ["managePostReactions"],
    mutationFn: managePostReactionsAPI,
  });

  const handleReaction = async () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      setUserReaction(
        userReaction === PostReaction.LIKE
          ? PostReaction.DISLIKE
          : PostReaction.LIKE
      );
      setLikeCount((prevCount) =>
        userReaction === PostReaction.LIKE ? prevCount - 1 : prevCount + 1
      );
      await mutateAsync({
        postId: postDetail?.id.toString() as string,
        post_reaction:
          userReaction === PostReaction.LIKE
            ? PostReaction.DISLIKE
            : PostReaction.LIKE,
      });
    }
  };

  useEffect(() => {
    if (!isLoading && isSuccess) {
      console.log("success", responseData);
    }
  }, [isLoading, isSuccess, responseData]);

  if (isLoading) {
    return (
      <div className="post-detail-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!postDetail) {
    return (
      <div className="post-detail-container">
        <div className="error-state">
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Back to Posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <article className="main-post">
        <div className="post-header">
          <div className="post-image-wrapper">
            <img
              src={postDetail.image as string}
              alt={postDetail.title}
              className="post-main-image"
            />
          </div>
          <div className="post-header-content">
            <h1 className="post-title">{postDetail.title}</h1>
            <div className="post-meta">
              <span className="post-author">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                    fill="currentColor"
                  />
                </svg>
                {postDetail.author.firstName} {postDetail.author.lastName}
              </span>
              <span className="post-date">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
                    fill="currentColor"
                  />
                </svg>
                {postDetail.createdAt.split("T")[0]}
              </span>
            </div>
          </div>
        </div>

        <div className="post-description">
          <p>{postDetail.description}</p>
        </div>

        <div className="post-actions">
          <div className="post-reactions">
            <button
              className={`reaction-button like ${
                userReaction === PostReaction.LIKE ? "active" : ""
              }`}
              onClick={handleReaction}
              aria-label="Like post"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"
                  fill="currentColor"
                />
              </svg>
              <span className="reaction-count">{likeCount}</span>
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default PostDetail;
