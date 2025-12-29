import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PostForm from "../../components/PostForm";

const PostAdd = () => {
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
