"use server";

import type { FeedbackFormData } from "@/types";
import { z } from "zod";

const feedbackSchema = z.object({
  type: z.enum(['c', 'f']),
  author_email: z.string().email(),
  place: z.string().optional(),
  content: z.string().min(10),
});

export async function submitFeedback(formData: FeedbackFormData) {
  try {
    const validatedData = feedbackSchema.parse(formData);

    // In a real application, you would save this data to your database.
    // For this example, we'll just log it and simulate success.
    console.log("Feedback received:", validatedData);

    // Simulate database operation
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true, message: "Thank you for your feedback!" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, message: "Validation failed.", errors: error.flatten().fieldErrors };
    }
    console.error("Error submitting feedback:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}
