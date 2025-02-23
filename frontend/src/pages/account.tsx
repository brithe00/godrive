import { useState, useEffect } from "react";

import { z } from "zod";

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
  Link,
  Avatar,
} from "@mui/material";

import LoadingButton from "@mui/lab/LoadingButton";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useApolloClient, useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import { useDispatch, useSelector } from "react-redux";

import {
  CHANGE_PASSWORD_MUTATION,
  DELETE_ME_MUTATION,
  UPDATE_ME_MUTATION,
} from "@/graphql/mutations/user";

import { updateCurrentUser } from "@/slices/userSlice";

import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);

import { styled } from "@mui/material/styles";
import { RootState } from "@/types/types";
import { ME } from "@/graphql/queries/user";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const updateMeSchema = z.object({
  firstname: z.string().min(1, "Firstname is required"),
  lastname: z.string().min(1, "Lastname is required"),
  phoneNumber: z.string().optional(),
  description: z.string().optional(),
  birthdate: z.date().optional(),
  pictureUrl: z.string().optional(),
});

type UpdateMeFormData = z.infer<typeof updateMeSchema>;

export default function Account() {
  const router = useRouter();
  const dispatch = useDispatch();
  const client = useApolloClient();

  const me = useSelector((state: RootState) => state.user.currentUser);

  const [firstname, setFirstname] = useState(me?.firstname || "");
  const [lastname, setLastname] = useState(me?.lastname || "");
  const [phoneNumber, setPhoneNumber] = useState(me?.phoneNumber || "");
  const [description, setDescription] = useState(me?.description || "");
  const [birthdate, setBirthdate] = useState<Dayjs | null>(
    me?.birthdate ? dayjs(me.birthdate) : null
  );

  const [file, setFile] = useState<File | null>(null);
  const [pictureUrl, setPictureUrl] = useState(me?.pictureUrl || "");

  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");

  const [updateMeErrors, setUpdateMeErrors] = useState<
    Partial<UpdateMeFormData>
  >({});

  const [
    updateMe,
    { data: dataUpdateMe, loading: loadingUpdateMe, error: errorUpdateMe },
  ] = useMutation(UPDATE_ME_MUTATION);

  const [changeMyPassword, { data, loading, error }] = useMutation(
    CHANGE_PASSWORD_MUTATION
  );

  const [
    deleteMe,
    { data: dataDeleteMe, loading: loadingDeleteMe, error: errorDeleteMe },
  ] = useMutation(DELETE_ME_MUTATION, {
    onCompleted: () => {
      handleCloseModal();
      localStorage.removeItem("token");
      router.push("/login");
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleClickOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleSubmitUpdateMe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: UpdateMeFormData = {
      firstname,
      lastname,
      phoneNumber,
      description,
      birthdate: birthdate ? birthdate.toDate() : undefined,
      pictureUrl,
    };

    try {
      updateMeSchema.parse(formData);
      setUpdateMeErrors({});

      const { data } = await updateMe({
        variables: {
          input: {
            ...formData,
            birthdate: formData.birthdate?.toISOString(),
          },
        },
      });

      if (data && data.updateMe) {
        dispatch(updateCurrentUser(data.updateMe));

        await client.query({
          query: ME,
          fetchPolicy: "network-only",
        });
      }
    } catch (e) {
      if (e instanceof z.ZodError) {
        setUpdateMeErrors(e.flatten().fieldErrors);
      } else {
        console.error("Update me error:", e);
      }
    }
  };

  const handleSubmitNewPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    try {
      e.preventDefault();
      await changeMyPassword({
        variables: { input: { password, repeatedPassword } },
      });
      setPassword("");
      setRepeatedPassword("");
    } catch (e) {
      console.error("Change password error:", e);
    }
  };

  const handleDeleteMyAccount = async () => {
    try {
      await deleteMe();
    } catch (e) {
      console.error("Error deleting account:", e);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordRepeat = () =>
    setShowPasswordRepeat((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseDownPasswordRepeat = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPictureUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Container component="main" maxWidth="md">
        <Card>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Box>
                <Typography gutterBottom variant="h5" component="div">
                  My account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  My personal information
                </Typography>
              </Box>
              <Box>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => {
                    router.push(`/users/${me?.id}`);
                  }}
                >
                  My public profile
                </Link>
              </Box>
            </Box>

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmitUpdateMe}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12}>
                  {dataUpdateMe && dataUpdateMe.updateMe && (
                    <Alert severity="success">
                      Personal information changed !
                    </Alert>
                  )}

                  {errorUpdateMe && (
                    <Alert severity="error">
                      Error : {errorUpdateMe.message}
                    </Alert>
                  )}
                </Grid>

                <Grid item xs={12} mb={2}>
                  <Box>
                    <LoadingButton
                      loading={loadingUpdateMe}
                      component="label"
                      role={undefined}
                      variant="outlined"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                    >
                      Upload file
                      <VisuallyHiddenInput
                        onChange={handleFileChange}
                        type="file"
                      />
                    </LoadingButton>
                  </Box>

                  {file && (
                    <Box mt={2}>
                      <Typography variant="body2">
                        Selected file: {file.name}
                      </Typography>
                      {pictureUrl && (
                        <Box mt={2} display="flex" justifyContent="center">
                          <Avatar
                            src={pictureUrl}
                            alt="Uploaded Picture"
                            sx={{ width: 100, height: 100 }}
                          />
                        </Box>
                      )}
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    fullWidth
                    id="firstname"
                    label="Firstname"
                    name="firstname"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    error={!!updateMeErrors.firstname}
                    helperText={updateMeErrors.firstname}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="family-name"
                    fullWidth
                    id="lastname"
                    label="Lastname"
                    name="lastname"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    error={!!updateMeErrors.lastname}
                    helperText={updateMeErrors.lastname}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="phoneNumber"
                    label="Phone number"
                    name="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                    label="Birthdate"
                    format="DD/MM/YYYY"
                    sx={{ width: "100%" }}
                    value={birthdate}
                    onChange={(newValue) => setBirthdate(newValue)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="outlined-multiline-static"
                    label="Description"
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={loadingUpdateMe}
                  >
                    Save
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    disabled
                    autoComplete="email"
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    value={me?.email || ""}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>
              </Grid>
            </Box>

            <Box component="form" noValidate onSubmit={handleSubmitNewPassword}>
              <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12}>
                  {data && data.changeMyPassword && (
                    <Alert severity="success">Password modified !</Alert>
                  )}

                  {error && (
                    <Alert severity="error">Error : {error.message}</Alert>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">
                      New password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="New password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password-repeat">
                      Repeat new password
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password-repeat"
                      type={showPasswordRepeat ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordRepeat}
                            onMouseDown={handleMouseDownPasswordRepeat}
                            edge="end"
                          >
                            {showPasswordRepeat ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Repeat new password"
                      value={repeatedPassword}
                      onChange={(e) => setRepeatedPassword(e.target.value)}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    loading={loading}
                  >
                    Save
                  </LoadingButton>
                </Grid>
              </Grid>
            </Box>

            <Box>
              <Grid container spacing={2} mt={0.5}>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12} container justifyContent="flex-end">
                  <Button
                    size="small"
                    color="error"
                    onClick={handleClickOpenModal}
                  >
                    Delete account
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>
      </Container>
      <Dialog
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete account</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action is irreversible and will permanently delete your your
            account. There is no going back.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <LoadingButton
            onClick={handleDeleteMyAccount}
            color="error"
            loading={loadingDeleteMe}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
