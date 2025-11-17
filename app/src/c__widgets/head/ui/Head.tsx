import { PROJECT_DATA } from "@/shared/config";

export const Head = () => (
  <head>
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <title>{PROJECT_DATA.meta.title}</title>
    <link
      rel="icon"
      href="data:image/x-icon;base64,AAABAAEAAQEAAAEAIAAwAAAAFgAAACgAAAABAAAAAgAAAAEAIAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAA=="
    ></link>
    <meta name="description" content={PROJECT_DATA.meta.description} />
  </head>
);