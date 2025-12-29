import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

import type { ProfileResponse } from "../../interfaces/user";

import Footer from "../../components/Footer";
import Header from "../../components/Header";
import UserProfileForm from "../../components/UserProfileForm";

import { getUser as getUserAPI } from "../../api/users";

const Profile = () => {
  const {
    data: responseData,
    isPending: isLoading,
    isSuccess,
    error,
  } = useQuery<ProfileResponse, Error>({
    queryKey: ["getUserProfile"],
    queryFn: () => getUserAPI(),
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
        <UserProfileForm userProfile={responseData?.data} />
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
