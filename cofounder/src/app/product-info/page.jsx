"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function IndustryForm() {
  const form = useForm({
    defaultValues: {
      industry: "",
      otherIndustry: "",
    },
  });

  const selectedIndustry = form.watch("industry"); // Watch the industry field
  const [showOtherField, setShowOtherField] = useState(false);

  const onSubmit = (data) => {
    console.log("Form Data:", data);
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
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      setShowOtherField(value === "other"); // Show input if "Other" is selected
                      if (value !== "other") form.setValue("otherIndustry", ""); // Clear other field if not selected
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Input placeholder="Enter your product or service description" {...field} />
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
                  <Input placeholder="Describe your target customers..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
              
            )}
          />

          {/* Additional Input Field for "Other" Industry */}
          {showOtherField && (
            <FormField
              control={form.control}
              name="otherIndustry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specify your industry</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your industry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
