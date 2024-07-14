import { useState, useEffect } from "react";

import {
  Alert,
  Container,
  Card,
  Typography,
  CardContent,
  Grid,
  TextField,
  Box,
  Divider,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import { calculateEndTime } from "@/utils/utils";
import { useMutation } from "@apollo/client";
import { CREATE_TRIP } from "@/graphql/mutations/trip";

import { useRouter } from "next/router";

dayjs.extend(utc);

export default function NewTrip() {
  const router = useRouter();

  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [date, setDate] = useState(null);
  const [price, setPrice] = useState(0);
  const [numberOfPassengers, setNumberOfPassengers] = useState(0);
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [licensePlateNumber, setLicensePlateNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState(0);

  const [createTrip, { data, loading, error }] = useMutation(CREATE_TRIP);

  useEffect(() => {
    if (startTime && estimatedDuration) {
      const calculatedEndTime = calculateEndTime(
        startTime,
        Number(estimatedDuration)
      );
      setEndTime(calculatedEndTime);
    }
  }, [startTime, estimatedDuration]);

  const handleCreateTrip = async (e) => {
    try {
      e.preventDefault();

      const { data } = await createTrip({
        variables: {
          input: {
            startLocation,
            endLocation,
            date: date ? dayjs(date).utc().toISOString() : null,
            startTime,
            estimatedDuration,
            endTime,
            price,
            status: "new",
            numberOfPassengers,
            vehicleType,
            vehicleModel,
            licensePlateNumber,
            stopLocations: "",
          },
        },
      });

      setTimeout(() => {
        router.push(`/trips/${data.createTrip.id}`);
      }, 1000);
    } catch (error) {
      console.error("Create trip error:", e);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="md">
        {error && (
          <Alert style={{ marginBottom: "1rem" }} severity="error">
            Error : {error.message}
          </Alert>
        )}

        {data && data.createTrip && (
          <Alert style={{ marginBottom: "1rem" }} severity="success">
            Trip successfully created. Redirecting...
          </Alert>
        )}

        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Create a Trip
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Share your ride and connect with others.
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={handleCreateTrip}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12}>
                  <Typography
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    Departure & Destination :
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="departure"
                    label="Departure"
                    name="departure"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="destination"
                    label="Destination"
                    name="destination"
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    Date :
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    required
                    fullWidth
                    label="Date"
                    format="DD/MM/YYYY"
                    sx={{ width: "100%" }}
                    value={date}
                    onChange={(newValue) => setDate(dayjs(newValue))}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    Start time & duration :
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    required
                    fullWidth
                    id="startTime"
                    label="Start time"
                    name="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    helperText={`format : "08:00"`}
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    required
                    fullWidth
                    id="estimatedDuration"
                    label="Estimated duration"
                    name="estimatedDuration"
                    value={estimatedDuration || ""}
                    onChange={(e) =>
                      setEstimatedDuration(
                        e.target.value === "" ? 0 : parseInt(e.target.value, 10)
                      )
                    }
                    helperText={`in minutes : 120 (for 2 hours)`}
                    type="number"
                  />
                </Grid>

                <Grid item xs={4}>
                  <TextField
                    required
                    disabled
                    fullWidth
                    id="endTime"
                    label="Generated end time"
                    name="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    Price :
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="price"
                    label="Price"
                    name="price"
                    value={price || ""}
                    onChange={(e) =>
                      setPrice(
                        e.target.value === "" ? 0 : parseFloat(e.target.value)
                      )
                    }
                    type="number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    sx={{ fontWeight: "bold", textDecoration: "underline" }}
                  >
                    Vehicle & Passengers :
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <RadioGroup
                      row
                      name="vehicleType"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                    >
                      <FormControlLabel
                        control={<Radio value="car" />}
                        label="Car"
                      />
                      <FormControlLabel
                        control={<Radio value="bus" />}
                        label="Bus"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="numberOfPassengers"
                    label="Number of passengers"
                    name="numberOfPassengers"
                    value={numberOfPassengers || ""}
                    onChange={(e) =>
                      setNumberOfPassengers(
                        e.target.value === "" ? 0 : parseInt(e.target.value, 10)
                      )
                    }
                    type="number"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="vehicleModel"
                    label="Vehicle model"
                    name="vehicleModel"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="licensePlateNumber"
                    label="License plate number"
                    name="licensePlateNumber"
                    value={licensePlateNumber}
                    onChange={(e) => setLicensePlateNumber(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={loading}
                  >
                    Create trip
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
