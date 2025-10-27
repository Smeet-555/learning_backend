import React, { useEffect, useState } from 'react';
import { likeApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { VideoCard } from '../components/VideoCard';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ThumbsUp, AlertCircle } from 'lucide-react';

export const LikedVideosPage: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchLikedVideos();
    }
  }, [user]);

  const fetchLikedVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await likeApi.getLikedVideos();
      setVideos(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load liked videos');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>Please login to view liked videos</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="mb-8">Liked Videos</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-video rounded-lg" />
              <div className="flex gap-3">
                <Skeleton className="size-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <ThumbsUp className="size-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="mb-2">No liked videos</h2>
          <p className="text-muted-foreground">
            Videos you like will appear here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};
