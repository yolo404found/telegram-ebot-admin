import { AppBar, IconButton, Toolbar, Typography, styled } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 200,
    width: `calc(100% - ${200}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface AdminNavbarProps {
  open: boolean;
  handleDrawerOpen: () => void;
}

export const AdminNavbar = ({ open, handleDrawerOpen }: AdminNavbarProps) => {
  return (
    <StyledAppBar position="fixed" open={open}>
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon sx={{width:20,height:20}}/>
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Admin Dashboard
        </Typography>
      </Toolbar>
    </StyledAppBar>
  );
};
