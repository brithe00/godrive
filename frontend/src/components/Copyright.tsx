import Typography from "@mui/material/Typography";
import Link from "next/link";

interface CopyrightProps {
  [key: string]: any;
}

export default function Copyright(props: CopyrightProps) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        GoDrive
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
