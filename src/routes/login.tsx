import { useForm } from "react-hook-form"
import { Input, VStack,Field, Button, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { API_BASE_URL } from "@/config/config"

import { createFileRoute, useNavigate } from '@tanstack/react-router'


export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

type FormData = {
    username: string
    password: string
}

const signIn = async (data: FormData) => {
    const form = new URLSearchParams()
    form.append("username", data.username)
    form.append("password", data.password)

    const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: form.toString()
    })
    if (!res.ok) throw new Error("Invalid credentials")
    return res.json() // { access_token, token_type }
}

function RouteComponent() {
    const { register, handleSubmit } = useForm<FormData>()
    const navigate = useNavigate()
    const { login } = useAuth()
    
    const { mutate, isPending, error } = useMutation({
        mutationFn: signIn,
        onSuccess: (data) => {
            login(data.access_token),
            navigate({ to: "/policies" })
        },
    })

    const onSubmit = (data: FormData) => {
        mutate(data)
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <VStack maxW={500} mt={20} mx={"auto"}  gap={5} align={"stretch"}>
            <Field.Root>
                <Field.Label>Username</Field.Label>
                <Input {...register("username")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Password</Field.Label>
                <Input type="password" {...register("password")} />
            </Field.Root>
            <Button type="submit" loading={isPending}>Sign In</Button>
            <Text color={"red"}>{error && error.message}</Text>
        </VStack>
    </form>
  )
}
