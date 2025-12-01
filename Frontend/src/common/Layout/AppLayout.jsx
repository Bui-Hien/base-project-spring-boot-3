import * as React from 'react';
import { memo } from 'react';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Button, Menu, MenuItem, Tooltip } from "@mui/material";
import { useStore } from "../../stores";
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";
import { navigations } from "../../navigations";
import { API_ENDPOINT, HOME_PAGE, LOGIN_PAGE, PROFILE } from "../../appConfig";
import AlertDialog from "../CommonConfirmationDialog";
import Loading from "./Loading";
import SEO from "../Component/SEO";
import { formatMoney } from "../../LocalFunction";
import Avatar from "@mui/material/Avatar";
import NotFound from "./NotFound";

// Bảng màu mới - Hiện đại và hài hòa hơn
const COLORS = {
  rootActiveBg:'#8b5cf6',      // Purple-500 cho cha cấp 1
  parentActiveBg:'#6366f1',    // Indigo-500 cho cha từ cấp 2
  itemActiveBg:'#10b981',      // Emerald-500 cho item được chọn
  activeText:'white',          // Chữ trắng cho các item active
  hoverBg:'rgba(255, 255, 255, 0.08)', // Hover effect nhẹ
};
// Màu theme tổng thể (Header + Nav)
const THEME = {
  headerBg:"#0F0F1A",
  navBg:"#0F0F1A",
  navGradient:"linear-gradient(to bottom, #0F0F1A, #0F0F1A)", // nếu bạn vẫn muốn gradient nhưng cùng màu
};
const DRAWER_WIDTH = 240;

function AppLayout ({routes}) {
  const navigate = useNavigate ();
  const location = useLocation ();
  const [open, setOpen] = React.useState (true);
  const [expandedItems, setExpandedItems] = React.useState ({});
  const {authStore, callApiLoadingStore} = useStore ();
  const {isLoading:apiLoading, activeRequests} = callApiLoadingStore;
  const [anchorElUser, setAnchorElUser] = React.useState (null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser (event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser (null);
  };

  const {
    roles,
    currentUser,
    handleLogout:handleLogoutStore
  } = authStore;

  const handleLogout = async () => {
    await handleLogoutStore ();
    setShouldOpenLogout (false);
    navigate (LOGIN_PAGE);
  };

  const [shouldOpenLogout, setShouldOpenLogout] = React.useState (false);

  const toggleExpand = (itemPath) => {
    setExpandedItems (prev => ({
      ... prev,
      [itemPath]:!prev[itemPath]
    }));
  };

  const hasActiveChild = (item, currentPath) => {
    if (!item.children) return false;
    return item.children.some (child =>
        child.path === currentPath ||
        (child.children && hasActiveChild (child, currentPath))
    );
  };

  const renderNavItems = (items, level = 0, parentPath = '') => {
    return items
        .filter (item => item.isVisible && ((!item.auth || item.auth.some (role => roles?.includes (role)))))
        ?.map ((item) => {
          const itemPath = parentPath? `${parentPath}/${item.name}` : item.name;
          const isActive = location.pathname === item.path;
          const hasActiveChildren = hasActiveChild (item, location.pathname);
          const isExpanded = expandedItems[itemPath];

          let bgColor = 'transparent';
          if (isActive) {
            bgColor = COLORS.itemActiveBg;
          } else if (hasActiveChildren) {
            bgColor = level === 0? COLORS.rootActiveBg : COLORS.parentActiveBg;
          }

          const textColor = hasActiveChildren || isActive
              ? COLORS.activeText
              : THEME.navText || 'rgba(255,255,255,0.9)';

          if (item.children?.length) {
            const visibleChildren = item.children.filter (
                child => child.isVisible && (!child.auth || child.auth.some (role => roles?.includes (role)))
            );

            if (visibleChildren.length === 0) return null;
            const shouldRenderChildren = open && isExpanded;

            return (
                <div key={`${item.name}-${level}`}>
                  <Tooltip title={!open && item.name}>
                    <ListItemButton
                        sx={{
                          paddingLeft:open? `${8 + (level * 16)}px` : '8px',
                          backgroundColor:bgColor,
                          color:textColor,
                          transition:'all 0.2s ease',
                          '&:hover':{
                            backgroundColor:COLORS.hoverBg || THEME.hoverBg,
                          }
                        }}
                        className={`flex !justify-center h-12 ${!open && '!p-0'}`}
                        onClick={() => {
                          toggleExpand (itemPath);
                          if (item.path) {
                            navigate (visibleChildren[0]?.path || '#');
                          }
                          setOpen (true);
                        }}
                    >
                      <ListItemIcon sx={{color:textColor, minWidth:40}} className={"px-2 !min-w-0"}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                          primary={item.name}
                          sx={{opacity:open? 1 : 0}}
                          className={`${!open && 'hidden'}`}
                          primaryTypographyProps={{
                            fontSize:'0.9rem',
                            fontWeight:hasActiveChildren || isActive? 600 : 400
                          }}
                      />
                      {open && (
                          isExpanded? <ExpandMore/> : <ChevronRight/>
                      )}
                    </ListItemButton>
                  </Tooltip>
                  {shouldRenderChildren && renderNavItems (visibleChildren, level + 1, itemPath)}
                </div>
            );
          }

          return (
              <ListItem
                  key={`${item.name}-${level}`}
                  disablePadding
                  sx={{backgroundColor:isActive? COLORS.itemActiveBg : 'transparent'}}
              >
                <Tooltip title={!open && item.name}>
                  <ListItemButton
                      sx={{
                        paddingLeft:open? `${8 + (level * 16)}px` : '8px',
                        color:textColor,
                        transition:'all 0.2s ease',
                        '&:hover':{
                          backgroundColor:isActive? COLORS.itemActiveBg : COLORS.hoverBg,
                        }
                      }}
                      onClick={() => {
                        navigate (item.path)
                        setOpen (true);
                      }}
                      className={"flex justify-center h-12"}
                  >
                    <ListItemIcon sx={{color:textColor, minWidth:40}}
                                  className={"px-2 !min-w-0"}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.name}
                        sx={{opacity:open? 1 : 0}}
                        primaryTypographyProps={{
                          fontSize:'0.9rem',
                          fontWeight:isActive? 600 : 400
                        }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
          );
        });
  };

  return (
      <div className={"overflow-y-auto"}>
        <SEO
            title="Sullrolx - Mua bán tài khoản Roblox uy tín, giá rẻ"
            description="Sullrolx là nền tảng chuyên cung cấp tài khoản Roblox chất lượng, bảo hành nhanh chóng, hỗ trợ 24/7. Mua acc Roblox an toàn, giao dịch tự động, giá cực tốt!"
            name="Sullrolx"
            imageUrl="/img/logo_2.png"
        />
        <CssBaseline/>

        {/* AppBar - Gradient đẹp hơn */}
        <header
            className="fixed top-0 z-[1201] transition-all duration-300 ease-sharp ml-0 w-full shadow-lg"
            style={{backgroundColor:THEME.headerBg}}
        >
          <Toolbar className={"flex justify-between"}>
            <div className="flex items-center">
              <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={() => setOpen (!open)}
                  edge="start"
                  className="hover:bg-white/10 transition-colors"
              >
                <MenuIcon className={"text-white"}/>
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                <img
                    src="/img/logo.png"
                    alt="Logo"
                    className="object-contain h-[55px] w-auto cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => {
                      navigate (HOME_PAGE);
                    }}
                />
              </Typography>
            </div>
            {currentUser?.id? (
                <div
                    className="flex items-center justify-end bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl text-white space-x-3 px-4 py-2 shadow-md">
                  <div className="flex flex-col items-end">
                    <span
                        className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      {currentUser?.vipLevel?.name || "Vip 0"}
                    </span>
                    <span className="text-xs text-gray-300 tracking-wide font-medium">
                      {formatMoney (currentUser?.wallet?.balance || 0)}
                    </span>
                  </div>
                  <div className="relative">
                    <IconButton
                        onClick={handleOpenUserMenu}
                        sx={{p:0}}
                        className="transition-all duration-200 hover:scale-110 focus:outline-none ring-2 ring-transparent hover:ring-purple-400 rounded-full"
                    >
                      <Avatar
                          alt={currentUser?.username}
                          src={`${API_ENDPOINT}/api/file-description/public/${currentUser?.avatar?.id}`}
                          className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 text-white font-semibold"
                      />
                    </IconButton>

                    <Menu
                        sx={{mt:'45px'}}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                          vertical:'top',
                          horizontal:'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical:'top',
                          horizontal:'right',
                        }}
                        open={Boolean (anchorElUser)}
                        onClose={handleCloseUserMenu}
                        PaperProps={{
                          className:
                              'rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 min-w-[150px]',
                        }}
                    >
                      <MenuItem
                          onClick={() => {
                            handleCloseUserMenu ();
                            navigate (PROFILE)
                          }}
                          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20"
                      >
                        <Typography className="w-full text-center text-gray-800 dark:text-gray-100 text-sm font-medium">
                          Profile
                        </Typography>
                      </MenuItem>
                      <MenuItem
                          onClick={() => {
                            handleCloseUserMenu ();
                            setShouldOpenLogout (true);
                          }}
                          className="hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Typography className="w-full text-center text-red-500 font-semibold text-sm">
                          Đăng xuất
                        </Typography>
                      </MenuItem>
                    </Menu>
                  </div>
                </div>
            ) : (
                <div className="flex items-center justify-end gap-3 rounded-xl px-4 py-2.5">
                  <Button
                      variant="contained"
                      className="!bg-gradient-to-r !from-blue-600 !to-blue-700 hover:!from-blue-700 hover:!to-blue-800 !text-white !font-semibold !text-sm !rounded-lg !px-6 !py-2.5 !shadow-lg hover:!shadow-xl !transition-all !duration-200 hover:!scale-105"
                      onClick={() => navigate (LOGIN_PAGE)}
                  >
                    Đăng nhập
                  </Button>

                  <Button
                      variant="outlined"
                      color="inherit"
                      size="small"
                      className="!text-white !border-2 !border-white/70 hover:!bg-white/20 hover:!border-white !text-xs !rounded-lg !px-5 !py-2 !font-semibold !backdrop-blur-sm !transition-all !duration-300 !transform hover:!scale-105"
                      onClick={() => navigate ("/register")}
                  >
                    Đăng ký
                  </Button>
                </div>
            )}
          </Toolbar>
        </header>

        <div className="flex min-h-screen">
          {/* Drawer - Màu gradient đẹp hơn */}
          {open && (
              <aside
                  className="fixed top-0 left-0 h-full z-50 overflow-hidden transition-all duration-300 ease-sharp flex-shrink-0 whitespace-nowrap box-border flex flex-col shadow-2xl"
                  style={{
                    width:open? `${DRAWER_WIDTH}px` : 'calc(theme(spacing.7) + 1px)',
                    background:THEME.navBg,
                  }}
              >
                <div className="flex items-center justify-end p-2 min-h-[64px] flex-shrink-0"/>
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                  <List className="!py-2 !px-2">{renderNavItems (navigations)}</List>
                </div>
              </aside>
          )}

          {/* Main Content */}
          <main
              className="flex-1 h-screen overflow-y-auto transition-all duration-300 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100"
              style={{
                marginLeft:open? `${DRAWER_WIDTH}px` : 0,
                width:open? `calc(100% - ${DRAWER_WIDTH}px)` : '100%',
              }}
          >
            <div className="min-h-[64px]"/>
            <div className="animate-fadeIn pb-4">
              <Routes>
                <Route path="/" element={<Navigate to={HOME_PAGE} replace/>}/>
                {routes?.map ((item, index) => {
                  const hasAccess = !item.auth || item.auth.some (role => roles.includes (role));
                  if (hasAccess) {
                    return (
                        <Route
                            key={index}
                            path={item.path}
                            element={React.createElement (item.component)}
                        />
                    );
                  }
                  return null;
                })}
                <Route path="*" element={<NotFound/>}/>
              </Routes>
            </div>
          </main>
        </div>

        {shouldOpenLogout && (
            <AlertDialog
                open={shouldOpenLogout}
                onConfirmDialogClose={() => setShouldOpenLogout (false)}
                onYesClick={handleLogout}
                title={"Bạn có chắc muốn đăng xuất không?"}
                text={`Đăng xuất tài khoản ${currentUser?.displayName}`}
                agree={"Đăng xuất"}
                cancel={"Hủy"}
            />
        )}
        {apiLoading && <Loading/>}
        {activeRequests}
      </div>
  );
}

export default memo (observer (AppLayout));

AppLayout.propTypes = {
  routes:PropTypes.arrayOf (
      PropTypes.shape ({
        path:PropTypes.string.isRequired,
        exact:PropTypes.bool,
        component:PropTypes.elementType.isRequired,
        auth:PropTypes.arrayOf (PropTypes.string),
      })
  ).isRequired,
};