import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi, videoApi } from '../lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Eye, ThumbsUp, Users, Video, Edit, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, videosRes] = await Promise.all([
        dashboardApi.getChannelStats(),
        dashboardApi.getChannelVideos(),
      ]);
      setStats(statsRes.data);
      setVideos(videosRes.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (videoId: string) => {
    try {
      await videoApi.togglePublishStatus(videoId);
      toast.success('Video status updated');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to update video status');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await videoApi.deleteVideo(videoId);
      toast.success('Video deleted');
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete video');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
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
      <div className="flex items-center justify-between mb-8">
        <h1>Channel Dashboard</h1>
        <Button asChild>
          <Link to="/upload">
            <Video className="size-4 mr-2" />
            Upload Video
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Views</CardTitle>
            <Eye className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats?.totalViews || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Subscribers</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats?.totalSubscribers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Total Likes</CardTitle>
            <ThumbsUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats?.totalLikes || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Videos List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Videos ({videos.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {videos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No videos uploaded yet
            </div>
          ) : (
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video._id} className="flex gap-4 p-4 border rounded-lg">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-40 aspect-video object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium mb-1 truncate">{video.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{video.views} views</span>
                      <span>{video.isPublished ? 'Published' : 'Draft'}</span>
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTogglePublish(video._id)}
                    >
                      {video.isPublished ? 'Unpublish' : 'Publish'}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/video/${video._id}/edit`}>
                        <Edit className="size-4 mr-1" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteVideo(video._id)}
                    >
                      <Trash2 className="size-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
