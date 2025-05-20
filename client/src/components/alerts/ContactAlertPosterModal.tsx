import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, Send } from "lucide-react";

interface ContactAlertPosterModalProps {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert;
}

export default function ContactAlertPosterModal({
  isOpen,
  onClose,
  alert,
}: ContactAlertPosterModalProps) {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const handleGetComments = async () => {
    setIsLoadingComments(true);
    try {
      const res = await fetch(`/api/alerts/${alert.id}/comments`);
      if (!res.ok) throw new Error('Failed to fetch comments');
      const data = await res.json();
      setComments(data);
      setShowComments(true);
    } catch (error) {
      toast({
        title: "Failed to load comments",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const commentData = {
        alertId: alert.id,
        userId: currentUser?.uid ? parseInt(currentUser.uid) : 1,
        text: message
      };
      
      await apiRequest("POST", "/api/comments", commentData);
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully",
      });
      
      setMessage("");
      
      // Reload comments if they're being shown
      if (showComments) {
        handleGetComments();
      }
    } catch (error: any) {
      toast({
        title: "Failed to post comment",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetModal = () => {
    setMessage("");
    setShowComments(false);
    setComments([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{showComments ? "Comments" : "Contact about Alert"}</DialogTitle>
          <DialogDescription>
            {showComments 
              ? `Join the discussion on "${alert.title}"`
              : `Respond to the "${alert.title}" alert`}
          </DialogDescription>
        </DialogHeader>

        {!showComments ? (
          <>
            <div className="border rounded-lg p-4 bg-gray-50 mb-4">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-900">{alert.title}</h3>
                <span className="text-xs text-gray-500">{formatDate(alert.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{alert.description}</p>
              <p className="text-xs text-gray-500 mt-1">{alert.location}</p>
            </div>

            <form onSubmit={handleSubmitComment}>
              <div className="space-y-4">
                <div>
                  <Textarea
                    placeholder="Type your message or information here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGetComments}
                  disabled={isLoadingComments}
                >
                  {isLoadingComments ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "View Comments"
                  )}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary-foreground"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="border-b pb-3 mb-3">
              <h3 className="font-medium text-gray-900">{alert.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{formatDate(alert.createdAt)}</p>
            </div>

            <div className="space-y-4 max-h-64 overflow-y-auto">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">User #{comment.userId}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm mt-1">{comment.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>

            <form onSubmit={handleSubmitComment} className="pt-4 border-t mt-4">
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="sm"
                    className="bg-primary hover:bg-primary-foreground"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Comment"
                    )}
                  </Button>
                </div>
              </div>
            </form>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowComments(false)}
              >
                Back
              </Button>
              <Button onClick={resetModal}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
