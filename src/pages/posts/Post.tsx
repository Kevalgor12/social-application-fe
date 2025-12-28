// import { useQuery, useMutation } from "@tanstack/react-query";
// import { getPosts, likePost } from "../../api/posts";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PostDetail from "../../components/PostDetail";
import { useQuery } from "@tanstack/react-query";
import {
  getPost as getPostAPI,
  getPublicPost as getPublicPostAPI,
  type SinglePostResponse,
} from "../../api/posts";
import { useAppSelector } from "../../store/hooks";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

const Post = () => {
  const { id: postId } = useParams<{ id: string }>();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
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
      console.log("error");
    }
  }, [isLoading, isSuccess]);

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
