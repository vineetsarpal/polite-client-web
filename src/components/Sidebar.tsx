import { VStack } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

function Sidebar() {
  return (
    <VStack p={10} align={"start"}>
        <Link to={'/policies'}>
            Policies
        </Link>
        <Link to={'/policies/create'}>
            Create a Policy
        </Link>

    </VStack>
  )
}

export default Sidebar