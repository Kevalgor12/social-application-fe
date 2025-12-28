import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PostForm from "../../components/PostForm";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  getPost as getPostAPI,
  type SinglePostResponse,
} from "../../api/posts";
import { useParams } from "react-router-dom";

const PostEdit = () => {
  const { id: postId } = useParams<{ id: string }>();
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
  } = useQuery<SinglePostResponse, Error>({
    queryKey: ["getUserProfile", postId],
    queryFn: () => getPostAPI(postId as string),
    enabled: !!postId,
  });

  useEffect(() => {
    if (!isLoading && !isSuccess) {
      console.log("error");
    }
  }, [isLoading, isSuccess]);

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
