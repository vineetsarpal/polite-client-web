import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { Container, Grid, GridItem } from '@chakra-ui/react'

export const Route = createRootRoute({
  component: () => (
    <>
      <Container h={"100vh"} maxW={"full"} p={0}>
        <Navbar />
        <hr />
        <Grid templateColumns={"repeat(8,1fr)"}>
          <GridItem as={"aside"} colSpan={1} borderRight={"1px solid grey"} minH={"93vh"} minW={"100px"} overflowY={"auto"}>
            <Sidebar />
          </GridItem>

          <GridItem as={"main"} colSpan={7} p={10}>
            <Outlet />
            <TanStackRouterDevtools />
          </GridItem>
        </Grid>
      </Container>
    </>
  ),
})