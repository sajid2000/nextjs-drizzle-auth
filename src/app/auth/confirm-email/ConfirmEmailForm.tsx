"use client";

import { Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import FormError from "@/components/FormError";
import FormSuccess from "@/components/FormSuccess";
import { AUTH_URI } from "@/lib/constants";

import { confirmEmailAction } from "../_actions/auth";
import AuthCard from "../_components/AuthCard";

const ConfirmEmailForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    confirmEmailAction(token)
      .then((data) => {
        if (data.success) setSuccess(data.message);
        else setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <AuthCard headerLabel="Confirming your verification" bottomButtonLabel="Back to login" bottomButtonHref={AUTH_URI.signIn}>
      <div className="flex w-full items-center justify-center">
        {!success && !error && <Loader className="animate-spin" />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </AuthCard>
  );
};

export default ConfirmEmailForm;
