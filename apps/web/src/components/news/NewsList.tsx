'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container, Grid, Button, Typography, Box } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import NewsCard from './NewsCard';
import CategoriesBar from './CategoriesBar';
import { apiClient } from '@/lib/api-client';
import type { INews } from '@newsapp/shared';

const LIMIT = 12;

export default function NewsList() {
  const searchParams = useSearchParams();
  const [docs, setDocs] = useState<INews[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    const urlCat = searchParams.get('category') ?? 'all';
    if (urlCat !== category) {
      setCategory(urlCat);
      setDocs([]);
      setPage(1);
    }
  }, [searchParams, category]);

  const fetchNews = useCallback(async (p: number, cat: string, append: boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.get('/news/get-all-news', {
        params: { page: p, limit: LIMIT, category: cat },
      });
      const data = res.data.data;
      setDocs((prev) => (append ? [...prev, ...data.docs] : data.docs));
      setHasNextPage(data.hasNextPage);
    } catch {
      setError('Failed to load news');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews(page, category, page > 1);
  }, [page, category, fetchNews]);

  const handleCategoryChange = (cat: string) => {
    if (cat !== category) {
      setCategory(cat);
      setDocs([]);
      setPage(1);
    }
  };

  const heroItem = docs[0];
  const restItems = docs.slice(1);
  const showSkeleton = isLoading && docs.length === 0;
  const showEmpty = !isLoading && docs.length === 0 && !error;

  return (
    <>
      <CategoriesBar currentCategory={category} onCategoryChange={handleCategoryChange} />
      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {error && (
          <Box sx={{ color: 'error.main', mb: 3, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography>{error}</Typography>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => fetchNews(page, category, false)}
            >
              Retry
            </Button>
          </Box>
        )}
        {showSkeleton ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <NewsCard loading variant="hero" />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Grid container spacing={3}>
                {[0, 1].map((i) => (
                  <Grid key={i} size={12}>
                    <NewsCard loading />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {[0, 1, 2, 3].map((i) => (
              <Grid key={`s${i}`} size={{ xs: 12, sm: 6, md: 4 }}>
                <NewsCard loading />
              </Grid>
            ))}
          </Grid>
        ) : showEmpty ? (
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
            No articles found
          </Typography>
        ) : (
          <InfiniteScroll
            dataLength={docs.length}
            next={() => setPage((p) => p + 1)}
            hasMore={hasNextPage}
            endMessage={
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textAlign: 'center', py: 4 }}
              >
                You&apos;re all caught up
              </Typography>
            }
            loader={null}
          >
            <Grid container spacing={3}>
              {heroItem && (
                <>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Link href={`/news/${heroItem._id}`} style={{ textDecoration: 'none' }}>
                      <NewsCard
                        variant="hero"
                        imageUrl={heroItem.image}
                        title={heroItem.title}
                        description={heroItem.text}
                        category={heroItem.category}
                        readingTime={heroItem.readingTime}
                        source={heroItem.source}
                        publishedAt={heroItem.publishedAt}
                      />
                    </Link>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Grid container spacing={3}>
                      {restItems.slice(0, 2).map((item) => (
                        <Grid key={item._id} size={12}>
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
                  </Grid>
                </>
              )}
              {restItems.slice(2).map((item) => (
                <Grid key={item._id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Link href={`/news/${item._id}`} style={{ textDecoration: 'none' }}>
                    <NewsCard
                      imageUrl={item.image}
                      title={item.title}
                      description={item.text}
                      category={item.category}
                      readingTime={item.readingTime}
                      source={item.source}
                      publishedAt={item.publishedAt}
                    />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        )}
      </Container>
    </>
  );
}
