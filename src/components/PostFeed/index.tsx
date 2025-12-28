import PostCard from "../PostCard";

import "./postFeed.scss";
import type { PostMeta } from "../../api/posts";
import SearchBox from "../SearchBox";
import Pagination from "../Pagination";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

interface PostsFeedProps {
  posts?: PostMeta[];
  onSearchChange?: (term: string) => void;
  onPageChange?: (page: number) => void;
  onNextPage?: () => void;
  onClearSearch?: () => void;
  onPreviousPage?: () => void;
  onPageSizeChange?: (size: number) => void;
  searchValue?: string;
  currentPage?: number;
  totalPages?: number;
  onReactionUpdate?: (
    postId: number,
    reaction: "LIKE" | "DISLIKE" | null
  ) => void;
}

const PostsFeed = ({
  posts,
  searchValue,
  currentPage,
  totalPages,
  onSearchChange,
  onClearSearch,
  onPageChange,
  onNextPage,
  onPreviousPage,
}: // onReactionUpdate,
PostsFeedProps) => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleAddPost = () => {
    navigate("/posts/add");
  };

  return (
    <div className="posts-feed">
      <div className="search-section">
        <div className="feed-header">
          <h1>Recent Posts</h1>
          <p>Discover amazing content from our community</p>
        </div>

        <div className="search-add-post-wrapper">
          <SearchBox
            searchTerm={searchValue as string}
            onSearchChange={onSearchChange}
            onClearSearch={onClearSearch}
            resultCount={posts?.length ?? 0}
          />
          <button onClick={handleAddPost}>+ Add post</button>
        </div>
      </div>

      {!posts?.length ? (
        <div className="no-posts">
          <p>No posts available</p>
          <span>Check back later for new content</span>
        </div>
      ) : (
        <>
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post.id} className="post-wrapper">
                <PostCard
                  post={post}
                  userCanEditAndDelete={
                    isLoggedIn && user?.id === post.author.id
                  }
                />
              </div>
            ))}
          </div>
          {totalPages &&
            currentPage &&
            onPageChange &&
            onNextPage &&
            onPreviousPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onNextPage={onNextPage}
                onPreviousPage={onPreviousPage}
              />
            )}
        </>
      )}
    </div>
  );
};

export default PostsFeed;
