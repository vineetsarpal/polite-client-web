import { API_BASE_URL, API_VERSION } from '@/config/config'
import { paths } from '@/types/openapi'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard/users/$userId')({
  component: RouteComponent,
})

type User = paths["/api/v1/users/{user_id}"]["get"]["responses"]["200"]["content"]["application/json"]
type Role = paths["/api/v1/roles/{role_id}"]["get"]["responses"]["200"]["content"]["application/json"]

const getUser = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/${API_VERSION.v1}/users/${id}`)
    if (!res.ok) throw new Error("Error fetching data!")
    return res.json()
}

const getUserRoles = async (userId: string | any) => {
    const res = await fetch(`${API_BASE_URL}/${API_VERSION.v1}/users/${userId}/roles`)
    if (!res.ok) throw new Error("Error fetching data!")
    return res.json()
}

function RouteComponent() {
    const { userId } = Route.useParams()

     // Auth0
    // const { getAccessTokenSilently } = useAuth0()
    // const [auth0Token, setAuth0Token] = useState(null)
    // useEffect(() => {
    //     const fetchAuth0Token = async () => {
    //     const t: string | any = await getAccessTokenSilently()
    //     setAuth0Token(t);
    //   }
    //   fetchAuth0Token()
    // }, [getAccessTokenSilently])

    const { data: userData, isLoading, error } = useQuery<User>({
        queryKey: ["users", userId],
        queryFn: () => getUser(userId),
    })

    const { data: roleData } = useQuery<Role[]>({
        queryKey: ["roles", userId],
        queryFn: () => getUserRoles(userData?.id.toString())
    })

    if (isLoading || !userData) return <p>Loading...</p>

    if (error) return <p>Error: {error.message}</p>
    
    console.log(roleData)
    return (
        <div>
            <div>{userData?.full_name}</div>
            <br />
            <div>Roles: </div>
            <div>{roleData?.map((role: Role) => (
                role.name
            ))}</div>
        </div>
    )
}
