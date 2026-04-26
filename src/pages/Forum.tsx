import { useEffect, useState } from "react";
import { z } from "zod";

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

import {
  MessageSquare, PlusCircle, Send, Users, AlertTriangle, Loader2, Clock,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

type ForumPost = {
  id: string;
  author_name: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
};

type ForumComment = {
  id: string;
  post_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

const postSchema = z.object({
  author_name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  title: z.string().trim().min(5, "Title must be at least 5 characters").max(140),
  content: z.string().trim().min(20, "Please describe with at least 20 characters").max(4000),
  category: z.string().min(1).max(40),
});

const commentSchema = z.object({
  author_name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  content: z.string().trim().min(2, "Comment is too short").max(1000),
});

const categories = {
  phishing: "Phishing",
  scam: "Online Scam",
  ransomware: "Ransomware",
  identity: "Identity Theft",
  upi: "UPI / Bank Fraud",
  social: "Social Engineering",
  general: "General",
};

const categoryColors: Record<string, string> = {
  phishing: "bg-red-500/10 text-red-500 border-red-500/30",
  scam: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  ransomware: "bg-red-500/10 text-red-500 border-red-500/30",
  identity: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  upi: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  social: "bg-purple-500/10 text-purple-500 border-purple-500/30",
  general: "bg-muted text-muted-foreground border-border",
};

const Forum = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState({
    author_name: "",
    title: "",
    content: "",
    category: "phishing",
  });

  const { toast } = useToast();
  const { user, profile } = useAuth();

  const loggedInName = profile?.full_name || user?.email || "";

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (user && loggedInName) {
      setForm((prev) => ({ ...prev, author_name: loggedInName }));
    }
  }, [user, loggedInName]);

  const fetchPosts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("forum_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Could not load posts",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setPosts(data || []);
    }

    setLoading(false);
  };

  const handleSubmit = async () => {
    const finalData = {
      ...form,
      author_name: user ? loggedInName : form.author_name.trim() || "Anonymous",
    };

    const parsed = postSchema.safeParse(finalData);

    if (!parsed.success) {
      toast({
        title: "Invalid input",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from("forum_posts").insert(parsed.data);

    setSubmitting(false);

    if (error) {
      toast({
        title: "Could not post",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Posted!",
      description: "Your post is now visible in the forum.",
    });

    setForm({
      author_name: user ? loggedInName : "",
      title: "",
      content: "",
      category: "phishing",
    });

    setOpenDialog(false);
    fetchPosts();
  };

  const filteredPosts =
    filter === "all" ? posts : posts.filter((post) => post.category === filter);

  const uniqueAuthors = new Set(posts.map((p) => p.author_name.toLowerCase())).size;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent">
                <MessageSquare className="w-7 h-7 text-primary-foreground" />
              </div>

              <div>
                <h1 className="text-3xl font-bold">Community Forum</h1>
                <p className="text-muted-foreground mt-1 max-w-2xl">
                  Share phishing incidents, scams, cyber crime warnings, and help others stay safe.
                </p>
              </div>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Share an incident or warning</DialogTitle>
                  <DialogDescription>
                    {user
                      ? `Posting as ${loggedInName}`
                      : "You can post without login using any name or Anonymous."}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Your Name</label>
                    <Input
                      value={user ? loggedInName : form.author_name}
                      disabled={!!user}
                      onChange={(e) =>
                        setForm({ ...form, author_name: e.target.value })
                      }
                      maxLength={60}
                      placeholder="Anonymous"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Title</label>
                    <Input
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      maxLength={140}
                      placeholder="e.g. Fake bank SMS asked for OTP"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Category</label>
                    <Select
                      value={form.category}
                      onValueChange={(value) =>
                        setForm({ ...form, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        {Object.entries(categories).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Describe what happened
                    </label>
                    <Textarea
                      value={form.content}
                      onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                      }
                      maxLength={4000}
                      rows={6}
                      placeholder="Share details — when, how, what they asked for, and how you noticed..."
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {form.content.length}/4000
                    </p>
                  </div>

                  <Button onClick={handleSubmit} disabled={submitting} className="w-full">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Post to Forum
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 max-w-2xl">
            <div className="p-3 rounded-lg bg-card border border-border flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-primary" />
              <div>
                <div className="text-xl font-bold">{posts.length}</div>
                <div className="text-xs text-muted-foreground">Total Posts</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border flex items-center gap-3">
              <Users className="w-5 h-5 text-accent" />
              <div>
                <div className="text-xl font-bold">{uniqueAuthors}</div>
                <div className="text-xs text-muted-foreground">Contributors</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="text-xl font-bold">
                  {posts.filter((p) => p.category !== "general").length}
                </div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All
          </Button>

          {Object.entries(categories).map(([key, label]) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "outline"}
              onClick={() => setFilter(key)}
            >
              {label}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center text-muted-foreground">
              No posts yet. Be the first to share an incident.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const PostCard = ({ post }: { post: ForumPost }) => {
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [posting, setPosting] = useState(false);

  const [commentForm, setCommentForm] = useState({
    author_name: "",
    content: "",
  });

  const { toast } = useToast();
  const { user, profile } = useAuth();

  const loggedInName = profile?.full_name || user?.email || "";

  useEffect(() => {
    if (user && loggedInName) {
      setCommentForm((prev) => ({ ...prev, author_name: loggedInName }));
    }
  }, [user, loggedInName]);

  const loadComments = async () => {
    setLoadingComments(true);

    const { data, error } = await supabase
      .from("forum_comments")
      .select("*")
      .eq("post_id", post.id)
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Could not load comments",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setComments(data || []);
    }

    setLoadingComments(false);
  };

  const handleExpand = () => {
    const next = !expanded;
    setExpanded(next);

    if (next && comments.length === 0) {
      loadComments();
    }
  };

  const handleComment = async () => {
    const finalData = {
      author_name: user ? loggedInName : commentForm.author_name.trim() || "Anonymous",
      content: commentForm.content,
    };

    const parsed = commentSchema.safeParse(finalData);

    if (!parsed.success) {
      toast({
        title: "Invalid input",
        description: parsed.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }

    setPosting(true);

    const { error } = await supabase.from("forum_comments").insert({
      ...parsed.data,
      post_id: post.id,
    });

    setPosting(false);

    if (error) {
      toast({
        title: "Could not comment",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setCommentForm({
      author_name: user ? loggedInName : "",
      content: "",
    });

    loadComments();
  };

  const categoryLabel =
    categories[post.category as keyof typeof categories] || post.category;

  const time = new Date(post.created_at).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Card className="border-2 hover:border-primary/30 transition-colors">
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg break-words">{post.title}</CardTitle>

            <CardDescription className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="font-medium">by {post.author_name}</span>
              <span className="text-muted-foreground">•</span>
              <Clock className="w-3 h-3" />
              <span>{time}</span>
            </CardDescription>
          </div>

          <Badge
            variant="outline"
            className={categoryColors[post.category] || categoryColors.general}
          >
            {categoryLabel}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {post.content}
        </p>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleExpand}
          className="mt-4 -ml-2"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Comments {comments.length > 0 && `(${comments.length})`}
        </Button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-4">
            {loadingComments ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No comments yet — start the discussion.
              </p>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 rounded-md bg-muted/40 border border-border"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">
                        {comment.author_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.created_at).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <p className="text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium">Add a comment</p>

              <Input
                placeholder="Your name"
                value={user ? loggedInName : commentForm.author_name}
                disabled={!!user}
                onChange={(e) =>
                  setCommentForm({
                    ...commentForm,
                    author_name: e.target.value,
                  })
                }
                maxLength={60}
              />

              <Textarea
                placeholder="Share your thoughts or similar experience..."
                value={commentForm.content}
                onChange={(e) =>
                  setCommentForm({
                    ...commentForm,
                    content: e.target.value,
                  })
                }
                maxLength={1000}
                rows={3}
              />

              <Button onClick={handleComment} disabled={posting} size="sm">
                {posting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Forum;