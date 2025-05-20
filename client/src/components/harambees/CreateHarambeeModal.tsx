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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { insertHarambeeSchema } from "@shared/schema";
import { Switch } from "@/components/ui/switch";

// Extend the schema with client-side validation
const harambeeFormSchema = insertHarambeeSchema.extend({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  goalAmount: z.number().min(1, "Goal amount must be at least 1"),
  imageUrl: z.string().optional(),
});

type HarambeeFormValues = z.infer<typeof harambeeFormSchema>;

interface CreateHarambeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHarambeeCreated: () => void;
}

export default function CreateHarambeeModal({
  isOpen,
  onClose,
  onHarambeeCreated,
}: CreateHarambeeModalProps) {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(false);

  const form = useForm<HarambeeFormValues>({
    resolver: zodResolver(harambeeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      goalAmount: 0,
      imageUrl: "",
      verified: false,
      createdBy: currentUser?.uid ? parseInt(currentUser.uid) : 1, // Fallback to user ID 1
    },
  });

  const onSubmit = async (values: HarambeeFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Update createdBy with current user ID
      values.createdBy = currentUser?.uid ? parseInt(currentUser.uid) : 1;
      
      await apiRequest("POST", "/api/harambees", values);
      
      toast({
        title: "Harambee created",
        description: requiresVerification 
          ? "Your harambee has been created and is pending verification" 
          : "Your harambee has been successfully created",
      });
      
      form.reset();
      onHarambeeCreated();
    } catch (error: any) {
      toast({
        title: "Failed to create harambee",
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
          <DialogTitle>Start a Harambee</DialogTitle>
          <DialogDescription>
            Create a fundraiser to support a cause that matters to your community.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harambee Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a descriptive title" {...field} />
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
                      placeholder="Describe the purpose of this harambee"
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
              name="goalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Amount (KSh)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Amount to raise"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
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

            <div className="flex items-center space-x-2">
              <Switch
                id="verification"
                checked={requiresVerification}
                onCheckedChange={setRequiresVerification}
              />
              <label
                htmlFor="verification"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I would like to verify my identity for this harambee (recommended)
              </label>
            </div>

            {requiresVerification && (
              <div className="rounded-md bg-blue-50 p-4">
                <div className="flex">
                  <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                      You will be asked to upload your ID for verification after creating this harambee. 
                      Verified harambees typically receive more contributions.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-secondary hover:bg-secondary-foreground">
                {isSubmitting ? "Creating..." : "Create Harambee"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
