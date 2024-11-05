"use client";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RegisterSchema } from "@/schemas";
import { FaFilePdf } from "react-icons/fa6";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeOff,
  Eye,
  FileIcon,
  Check,
  XIcon,
} from "lucide-react";
import { useAccountTypeStore } from "@/stores/useAccountTypeStore";
import { Role } from "@prisma/client";
import { z } from "zod";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { uploadFile } from "@/actions/uploadthing-actions";
import { toast } from "sonner";
import { register } from "@/actions/auth-actions";
import { rolesInfo } from "@/constants";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AccountCreationStepper() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<z.infer<typeof RegisterSchema>>({
    email: "",
    lastname: "",
    name: "",
    password: "",
    phone: "",
  });

  const router = useRouter();

  const { setAccountType, accountType } = useAccountTypeStore();

  const validateField = (name: string, value: string) => {
    try {
      const fieldSchema =
        RegisterSchema.shape[name as keyof z.infer<typeof RegisterSchema>];
      fieldSchema.parse(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
      }
      return false;
    }
  };

  const validateForm = () => {
    try {
      RegisterSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrija los errores del formulario");
      return;
    }

    try {
      if (accountType === "ADMIN" && selectedFile) {
        const formData2 = new FormData();
        formData2.append("file", selectedFile);

        const response = await uploadFile(formData2);

        if (response?.success && response.fileUrl) {
          const { success, error } = await register(
            formData,
            accountType,
            response.fileUrl
          );

          if (error) {
            toast.error(error);
          }

          if (success) {
            toast.success(success);
            resetForm();
            router.push("/sign-in");
          }
        }

        if (!response?.success) {
          toast.error("No se pudo subir el archivo.");
        }
      } else {
        const { success, error } = await register(formData, accountType!);

        if (error) {
          toast.error(error);
        }

        if (success) {
          toast.success(success);
          resetForm();
          router.push("/sign-in");
        }
      }
    } catch (error) {
      toast.error("Algo salió mal al procesar el registro");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFormData({
      email: "",
      lastname: "",
      name: "",
      password: "",
      phone: "",
    });
    setStep(1);
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handlePhoneChange = (phone: string) => {
    setFormData((prev) => ({ ...prev, phone }));
    validateField("phone", phone);
  };
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
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
                          transition: { duration: 0 },
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 16,
                          bounce: 0.5,
                          duration: 0.5,
                        }}
                        className="absolute top-4 right-3 rounded-full bg-blue-500 p-1"
                      >
                        <Check
                          className="size-3 shrink-0 dark:text-white"
                          strokeWidth={3}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <CardContent className="flex justify-start items-center gap-4 p-4">
                    <RadioGroupItem
                      value={value}
                      id={value}
                      className="sr-only"
                    />
                    <div className="p-3 border border-muted-foreground rounded-md">
                      <Icon className="size-6 dark:text-white shrink-0 text-primary m-0" />
                    </div>
                    <div className="flex-grow cursor-pointer">
                      <h3 className="dark:text-white text-lg font-semibold">
                        {title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {description}
                      </p>
                    </div>
                  </CardContent>
                </Label>
              </Card>
            ))}
          </RadioGroup>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Tu nombre o nombre de marca"
                className={cn(
                  "border-[#525252] py-6",
                  errors.name && "border-red-500"
                )}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Apellido</Label>
              <Input
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                placeholder="Tu Apellido"
                className={cn(
                  "border-[#525252] py-6",
                  errors.lastname && "border-red-500"
                )}
              />
              {errors.lastname && (
                <p className="text-sm text-red-500 mt-1">{errors.lastname}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <PhoneInput
                defaultCountry="co"
                value={formData.phone}
                onChange={handlePhoneChange}
                inputClassName={cn(errors.phone && "border-red-500")}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={cn(
                  "border-[#525252] py-6",
                  errors.email && "border-red-500"
                )}
                placeholder="shadcn@gmail.com"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative flex items-center justify-between">
                <Input
                  id="password"
                  name="password"
                  className={cn(
                    "pr-11 border-[#525252] py-6",
                    errors.password && "border-red-500"
                  )}
                  type={showPassword ? "text" : "password"}
                  placeholder="8+ caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-1 hover:bg-transparent hover:text-white/80 p-0 mr-2"
                >
                  {showPassword ? (
                    <EyeOff className="min-w-5 min-h-5 shrink-0" />
                  ) : (
                    <Eye className="min-w-5 min-h-5 shrink-0" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>
            {accountType === "USER" && (
              <Button
                type="submit"
                className="w-full bg-blue-500 text-white"
                disabled={!formData.email || !formData.password}
              >
                Enviar
              </Button>
            )}
          </div>
        );
      case 4:
        return (
          <>
            {accountType === "ADMIN" && (
              <div className="w-full mx-auto space-y-4">
                <Label className="dark:text-gray-300">
                  RUT o documento que acredite propiedad del terreno
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 w-full"
                  >
                    <FileIcon className="size-4" />
                    <span>Seleccionar PDF</span>
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && file.type === "application/pdf") {
                        setSelectedFile(file);
                        setPreviewUrl(URL.createObjectURL(file));
                      } else {
                        toast.error(
                          "Por favor, selecciona un archivo PDF válido."
                        );
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }
                    }}
                    accept=".pdf"
                    hidden
                  />
                </div>
                {selectedFile && (
                  <div className="flex items-center space-x-2 justify-between">
                    <FaFilePdf className="w-8 h-4 text-red-500" size={20} />
                    <span className="text-sm text-gray-500">
                      {truncateText(selectedFile.name, 100)}
                    </span>
                    <Button
                      size="icon"
                      onClick={handleRemoveFile}
                      className="w-5 h-5 shrink-0 flex items-center rounded-full bg-rose-500 text-white"
                    >
                      <XIcon className="w-3 h-3" strokeWidth={3} />
                    </Button>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-blue-700 text-white hover:bg-blue-900"
                  disabled={!selectedFile}
                >
                  Enviar
                </Button>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <form className="space-y-6" onSubmit={onSubmit}>
        {renderStep()}
      </form>
      <div className="flex justify-between">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep((prev) => prev - 1)}
            className="flex items-center"
          >
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            Atrás
          </Button>
        )}
        {step < 3 && (
          <Button
            onClick={() => setStep((prev) => prev + 1)}
            disabled={
              step === 2 &&
              (!formData.name ||
                formData.phone.length < 10 ||
                !formData.lastname)
            }
            className="flex items-center ml-auto"
          >
            Continuar
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
        {step === 3 && accountType === "ADMIN" && (
          <Button
            onClick={() => setStep((prev) => prev + 1)}
            disabled={!formData.email || !formData.password}
            className="flex items-center ml-auto"
          >
            Continuar
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex justify-center space-x-2">
        {[1, 2, 3, accountType === "ADMIN" ? 4 : 0].filter(Boolean).map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
