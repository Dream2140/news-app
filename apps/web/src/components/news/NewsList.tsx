'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Container, Grid, Button, Typography, Box } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import NewsCard from './NewsCard';
import CategoriesBar from './CategoriesBar';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { fetchNews, changeCategory } from '@/store/slices/newsSlice';

const LIMIT = 12;

export default function NewsList() {
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const prevCategory = useRef('all');
  const searchParams = useSearchParams();

  const { docs, hasNextPage, isLoading, error, category } = useAppSelector((state) => state.news);

  useEffect(() => {
    const urlCategory = searchParams.get('category') ?? 'all';
    if (urlCategory !== category) {
      dispatch(changeCategory(urlCategory));
    }
  }, [searchParams, category, dispatch]);

  useEffect(() => {
    if (category !== prevCategory.current) {
      prevCategory.current = category;
      setPage(1);
      dispatch(fetchNews({ limit: LIMIT, page: 1, category }));
    } else {
      dispatch(fetchNews({ limit: LIMIT, page, category }));
    }
  }, [dispatch, page, category]);

  const heroItem = docs[0];
  const restItems = docs.slice(1);

  return (
    <>
      <CategoriesBar />

      <Container maxWidth="lg" sx={{ mt: 3 }}>
        {error && (
          <Box sx={{ color: 'error.main', mb: 3, display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography>{error}</Typography>
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => dispatch(fetchNews({ limit: LIMIT, page, category }))}
            >
              Retry
            </Button>
          </Box>
        )}

        {isLoading && docs.length === 0 ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <NewsCard loading variant="hero" />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Grid container spacing={3}>
                {Array.from({ length: 2 }).map((_, i) => (
                  <Grid key={`sk-side-${i}`} size={12}>
                    <NewsCard loading />
                  </Grid>
                ))}
              </Grid>
            </Grid>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid key={`sk-${i}`} size={{ xs: 12, sm: 6, md: 4 }}>
                <NewsCard loading />
              </Grid>
            ))}
          </Grid>
        ) : (
          <InfiniteScroll
            dataLength={docs.length}
            next={() => setPage((p) => p + 1)}
            hasMore={hasNextPage}
            endMessage={
              docs.length > 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  You&apos;re all caught up
                </Typography>
              ) : (
                <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
                  No articles found
                </Typography>
              )
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
