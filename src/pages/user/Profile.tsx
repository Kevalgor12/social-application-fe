import { useQuery } from "@tanstack/react-query";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import UserProfileForm from "../../components/UserProfileForm";
import { getUser as getUserAPI, type ProfileResponse } from "../../api/users";
import { useEffect } from "react";

const Profile = () => {
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
  } = useQuery<ProfileResponse, Error>({
    queryKey: ["getUserProfile"],
    queryFn: () => getUserAPI(),
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
        <UserProfileForm userProfile={responseData?.data} />
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
