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
  FormHelperText,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

import { calculateEndTime } from "@/utils/utils";
import { useMutation } from "@apollo/client";
import { CREATE_TRIP } from "@/graphql/mutations/trip";

import { useRouter } from "next/router";

import { z } from "zod";

dayjs.extend(utc);

interface CustomDatePickerProps {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  error?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  error,
}) => (
  <DatePicker
    label="Date"
    value={value}
    onChange={onChange}
    format="DD/MM/YYYY"
    slotProps={{
      textField: {
        required: true,
        fullWidth: true,
        sx: { width: "100%" },
        error: !!error,
        helperText: error,
      },
    }}
  />
);

export const tripSchema = z.object({
  startLocation: z.string().min(1, "Start location is required"),
  endLocation: z.string().min(1, "End location is required"),
  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "That's not a date!",
  }),
  price: z
    .number()
    .min(0, "Price must be a positive number")
    .refine((val) => !isNaN(val), "Price must be a valid number"),
  numberOfPassengers: z
    .number()
    .int()
    .min(1, "At least one passenger is required"),
  vehicleType: z.enum(["car", "bus"], {
    required_error: "Vehicle type is required",
  }),
  vehicleModel: z.string().optional(),
  licensePlateNumber: z.string().optional(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  estimatedDuration: z
    .number()
    .int()
    .min(1, "Duration must be at least 1 minute"),
  endTime: z.string().optional(),
});

export type TripFormData = z.infer<typeof tripSchema>;

export default function NewTrip() {
  const router = useRouter();

  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [date, setDate] = useState<Dayjs | null>(null);
  const [price, setPrice] = useState(0);
  const [numberOfPassengers, setNumberOfPassengers] = useState(0);
  const [vehicleType, setVehicleType] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [licensePlateNumber, setLicensePlateNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState(0);

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof TripFormData, string>>
  >({});

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

  const handleCreateTrip = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: TripFormData = {
      startLocation,
      endLocation,
      date: date ? date.toDate() : new Date(),
      price,
      numberOfPassengers,
      vehicleType: vehicleType as "car" | "bus",
      vehicleModel,
      licensePlateNumber,
      startTime,
      estimatedDuration,
      endTime,
    };

    try {
      tripSchema.parse(formData);

      setFormErrors({});

      const { data } = await createTrip({
        variables: {
          input: {
            ...formData,
            date: dayjs(formData.date).utc().toISOString(),
            status: "new",
            stopLocations: "",
          },
        },
      });

      setTimeout(() => {
        router.push(`/trips/${data.createTrip.id}`);
      }, 1000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof TripFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path[0] as keyof TripFormData] = err.message;
          }
        });
        setFormErrors(errors);
      } else {
        console.error("Create trip error:", error);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <Container component="main" maxWidth="md" sx={{ marginTop: "-8rem" }}>
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
                    error={!!formErrors.startLocation}
                    helperText={formErrors.startLocation}
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
                    error={!!formErrors.endLocation}
                    helperText={formErrors.endLocation}
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
                  <CustomDatePicker
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                    error={formErrors.date}
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
                    error={!!formErrors.startTime}
                    helperText={formErrors.startTime || `format : "08:00"`}
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
                    error={!!formErrors.estimatedDuration}
                    helperText={
                      formErrors.estimatedDuration ||
                      `in minutes : 120 (for 2 hours)`
                    }
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
                    error={!!formErrors.price}
                    helperText={formErrors.price}
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
                  <FormControl error={!!formErrors.vehicleType}>
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
                    {formErrors.vehicleType && (
                      <FormHelperText>{formErrors.vehicleType}</FormHelperText>
                    )}
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
                    error={!!formErrors.numberOfPassengers}
                    helperText={formErrors.numberOfPassengers}
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
