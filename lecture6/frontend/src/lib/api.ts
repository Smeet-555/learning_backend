// API utility functions for backend communication

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

// Helper function to make authenticated requests
const fetchWithAuth = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Only add Content-Type if not FormData (for file uploads)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// Auth APIs
export const authApi = {
  register: async (data: FormData) => {
    return fetchWithAuth('/users/register', {
      method: 'POST',
      body: data,
    });
  },

  login: async (email: string, password: string) => {
    return fetchWithAuth('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return fetchWithAuth('/users/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return fetchWithAuth('/users/current-user');
  },

  updateAccountDetails: async (fullName: string, email: string) => {
    return fetchWithAuth('/users/update-account', {
      method: 'PATCH',
      body: JSON.stringify({ fullName, email }),
    });
  },

  updateAvatar: async (avatar: FormData) => {
    return fetchWithAuth('/users/avatar', {
      method: 'PATCH',
      body: avatar,
    });
  },

  updateCoverImage: async (coverImage: FormData) => {
    return fetchWithAuth('/users/cover-image', {
      method: 'PATCH',
      body: coverImage,
    });
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    return fetchWithAuth('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  },

  getUserChannelProfile: async (username: string) => {
    return fetchWithAuth(`/users/c/${username}`);
  },

  getWatchHistory: async () => {
    return fetchWithAuth('/users/history');
  },
};

// Video APIs
export const videoApi = {
  getAllVideos: async (page = 1, limit = 10, query = '', sortBy = 'createdAt', sortType = 'desc') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      query,
      sortBy,
      sortType,
    });
    return fetchWithAuth(`/videos?${params}`);
  },

  getVideoById: async (videoId: string) => {
    return fetchWithAuth(`/videos/${videoId}`);
  },

  publishVideo: async (videoData: FormData) => {
    return fetchWithAuth('/videos', {
      method: 'POST',
      body: videoData,
    });
  },

  updateVideo: async (videoId: string, data: any) => {
    return fetchWithAuth(`/videos/${videoId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  deleteVideo: async (videoId: string) => {
    return fetchWithAuth(`/videos/${videoId}`, {
      method: 'DELETE',
    });
  },

  togglePublishStatus: async (videoId: string) => {
    return fetchWithAuth(`/videos/toggle/publish/${videoId}`, {
      method: 'PATCH',
    });
  },
};

// Comment APIs
export const commentApi = {
  getVideoComments: async (videoId: string, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return fetchWithAuth(`/comments/${videoId}?${params}`);
  },

  addComment: async (videoId: string, content: string) => {
    return fetchWithAuth(`/comments/${videoId}`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  updateComment: async (commentId: string, content: string) => {
    return fetchWithAuth(`/comments/c/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  },

  deleteComment: async (commentId: string) => {
    return fetchWithAuth(`/comments/c/${commentId}`, {
      method: 'DELETE',
    });
  },
};

// Like APIs
export const likeApi = {
  toggleVideoLike: async (videoId: string) => {
    return fetchWithAuth(`/likes/toggle/v/${videoId}`, {
      method: 'POST',
    });
  },

  toggleCommentLike: async (commentId: string) => {
    return fetchWithAuth(`/likes/toggle/c/${commentId}`, {
      method: 'POST',
    });
  },

  toggleTweetLike: async (tweetId: string) => {
    return fetchWithAuth(`/likes/toggle/t/${tweetId}`, {
      method: 'POST',
    });
  },

  getLikedVideos: async () => {
    return fetchWithAuth('/likes/videos');
  },
};

// Tweet APIs
export const tweetApi = {
  createTweet: async (content: string) => {
    return fetchWithAuth('/tweets', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  getUserTweets: async (userId: string) => {
    return fetchWithAuth(`/tweets/user/${userId}`);
  },

  updateTweet: async (tweetId: string, content: string) => {
    return fetchWithAuth(`/tweets/${tweetId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  },

  deleteTweet: async (tweetId: string) => {
    return fetchWithAuth(`/tweets/${tweetId}`, {
      method: 'DELETE',
    });
  },
};

// Playlist APIs
export const playlistApi = {
  createPlaylist: async (name: string, description: string) => {
    return fetchWithAuth('/playlists', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
  },

  getUserPlaylists: async (userId: string) => {
    return fetchWithAuth(`/playlists/user/${userId}`);
  },

  getPlaylistById: async (playlistId: string) => {
    return fetchWithAuth(`/playlists/${playlistId}`);
  },

  updatePlaylist: async (playlistId: string, name: string, description: string) => {
    return fetchWithAuth(`/playlists/${playlistId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name, description }),
    });
  },

  deletePlaylist: async (playlistId: string) => {
    return fetchWithAuth(`/playlists/${playlistId}`, {
      method: 'DELETE',
    });
  },

  addVideoToPlaylist: async (playlistId: string, videoId: string) => {
    return fetchWithAuth(`/playlists/add/${videoId}/${playlistId}`, {
      method: 'PATCH',
    });
  },

  removeVideoFromPlaylist: async (playlistId: string, videoId: string) => {
    return fetchWithAuth(`/playlists/remove/${videoId}/${playlistId}`, {
      method: 'PATCH',
    });
  },
};

// Subscription APIs
export const subscriptionApi = {
  toggleSubscription: async (channelId: string) => {
    return fetchWithAuth(`/subscriptions/c/${channelId}`, {
      method: 'POST',
    });
  },

  getUserChannelSubscribers: async (channelId: string) => {
    return fetchWithAuth(`/subscriptions/c/${channelId}`);
  },

  getSubscribedChannels: async (subscriberId: string) => {
    return fetchWithAuth(`/subscriptions/u/${subscriberId}`);
  },
};

// Dashboard APIs
export const dashboardApi = {
  getChannelStats: async () => {
    return fetchWithAuth('/dashboard/stats');
  },

  getChannelVideos: async () => {
    return fetchWithAuth('/dashboard/videos');
  },
};
