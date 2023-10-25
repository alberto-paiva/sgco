// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

export interface LayoutConfig {
  ripple: boolean;
  inputStyle: "outlined" | "filled";
  menuMode: "static" | "overlay" | "popup";
  colorScheme: "light" | "dark";
  theme:
    | "lara-light-indigo"
    | "lara-dark-indigo"
    | "lara-light-pink"
    | "lara-dark-pink";
  scale: number;
}

export interface LayoutState {
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuDesktopInactive: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

export const initialLayoutConfig: LayoutConfig = {
  ripple: false,
  inputStyle: "outlined",
  menuMode: "static",
  colorScheme: "light",
  theme: "lara-light-indigo",
  scale: 14,
};

export const initialLayoutState: LayoutState = {
  overlayMenuActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  staticMenuDesktopInactive: false,
  staticMenuMobileActive: false,
  menuHoverActive: false,
};
