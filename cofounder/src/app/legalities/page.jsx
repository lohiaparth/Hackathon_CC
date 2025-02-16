"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

export default function TrademarkPatentForm() {
  const form = useForm({
    defaultValues: {
      brandName: "",
      productDescription: "",
    },
  });

  const router = useRouter();

  const onSubmit = (data) => {
    console.debug("Form Data:", data);

    // Store data in localStorage
    localStorage.setItem("Brand Name", data.brandName);
    localStorage.setItem("Product Description", data.productDescription);

    // Redirect to results page (modify as needed)
    router.push('/check-trademark-patent');
  };

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white">
      <h2 className="text-2xl font-bold">Check Trademark & Patent Status</h2>
      <p className="text-gray-500">Enter your brand name and product details to check for trademarks and patent eligibility.</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
          
          {/* Brand Name */}
          <FormField
            control={form.control}
            name="brandName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand / Company Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your brand name"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      localStorage.setItem("Brand Name", e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Description */}
          <FormField
            control={form.control}
            name="productDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product / Service Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Describe your product or service"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      localStorage.setItem("Product Description", e.target.value);
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Check Status →
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
