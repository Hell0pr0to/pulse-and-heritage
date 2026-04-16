import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Allison Smith, MSN, FNP-C'),
    pillar: z.enum([
      'conditions',
      'misdiagnosis',
      'veteran-health',
      'self-advocacy',
      'financial-health',
      'community',
    ]),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    sources: z
      .array(
        z.object({
          label: z.string(),
          url: z.string().url(),
        })
      )
      .default([]),
    readingTime: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const conditions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/conditions' }),
  schema: z.object({
    name: z.string(),
    category: z.string(),
    slug: z.string().optional(),
    summary: z.string(),
    affectedPopulations: z.array(z.string()),
    keyDisparities: z.array(z.string()),
    relatedTools: z.array(z.string()).default([]),
    relatedArticles: z.array(z.string()).default([]),
    updatedDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    type: z.enum(['checklist', 'guide', 'template', 'tracker', 'reference']),
    relatedConditions: z.array(z.string()).default([]),
    printable: z.boolean().default(true),
    pubDate: z.coerce.date(),
    draft: z.boolean().default(false),
  }),
});

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    contributor: z.string(),
    contributorRole: z.string().optional(),
    pubDate: z.coerce.date(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    triggerWarning: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, conditions, tools, stories };
