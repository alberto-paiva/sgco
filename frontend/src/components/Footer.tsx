// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import logo from "assets/images/preact.svg";

export function AppFooter() {
  return (
    <div className="layout-footer">
      <img src={logo} alt="Logo" height="20" className="mr-2" />
      <div>SGCO &copy; {new Date().getFullYear()}</div>
      &nbsp; by
      <span className="font-medium ml-2">
        <a
          className=""
          href="https://github.com/alberto-paiva"
          target="_blank"
          rel="noopener noreferrer"
        >
          Alberto Paiva
        </a>
      </span>
    </div>
  );
}
