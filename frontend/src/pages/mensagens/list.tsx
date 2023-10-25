// Copyright 2023 Alberto Paiva.
// SPDX-License-Identifier: MIT

import { DefaultLayout } from "@/layouts/DefaultLayout";
import { type RouteComponentProps } from "wouter";
import { type FunctionComponent } from "react";

interface MensagensListProps extends RouteComponentProps {
  title?: string;
}

export const MensagensList: FunctionComponent<MensagensListProps> = ({
  title = "Mensagens",
}: MensagensListProps) => {
  return (
    <DefaultLayout title={title}>
      <>
        <h1>Hi 👋</h1>
        <p>
          Can&apos;t wait to see what you build!
          <br />
          Happy coding!
        </p>
        <p className="text-justify">
          The standard Lorem Ipsum passage, used since the 1500s `&quot;Lorem
          ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
          tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
          veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.`&quot;
        </p>
      </>
    </DefaultLayout>
  );
};
