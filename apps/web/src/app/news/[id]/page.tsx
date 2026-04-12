import Image from 'next/image';
import { Container, Typography, Box } from '@mui/material';
import CommentsList from '@/components/comments/CommentsList';
import { apiClient } from '@/lib/api-client';
import type { INews } from '@newsapp/shared';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

async function getNews(id: string): Promise<INews | null> {
  if (!/^[0-9a-f]{24}$/i.test(id)) {
    return null;
  }
  try {
    const response = await apiClient.get(`/news/get-news-by-id/${id}`);
    return response.data.data;
  } catch {
    return null;
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const news = await getNews(id);

  if (!news) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4">Article not found</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      {news.image && isValidUrl(news.image) ? (
        <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
          <Image
            src={news.image}
            alt={news.title}
            fill
            style={{ objectFit: 'cover', borderRadius: 8 }}
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </Box>
      ) : null}
      <Typography variant="h3" sx={{ mt: 3, mb: 2 }}>
        {news.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {new Date(news.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 4 }}>
        {news.text}
      </Typography>

      <CommentsList newsId={id} />
    </Container>
  );
}
