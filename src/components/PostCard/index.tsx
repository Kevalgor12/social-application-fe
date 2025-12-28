import "./postCard.scss";
import {
  deletePost as deletePostAPI,
  managePostReactions as managePostReactionsAPI,
  type PostMeta,
  type PostResponse,
} from "../../api/posts";
import { useMutation } from "@tanstack/react-query";
import { PostReaction } from "../../constants/enum";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";

interface PostCardProps {
  post: PostMeta;
  userCanEditAndDelete: boolean;
}

const PostCard = ({ post, userCanEditAndDelete = false }: PostCardProps) => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [userReaction, setUserReaction] = useState<PostReaction | null>(
    post.likedByMe ? PostReaction.LIKE : null
  );
  const [likeCount, setLikeCount] = useState<number>(post.likes.totalLikes);

  const {
    data: managePostReactionsData,
    isPending: managePostReactionsIsLoading,
    isSuccess: managePostReactionsIsSuccess,
    mutateAsync: managePostReactionsMutateAsync,
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
  const {
    data: deletePostData,
    isPending: deletePostIsLoading,
    isSuccess: deletePostIsSuccess,
    mutateAsync: deletePostMutateAsync,
    // isError,
    // error,
  } = useMutation<
    PostResponse,
    Error,
    {
      postId: string;
    }
  >({
    mutationKey: ["deletePost"],
    mutationFn: deletePostAPI,
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
      await managePostReactionsMutateAsync({
        postId: post.id.toString(),
        post_reaction:
          userReaction === PostReaction.LIKE
            ? PostReaction.DISLIKE
            : PostReaction.LIKE,
      });
    }
  };

  const handleViewPost = () => {
    navigate(`/posts/${post.id}`);
  };

  const handlePostEdit = () => {
    navigate(`/posts/${post.id}/edit`);
  };

  const handlePostDelete = async () => {
    await deletePostMutateAsync({
      postId: post.id as string,
    });
    navigate("/posts");
  };

  useEffect(() => {
    if (!managePostReactionsIsLoading && managePostReactionsIsSuccess) {
      console.log("success", managePostReactionsData);
    }
  }, [
    managePostReactionsIsLoading,
    managePostReactionsIsSuccess,
    managePostReactionsData,
  ]);

  useEffect(() => {
    if (!deletePostIsLoading && deletePostIsSuccess) {
      console.log("Post deleted successfully", deletePostData);
    }
  }, [deletePostIsLoading, deletePostIsSuccess, deletePostData]);

  return (
    <article className="post-card">
      <div className="post-image">
        <img src={post.image as string} alt={post.title} loading="lazy" />
        <div className="post-overlay">
          <button className="view-button" onClick={handleViewPost}>
            View Post
          </button>
        </div>
        <div className="post-actions-overlay">
          {userCanEditAndDelete && (
            <>
              <button
                className="action-btn edit-btn"
                aria-label="Edit post"
                style={{}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 1)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={handlePostEdit}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>

              <button
                className="action-btn delete-btn"
                aria-label="Delete post"
                style={{}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 1)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={handlePostDelete}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="post-content">
        <h3 className="post-title">{post.title}</h3>

        <div className="post-meta">
          <span className="post-author">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                fill="currentColor"
              />
            </svg>
            {post.author.firstName} {post.author.lastName}
          </span>

          <span className="post-date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"
                fill="currentColor"
              />
            </svg>
            {post.createdAt.split("T")[0]}
          </span>
        </div>

        <div className="post-reactions">
          <button
            className={`reaction-button like ${
              userReaction === PostReaction.LIKE ? "active" : ""
            }`}
            onClick={handleReaction}
            aria-label="Like post"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
  );
};

export default PostCard;
