import Sidebar from '@/components/Sidebar'
import { Grid, GridItem } from '@chakra-ui/react'

import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <Grid templateColumns={"repeat(8,1fr)"}>
        <GridItem as={"aside"} colSpan={1} borderRight={"1px solid grey"} minH={"93vh"} minW={"100px"} overflowY={"auto"}>
        <Sidebar />
        </GridItem>

        <GridItem as={"main"} colSpan={7} p={10}>
        <Outlet />
        </GridItem>
    </Grid>
  )
}
