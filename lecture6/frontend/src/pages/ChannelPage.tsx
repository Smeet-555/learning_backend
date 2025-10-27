import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authApi, subscriptionApi, tweetApi, playlistApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { VideoCard } from '../components/VideoCard';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const ChannelPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useAuth();
  const [channel, setChannel] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [tweets, setTweets] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (username) {
      fetchChannelData();
    }
  }, [username]);

  const fetchChannelData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.getUserChannelProfile(username!);
      setChannel(response.data);
      setVideos(response.data.videos || []);
      setIsSubscribed(response.data.isSubscribed || false);

      // Fetch tweets and playlists
      if (response.data._id) {
        fetchTweets(response.data._id);
        fetchPlaylists(response.data._id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load channel');
    } finally {
      setLoading(false);
    }
  };

  const fetchTweets = async (userId: string) => {
    try {
      const response = await tweetApi.getUserTweets(userId);
      setTweets(response.data || []);
    } catch (err) {
      console.error('Failed to fetch tweets:', err);
    }
  };

  const fetchPlaylists = async (userId: string) => {
    try {
      const response = await playlistApi.getUserPlaylists(userId);
      setPlaylists(response.data || []);
    } catch (err) {
      console.error('Failed to fetch playlists:', err);
    }
  };

  const handleSubscribe = async () => {
    if (!currentUser) {
      toast.error('Please login to subscribe');
      return;
    }

    try {
      await subscriptionApi.toggleSubscription(channel._id);
      setIsSubscribed(!isSubscribed);
      setChannel({
        ...channel,
        subscribersCount: isSubscribed
          ? channel.subscribersCount - 1
          : channel.subscribersCount + 1,
      });
      toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!');
    } catch (err) {
      toast.error('Failed to update subscription');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Skeleton className="w-full h-48 rounded-lg mb-8" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="size-32 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !channel) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error || 'Channel not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isOwnChannel = currentUser?._id === channel._id;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cover Image */}
      {channel.coverImage && (
        <div className="w-full h-48 bg-muted">
          <img
            src={channel.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Channel Info */}
      <div className="p-8">
        <div className="flex items-start gap-6 mb-8">
          <Avatar className="size-32">
            <AvatarImage src={channel.avatar} alt={channel.fullName} />
            <AvatarFallback className="text-4xl">
              {channel.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="mb-1">{channel.fullName}</h1>
            <p className="text-muted-foreground mb-2">@{channel.username}</p>
            <p className="text-muted-foreground mb-4">
              {channel.subscribersCount || 0} subscribers • {videos.length} videos
            </p>

            {!isOwnChannel && currentUser && (
              <Button onClick={handleSubscribe} variant={isSubscribed ? 'outline' : 'default'}>
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="videos">
          <TabsList>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-6">
            {videos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No videos yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="playlists" className="mt-6">
            {playlists.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No playlists yet
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {playlists.map((playlist) => (
                  <div key={playlist._id} className="border rounded-lg p-4">
                    <h3 className="font-medium mb-2">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {playlist.videos?.length || 0} videos
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            {tweets.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No community posts yet
              </div>
            ) : (
              <div className="space-y-4 max-w-2xl">
                {tweets.map((tweet) => (
                  <div key={tweet._id} className="border rounded-lg p-4">
                    <p className="mb-2">{tweet.content}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(tweet.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <div className="max-w-2xl space-y-4">
              <div>
                <h3 className="font-medium mb-2">Channel Details</h3>
                <p className="text-muted-foreground">Email: {channel.email}</p>
                <p className="text-muted-foreground">
                  Joined: {new Date(channel.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
