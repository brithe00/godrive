import Head from "next/head";
import { ReactNode } from "react";
import { Box } from "@mui/material";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <title>Godrive</title>
        <meta name="description" content="En route pour le paradis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: {
            xs: 10, // 16px on extra-small screens
            sm: 10, // 32px on small screens
            md: 12, // 48px on medium screens and up
          },
        }}
      >
        {children}
      </Box>
    </>
  );
}
