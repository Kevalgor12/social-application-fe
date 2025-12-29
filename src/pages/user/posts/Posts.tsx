import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { PostListResponse } from "../../../interfaces/post";

import Header from "../../../components/Header";
import PostsFeed from "../../../components/PostFeed";
import Footer from "../../../components/Footer";

import { getUsersPosts as getUsersPostsAPI } from "../../../api/users";

const UserPosts = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
    error,
  } = useQuery<PostListResponse, Error>({
    queryKey: ["getUserPosts", currentPage, 10, searchTerm],
    queryFn: () => getUsersPostsAPI(),
  });

  const handleSearchChange = (term: string): void => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
  };

  const handleNextPage = (): void => {
    if (
      responseData?.data.posts &&
      currentPage < Math.ceil((responseData?.data.pagination.total ?? 0) / 10)
    ) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    if (!isLoading && !isSuccess) {
      toast.error(error?.message);
    }
  }, [error?.message, isLoading, isSuccess]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <PostsFeed
          posts={responseData?.data.posts}
          searchValue={searchTerm}
          currentPage={currentPage}
          totalPages={Math.ceil(
            (responseData?.data.pagination.total ?? 0) / 10
          )}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          onNextPage={handleNextPage}
          onClearSearch={() => handleSearchChange("")}
          onPreviousPage={handlePreviousPage}
        />
      </main>

      <Footer />
    </div>
  );
};

export default UserPosts;
