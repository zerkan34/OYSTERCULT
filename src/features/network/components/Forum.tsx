import React from 'react';
import { MessageSquare, ThumbsUp, Eye, User } from 'lucide-react';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: string;
  author: {
    name: string;
    avatar?: string;
  };
  postedAt: string;
  likes: number;
  views: number;
  replies: number;
  tags: string[];
}

const mockPosts: ForumPost[] = [
  {
    id: '1',
    title: 'Gestion de la mortalité hivernale',
    content: 'Quelles sont vos techniques pour minimiser la mortalité pendant l\'hiver ?',
    category: 'Production',
    author: {
      name: 'Jean Dupont'
    },
    postedAt: '2025-02-19T10:00:00',
    likes: 15,
    views: 234,
    replies: 8,
    tags: ['Mortalité', 'Hiver', 'Techniques']
  },
  {
    id: '2',
    title: 'Nouvelle réglementation sanitaire',
    content: 'Discussion sur les impacts de la nouvelle réglementation sanitaire',
    category: 'Réglementation',
    author: {
      name: 'Marie Martin'
    },
    postedAt: '2025-02-19T09:00:00',
    likes: 23,
    views: 567,
    replies: 12,
    tags: ['Réglementation', 'Sanitaire']
  }
];

interface ForumProps {
  searchQuery: string;
}

export function Forum({ searchQuery }: ForumProps) {
  const filteredPosts = mockPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">256</div>
          <div className="text-sm text-white/60">Discussions</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">1,234</div>
          <div className="text-sm text-white/60">Messages</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">89</div>
          <div className="text-sm text-white/60">Membres actifs</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
          <div className="text-2xl font-bold text-white">15</div>
          <div className="text-sm text-white/60">Nouveaux aujourd'hui</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-lg">
        {filteredPosts.map((post, index) => (
          <div
            key={post.id}
            className={`p-6 ${
              index < filteredPosts.length - 1 ? 'border-b border-white/10' : ''
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-brand-burgundy rounded-full flex items-center justify-center flex-shrink-0">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-white">{post.title}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-white/60">{post.author.name}</span>
                      <span className="text-sm text-white/60">
                        {new Date(post.postedAt).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="px-2 py-1 bg-white/5 rounded-full text-xs text-white/70">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-white/60">
                    <div className="flex items-center">
                      <ThumbsUp size={16} className="mr-1" />
                      {post.likes}
                    </div>
                    <div className="flex items-center">
                      <Eye size={16} className="mr-1" />
                      {post.views}
                    </div>
                    <div className="flex items-center">
                      <MessageSquare size={16} className="mr-1" />
                      {post.replies}
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-white/70">{post.content}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-white/5 rounded-full text-sm text-white/70"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}