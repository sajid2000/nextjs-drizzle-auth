"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import LoadingButton from "@/components/LoadingButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH_URI } from "@/lib/constants";
import { ResetPasswordSchema } from "@/lib/validators/auth";

import { requestResetPasswordAction } from "../_actions/auth";
import AuthCard from "../_components/AuthCard";

const ResetPasswordForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      requestResetPasswordAction(values).then((data) => {
        if (data.success) {
          setSuccess(data.message);
        } else {
          Object.keys(data.fields || {}).forEach((key) => {
            // @ts-ignore
            form.setError(key, { message: data.fields[key][0] });
          });

          setError(data.error);
        }
      });
    });
  };

  return (
    <AuthCard headerLabel="Forgot your password?" bottomButtonLabel="Back to login" bottomButtonHref={AUTH_URI.signIn}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="john.doe@example.com" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <LoadingButton type="submit" loading={isPending} className="w-full">
            Send reset email
          </LoadingButton>
        </form>
      </Form>
    </AuthCard>
  );
};

export default ResetPasswordForm;
