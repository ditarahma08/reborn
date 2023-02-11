export default async function handler(req, res) {
  const baseUrl = process.env.GRAPHQL_URL;
  const { body: value } = req;

  const slug = value?.slug;

  const query = JSON.stringify({
    query: `
      query MyQuery($slug: String = "${slug}") {
        postBy(slug: $slug) {
          title
          contentWorkshopTop {
            description
            h1Title
          }
          contentWorkshopMiddle {
            content
          }
          faq {
            faqList
          }
          carousel {
            carouselList
          }
          featuredImage {
            node {
              altText
              caption
              link
              sourceUrl
            }
          }
          categories {
            nodes {
              children {
                nodes {
                  name
                  slug
                }
              }
            }
          }
        }
      }
    `,
    variables: {}
  });

  const reqOptions = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Access-Allow-Origin': '*'
    }),
    body: query,
    redirect: 'follow'
  };

  try {
    const resData = await fetch(baseUrl, reqOptions)
      .then((result) => result.text())
      .then((response) => JSON.parse(response));
    res.status(200).json({ data: resData?.data?.postBy });
  } catch (err) {
    res.status(500).send({ err, data: { message: err } });
  }
}
