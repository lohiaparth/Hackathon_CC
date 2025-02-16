// filepath: /Users/parthlohia/Desktop/Hackathon_CC/cofounder/src/app/product-info/page.jsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useLocalStorage } from "@/utils/storage";

export default function IndustryForm() {
  const form = useForm({
    defaultValues: {
      industry: "",
      otherIndustry: "",
      Description: "",
      targetMarket: "",

    },
  });

  ;
  const [showOtherField, setShowOtherField] = useState(false);
  const router = useRouter();

  const onSubmit = (data) => {
    
    console.debug("Form Data:", data);
    router.push('/data-validation');
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold">Let's start with your industry</h2>
      <p className="text-gray-500">Select the industry that best describes your business idea.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Industry Dropdown */}
          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                <Input
          placeholder="Enter your industry"
          {...field}
          onChange={(e) => {
            // Update react-hook-form state
            field.onChange(e);
            // Store the value in localStorage
            localStorage.setItem("Industry", e.target.value);
          }}
        />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
<FormField
  control={form.control}
  name="Description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Product / Service Description</FormLabel>
      <FormControl>
        <Input
          placeholder="Enter your product or service description"
          {...field}
          onChange={(e) => {
            // Update react-hook-form state
            field.onChange(e);
            // Store the value in localStorage
            useLocalStorage("Description", e.target.value);
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

          <FormField
            control={form.control}
            name="targetMarket"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Audience</FormLabel>
                <FormControl>
                <Input
          placeholder="Describe your target customers..."
          {...field}
          onChange={(e) => {
            // Update react-hook-form state
            field.onChange(e);
            // Store the value in localStorage
            localStorage.setItem("Target Market", e.target.value);
          }}
        />

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />


          {/* Buttons */}
          <div className="flex justify-between">
            <Button variant="outline">Previous</Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Next →
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}