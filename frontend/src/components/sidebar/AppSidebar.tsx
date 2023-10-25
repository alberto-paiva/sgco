// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { Ripple } from "primereact/ripple";
import { classNames } from "primereact/utils";
import React, { useEffect, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useLocation } from "wouter";
import { defaultItems, type MenuItemModel } from "./SidebarMenuItems.tsx";

interface AppSidebarProps {
  loggedUser?: UsuarioData;
}
export function AppSidebar({ loggedUser }: AppSidebarProps) {
  const [_user, setUser] = useState<UsuarioData>();
  const [currentPage, setCurrentPage] = useState("");
  const [currentKey, setCurrentKey] = useState("");
  const [location, navigate] = useLocation();

  const activeCurrentPage = (href?: string): boolean => href === currentPage;

  const itemClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    item: MenuItemModel,
    key: never | string,
  ) => {
    // toggle active menu item
    setCurrentKey(currentKey === key ? "" : key);

    // avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return;
    }

    // execute command
    if (item.onMenuButtonClick) {
      item.onMenuButtonClick({ originalEvent: event.nativeEvent, item });
    }
  };

  const onLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: MenuItemModel,
    key: never | string,
    to: string,
  ) => {
    itemClick(e, item, key);
    navigate(to, { replace: false });
  };

  useEffect(() => {
    setCurrentPage(location);
  }, [setCurrentPage, setCurrentKey, location]);

  useEffect(() => {
    if (loggedUser) {
      setUser(loggedUser);
    }
  }, [loggedUser]);

  function renderItem(item: MenuItemModel, key: never | string) {
    const classes = classNames(item.className, "p-ripple", {
      "active-route": activeCurrentPage(item.href),
    });

    const link = (
      <>
        <a
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            onLinkClick(e, item, key, item.href ?? location);
          }}
          className={classNames(classes)}
          target={item.target}
          tabIndex={0}
        >
          <i className={classNames("layout-menuitem-icon", item.icon)}></i>
          <span className="layout-menuitem-text">{item.label}</span>
          {item.subItems && (
            <i className="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
          )}
          <Ripple />
        </a>
      </>
    );

    return item.visible ? link : null;
  }

  return (
    <>
      <ul className="layout-menu">
        {defaultItems.map((item, i) => {
          return item.separator ? (
            <li key={i} className={"menu-separator"}></li>
          ) : (
            <li
              key={i}
              className={classNames({
                "layout-root-menuitem": item.root,
                "active-menuitem": activeCurrentPage(item.href),
              })}
            >
              {/* MENU HEADERS */}
              {item.root && item.visible && (
                <div className="text-center">
                  <span className="layout-menuitem-root-text">
                    {item.label}
                  </span>
                </div>
              )}
              {item.items && item.visible && (
                <ul>
                  {item.items?.map((child, cKey) => {
                    return (
                      <li key={`${cKey}-${child.label}`}>
                        {renderItem(child, `${cKey}-${child.label}`)}
                        {child.subItems && child.visible && (
                          <div>
                            <CSSTransition
                              timeout={{ enter: 1000, exit: 450 }}
                              classNames="layout-submenu"
                              in={currentKey.includes(`${cKey}-${child.label}`)}
                              key={child.label}
                            >
                              <ul>
                                {child.subItems?.map((subItem, sKey) => {
                                  return (
                                    <li key={`${sKey}-${subItem.label}`}>
                                      {renderItem(
                                        subItem,
                                        `${sKey}-${subItem.label}`,
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            </CSSTransition>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
