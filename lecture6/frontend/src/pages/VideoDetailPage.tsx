import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { videoApi, commentApi, likeApi, subscriptionApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ThumbsUp, ThumbsDown, Share2, AlertCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner@2.0.3';

export const VideoDetailPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const { user } = useAuth();
  const [video, setVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);

  useEffect(() => {
    if (videoId) {
      fetchVideoDetails();
      fetchComments();
    }
  }, [videoId]);

  const fetchVideoDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await videoApi.getVideoById(videoId!);
      setVideo(response.data);
      setLikesCount(response.data.likesCount || 0);
      setIsLiked(response.data.isLiked || false);
      
      if (response.data.owner) {
        fetchSubscriptionStatus(response.data.owner._id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentApi.getVideoComments(videoId!);
      setComments(response.data.docs || response.data || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    }
  };

  const fetchSubscriptionStatus = async (channelId: string) => {
    try {
      const response = await subscriptionApi.getUserChannelSubscribers(channelId);
      setSubscribersCount(response.data.subscribersCount || 0);
      setIsSubscribed(response.data.isSubscribed || false);
    } catch (err) {
      console.error('Failed to fetch subscription status:', err);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error('Please login to like videos');
      return;
    }
    
    try {
      await likeApi.toggleVideoLike(videoId!);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (err) {
      toast.error('Failed to like video');
    }
  };

  const handleSubscribe = async () => {
    if (!user) {
      toast.error('Please login to subscribe');
      return;
    }

    if (!video?.owner?._id) return;

    try {
      await subscriptionApi.toggleSubscription(video.owner._id);
      setIsSubscribed(!isSubscribed);
      setSubscribersCount(isSubscribed ? subscribersCount - 1 : subscribersCount + 1);
      toast.success(isSubscribed ? 'Unsubscribed' : 'Subscribed!');
    } catch (err) {
      toast.error('Failed to update subscription');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to comment');
      return;
    }

    if (!commentText.trim()) return;

    try {
      await commentApi.addComment(videoId!, commentText);
      setCommentText('');
      fetchComments();
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Skeleton className="aspect-video w-full rounded-lg mb-4" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="max-w-7xl mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error || 'Video not found'}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
        <video
          src={video.videoFile}
          controls
          className="w-full h-full"
          autoPlay
        />
      </div>

      {/* Video Info */}
      <h1 className="mb-2">{video.title}</h1>

      <div className="flex items-center justify-between mb-4">
        <p className="text-muted-foreground">
          {video.views} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant={isLiked ? 'default' : 'outline'}
            size="sm"
            onClick={handleLike}
          >
            <ThumbsUp className="size-4 mr-2" />
            {likesCount}
          </Button>
          <Button variant="outline" size="sm">
            <ThumbsDown className="size-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="size-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <Separator className="mb-4" />

      {/* Channel Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to={`/channel/${video.owner.username}`}>
            <Avatar className="size-12">
              <AvatarImage src={video.owner.avatar} alt={video.owner.fullName} />
              <AvatarFallback>{video.owner.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <Link to={`/channel/${video.owner.username}`}>
              <p className="font-medium hover:text-primary">{video.owner.fullName}</p>
            </Link>
            <p className="text-sm text-muted-foreground">{subscribersCount} subscribers</p>
          </div>
        </div>

        {user && user._id !== video.owner._id && (
          <Button onClick={handleSubscribe} variant={isSubscribed ? 'outline' : 'default'}>
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </Button>
        )}
      </div>

      {/* Description */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <p className="whitespace-pre-wrap">{video.description}</p>
      </div>

      <Separator className="mb-6" />

      {/* Comments Section */}
      <div>
        <h2 className="mb-4">{comments.length} Comments</h2>

        {user && (
          <form onSubmit={handleAddComment} className="flex gap-4 mb-6">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.fullName} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-2"
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setCommentText('')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!commentText.trim()}>
                  <Send className="size-4 mr-2" />
                  Comment
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment._id} className="flex gap-4">
              <Link to={`/channel/${comment.owner.username}`}>
                <Avatar>
                  <AvatarImage src={comment.owner.avatar} alt={comment.owner.fullName} />
                  <AvatarFallback>{comment.owner.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link to={`/channel/${comment.owner.username}`}>
                    <span className="font-medium hover:text-primary">
                      {comment.owner.fullName}
                    </span>
                  </Link>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="mb-2">{comment.content}</p>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="size-4 mr-1" />
                    {comment.likesCount || 0}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsDown className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
