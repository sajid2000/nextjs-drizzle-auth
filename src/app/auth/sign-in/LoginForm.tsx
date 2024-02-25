"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";

import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AUTH_URI, DEFAULT_LOGIN_REDIRECT } from "@/lib/constants";
import { LoginPayload, LoginSchema } from "@/lib/validators/auth";

import { loginAction } from "../_actions/auth";
import AuthCard from "../_components/AuthCard";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : "";

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginPayload>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "jhon@gmail.com",
      password: "12345",
      code: "",
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const onSubmit = (values: LoginPayload) => {
    setError("");
    setMessage("");

    startTransition(() => {
      loginAction(values)
        .then((data) => {
          if (data.success) {
            if (data?.twoFactor) {
              setShowTwoFactor(true);
            } else {
              router.replace(callbackUrl || DEFAULT_LOGIN_REDIRECT);
              router.refresh();
            }
            if (data.message) setMessage(data.message);
          } else {
            console.log(data);
            if (!data.fields) {
              setShowTwoFactor(false);
              form.setValue("code", "");
            }

            Object.keys(data.fields || {}).forEach((key) => {
              // @ts-ignore
              form.setError(key, { message: data.fields[key][0] });
            });

            setError(data.error);
          }
        })
        .catch(() => setError("Something went wrong"));
    });
  };

  return (
    <AuthCard
      headerLabel="Choose your preferred sign in method"
      bottomButtonLabel="Don't have an account?"
      bottomButtonHref={AUTH_URI.signUp}
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} placeholder="123456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
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
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} placeholder="******" type="password" />
                      </FormControl>
                      <Button size="sm" variant="link" asChild className="px-0 font-normal">
                        <Link href={AUTH_URI.resetPassword}>Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>
          {message && <FormSuccess message={message} />}
          <FormError message={error || urlError} />
          <LoadingButton type="submit" loading={isPending} className="w-full">
            {showTwoFactor ? "Confirm" : "Login"}
          </LoadingButton>
        </form>
      </Form>
    </AuthCard>
  );
};

export default LoginForm;
