import {
  Card,
  Typography,
  CardContent,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

const SortBy = {
  DATE: "DATE",
  START_TIME: "START_TIME",
  PRICE: "PRICE",
};

export default function TripsFilters({
  sortBy,
  onSortByChange,
  onResetFilters,
}) {
  const handleSortByChange = (event) => {
    const { value } = event.target;
    onSortByChange(value);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.5rem",
              }}
            >
              <Typography sx={{ fontWeight: "bold" }}>Filter by</Typography>
              <Typography
                sx={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={onResetFilters}
              >
                Reset all
              </Typography>
            </Box>
            <Box>
              <FormControl>
                <RadioGroup name="radio-buttons-group">
                  <FormControlLabel
                    control={
                      <Radio
                        onChange={handleSortByChange}
                        value={SortBy.DATE}
                        checked={sortBy.includes(SortBy.DATE)}
                      />
                    }
                    label="Date"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        onChange={handleSortByChange}
                        value={SortBy.START_TIME}
                        checked={sortBy.includes(SortBy.START_TIME)}
                      />
                    }
                    label="Start time"
                  />
                  <FormControlLabel
                    control={
                      <Radio
                        onChange={handleSortByChange}
                        value={SortBy.PRICE}
                        checked={sortBy.includes(SortBy.PRICE)}
                      />
                    }
                    label="Price"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            <Box>
              <Divider />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
