import React from 'react';
import { ThumbsUp, MessageSquare, Share2, MoreVertical, Globe, Users, Lock } from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    company: string;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  visibility: 'public' | 'network' | 'private';
  liked?: boolean;
}

const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Jean Dupont',
      company: 'Huîtres Dupont & Fils'
    },
    content: 'Nouvelle livraison d\'huîtres plates de qualité exceptionnelle disponible. N\'hésitez pas à me contacter pour plus d\'informations.',
    timestamp: '2025-02-19T10:30:00',
    likes: 15,
    comments: 3,
    shares: 2,
    visibility: 'public'
  },
  {
    id: '2',
    author: {
      name: 'Marie Martin',
      company: 'Ostréiculture Martin'
    },
    content: 'Recherche fournisseur de poches d\'élevage pour livraison urgente. Merci de me contacter en MP.',
    timestamp: '2025-02-19T09:15:00',
    likes: 8,
    comments: 5,
    shares: 1,
    visibility: 'network'
  }
];

const visibilityIcons = {
  public: Globe,
  network: Users,
  private: Lock
};

export function NetworkFeed() {
  const [selectedPost, setSelectedPost] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Zone de publication */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-brand-burgundy rounded-full flex items-center justify-center">
            <span className="text-white font-medium">M</span>
          </div>
          <div className="flex-1">
            <textarea
              placeholder="Partagez une actualité..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 resize-none"
              rows={3}
            />
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="text-white/60 hover:text-white transition-colors">
                  <Globe size={20} />
                </button>
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-white text-sm">
                  <option value="public">Public</option>
                  <option value="network">Mon réseau</option>
                  <option value="private">Privé</option>
                </select>
              </div>
              <button className="px-4 py-2 bg-brand-burgundy rounded-lg text-white hover:bg-brand-burgundy/90 transition-colors">
                Publier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des publications */}
      <div className="space-y-6">
        {mockPosts.map((post) => {
          const VisibilityIcon = visibilityIcons[post.visibility];

          return (
            <div
              key={post.id}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-brand-burgundy rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {post.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-white font-medium">
                          {post.author.name}
                        </h3>
                        <span className="text-white/40">•</span>
                        <span className="text-white/60">
                          {post.author.company}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-white/40">
                        <VisibilityIcon size={14} className="mr-1" />
                        {new Date(post.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <MoreVertical size={20} className="text-white/60" />
                    </button>
                    {selectedPost === post.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-lg shadow-lg py-1 z-10">
                        <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5">
                          Signaler
                        </button>
                        <button className="w-full px-4 py-2 text-left text-white hover:bg-white/5">
                          Masquer
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-white/80">{post.content}</p>

                <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/10">
                  <button className="flex items-center text-white/60 hover:text-white transition-colors">
                    <ThumbsUp size={20} className="mr-2" />
                    {post.likes}
                  </button>
                  <button className="flex items-center text-white/60 hover:text-white transition-colors">
                    <MessageSquare size={20} className="mr-2" />
                    {post.comments}
                  </button>
                  <button className="flex items-center text-white/60 hover:text-white transition-colors">
                    <Share2 size={20} className="mr-2" />
                    {post.shares}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}