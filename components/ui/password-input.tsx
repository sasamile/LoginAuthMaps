"use client";

import { useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  isSubmitting: boolean;
  field:
    | ControllerRenderProps<
        {
          email: string;
          password: string;
        },
        "password"
      >
    | ControllerRenderProps<
        {
          email: string;
          password: string;
          name: string;
          phone: string;
        },
        "password"
      >
    | ControllerRenderProps<
        {
          oldPassword: string;
          newPassword: string;
        },
        "oldPassword"
      >
    | ControllerRenderProps<
        {
          oldPassword: string;
          newPassword: string;
        },
        "newPassword"
      >;
  className?: string;
  showPlaceholder?: boolean;
}

export function PasswordInput({
  isSubmitting,
  field,
  className,
  showPlaceholder = true,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <div className="relative flex items-center justify-between">
      <Input
        className={cn("pr-11", className)}
        type={showPassword ? "text" : "password"}
        placeholder={showPlaceholder ? "8+ caracteres" : ""}
        disabled={isSubmitting}
        {...field}
      />
      <Button
        variant="ghost"
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        className="absolute right-1 size-8 hover:bg-transparent"
      >
        {showPassword ? (
          <EyeOff className="shrink-0" />
        ) : (
          <Eye className="shrink-0" />
        )}
      </Button>
    </div>
  );
}
