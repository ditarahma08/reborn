export default async function handler(req, res) {
  const baseUrl = process.env.GRAPHQL_URL;
  const { body: value } = req;

  const categoryName = value?.categoryName;

  const query = JSON.stringify({
    query: `
        query NewQuery($categoryName: String = "${categoryName}") {
            posts(where: {categoryName: $categoryName}) {
              edges {
                node {
                  id
                  title
                  seo {
                    metaKeywords
                    metaDesc
                    title
                  }
                  seoMeta {
                    h1
                    h2
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
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
    res.status(200).json({ data: resData?.data?.posts });
  } catch (err) {
    res.status(500).send({ err, data: { message: err } });
  }
}
