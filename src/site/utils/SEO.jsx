import React from "react";
import { Helmet } from "react-helmet-async";
import metaConfig from "./meta-config";

const SEO = ({ page = "home" }) => {
  const pageMeta = metaConfig.pages[page] || metaConfig.pages.home;
  const site = metaConfig.site;

  const title = pageMeta.title;
  const description = pageMeta.description;
  const image = pageMeta.image || site.image;
  const url = `${site.url}/${page === "home" ? "" : page}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
