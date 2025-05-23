import Sidebar from '@/components/Sidebar'
import { Grid, GridItem, Box } from '@chakra-ui/react'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Grid
        templateColumns={{ base: '1fr', md: 'auto 1fr' }}
        minH="100vh"
      >
        <GridItem
          as="aside"
          w={{ base: 0, md: 'auto' }} // Sidebar width handled by Sidebar.tsx
          borderRight={{ base: 'none', md: '1px' }}
          borderColor={{ base: 'transparent', md: 'gray.200' }}
          overflowY="auto"
          display={{ base: 'none', md: 'block' }} // Hide sidebar on mobile
        >
          <Sidebar />
        </GridItem>

        <GridItem as="main" p={{ base: 4, md: 10 }} overflow="auto">
          <Box maxW="container.xl" mx="auto">
            <Outlet />
          </Box>
        </GridItem>
      </Grid>
    </>
  )
}

// === OLDER ===
// import Sidebar from '@/components/Sidebar'
// import { Grid, GridItem } from '@chakra-ui/react'

// import { createFileRoute, Outlet } from '@tanstack/react-router'

// export const Route = createFileRoute('/_dashboard')({
//   component: RouteComponent,
// })

// function RouteComponent() {
//   return (
//     <>
//       <Grid templateColumns={"repeat(8,1fr)"}>
//         <GridItem as={"aside"} colSpan={1} borderRight={"1px solid grey"} minH={"93vh"} minW={"100px"} overflowY={"auto"}>
//         <Sidebar />
//         </GridItem>

//         <GridItem as={"main"} colSpan={7} p={10}>
//         <Outlet />
//         </GridItem>
//     </Grid>
//     </>
//   )
// }
