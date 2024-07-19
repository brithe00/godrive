import React from "react";
import { Container, Grid, Typography, Button, Box } from "@mui/material";

import Image from "next/image";

import { useRouter } from "next/router";

function Hero() {
  const router = useRouter();

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        marginTop: "-13rem",
      }}
    >
      <Box sx={{ position: "relative", width: "100%", paddingTop: "40%" }}>
        <Image
          src="/godrive-banner.png"
          alt="Hero banned image"
          layout="fill"
          objectFit="cover"
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "10%",
          transform: "translateY(-50%)",
          textAlign: "left",
          zIndex: 1,
        }}
      >
        <Typography variant="h2" component="div">
          <Box
            component="span"
            sx={{ color: "white", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            GOD
          </Box>
          <Box
            component="span"
            sx={{ color: "#54F49A", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            RIVE
          </Box>
          <Box
            component="span"
            sx={{ color: "yellow", textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            {" "}
            STAGING
          </Box>
        </Typography>

        <Box
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/trips/search")}
          >
            Find a Ride
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push("/trips/new")}
          >
            Offer a Ride
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

function FeatureSection() {
  const router = useRouter();

  return (
    <Box sx={{ width: "100%", backgroundColor: "#f5f5f5" }}>
      <Grid container>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ p: { xs: 4, md: 8 }, display: "flex", alignItems: "center" }}
        >
          <Box sx={{ maxWidth: "600px", margin: "0 auto" }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Share Your Journey
            </Typography>
            <Typography variant="body1" paragraph>
              Godrive connects drivers with empty seats to passengers looking
              for a ride. Save money, make new friends, and reduce your carbon
              footprint by sharing your journey. Whether you&apos;re commuting
              to work or planning a road trip, find your perfect ride match with
              just a few taps.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => router.push("/trips/new")}
            >
              Start Sharing
            </Button>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{ position: "relative", height: { xs: "400px", md: "auto" } }}
        >
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "100%",
              paddingTop: { xs: "75%", md: "" },
            }}
          >
            <Image
              src="/godrive-car.png"
              alt="Feature image"
              layout="fill"
              objectFit="cover"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function ImageSection() {
  return (
    <Box
      sx={{
        width: "100%",
        height: { xs: "400px", sm: "600px", md: "800px" },
        position: "relative",
      }}
    >
      <Image
        src="/godrive-green-banner.png"
        alt="Full width image"
        layout="fill"
        objectFit="cover"
        priority
      />
    </Box>
  );
}

const colors = {
  background: "#114360",
  textPrimary: "#FFFFFF",
  textSecondary: "#B0C4DE",
};

function Footer() {
  return (
    <Box
      sx={{
        bgcolor: colors.background,
        color: colors.textSecondary,
        py: 6,
        width: "100%",
      }}
    >
      <Container maxWidth={false} disableGutters>
        <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                sx={{ color: colors.textPrimary }}
                gutterBottom
              >
                About Godrive
              </Typography>
              <Typography variant="body2">
                Godrive connects drivers with empty seats to passengers looking
                for a ride. Save money, make new friends, and reduce your carbon
                footprint by sharing your journey. Whether you&apos;re commuting
                to work or planning a road trip, find your perfect ride match
                with just a few taps.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                sx={{ color: colors.textPrimary }}
                gutterBottom
              >
                Contact Us
              </Typography>
              <Typography variant="body2">
                123 Ride Share Avenue, Mobiletown, MS 12345
                <br />
                Email: support@godrive.com
                <br />
                Phone: +33 0 00 00 00 00
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography
                variant="h6"
                sx={{ color: colors.textPrimary }}
                gutterBottom
              >
                Quick Links
              </Typography>
              <Typography variant="body2">
                How It Works • Safety • Help Center • Terms of Service • Privacy
                Policy
              </Typography>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Typography
              variant="body2"
              align="center"
              sx={{ color: colors.textSecondary }}
            >
              © {new Date().getFullYear()} Godrive. All rights reserved. Ride
              responsibly.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureSection />
      <ImageSection />
      <Footer />
    </>
  );
}
