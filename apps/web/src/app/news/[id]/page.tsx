import Image from 'next/image';
import Link from 'next/link';
import { Container, Typography, Box, Chip, Breadcrumbs, Divider, Grid } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CommentsList from '@/components/comments/CommentsList';
import ShareButtons from '@/components/news/ShareButtons';
import NewsCard from '@/components/news/NewsCard';
import { apiClient } from '@/lib/api-client';
import type { INews } from '@newsapp/shared';

const PLACEHOLDER = 'https://placehold.co/1200x500/1a1a2e/e94560?text=Dream+News';

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
  if (!/^[0-9a-f]{24}$/i.test(id)) return null;
  try {
    const response = await apiClient.get(`/news/get-news-by-id/${id}`);
    return response.data.data;
  } catch {
    return null;
  }
}

async function getRelated(id: string): Promise<INews[]> {
  try {
    const response = await apiClient.get(`/news/related/${id}`);
    return response.data.data ?? [];
  } catch {
    return [];
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const [news, related] = await Promise.all([getNews(id), getRelated(id)]);

  if (!news) {
    return (
      <Container sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Article not found
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          The article you&apos;re looking for doesn&apos;t exist or has been removed.
        </Typography>
      </Container>
    );
  }

  const imgSrc = news.image && isValidUrl(news.image) ? news.image : PLACEHOLDER;
  const date = new Date(news.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: 250, md: 450 },
          overflow: 'hidden',
        }}
      >
        <Image
          src={imgSrc}
          alt={news.title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.8))',
          }}
        />
      </Box>

      <Container maxWidth="md" sx={{ mt: -8, position: 'relative', zIndex: 1 }}>
        <Breadcrumbs
          sx={{
            mb: 2,
            '& a': {
              color: 'grey.400',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
            },
          }}
        >
          <Link href="/">Home</Link>
          <Link href={`/?category=${news.category}`}>{news.category}</Link>
          <Typography color="text.secondary" variant="body2" noWrap sx={{ maxWidth: 200 }}>
            {news.title}
          </Typography>
        </Breadcrumbs>

        <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
          {news.title}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, mb: 3 }}>
          <Chip
            label={news.category}
            color="primary"
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CalendarTodayIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {date}
            </Typography>
          </Box>
          {news.readingTime > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {news.readingTime} min read
              </Typography>
            </Box>
          )}
          {news.source && (
            <Typography
              variant="body2"
              sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'capitalize' }}
            >
              {news.source}
            </Typography>
          )}
        </Box>

        <ShareButtons title={news.title} />

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="body1"
          sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8, fontSize: '1.05rem', mb: 4 }}
        >
          {news.text}
        </Typography>

        <Divider sx={{ my: 4 }} />
        <CommentsList newsId={id} />

        {related.length > 0 && (
          <>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
              Related Articles
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {related.map((item) => (
                <Grid key={item._id} size={{ xs: 12, sm: 6, md: 3 }}>
                  <Link href={`/news/${item._id}`} style={{ textDecoration: 'none' }}>
                    <NewsCard
                      imageUrl={item.image}
                      title={item.title}
                      category={item.category}
                      readingTime={item.readingTime}
                      source={item.source}
                      publishedAt={item.publishedAt}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
