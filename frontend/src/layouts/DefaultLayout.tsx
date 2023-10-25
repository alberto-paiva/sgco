// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { AppFooter } from "components/Footer.tsx";
import { AppNavbar } from "components/navbar/AppNavbar.tsx";
import { AppSidebar } from "components/sidebar/AppSidebar.tsx";
import { useEventListener, useUnmountEffect } from "primereact/hooks";
import { classNames } from "primereact/utils";
import { type ReactNode, useEffect, useState } from "react";
import {
  initialLayoutConfig,
  initialLayoutState,
  type LayoutConfig,
  type LayoutState,
} from "./LayoutContext";
import AuthService from "@/services/auth.service.ts";

interface DefaultLayoutProps {
  title?: string;
  children?: ReactNode;
}

export function DefaultLayout({ title, children }: DefaultLayoutProps) {
  const [layoutConfig, setLayoutConfig] =
    useState<LayoutConfig>(initialLayoutConfig);
  const [layoutState, setLayoutState] =
    useState<LayoutState>(initialLayoutState);
  const [loggedUser, setLoggedUser] = useState<UsuarioData>();

  const isDesktop = () => window.innerWidth > 991;
  const isOverlay = () => layoutConfig.menuMode === "overlay";

  const toggleMenu = () => {
    setLayoutState((prevLayoutState) => {
      const overlayMenuActive = isOverlay()
        ? !prevLayoutState.overlayMenuActive
        : false;
      const staticMenuDesktopInactive = isDesktop()
        ? !prevLayoutState.staticMenuDesktopInactive
        : false;
      const staticMenuMobileActive = !isDesktop()
        ? !prevLayoutState.staticMenuMobileActive
        : false;

      return {
        ...prevLayoutState,
        overlayMenuActive,
        staticMenuDesktopInactive,
        staticMenuMobileActive,
      };
    });
  };

  const profileSidebarToggle = () => {
    setLayoutConfig((prev) => prev);

    const changeProfileState = () => {
      const profileSidebarActive = layoutState.profileSidebarVisible;
      setLayoutState({
        ...layoutState,
        profileSidebarVisible: !profileSidebarActive,
      });
    };

    changeProfileState();
  };

  const blockBodyScroll = () => {
    document.body.classList.add("blocked-scroll");
  };
  const unblockBodyScroll = () => {
    document.body.classList.remove("blocked-scroll");
  };

  const hideMenu = () => {
    setLayoutState((prevLayoutState: LayoutState) => ({
      ...prevLayoutState,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
    unbindMenuOutsideClickListener();
    unblockBodyScroll();
  };

  const handleOutsideClick = (event: Event) => {
    const isOutsideClicked = (event.target as HTMLElement).classList.contains(
      "layout-mask",
    );
    if (isOutsideClicked) {
      hideMenu();
    }
  };

  const [bindMenuOutsideClickListener, unbindMenuOutsideClickListener] =
    useEventListener({
      type: "click",
      listener: handleOutsideClick,
    });

  const hideProfileMenu = () => {
    setLayoutState((prevLayoutState: LayoutState) => ({
      ...prevLayoutState,
      profileSidebarVisible: false,
    }));
    unbindProfileMenuOutsideClickListener();
  };

  const handleProfileMenuOutsideClick = (event: Event) => {
    const isOutsideClicked = !(event.target as HTMLElement).classList.contains(
      "layout-topbar-menu-mobile-active",
    );
    if (isOutsideClicked) {
      hideProfileMenu();
    }
  };

  const [
    bindProfileMenuOutsideClickListener,
    unbindProfileMenuOutsideClickListener,
  ] = useEventListener({
    type: "click",
    listener: handleProfileMenuOutsideClick,
  });

  useEffect(() => {
    if (layoutState.overlayMenuActive || layoutState.staticMenuMobileActive) {
      bindMenuOutsideClickListener();
    }

    if (layoutState.staticMenuMobileActive) {
      blockBodyScroll();
    }

    return () => {
      unbindMenuOutsideClickListener();
    };
  }, [
    bindMenuOutsideClickListener,
    layoutState.overlayMenuActive,
    layoutState.staticMenuMobileActive,
    unbindMenuOutsideClickListener,
  ]);

  useEffect(() => {
    if (layoutState.profileSidebarVisible) {
      bindProfileMenuOutsideClickListener();
    }

    return () => {
      unbindProfileMenuOutsideClickListener();
    };
  }, [
    bindProfileMenuOutsideClickListener,
    layoutState.profileSidebarVisible,
    unbindProfileMenuOutsideClickListener,
  ]);

  useEffect(() => {
    const userStr = localStorage.getItem(AuthService.USER_KEY);
    if (userStr) {
      setLoggedUser(JSON.parse(userStr));
    }
  }, []);

  useUnmountEffect(() => {
    unbindMenuOutsideClickListener();
    unbindProfileMenuOutsideClickListener();
  });

  const containerClass = classNames("layout-wrapper", "page-break", {
    "layout-overlay": layoutConfig.menuMode === "overlay",
    "layout-static": layoutConfig.menuMode === "static",
    "layout-static-inactive":
      layoutState.staticMenuDesktopInactive &&
      layoutConfig.menuMode === "static",
    "layout-overlay-active": layoutState.overlayMenuActive,
    "layout-mobile-active": layoutState.staticMenuMobileActive,
    "p-input-filled": layoutConfig.inputStyle === "filled",
    "p-ripple-disabled": !layoutConfig.ripple,
  });

  return (
    <>
      <div className={containerClass}>
        <AppNavbar
          title={title}
          onMenuToggle={toggleMenu}
          showProfileSidebar={profileSidebarToggle}
          profileSidebarVisible={layoutState.profileSidebarVisible}
          loggedUser={loggedUser}
        />
        <div className="layout-sidebar">
          <AppSidebar />
        </div>
        <div className="layout-main-container flex-auto">
          <div className="layout-main">{children}</div>
          <AppFooter />
        </div>
        <div className="layout-mask"></div>
      </div>
    </>
  );
}
