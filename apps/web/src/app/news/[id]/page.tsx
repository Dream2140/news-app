import { Container, Typography } from '@mui/material';
import CommentsList from '@/components/comments/CommentsList';
import { apiClient } from '@/lib/api-client';
import type { INews } from '@newsapp/shared';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

async function getNews(id: string): Promise<INews | null> {
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
      {news.image && (
        <img
          src={news.image}
          alt={news.title}
          style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8 }}
        />
      )}
      <Typography variant="h3" sx={{ mt: 3, mb: 2 }}>
        {news.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {new Date(news.publishedAt).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 4 }}>
        {news.text}
      </Typography>

      <CommentsList newsId={id} />
    </Container>
  );
}
