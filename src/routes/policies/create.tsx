import { paths } from '@/types/openapi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { SimpleGrid, Input, Button, Field, Flex, Text } from '@chakra-ui/react'
import { API_BASE_URL, API_VERSION } from '@/config/config'
import { useEffect } from 'react'

export const Route = createFileRoute('/policies/create')({
  component: RouteComponent,
})

type FormData = paths["/policies/"]["post"]["requestBody"]["content"]["application/json"]

const createPolicy = async (data: FormData) => {
    const token = localStorage.getItem("token")

    const res = await fetch(`${API_BASE_URL}/${API_VERSION}/policies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    })
    if (!res.ok) {
        const errorResponse = await res.json()
        console.error(errorResponse)
        throw new Error("Failed to create policy")
    }
    return res.json()
}


function RouteComponent() {
    const token = localStorage.getItem("token")
    const { register, handleSubmit } = useForm<FormData>()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    useEffect(() => {
      if (!token) {
        navigate({ to: '/login'})
      } else if (error && (error as any).status === 401) {
        navigate({ to: '/login' })
      }
    }, [token, navigate])

    const { mutate, isPending, error } = useMutation({
        mutationFn: createPolicy,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['policies']}),
            navigate({ to: "/policies" })
        }
    })

    const onSubmit = (data: FormData) => {
        mutate(data)
    }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
            <Field.Root>
                <Field.Label>LOB</Field.Label>
                <Input {...register("lob")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>License Plate</Field.Label>
                <Input {...register("license_plate")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>VIN</Field.Label>
                <Input {...register("vin")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Sum Insured</Field.Label>
                <Input {...register("sum_insured")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Base Premium</Field.Label>
                <Input {...register("base_premium")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Net Premium</Field.Label>
                <Input {...register("net_premium")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Tax</Field.Label>
                <Input {...register("tax")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Start Date</Field.Label>
                <Input type='date' {...register("start_date")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>End Date</Field.Label>
                <Input type='date' {...register("end_date")} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Policyholder ID</Field.Label>
                <Input {...register("policyholder_id")} />
            </Field.Root>

        </SimpleGrid>

        <Flex justifyContent="center" mt={6}>
            <Button type="submit" loading={isPending}>
                Create Policy
            </Button>
        </Flex>

        <Text color={"red"}>{error && error.message}</Text>
    </form>
  )
}
