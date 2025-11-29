import { Helmet } from "react-helmet-async";

function SEO ({
                title = "",
                description = "",
                name = "",
                imageUrl = ""
              }) {
  return (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description}/>
        <meta property="og:title" content={name}/>
        <meta property="og:image" content={imageUrl}/>
      </Helmet>
  );
}

export default SEO;
