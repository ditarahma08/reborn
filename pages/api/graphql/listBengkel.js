import { reqOptions, workshopQuery } from './query';

export default async function handler(req, res) {
  const baseUrl = process.env.GRAPHQL_URL;
  const { body: value } = req;

  const area = value?.area;
  const limit = value?.limit;

  try {
    const resData = await fetch(baseUrl, reqOptions(workshopQuery(area, limit)))
      .then((result) => result.text())
      .then((response) => JSON.parse(response));
    res.status(200).json({ data: resData?.data?.posts });
  } catch (err) {
    res.status(500).send({ err, data: { message: err } });
  }
}
