export default async function handler(req, res) {
  const baseUrl = process.env.GRAPHQL_URL;
  const { body: value } = req;

  const categoryName = value?.categoryName;

  const query = JSON.stringify({
    query: `
      query MyQuery($slug: [String] = "${categoryName}") {
        categories(where: {slug: $slug}) {
          nodes {
            name
            slug
            children {
              nodes {
                name
                slug
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
    res.status(200).json({ data: resData?.data?.categories });
  } catch (err) {
    res.status(500).send({ err, data: { message: err } });
  }
}
