# VidStream - YouTube Clone Frontend

A full-featured video streaming platform frontend built with React, TypeScript, and Tailwind CSS. This application connects to your YouTube-like backend API running on `localhost:3000`.

## Features

### Authentication
- User registration with avatar and cover image upload
- Login/logout functionality
- JWT token-based authentication
- Protected routes for authenticated users

### Video Management
- Browse all videos on home page
- Upload videos with thumbnails
- Video player with controls
- Like/dislike videos
- View count tracking
- Video publish/unpublish toggle
- Delete videos

### User Channels
- User channel pages with videos, playlists, and community posts
- Subscribe/unsubscribe to channels
- Channel statistics (subscribers, videos)
- Custom cover images and avatars

### Comments
- Add comments to videos
- Like comments
- View all video comments
- Delete your own comments

### Playlists
- Create and manage playlists
- Add/remove videos from playlists
- View all user playlists

### Community (Tweets)
- Create community posts
- Like community posts
- Delete your own posts
- View user community feed

### Dashboard
- Channel analytics (views, subscribers, likes)
- Manage all your videos
- Quick video status controls

### Additional Features
- Watch history tracking
- Liked videos collection
- Responsive design
- Real-time updates
- Toast notifications
- Search functionality (UI ready)

## Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Shadcn/UI** - UI components
- **Lucide React** - Icons
- **date-fns** - Date formatting
- **Sonner** - Toast notifications

## Project Structure

```
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── Layout.tsx       # Main layout with header & sidebar
│   └── VideoCard.tsx    # Reusable video card component
├── contexts/
│   └── AuthContext.tsx  # Authentication state management
├── lib/
│   └── api.ts          # API service layer
├── pages/
│   ├── HomePage.tsx
│   ├── VideoDetailPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── UploadVideoPage.tsx
│   ├── ChannelPage.tsx
│   ├── DashboardPage.tsx
│   ├── PlaylistsPage.tsx
│   ├── TweetsPage.tsx
│   ├── HistoryPage.tsx
│   └── LikedVideosPage.tsx
└── App.tsx             # Main app with routing
```

## Backend API Endpoints

The frontend expects the following API structure at `http://localhost:3000/api/v1`:

### Auth Routes
- POST `/users/register` - Register new user
- POST `/users/login` - Login user
- POST `/users/logout` - Logout user
- GET `/users/current-user` - Get current user
- PATCH `/users/update-account` - Update account details
- PATCH `/users/avatar` - Update avatar
- PATCH `/users/cover-image` - Update cover image
- POST `/users/change-password` - Change password
- GET `/users/c/:username` - Get channel profile
- GET `/users/history` - Get watch history

### Video Routes
- GET `/videos` - Get all videos (with pagination, search, sort)
- GET `/videos/:id` - Get video by ID
- POST `/videos` - Upload video
- PATCH `/videos/:id` - Update video
- DELETE `/videos/:id` - Delete video
- PATCH `/videos/toggle/publish/:id` - Toggle publish status

### Comment Routes
- GET `/comments/:videoId` - Get video comments
- POST `/comments/:videoId` - Add comment
- PATCH `/comments/c/:commentId` - Update comment
- DELETE `/comments/c/:commentId` - Delete comment

### Like Routes
- POST `/likes/toggle/v/:videoId` - Toggle video like
- POST `/likes/toggle/c/:commentId` - Toggle comment like
- POST `/likes/toggle/t/:tweetId` - Toggle tweet like
- GET `/likes/videos` - Get liked videos

### Tweet Routes
- POST `/tweets` - Create tweet
- GET `/tweets/user/:userId` - Get user tweets
- PATCH `/tweets/:tweetId` - Update tweet
- DELETE `/tweets/:tweetId` - Delete tweet

### Playlist Routes
- POST `/playlists` - Create playlist
- GET `/playlists/user/:userId` - Get user playlists
- GET `/playlists/:playlistId` - Get playlist by ID
- PATCH `/playlists/:playlistId` - Update playlist
- DELETE `/playlists/:playlistId` - Delete playlist
- PATCH `/playlists/add/:videoId/:playlistId` - Add video to playlist
- PATCH `/playlists/remove/:videoId/:playlistId` - Remove video from playlist

### Subscription Routes
- POST `/subscriptions/c/:channelId` - Toggle subscription
- GET `/subscriptions/c/:channelId` - Get channel subscribers
- GET `/subscriptions/u/:subscriberId` - Get subscribed channels

### Dashboard Routes
- GET `/dashboard/stats` - Get channel statistics
- GET `/dashboard/videos` - Get channel videos

## Setup Instructions

1. **Ensure your backend is running** on `http://localhost:3000`

2. **Install dependencies** (handled automatically by Figma Make)

3. **The application will start automatically**

4. **Default routes:**
   - Home: `/`
   - Login: `/login`
   - Register: `/register`
   - Upload: `/upload`
   - Dashboard: `/dashboard`

## Usage

1. **Register a new account** with username, email, password, and optional avatar/cover image
2. **Login** with your credentials
3. **Upload videos** from the upload page
4. **Browse videos** on the home page
5. **Watch videos** and interact with likes, comments, and subscriptions
6. **Manage your channel** from the dashboard
7. **Create playlists** to organize videos
8. **Post community updates** to engage with subscribers

## Notes

- All file uploads (videos, thumbnails, avatars) use FormData
- Authentication tokens are stored in localStorage
- Protected routes redirect to login if not authenticated
- All dates are formatted using relative time (e.g., "2 hours ago")
- Toast notifications provide feedback for all actions
