import { Flex, HStack, Spacer, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { ColorModeButton } from "@/components/ui/color-mode"
import AuthButton from "./AuthButton"
import { authService } from "@/services/authService"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react"

function Navbar() {
    const { isLoggedIn, token } = useAuth()

    const { data: user, refetch } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => authService.getCurrentUser(token),
        staleTime: 5 * 60 * 1000,
        enabled: isLoggedIn && !!token,
    })

    useEffect(() => {
    if (isLoggedIn && token) {
        refetch(); // Manually refetch data when the user logs in
        }
    }, [token, isLoggedIn, refetch]);

  return (
    <Flex as={"nav"} p={2} mx={10} gap={2} alignItems={"center"} wrap={"wrap"}>
        <HStack gap={10}>
            <Link to="/"  activeProps={{ className: 'font-bold' }} activeOptions={{ exact: true }}>
                Home
            </Link> 
            <Link to="/about"  activeProps={{ className: 'font-bold' }} activeOptions={{ exact: true }}>
                About
            </Link>
        </HStack>
       
        <Spacer />

        <HStack>
            {isLoggedIn && <Text>Welcome, {user?.username} </Text>}
            <AuthButton />
            <ColorModeButton />
        </HStack>
    </Flex>
  )
}

export default Navbar