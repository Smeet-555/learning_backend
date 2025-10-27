import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { videoApi } from '../lib/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Upload, AlertCircle, Video, Image } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const UploadVideoPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    if (!thumbnail) {
      setError('Please select a thumbnail image');
      return;
    }

    setLoading(true);
    setUploadProgress(10);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('videoFile', videoFile);
      data.append('thumbnail', thumbnail);

      setUploadProgress(30);
      await videoApi.publishVideo(data);
      setUploadProgress(100);

      toast.success('Video uploaded successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to upload video');
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="size-6" />
            Upload Video
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter video title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Tell viewers about your video"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoFile">Video File *</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Video className="size-12 mx-auto mb-4 text-muted-foreground" />
                <Input
                  id="videoFile"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                  required
                  className="max-w-sm mx-auto"
                />
                {videoFile && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected: {videoFile.name}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail *</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Image className="size-12 mx-auto mb-4 text-muted-foreground" />
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                  required
                  className="max-w-sm mx-auto"
                />
                {thumbnail && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Selected: {thumbnail.name}
                  </p>
                )}
              </div>
            </div>

            {loading && uploadProgress > 0 && (
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground text-center">
                  {uploadProgress}%
                </p>
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Video'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
