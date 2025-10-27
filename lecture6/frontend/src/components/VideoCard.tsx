import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: number;
    views: number;
    createdAt: string;
    owner: {
      _id: string;
      username: string;
      fullName: string;
      avatar?: string;
    };
  };
}

export const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  return (
    <div className="group cursor-pointer">
      <Link to={`/video/${video._id}`}>
        <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
      </Link>

      <div className="flex gap-3 mt-3">
        <Link to={`/channel/${video.owner.username}`}>
          <Avatar className="size-9 shrink-0">
            <AvatarImage src={video.owner.avatar} alt={video.owner.fullName} />
            <AvatarFallback>{video.owner.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <Link to={`/video/${video._id}`}>
            <h3 className="font-medium line-clamp-2 text-sm mb-1 hover:text-primary">
              {video.title}
            </h3>
          </Link>
          
          <Link to={`/channel/${video.owner.username}`}>
            <p className="text-sm text-muted-foreground hover:text-foreground">
              {video.owner.fullName}
            </p>
          </Link>
          
          <p className="text-sm text-muted-foreground">
            {formatViews(video.views)} views • {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
};