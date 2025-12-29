export interface Post {
  id: string;
  title: string;
  description: string;
  image: string | null;
  user: {
    id: string;
  };
}

export interface PostResponse {
  success: boolean;
  message: string;
  data: Post;
}

export interface PostMeta {
  id: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    isVerified: boolean;
  };
  title: string;
  description: string;
  image: string | null;
  likedByMe: boolean;
  likes: {
    totalLikes: number;
    recentLikedBy: {
      id: string;
      name: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
}

export interface SinglePostResponse {
  success: boolean;
  message: string;
  data: PostMeta;
}

export interface PostListResponse {
  success: boolean;
  message: string;
  data: {
    posts: PostMeta[];
    pagination: Pagination;
  };
}
