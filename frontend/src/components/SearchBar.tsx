import { useState } from "react";

import {
  Alert,
  Container,
  Card,
  CardContent,
  Grid,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.extend(utc);

import { useLazyQuery } from "@apollo/client";
import { SEARCH_TRIPS } from "@/graphql/queries/trip";
import TripsList from "./TripsList";
import TripsFilters from "./TripsFilters";

export default function SearchBar() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [date, setDate] = useState(null);
  const [sortBy, setSortBy] = useState([]);

  const [search, { loading, data, error, refetch }] = useLazyQuery(
    SEARCH_TRIPS,
    {
      variables: {
        startLocation,
        endLocation,
        date: date ? dayjs(date).utc().format() : null,
        sortBy,
      },
    }
  );

  const handleSortByChange = (value) => {
    setSortBy([value]);
  };

  const handleResetFilters = () => {
    setSortBy([]);
  };

  return (
    <>
      <Container component="main">
        {error && (
          <Alert
            severity="error"
            sx={{
              margin: "1rem 0",
            }}
          >
            <strong>{error.message}</strong>
          </Alert>
        )}

        <Card>
          <CardContent>
            <Box component="form">
              <Grid container spacing={2}>
                <Grid item xs={3.5}>
                  <TextField
                    fullWidth
                    id="startLocation"
                    label="Departure"
                    name="startLocation"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={3.5}>
                  <TextField
                    fullWidth
                    id="endLocation"
                    label="Destination"
                    name="endLocation"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={3.5}>
                  <DatePicker
                    fullWidth
                    label="Date"
                    format="DD/MM/YYYY"
                    sx={{ width: "100%" }}
                    onChange={(newValue) => setDate(dayjs(newValue))}
                  />
                </Grid>

                <Grid item xs={1.5} container>
                  <LoadingButton
                    fullWidth
                    variant="contained"
                    loading={loading}
                    onClick={search}
                  >
                    Search
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        <Grid
          container
          sx={{
            margin: "1rem 0",
          }}
        >
          <Grid item xs={3.5}>
            <TripsFilters
              sortBy={sortBy}
              onSortByChange={handleSortByChange}
              onResetFilters={handleResetFilters}
            />
          </Grid>
          <Grid item xs={0.5}></Grid>

          {data && data.searchTrips.length === 0 && (
            <Grid item xs={8}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CardContent>No results.</CardContent>
              </Card>
            </Grid>
          )}

          {loading ? (
            <Grid item xs={8}>
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CardContent>
                  <CircularProgress size={80} />
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <Grid item xs={8}>
              {data && <TripsList trips={data.searchTrips} />}
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
}
