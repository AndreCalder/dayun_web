"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";

import { boolean, number, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import axiosInstance from "../api";
import { saveAccessToken } from "../accessToken";
import { redirect, useRouter } from "next/navigation";
import Image from "next/image";

const loginSchema = z.object({
    username: z.string(),
    password: z.string(),
});

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function Login() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: z.infer<typeof loginSchema>) {
        setLoading(true);
        await axiosInstance
            .post("/auth/login", data)
            .then((res) => {
                toast.success("Inicio de sesión exitoso");
                saveAccessToken(res.data.access_token);

                delay(500).then(() => {
                    router.replace(`/admin/covers`);
                });
            })
            .catch((err) => {
                setLoading(false);
                toast.error("Error al iniciar sesión");
            });
    }

    return (
        <div className="w-screen h-svh flex justify-center items-center bg-white z-50">
            <Card className="w-96">
                <CardHeader>
                    <Image
                        className="mx-auto"
                        src="/Logo_Vector.svg"
                        alt="Logo"
                        width={155}
                        height={55}
                    />
                    <h1 className="text-2xl font-bold text-center">Login</h1>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex align-middle justify-between">
                                            <FormLabel>Usuario</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Usuario"
                                                onChange={field.onChange}
                                            />
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
                                        <div className="flex align-middle justify-between">
                                            <FormLabel>Contraseña</FormLabel>
                                        </div>
                                        <FormControl>
                                            <PasswordInput
                                                placeholder="Contraseña"
                                                id="password"
                                                value={field.value || ""}
                                                onChange={field.onChange}
                                                autoComplete="new-password"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="flex py-3 justify-center">
                                {!loading ? (
                                    <Button
                                        className=" w-full rounded-lg"
                                        type="submit"
                                    >
                                        Iniciar Sesión
                                    </Button>
                                ) : (
                                    <p>Loading...</p>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Image
                className="absolute z-10 translate-x-1/3 top-0 right-0 rotate-180"
                src="/Dayun_Face.png"
                alt="Dayun"
                width={400}
                height={400}
            />
            <Image
                className="absolute z-10 -translate-x-1/3 bottom-0 left-0 "
                src="/Dayun_Face.png"
                alt="Dayun"
                width={400}
                height={400}
            />
        </div>
    );
}

export default Login;
