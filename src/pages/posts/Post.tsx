import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { SinglePostResponse } from "../../interfaces/post";

import { useAppSelector } from "../../store/hooks";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PostDetail from "../../components/PostDetail";

import {
  getPost as getPostAPI,
  getPublicPost as getPublicPostAPI,
} from "../../api/posts";

const Post = () => {
  const { id: postId } = useParams<{ id: string }>();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
    error,
  } = useQuery<SinglePostResponse, Error>({
    queryKey: ["getPosts", postId],
    queryFn: () =>
      isLoggedIn
        ? getPostAPI(postId as string)
        : getPublicPostAPI(postId as string),
    enabled: !!postId,
  });

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
        <PostDetail postDetail={responseData?.data} />
      </main>

      <Footer />
    </div>
  );
};

export default Post;
