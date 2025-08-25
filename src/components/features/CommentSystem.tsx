import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Reply, Heart, Flag } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  articleId: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
  replies: Comment[];
  likes: number;
  parentId?: string;
}

interface CommentSystemProps {
  articleId: string;
}

export const CommentSystem = ({ articleId }: CommentSystemProps) => {
  const [comments, setComments] = useLocalStorage<Comment[]>('article_comments', []);
  const [newComment, setNewComment] = useState({ name: '', email: '', content: '' });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [likedComments, setLikedComments] = useLocalStorage<string[]>('liked_comments', []);
  const { toast } = useToast();

  const articleComments = comments.filter(comment => 
    comment.articleId === articleId && !comment.parentId
  );

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.name.trim() || !newComment.content.trim()) {
      toast({
        title: 'Form Tidak Lengkap',
        description: 'Harap isi nama dan komentar',
        variant: 'destructive'
      });
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      articleId,
      name: newComment.name,
      email: newComment.email,
      content: newComment.content,
      createdAt: new Date().toISOString(),
      replies: [],
      likes: 0
    };

    setComments([...comments, comment]);
    setNewComment({ name: '', email: '', content: '' });
    
    toast({
      title: 'Komentar Ditambahkan',
      description: 'Komentar Anda berhasil ditambahkan',
    });
  };

  const handleSubmitReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const reply: Comment = {
      id: Date.now().toString(),
      articleId,
      name: 'Anonymous', // In real app, get from user session
      email: '',
      content: replyContent,
      createdAt: new Date().toISOString(),
      replies: [],
      likes: 0,
      parentId
    };

    setComments([...comments, reply]);
    setReplyContent('');
    setReplyingTo(null);

    toast({
      title: 'Balasan Ditambahkan',
      description: 'Balasan Anda berhasil ditambahkan',
    });
  };

  const handleLikeComment = (commentId: string) => {
    if (likedComments.includes(commentId)) {
      setLikedComments(likedComments.filter(id => id !== commentId));
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: Math.max(0, comment.likes - 1) }
          : comment
      ));
    } else {
      setLikedComments([...likedComments, commentId]);
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ));
    }
  };

  const getCommentReplies = (commentId: string) => {
    return comments.filter(comment => comment.parentId === commentId);
  };

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => {
    const replies = getCommentReplies(comment.id);
    const isLiked = likedComments.includes(comment.id);

    return (
      <div className={`space-y-3 ${isReply ? 'ml-8 border-l pl-4' : ''}`}>
        <div className="flex space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">
              {comment.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm">{comment.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            <p className="text-sm leading-relaxed">{comment.content}</p>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeComment(comment.id)}
                className={`h-6 px-2 ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
              >
                <Heart className={`h-3 w-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                {comment.likes > 0 && <span className="text-xs">{comment.likes}</span>}
              </Button>
              
              {!isReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="h-6 px-2 text-muted-foreground"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  <span className="text-xs">Balas</span>
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-muted-foreground"
              >
                <Flag className="h-3 w-3" />
              </Button>
            </div>

            {replyingTo === comment.id && (
              <div className="space-y-2 pt-2">
                <Textarea
                  placeholder="Tulis balasan..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="text-sm"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleSubmitReply(comment.id)}
                    disabled={!replyContent.trim()}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Kirim
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setReplyingTo(null)}
                  >
                    Batal
                  </Button>
                </div>
              </div>
            )}

            {replies.length > 0 && (
              <div className="space-y-3 mt-4">
                {replies.map((reply) => (
                  <CommentItem key={reply.id} comment={reply} isReply={true} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Komentar ({articleComments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                value={newComment.name}
                onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                placeholder="Nama Anda"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (opsional)</Label>
              <Input
                id="email"
                type="email"
                value={newComment.email}
                onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Komentar *</Label>
            <Textarea
              id="content"
              value={newComment.content}
              onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
              placeholder="Tulis komentar Anda..."
              rows={4}
              required
            />
          </div>
          
          <Button type="submit" disabled={!newComment.name.trim() || !newComment.content.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Kirim Komentar
          </Button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {articleComments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Belum ada komentar. Jadilah yang pertama berkomentar!</p>
            </div>
          ) : (
            articleComments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};