import express from 'express';

const router = express.Router();
const MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001';

// Mock profile response
const MOCK_PROFILE = {
  archetype: 'The Curious Explorer',
  summary:
    'You enjoy low-pressure creative and social spaces, particularly around games, study, and outdoor activities. You thrive in environments where there is no pressure to perform — just show up and see what happens.',
  tags: ['games', 'study', 'outdoors', 'creative', 'calm'],
  recommendedCategories: ['Games', 'Study', 'Creative', 'Walking'],
};

// Mock suggestions
const MOCK_SUGGESTIONS = [
  {
    id: 'ai-sug1',
    title: 'Language Exchange at WORM',
    location: 'WORM Rotterdam',
    area: 'Delfshaven',
    time: 'Saturday 15:00',
    language: 'Dutch / English / Spanish',
    vibeTags: ['Social-light', 'Language', 'Creative'],
    reason:
      'High demand for English-Dutch exchange in Delfshaven. 23 users in the area expressed interest in language learning over the past 30 days.',
    suggestedAction: 'Partner with WORM venue; assign a bilingual host.',
    status: 'pending',
  },
  {
    id: 'ai-sug2',
    title: 'Tech & Coffee Morning',
    location: 'Spaces Blaak',
    area: 'Rotterdam Centrum',
    time: 'Wednesday 09:00',
    language: 'English',
    vibeTags: ['Tech', 'Study', 'Social-light'],
    reason:
      '18 users listed "tech" as an interest but no active tech-focused routine exists. Morning slot matches peak weekday availability.',
    suggestedAction: 'Pilot a drop-in coworking/networking hour. No agenda required.',
    status: 'pending',
  },
];

// POST /api/ai/profile
router.post('/profile', async (req, res) => {
  const prefs = req.body;

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json(MOCK_PROFILE);
  }

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `You are a city integration assistant for Rotterdam. Based on this user's preferences, generate a JSON profile.

User preferences:
- Interests: ${prefs.interests?.join(', ') || 'none specified'}
- Vibe: ${prefs.vibe || 'not specified'}
- Language: ${prefs.language || 'not specified'}
- Age range: ${prefs.ageRange || 'not specified'}
- Area: ${prefs.area || 'not specified'}
- Additional context: ${prefs.freeText || 'none'}

Respond ONLY with valid JSON in this exact format:
{
  "archetype": "a creative 3-word label like 'The Quiet Explorer'",
  "summary": "2-3 sentences describing what spaces and activities suit this person",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "recommendedCategories": ["Category1", "Category2", "Category3"]
}`;

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const profile = JSON.parse(jsonMatch[0]);
      return res.json(profile);
    }
    return res.json(MOCK_PROFILE);
  } catch (err) {
    console.error('Claude API error:', err.message);
    return res.json(MOCK_PROFILE);
  }
});

// POST /api/ai/suggestions
router.post('/suggestions', async (req, res) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    return res.json(MOCK_SUGGESTIONS);
  }

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a city event coordinator for Rotterdam's StadKompas platform. Generate 2 new event suggestions based on community demand data. Respond ONLY with a JSON array of suggestion objects with these fields: id, title, location, area, time, language, vibeTags (array), reason, suggestedAction, status ("pending").`,
        },
      ],
    });

    const text = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);

    if (jsonMatch) {
      const suggestions = JSON.parse(jsonMatch[0]);
      return res.json(suggestions);
    }
    return res.json(MOCK_SUGGESTIONS);
  } catch (err) {
    console.error('Claude API error:', err.message);
    return res.json(MOCK_SUGGESTIONS);
  }
});

export default router;
