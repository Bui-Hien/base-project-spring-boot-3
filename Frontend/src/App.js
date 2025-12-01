import "./i18n";
import React, { memo, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AppLayout from "./common/Layout/AppLayout";
import routes from "./RootRoutes";
import ConstantList, { FORGOT_PASSWORD, LOGIN_PAGE, REGISTER, RESET_PASSWORD } from "./appConfig";
import LoginIndex from "./views/Login/LoginIndex";
import { useStore } from "./stores";
import { ToastContainer } from "react-toastify";
import Loading from "./common/Layout/Loading";
import ResetPasswordForm from "./views/User/ResetPasswordForm";
import ForgotPasswordForm from "./views/User/ForgotPasswordForm";
import RegisterUserForm from "./views/User/RegisterUserForm";
import { findMatchingRoute, hasRequiredRole, isRouteProtected } from "./LocalFunction";
import { HelmetProvider } from "react-helmet-async";
import { observer } from "mobx-react-lite";

const PUBLIC_ROUTES = [LOGIN_PAGE, RESET_PASSWORD, FORGOT_PASSWORD, REGISTER, ConstantList.PROFILE, "/account-shop", "/guarantee", "/notification", "/instruct"];

function AppWrapper () {
  const navigate = useNavigate ();
  const {pathname} = useLocation ();
  const [isLoading, setIsLoading] = useState (true);
  const configLoadedRef = useRef (false);

  const {authStore, systemConfigStore} = useStore ();
  const {getCurrentUser, roles, currentUser} = authStore;
  const {handleGetAllSystemConfig} = systemConfigStore;

  const routeNeedsAuth = useMemo (() => isRouteProtected (pathname, routes), [pathname]);
  const isPublicRoute = useMemo (() => PUBLIC_ROUTES.includes (pathname), [pathname]);

  // Init auth on mount
  useEffect (() => {
    (async () => {
      try {
        const token = localStorage.getItem ("access_token");

        if (!token && routeNeedsAuth) {
          navigate (LOGIN_PAGE);
          return;
        }

        if (token) {
          const user = await getCurrentUser ();
          if (!user) {
            localStorage.clear ();
            if (routeNeedsAuth) navigate (LOGIN_PAGE);
          }
        }
      } catch (error) {
        localStorage.clear ();
        if (routeNeedsAuth) navigate (LOGIN_PAGE);
      } finally {
        setIsLoading (false);
      }
    }) ();

    if (!configLoadedRef.current) {
      configLoadedRef.current = true;
      // handleGetAllSystemConfig ();
    }
  }, []);

  // Check permission when route changes
  useEffect (() => {
    if (isLoading || !routeNeedsAuth) return;

    const requiredRoles = findMatchingRoute (pathname, routes)?.auth || [];
    if (!hasRequiredRole (roles, requiredRoles)) {
      navigate ("/404");
    }
  }, [pathname, roles, routeNeedsAuth, isLoading, navigate]);

  if (isLoading) return <Loading/>;
  if (routeNeedsAuth && !roles?.length && !isPublicRoute) return <Loading/>;

  return (
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path={LOGIN_PAGE} element={<LoginIndex/>}/>
          <Route path={RESET_PASSWORD} element={<ResetPasswordForm/>}/>
          <Route path={FORGOT_PASSWORD} element={<ForgotPasswordForm/>}/>
          <Route path={REGISTER} element={<RegisterUserForm/>}/>
          <Route path="/*" element={<AppLayout routes={routes}/>}/>
        </Routes>
      </Suspense>
  );
}

function App () {
  return (
      <HelmetProvider>
        <BrowserRouter>
          <AppWrapper/>
          <ToastContainer position="top-right" limit={3}/>
        </BrowserRouter>
      </HelmetProvider>
  );
}

export default memo (observer (App));
