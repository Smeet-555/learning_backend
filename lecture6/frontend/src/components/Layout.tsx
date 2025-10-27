import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import {
  Home,
  Video,
  TrendingUp,
  Clock,
  ThumbsUp,
  ListVideo,
  Settings,
  LogOut,
  Upload,
  Search,
  LayoutDashboard,
  MessageSquare,
  User,
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <Video className="size-8 text-red-600" />
              <span className="font-semibold text-xl">VidStream</span>
            </Link>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl mx-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
              >
                <Search className="size-4" />
              </Button>
            </div>
          </form>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <>
                <Button variant="ghost" size="icon" asChild>
                  <Link to="/upload">
                    <Upload className="size-5" />
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={`/channel/${user.username}`}>
                        <User className="size-4 mr-2" />
                        Your Channel
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <LayoutDashboard className="size-4 mr-2" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings">
                        <Settings className="size-4 mr-2" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="size-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        {user && (
          <aside className="w-64 border-r bg-background">
            <nav className="flex flex-col gap-1 p-4">
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="size-5 mr-3" />
                  Home
                </Button>
              </Link>
              <Link to="/subscriptions">
                <Button variant="ghost" className="w-full justify-start">
                  <Video className="size-5 mr-3" />
                  Subscriptions
                </Button>
              </Link>
              <Link to="/trending">
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="size-5 mr-3" />
                  Trending
                </Button>
              </Link>
              
              <div className="h-px bg-border my-2" />
              
              <Link to="/history">
                <Button variant="ghost" className="w-full justify-start">
                  <Clock className="size-5 mr-3" />
                  History
                </Button>
              </Link>
              <Link to="/liked-videos">
                <Button variant="ghost" className="w-full justify-start">
                  <ThumbsUp className="size-5 mr-3" />
                  Liked Videos
                </Button>
              </Link>
              <Link to="/playlists">
                <Button variant="ghost" className="w-full justify-start">
                  <ListVideo className="size-5 mr-3" />
                  Playlists
                </Button>
              </Link>
              <Link to="/tweets">
                <Button variant="ghost" className="w-full justify-start">
                  <MessageSquare className="size-5 mr-3" />
                  Community
                </Button>
              </Link>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
