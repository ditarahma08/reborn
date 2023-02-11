import { Container, Icon, Row, Text } from '@components/otoklix-elements';

const FooterLight = () => {
  const socials = [
    { logo: 'facebook-light', url: 'https://www.facebook.com/otoklix' },
    { logo: 'linkedin', url: 'https://www.linkedin.com/company/otoklix/' },
    { logo: 'youtube', url: 'https://www.youtube.com/channel/UCOp6GgcqNb2dXAZcL59OI3A/featured' },
    { logo: 'instagram', url: 'https://www.instagram.com/otoklix/' }
  ];

  const productCategory = [
    {
      label: 'Product',
      items: [
        { name: 'Otoklix', url: `/servis` },
        { name: 'OtoPartner', url: 'https://otoklix.com/otopartner' },
        { name: 'OtoXpress', url: '/' },
        { name: 'OtoProduct', url: '/' }
      ]
    },
    {
      label: 'Perusahaan',
      items: [
        { name: 'Blog', url: 'https://otoklix.com/blog/' },
        { name: 'Karir', url: 'https://otoklix.com/career' },
        { name: 'Mitra', url: 'https://otoklix.com/mitra' },
        { name: 'Tentang', url: '/about-us' },
        { name: 'Syarat & Ketentuan', url: '/account/terms-conditions' },
        { name: 'Kebijakan Privasi', url: '/account/privacy-policy' }
      ]
    }
  ];

  return (
    <Container className="d-flex flex-column p-3 bg-off-white">
      <img src="/assets/logo/logo.svg" width={170} alt="otoklix-logo" />

      <Text color="label" className="mt-4 mb-2">
        Didirikan pada tahun 2019, Otoklix menjembatani kesenjangan antara pemilik kendaraan
        otomotif dan sektor bengkel mobil independen yang terfragmentasi di Indonesia.
      </Text>

      <Row>
        {socials?.map((social, index) => (
          <Icon
            image={`/assets/icons/${social?.logo}.svg`}
            imageHeight={16}
            imageWidth={16}
            key={index}
            className="pointer"
            onClick={() => window.open(social?.url, '_blank')}
          />
        ))}
      </Row>

      <div className="my-2 d-flex">
        {productCategory?.map((category, index) => (
          <div className={`d-flex flex-column ${index === 0 ? 'me-5' : ''}`} key={index}>
            <Text weight="bold" color="body" className="mb-3">
              {category?.label}
            </Text>

            {category?.items?.map((item, index) => (
              <Text
                key={index}
                color="label"
                className="text-md text-underline pointer my-1"
                onClick={() => window.open(item?.url, '_blank')}>
                {item?.name}
              </Text>
            ))}
          </div>
        ))}
      </div>

      <Row className="mt-2">
        <Icon
          card
          textRight
          imgAlt="pin-map"
          image="/assets/icons/pin-map-blue-xl.svg"
          imageWidth={20}
          imageHeight={20}
          className="ms-2"
          title={
            <Text color="body" weight="semi-bold" className="text-md">
              Otoklix - HQ
            </Text>
          }
        />
        <div className="ms-4">
          <Text color="body" className="text-md">
            Jl. Terusan Sinabung No.1, RT.7/RW.8, Jakarta Selatan
          </Text>
        </div>

        <Icon
          card
          textRight
          imgAlt="pin-map"
          image="/assets/icons/phone-blue.svg"
          imageWidth={20}
          imageHeight={20}
          className="mt-2 ms-2"
          title={
            <Text color="body" weight="semi-bold" className="text-md">
              0811-920-025
            </Text>
          }
        />
      </Row>

      <Row>
        <div className="d-flex mt-3">
          <a href={`${process.env.BRANCH_LINK}Website-Install`} target="_blank" rel="noreferrer">
            <img className="me-4" src="/assets/images/playstore.png" alt="" height="32px" />
          </a>

          <a href={`${process.env.BRANCH_LINK}Website-Install`} target="_blank" rel="noreferrer">
            <img src="/assets/images/appstore.svg" alt="" height="32px" />
          </a>
        </div>
      </Row>
    </Container>
  );
};

export default FooterLight;
