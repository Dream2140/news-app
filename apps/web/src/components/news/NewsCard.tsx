'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, Box, Chip, Skeleton, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const PLACEHOLDER = 'https://placehold.co/800x400/1a1a2e/e94560?text=Dream+News';

interface NewsCardProps {
  loading?: boolean;
  imageUrl?: string;
  title?: string;
  description?: string;
  category?: string;
  readingTime?: number;
  source?: string;
  publishedAt?: number;
  variant?: 'default' | 'hero';
}

export default function NewsCard({
  loading,
  imageUrl,
  title,
  description,
  category,
  readingTime,
  source,
  publishedAt,
  variant = 'default',
}: NewsCardProps) {
  const [imgError, setImgError] = useState(false);
  const isHero = variant === 'hero';

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <Skeleton animation="wave" variant="rectangular" height={isHero ? 360 : 200} />
        <CardContent>
          <Skeleton animation="wave" width="30%" height={24} sx={{ mb: 1 }} />
          <Skeleton animation="wave" width="90%" height={28} />
          <Skeleton animation="wave" width="70%" height={28} />
          <Skeleton animation="wave" width="60%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  const imgSrc = imgError || !imageUrl ? PLACEHOLDER : imageUrl;
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 8 },
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative', height: isHero ? 360 : 200, overflow: 'hidden' }}>
        <Image
          src={imgSrc}
          alt={title ?? 'News'}
          fill
          sizes={isHero ? '100vw' : '(max-width: 600px) 100vw, 400px'}
          style={{ objectFit: 'cover' }}
          onError={() => setImgError(true)}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
          }}
        />
        {category && (
          <Chip
            label={category}
            size="small"
            color="primary"
            sx={{ position: 'absolute', top: 12, left: 12, textTransform: 'capitalize' }}
          />
        )}
        {readingTime && (
          <Chip
            icon={<AccessTimeIcon sx={{ fontSize: '0.8rem !important' }} />}
            label={`${readingTime} min`}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: '0.7rem',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant={isHero ? 'h5' : 'subtitle1'}
          sx={{
            fontWeight: 700,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: isHero ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: isHero ? 3 : 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </Typography>
        )}

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          {date && (
            <Typography variant="caption" color="text.secondary">
              {date}
            </Typography>
          )}
          {source && (
            <>
              <Typography variant="caption" color="text.secondary">
                &middot;
              </Typography>
              <Typography
                variant="caption"
                color="primary.main"
                sx={{ textTransform: 'capitalize', fontWeight: 600 }}
              >
                {source}
              </Typography>
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
