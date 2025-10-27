import React, { useEffect, useState } from 'react';
import { tweetApi, likeApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Skeleton } from '../components/ui/skeleton';
import { Alert, AlertDescription } from '../components/ui/alert';
import { ThumbsUp, Send, AlertCircle, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner@2.0.3';

export const TweetsPage: React.FC = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTweet, setNewTweet] = useState('');

  useEffect(() => {
    if (user) {
      fetchTweets();
    }
  }, [user]);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tweetApi.getUserTweets(user!._id);
      setTweets(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load tweets');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTweet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTweet.trim()) return;

    try {
      await tweetApi.createTweet(newTweet);
      setNewTweet('');
      toast.success('Tweet posted');
      fetchTweets();
    } catch (err) {
      toast.error('Failed to post tweet');
    }
  };

  const handleLikeTweet = async (tweetId: string) => {
    try {
      await likeApi.toggleTweetLike(tweetId);
      fetchTweets();
    } catch (err) {
      toast.error('Failed to like tweet');
    }
  };

  const handleDeleteTweet = async (tweetId: string) => {
    if (!confirm('Delete this post?')) return;

    try {
      await tweetApi.deleteTweet(tweetId);
      toast.success('Tweet deleted');
      fetchTweets();
    } catch (err) {
      toast.error('Failed to delete tweet');
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>Please login to view community posts</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="mb-8">Community Posts</h1>

      {/* Create Tweet */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <form onSubmit={handleCreateTweet} className="space-y-4">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.fullName} />
                <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Share something with your subscribers..."
                value={newTweet}
                onChange={(e) => setNewTweet(e.target.value)}
                rows={3}
                className="flex-1"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={!newTweet.trim()}>
                <Send className="size-4 mr-2" />
                Post
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tweets List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : tweets.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="size-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="mb-2">No posts yet</h2>
          <p className="text-muted-foreground">
            Share your thoughts with your subscribers
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <Card key={tweet._id}>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src={tweet.owner?.avatar || user.avatar} alt={user.fullName} />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{user.fullName}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(tweet.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="mb-4 whitespace-pre-wrap">{tweet.content}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLikeTweet(tweet._id)}
                      >
                        <ThumbsUp className="size-4 mr-1" />
                        {tweet.likesCount || 0}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTweet(tweet._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
