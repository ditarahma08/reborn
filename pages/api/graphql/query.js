export const contentQuery = (area) =>
  JSON.stringify({
    query: `
      query MyQuery($slug: String = "${area}") {
        postBy(slug: $slug) {
          title
          contentWorkshopList {
            categoryslug
          }
          contentWorkshopMiddle {
            content
          }
          contentWorkshopTop {
            description
            h1Title
          }
          seo {
            metaDesc
            metaKeywords
            title
          }
          faq {
            faqList
          }
          carousel {
            carouselList
          }
        }
      }
    `,
    variables: {}
  });

export const categoryQuery = (category) =>
  JSON.stringify({
    query: `
    query getChildCategory($slug: [String] = "${category}") {
      categories(where: {slug: $slug}) {
        nodes {
          parent {
            node {
              children {
                nodes {
                  name
                  slug
                }
              }
              slug
            }
          }
        }
      }
    }
  `,
    variables: {}
  });

export const workshopQuery = (area, limit) =>
  JSON.stringify({
    query: `
      query MyQuery($categoryName: String = "${area}", $first: Int = ${limit}) {
        posts(where: {categoryName: $categoryName}, first: $first) {
          nodes {
            slug
            title
            workshopParams {
              city
              price
              tier
              id
              time
              timeIcon
            }
            featuredImage {
              node {
                sourceUrl
                title
                uri
                altText
              }
            }
            tags {
              nodes {
                name
              }
            }
          }
          pageInfo {
            endCursor
            hasPreviousPage
            hasNextPage
          }
        }
      }
    `,
    variables: {}
  });

export const faqQuery = (id) =>
  JSON.stringify({
    query: `
    query getFaqList($categoryName: String = "faq-${id}") {
      posts(where: {categoryName: $categoryName, orderby: {field: DATE, order: ASC}}) {
        nodes {
          slug
          title
          faq {
            answer
            question
          }
        }
      }
    }
    `,
    variables: {}
  });

export const reqOptions = (query) => {
  return {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Access-Allow-Origin': '*'
    }),
    body: query,
    redirect: 'follow'
  };
};
