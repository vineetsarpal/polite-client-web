import { Flex, HStack, Spacer } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { ColorModeButton } from "@/components/ui/color-mode"
import AuthButton from "./AuthButton"

function Navbar() {
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
        <Link to="/login">
            <AuthButton />
        </Link>
        
        <ColorModeButton />
    </Flex>
  )
}

export default Navbar