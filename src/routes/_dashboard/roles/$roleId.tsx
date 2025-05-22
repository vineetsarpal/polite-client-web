import { API_BASE_URL, API_VERSION } from '@/config/config'
import { paths } from '@/types/openapi'
import { Box, Button, Checkbox, Heading, HStack, Spacer, Text, VStack } from '@chakra-ui/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/roles/$roleId')({
  component: RouteComponent,
})

type Role = paths["/api/v1/roles/{role_id}"]["get"]["responses"]["200"]["content"]["application/json"]
type Permission = paths["/api/v1/permissions/{permission_id}"]["get"]["responses"]["200"]["content"]["application/json"]

interface PermissionWithAssignment extends Permission {
    assigned: boolean
}

const getRole = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/${API_VERSION.v1}/roles/${id}`)
    if (!res.ok) throw new Error("Error fetching data!")
    return res.json()
}

const getRolePermissions = async (roleId: string | any) => {
    const res = await fetch(`${API_BASE_URL}/${API_VERSION.v1}/roles/${roleId}/permissions`)
    if (!res.ok) throw new Error("Error fetching data!")
    return res.json()
}

function RouteComponent() {
    const { roleId } = Route.useParams()
    const [permissions, setPermissions] = useState<PermissionWithAssignment[]>([])
    const queryClient = useQueryClient()


    const { data: roleData, isLoading, error } = useQuery<Role>({
        queryKey: ["roles", roleId],
        queryFn: () => getRole(roleId),
        enabled: !!roleId
    })

    const { data: initialPermissionData } = useQuery<PermissionWithAssignment[]>({
        queryKey: ["permissions", roleId],
        queryFn: () => getRolePermissions(roleId),
        enabled: !!roleId
    })

    // Initialize roles state when roleData loads
    useEffect(() => {
        if (initialPermissionData) {
            setPermissions(initialPermissionData)
        }
    }, [initialPermissionData])

    console.log(initialPermissionData)

     // Mutation for saving changes
    const updateRolesMutation = useMutation({
        mutationFn: async (selectedPermissionIds: number[]) => {
            const res = await fetch(
                `${API_BASE_URL}/${API_VERSION.v1}/users/${roleData?.id}/roles`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(selectedPermissionIds)
                }
            );
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || "Failed to update roles")
            }
            return res.json();
        },
        onSuccess: () => {
            alert("Permissions updated successfully!")
            // Invalidate the 'roles' query to refetch fresh data from the backend
            // This ensures that if the user navigates away and comes back, or if another part
            // of the app relies on this data, it's always up-to-date with the backend.
            queryClient.invalidateQueries({ queryKey: ["permisions", roleId] });
        },
        onError: (error) => {
            alert(`Error: ${error.message}`)
        },
    })

     // Handle checkbox change
    const handleCheckboxChange = (permissionId: number) => {
        setPermissions(prev => prev.map(permission => permission.id === permissionId ? { ...permission, assigned: !permission.assigned } : permission))
    }

    // Save permissions to backend
    const handleSave = () => {
        if (!roleData?.id) {
            alert(`Role ID ${roleData?.id} not available to save permissions.`);
            return;
        }
        const selectedPermissionIds = permissions.filter(p => p.assigned).map(p => p.id);
        updateRolesMutation.mutate(selectedPermissionIds);
    }

    if (isLoading || !roleData) return <p>Loading...</p>

    if (error) return <p>Error: {error.message}</p>

    return (
    <Box
      p={6}
      borderWidth="1px"
      borderRadius="lg"
      shadow="md"
      w="100%"
      maxW="md"
      mx="auto" 
    >
      <VStack gap={5} align="stretch">
        <Heading as="h2" size="lg"  mb={2}>
          Role Details
        </Heading>
        <Text>
          Name: {roleData?.name || 'Loading Role...'}
        </Text>

        {/* Roles Section */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            Manage Permissions
          </Text>
          {permissions && permissions.length > 0 ? (
            <VStack align="flex-start" gap={3}>
              {permissions.map((permission: PermissionWithAssignment) => {
                console.log(permission.assigned)
                return (
                // Use Checkbox.Root for each individual checkbox
                <HStack key={permission.id} width="100%">
                  <Checkbox.Root
                    // The 'checked' prop controls the state
                    checked={permission.assigned}
                    // The 'onCheckedChange' event handler
                    onCheckedChange={() => handleCheckboxChange(permission.id)}
                    id={`permission-${permission.id}`} // Good for accessibility, links to the label
                  >
                    <Checkbox.HiddenInput />

                    <Checkbox.Control
                        borderRadius="md" // Rounded corners for the box
                        borderWidth="2px"
                    >
                    </Checkbox.Control>

                    {/* The label text */}
                    <Checkbox.Label  ml={2}>
                      <Text fontSize="md">
                        {permission.name}
                      </Text>
                    </Checkbox.Label>
                  </Checkbox.Root>
                </HStack>
              )})}
            </VStack>
          ) : (
            <Text fontStyle="italic">
              No roles available to assign.
            </Text>
          )}
        </Box>

        {/* Save Button */}
        <Spacer />
        <Button
          onClick={handleSave}
          loading={isLoading}
          loadingText="Saving..."
          spinnerPlacement="end"
          mt={5}
          w="100%"
        >
          Save Changes
        </Button>
      </VStack>
    </Box>
  )
}
