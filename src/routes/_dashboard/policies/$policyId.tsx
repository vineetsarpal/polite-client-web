import { Button, Field, Flex, HStack, Input, SimpleGrid } from "@chakra-ui/react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { paths } from "@/types/openapi"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { API_BASE_URL, API_VERSION } from "@/config/config"

import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from "@/context/AuthContext"


export const Route = createFileRoute('/_dashboard/policies/$policyId')({
  component: RouteComponent,
})

type Policy = paths["/policies/{policy_id}"]["get"]["responses"]["200"]["content"]["application/json"]
type UpdatePayload = paths["/policies/{policy_id}"]["put"]["requestBody"]["content"]["application/json"]

const getPolicy = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/${API_VERSION.v1}/policies/${id}`)
    if (!res.ok) throw new Error("Error fetching data!")
    return res.json()
}

const updatePolicy = async (payload : { id: string, token: string | null, data: UpdatePayload }) => {
    const { id, token, data } = payload

    const res = await fetch(`${API_BASE_URL}/${API_VERSION.v1}/policies/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Error updating policy!")
    return res.json()
}

function RouteComponent() {
    const { token } = useAuth()
    const [editMode, setEditMode] = useState(false)
    const { policyId } = Route.useParams()
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { data, isLoading, error } = useQuery<Policy>({
        queryKey: ["policies", policyId],
        queryFn: () => getPolicy(policyId),
    })

    const toDateInputFormat = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
    }

    const { register, handleSubmit, reset } = useForm<UpdatePayload>({
        defaultValues: data ? {
            ...data,
            start_date: toDateInputFormat(data.start_date),
            end_date: toDateInputFormat(data.end_date),
        } : {},
      })

    // Reset the form when the data is loaded or updated
    useEffect(() => {
        if (data) {
            const formatted = {
                ...data,
                start_date: toDateInputFormat(data.start_date),
                end_date: toDateInputFormat(data.end_date),
            }
            reset(formatted)
        }
    }, [data, reset])

    const { mutate } = useMutation({
        mutationFn: updatePolicy,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['policies', policyId] });
            navigate({ to: `/policies/${policyId}`})
            setEditMode(false)
        }
    })

    const onSubmit = (formData: UpdatePayload) => {
        mutate({ id: policyId, token, data: formData })
    }

    if (isLoading || !data) return <p>Loading...</p>

    if (error) return <p>Error: {error.message}</p>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
            <Field.Root>
                <Field.Label>LOB</Field.Label>
                <Input {...register("lob")} disabled={true} />
            </Field.Root>
            <Field.Root>
                <Field.Label>License Plate</Field.Label>
                <Input {...register("license_plate")} disabled={!editMode} />
            </Field.Root>
            <Field.Root>
                <Field.Label>VIN</Field.Label>
                <Input {...register("vin")} disabled={!editMode} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Sum Insured</Field.Label>
                <Input {...register("sum_insured")} disabled={!editMode} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Base Premium</Field.Label>
                <Input {...register("base_premium")} disabled={!editMode} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Net Premium</Field.Label>
                <Input {...register("net_premium")} disabled={!editMode} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Tax</Field.Label>
                <Input {...register("tax")} disabled={!editMode} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Start Date</Field.Label>
                <Input type="date" {...register("start_date")} disabled={true} />
            </Field.Root>
            <Field.Root>
                <Field.Label>End Date</Field.Label>
                <Input type="date" {...register("end_date")} disabled={true} />
            </Field.Root>
            <Field.Root>
                <Field.Label>Policyholder ID</Field.Label>
                <Input {...register("policyholder_id")} disabled={!editMode} />
            </Field.Root>
        </SimpleGrid>

        <Flex justifyContent="center" mt={6}>
            {editMode ? (
                <HStack justify="flex-end">
                    <Button type="submit" colorScheme="blue">Save</Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            reset()
                            setEditMode(false)
                        }}
                    >
                        Cancel
                    </Button>
                </HStack>
                ) : (
                <Button alignSelf="flex-end" onClick={() => setEditMode(true)}>Edit</Button>
            )}
        </Flex>
    </form>
  )
}