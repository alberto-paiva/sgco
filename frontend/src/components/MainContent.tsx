// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { type ReactNode } from "react";

interface MainContentProps {
  title?: string;
  children?: ReactNode;
  hasButtons?: boolean;
  onAddNewButtonClick?: () => void;
  onExportButtonClick?: () => void;
}

export function MainContent({
  title,
  children,
  hasButtons = false,
  onAddNewButtonClick,
  onExportButtonClick,
}: MainContentProps) {
  return (
    <>
      {/* Main content */}
      <main className="flex-1 max-h-full p-5 overflow-hidden overflow-y-scroll">
        <div className="mb-4">
          <div className="breadcrumbs text-sm">
            <ul>
              <li>
                <a href="/" className="font-semibold">
                  Home
                </a>
              </li>
              <li>
                <a className="font-bold">{title}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap pb-4 md:justify-content-between justify-content-center">
          {/* Main content header */}
          <h1 className="pr-6 text-2xl font-semibold whitespace-nowrap">
            {title}
          </h1>
          {/* Main content button bar */}
          {hasButtons && (
            <div className="join join-horizontal">
              <a
                href="#"
                className="btn btn-sm btn-primary join-item"
                onClick={onAddNewButtonClick}
              >
                <div className="flex items-center gap-x-3">
                  {/* <IconBxUserPlus className='w-6 h-6' /> */}
                  <span className="text-xs">Adicionar</span>
                </div>
              </a>
              <a
                href="#"
                className="btn btn-sm btn-neutral join-item"
                onClick={onExportButtonClick}
              >
                <div className="flex items-center gap-x-3">
                  {/* <IconBxExport className='w-6 h-6' /> */}
                  <span className="text-xs">Exportar</span>
                </div>
              </a>
            </div>
          )}
        </div>
        {/* Start Content */}
        {children}
      </main>
    </>
  );
}
