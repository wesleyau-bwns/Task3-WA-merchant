import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import { Box, Typography, Stack, Avatar } from "@mui/material";
import MenuContent from "./MenuContent";
import { useAuth } from "../contexts/AuthContext";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: "border-box",
  },
});

export default function SideMenu() {
  const { merchant } = useAuth();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: "background.paper",
        },
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Avatar
          alt={merchant?.name}
          src={merchant?.avatar}
          sx={{ width: 32, height: 32 }}
        >
          {merchant?.name ? merchant.name.charAt(0).toUpperCase() : "?"}
        </Avatar>
        <Box sx={{ mr: "auto" }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {merchant?.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {merchant?.email}
          </Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}
