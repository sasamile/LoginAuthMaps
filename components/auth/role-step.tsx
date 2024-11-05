"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Role } from "@prisma/client";
import { Check } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { rolesInfo } from "@/constants";
import { cn } from "@/lib/utils";
import { useAccountTypeStore } from "@/stores/useAccountTypeStore";

interface AccountTypeStepProps {
  accountType: Role | null;
}

export function AccountTypeStep({ accountType }: AccountTypeStepProps) {
  const { setAccountType } = useAccountTypeStore();

  return (
    <RadioGroup
      onValueChange={(value) => setAccountType(value as Role)}
      value={accountType || undefined}
      className="space-y-4"
    >
      {rolesInfo.map(({ title, description, value, Icon }) => (
        <Card
          key={value}
          className={cn(
            "relative cursor-pointer bg-transparent border-[1.5px] transition-all duration-200 p-0",
            accountType === value
              ? "border-blue-600 ring-1 ring-blue-500"
              : "border-muted-foreground"
          )}
        >
          <Label htmlFor={value} className="cursor-pointer">
            <AnimatePresence>
              {accountType === value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{
                    scale: 0,
                    transition: {
                      duration: 0,
                    },
                  }}
                  transition={{
                    type: "spring", // Tipo de transición con efecto rebote
                    stiffness: 300, // Aumenta la fuerza del resorte
                    damping: 16, // Controla la rapidez con que el rebote se detiene
                    bounce: 0.5, // Controla el nivel de rebote
                    duration: 0.5, // Duración de la animación
                  }}
                  className="absolute top-4 right-3 rounded-full bg-blue-500 p-1"
                >
                  <Check
                    className="size-3 shrink-0 text-white"
                    strokeWidth={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <CardContent className="flex justify-start items-center gap-4 p-4">
              <RadioGroupItem value={value} id={value} className="sr-only" />
              <div className="p-3 border border-muted-foreground rounded-md">
                <Icon className="size-6 text-white shrink-0 text-primary m-0" />
              </div>
              <div className="flex-grow cursor-pointer">
                <h3 className="text-white text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </CardContent>
          </Label>
        </Card>
      ))}
    </RadioGroup>
  );
}
