import { API_BASE_URL, API_VERSION } from '@/config/config'
import { useAuth } from '@/context/AuthContext'
import { paths } from '@/types/openapi'
import { Button, Card, CloseButton, Dialog, Portal, SimpleGrid } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/dashboard/contacts/')({
  component: RouteComponent,
})

type Contact = paths["/api/v1/contacts/{contact_id}"]["get"]["responses"]["200"]["content"]["application/json"]

const getContacts = async (token: string | null, token0: string | null = null) => {
    const bearerToken = token ? token : token0
    const res = await fetch(`${API_BASE_URL}/${API_VERSION.v1}/contacts`, {
        headers: {
            "Authorization": `Bearer ${bearerToken}`
        }
    })
    if (!res.ok) throw new Error("Error fetching data")
    return res.json()
}

const deleteContacts = async (payload: {id: string, token: string | null, token0: string | null})  => {
    const { id, token, token0 } = payload
    const bearerToken = token ? token : token0
    const res = await fetch(`${API_BASE_URL}/${API_VERSION.v1}/contacts/${id}`, {
        method: "DELETE",
        headers: {
        "Authorization": `Bearer ${bearerToken}`,
        },
    })
    if (!res.ok) throw new Error("Failed to delete User")
    return true
}

function RouteComponent() {
    const { token } = useAuth()
    const queryClient = useQueryClient()
    const [idToDelete, setIdToDelete] = useState<string | null>(null)
    
    // // Auth0
    // const { getAccessTokenSilently } = useAuth0()
    // const [auth0Token, setAuth0Token] = useState(null)
    // useEffect(() => {
    //     const fetchAuth0Token = async () => {
    //     const t: string | any = await getAccessTokenSilently()
    //     setAuth0Token(t);
    //   }
    //   fetchAuth0Token()
    // }, [getAccessTokenSilently])


    const { data, isLoading, error } = useQuery<Contact[]>({
        queryKey: ["contacts"],
        queryFn: () => getContacts(token),
        enabled: !!token
    })

    const { mutate, isPending } = useMutation({
        mutationFn: deleteContacts,
        onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["contacts"] })
      }
    })

    const handleDeleteClick = (id: string) => {
      setIdToDelete(id)
    }

    const confirmDelete = () => {
      if (idToDelete && token) mutate({ id: idToDelete, token, token0: null })
    }

    if (isLoading) return <p> Loading</p>

    if (error) return <p>Error: {error.message}</p>

    return (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={10}>
        {
            data?.map((contact: Contact) => (
                <Card.Root key={contact.id}> 
                    <Link to="/dashboard/contacts/$contactId" params={{ contactId: contact.id.toString() }} >
                    <Card.Header>{contact.first_name} {contact.last_name}</Card.Header>
                    <Card.Body>
                        Type: {contact.type}
                    </Card.Body>
                    </Link>

                    <Card.Footer>
                    <Dialog.Root role="alertdialog">
                        <Dialog.Trigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClick(contact.id.toString())}>
                            Delete
                        </Button>
                        </Dialog.Trigger>
                        <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Are you sure?</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <p>
                                This will permanently delete Contact ID: {contact.id}
                                </p>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button colorPalette="red" onClick={confirmDelete} loading={isPending}>Delete</Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                            </Dialog.Content>
                        </Dialog.Positioner>
                        </Portal>
                    </Dialog.Root> 
                    </Card.Footer>
                </Card.Root>
            ))
        }
        </SimpleGrid>
    )
}