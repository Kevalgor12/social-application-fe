import type { PostReaction } from "../constants/enum";

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

export async function createPost(data: {
  title: string;
  image: string;
  description: string;
}): Promise<PostResponse> {
  const res = await fetch(`${import.meta.env.VITE_API_ENDPOINT}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) throw new Error("Create post failed");
  const result = await res.json();
  return result;
}

export async function updatePost(data: {
  postId: string;
  title: string;
  image: string;
  description: string;
}): Promise<PostResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/posts/${data.postId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        image: data.image,
        description: data.description,
      }),
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Update post failed");
  const result = await res.json();
  return result;
}

export async function getPublicPosts(
  page = 1,
  limit = 10,
  search = ""
): Promise<PostListResponse> {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_ENDPOINT
    }/posts/public?page=${page}&limit=${limit}&search=${search}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPosts(
  page = 1,
  limit = 10,
  search = ""
): Promise<PostListResponse> {
  const res = await fetch(
    `${
      import.meta.env.VITE_API_ENDPOINT
    }/posts?page=${page}&limit=${limit}&search=${search}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function managePostReactions(data: {
  postId: string;
  post_reaction: PostReaction | null;
}): Promise<PostResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/posts/${data.postId}/reaction`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reaction_type: data.post_reaction }),
    }
  );

  if (!res.ok) throw new Error("Post reaction updating failed");
  return res.json();
}

export async function getPost(postId: string): Promise<SinglePostResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/posts/${postId}`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export async function getPublicPost(
  postId: string
): Promise<SinglePostResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/posts/${postId}/public`,
    {
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Failed to fetch public post");
  return res.json();
}

export async function deletePost(data: {
  postId: string;
}): Promise<PostResponse> {
  const res = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}/posts/${data.postId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Post reaction deleting failed");
  return res.json();
}
