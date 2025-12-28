// import { useQuery, useMutation } from "@tanstack/react-query";
// import { getPosts, likePost } from "../api/posts";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PostForm from "../../components/PostForm";

const PostAdd = () => {
  // const { data, refetch } = useQuery({
  //   queryKey: ["posts"],
  //   queryFn: getPosts,
  // });

  // const likeMutation = useMutation({
  //   mutationFn: likePost,
  //   onSuccess: () => refetch(),
  // });

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        <PostForm isEdit={false} />
      </main>

      <Footer />
    </div>
  );
};

export default PostAdd;
