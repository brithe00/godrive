import { useState } from "react";

import {
  Alert,
  Container,
  Card,
  Typography,
  Button,
  CardContent,
  Grid,
  TextField,
  Box,
  Divider,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function NewTrip() {
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");

  return (
    <>
      <Container component="main" maxWidth="md">
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Trip
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create a new trip.
            </Typography>

            <Box
              component="form"
              noValidate
              //onSubmit={}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2} mt={0.5}>
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

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    fullWidth
                    label="Date de naissance"
                    format="DD/MM/YYYY"
                    sx={{ width: "100%" }}
                    //value={birthdate}
                    //onChange={(newValue) => setBirthdate(newValue)}
                  />
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

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel id="number-of-passengers-label">
                      Number of passengers
                    </InputLabel>
                    <Select
                      labelId="number-of-passengers-label"
                      id="number-of-passengers"
                      name="number-of-passengers"
                      //value={age}
                      label="Number of passengers"
                      //onChange={handleChange}
                    >
                      <MenuItem value={10}>1</MenuItem>
                      <MenuItem value={20}>2</MenuItem>
                      <MenuItem value={30}>3</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
