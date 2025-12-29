import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { SinglePostResponse } from "../../interfaces/post";

import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PostForm from "../../components/PostForm";

import { getPost as getPostAPI } from "../../api/posts";

const PostEdit = () => {
  const { id: postId } = useParams<{ id: string }>();
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
    error,
  } = useQuery<SinglePostResponse, Error>({
    queryKey: ["getUserProfile", postId],
    queryFn: () => getPostAPI(postId as string),
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
        <PostForm isEdit={true} postDetail={responseData?.data} />
      </main>

      <Footer />
    </div>
  );
};

export default PostEdit;
