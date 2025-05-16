import { Flex, Heading, HStack, Spacer, Text } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { ColorModeButton } from "@/components/ui/color-mode"
import AuthButton from "./AuthButton"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/context/AuthContext"
import { userService } from "@/services/userService"

function Navbar() {
    const { isLoggedIn, token } = useAuth()

    const { data: user } = useQuery({
        queryKey: ["currentUser", token],
        queryFn: () => userService.getCurrentUser(token),
        staleTime: 5 * 60 * 1000,
        enabled: isLoggedIn && !!token,
    })

  return (
    <Flex as={"nav"} p={2} mx={10} gap={2} alignItems={"center"} wrap={"wrap"}>
        <HStack gap={10}>
            <Heading size="3xl" fontWeight="bold">Polite</Heading>
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