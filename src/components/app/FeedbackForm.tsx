"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import type { FeedbackFormData } from "@/types";
import { submitFeedback } from "@/lib/actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

const feedbackFormSchema = z.object({
  type: z.enum(["c", "f"], {
    required_error: "You need to select a submission type.",
  }),
  author_email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  place: z.string().optional(),
  content: z.string().min(10, {
    message: "Your message must be at least 10 characters long.",
  }).max(1000, {
    message: "Your message must not exceed 1000 characters."
  }),
});

export function FeedbackForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FeedbackFormData>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      type: "c",
      author_email: "",
      place: "",
      content: "",
    },
  });

  async function onSubmit(data: FeedbackFormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitFeedback(data);
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
        form.reset();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit feedback.",
          variant: "destructive",
        });
        if (result.errors) {
          // Handle field-specific errors from Zod, if any were returned
           Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages && messages.length > 0) {
              form.setError(field as keyof FeedbackFormData, { message: messages[0] });
            }
          });
        } else {
          setError(result.message || "An unknown error occurred.");
        }
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-lg mx-auto p-6 md:p-8 bg-card rounded-xl shadow-xl">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-card-foreground">Type of Submission</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1 md:flex-row md:space-y-0 md:space-x-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="c" />
                    </FormControl>
                    <FormLabel className="font-normal text-card-foreground">Comment</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="f" />
                    </FormControl>
                    <FormLabel className="font-normal text-card-foreground">Feedback</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-card-foreground">Your Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} className="bg-background" />
              </FormControl>
              <FormDescription>
                Your email will not be shared publicly.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="place"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-card-foreground">Regarding (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Portfolio page, a specific link" {...field} className="bg-background"/>
              </FormControl>
              <FormDescription>
                Optionally, specify what your comment/feedback is about.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-card-foreground">Your Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell me what you think..."
                  className="resize-y min-h-[120px] bg-background"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}

        <Button type="submit" disabled={isPending} className="w-full bg-accent hover:bg-opacity-80 text-accent-foreground">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit
        </Button>
      </form>
    </Form>
  );
}
