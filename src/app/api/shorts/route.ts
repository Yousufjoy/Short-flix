import { NextResponse } from 'next/server';

interface Short {
  id: number;
  videoUrl: string;
  title: string;
  tags: string[];
  duration?: string;
}

const SHORTS: Short[] = [
  {
    id: 1,
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    title: 'Big Buck Bunny',
    tags: ['animation', 'comedy', 'nature'],
    duration: '0:10'
  },
  {
    id: 2,
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    title: 'Sample Clip 5s',
    tags: ['demo', 'short', 'test'],
    duration: '0:05'
  },
  {
    id: 3,
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-10s.mp4',
    title: 'Sample Clip 10s',
    tags: ['demo', 'medium', 'test'],
    duration: '0:10'
  },
  {
    id: 4,
    videoUrl: 'https://samplelib.com/lib/preview/mp4/sample-15s.mp4',
    title: 'Sample Clip 15s',
    tags: ['demo', 'longer', 'test'],
    duration: '0:15'
  },
  {
    id: 5,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    title: 'For Bigger Blazes',
    tags: ['nature', 'fire', 'cinematic'],
    duration: '0:15'
  },
  {
    id: 6,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    title: 'For Bigger Escapes',
    tags: ['travel', 'adventure', 'cinematic'],
    duration: '0:15'
  },
  {
    id: 7,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    title: 'For Bigger Joyrides',
    tags: ['automotive', 'adventure', 'cinematic'],
    duration: '0:15'
  },
  {
    id: 8,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    title: 'For Bigger Meltdowns',
    tags: ['action', 'thriller', 'cinematic'],
    duration: '0:15'
  }
];

// GET /api/shorts - Get all shorts or filter by search
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  
  if (search) {
    const filtered = SHORTS.filter(short => 
      short.title.toLowerCase().includes(search.toLowerCase()) ||
      short.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );
    return NextResponse.json(filtered);
  }
  
  return NextResponse.json(SHORTS);
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoUrl, title, tags, duration } = body;
    
    if (!videoUrl || !title || !tags) {
      return NextResponse.json(
        { error: 'Missing required fields: videoUrl, title, tags' },
        { status: 400 }
      );
    }
    
    const newShort: Short = {
      id: SHORTS.length + 1,
      videoUrl,
      title,
      tags: Array.isArray(tags) ? tags : [tags],
      duration
    };
    
    SHORTS.push(newShort);
    
    return NextResponse.json(newShort, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}