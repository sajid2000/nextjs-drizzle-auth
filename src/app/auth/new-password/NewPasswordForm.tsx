"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import LoadingButton from "@/components/LoadingButton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH_URI } from "@/lib/constants";
import { NewPasswordSchema } from "@/lib/validators/auth";

import { newPasswordAction } from "../_actions/auth";
import AuthCard from "../_components/AuthCard";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      newPasswordAction(values, token).then((data) => {
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
    <AuthCard headerLabel="Enter a new password" bottomButtonLabel="Back to login" bottomButtonHref={AUTH_URI.signIn}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder="******" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <LoadingButton type="submit" loading={isPending} className="w-full">
            Reset password
          </LoadingButton>
        </form>
      </Form>
    </AuthCard>
  );
};

export default NewPasswordForm;
