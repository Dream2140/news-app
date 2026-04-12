import { Card, CardContent, CardMedia, Skeleton, Typography } from '@mui/material';

interface NewsCardProps {
  loading?: boolean;
  imageUrl?: string;
  title?: string;
  description?: string;
}

export default function NewsCard({ loading, imageUrl, title, description }: NewsCardProps) {
  if (loading) {
    return (
      <Card sx={{ maxWidth: 345, height: '100%' }}>
        <Skeleton animation="wave" width="100%" height={140} />
        <CardContent>
          <Skeleton animation="wave" width="80%" height={30} />
          <Skeleton animation="wave" width="100%" height={60} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 345, height: '100%' }}>
      <CardMedia image={imageUrl} title={title} sx={{ height: 140 }} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description?.substring(0, 150)}
        </Typography>
      </CardContent>
    </Card>
  );
}
