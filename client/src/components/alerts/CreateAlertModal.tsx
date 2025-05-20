import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { insertAlertSchema } from "@shared/schema";

// Extend the schema with client-side validation
const alertFormSchema = insertAlertSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: z.string().min(1, "Please select an alert type"),
  location: z.string().min(1, "Location is required"),
  imageUrl: z.string().optional(),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

interface CreateAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAlertCreated: () => void;
}

export default function CreateAlertModal({
  isOpen,
  onClose,
  onAlertCreated,
}: CreateAlertModalProps) {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      location: "",
      imageUrl: "",
      createdBy: currentUser?.uid ? parseInt(currentUser.uid) : 1,
    },
  });

  const alertTypes = [
    'Lost & Found',
    'Emergency',
    'Community Safety',
    'Service Interruption',
    'Weather'
  ];

  const onSubmit = async (values: AlertFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Update createdBy with current user ID
      values.createdBy = currentUser?.uid ? parseInt(currentUser.uid) : 1;
      
      await apiRequest("POST", "/api/alerts", values);
      
      toast({
        title: "Alert posted",
        description: "Your community alert has been successfully posted",
      });
      
      form.reset();
      onAlertCreated();
    } catch (error: any) {
      toast({
        title: "Failed to post alert",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Post Community Alert</DialogTitle>
          <DialogDescription>
            Share important information or alerts with your community.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select alert type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {alertTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a clear, descriptive title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide detailed information about this alert"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Where is this alert relevant to?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("type") === "Emergency" && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-red-700">
                      For serious emergencies, please also contact appropriate emergency services at 999 or 112.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? "Posting..." : "Post Alert"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
