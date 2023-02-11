import { Card, Col, Icon, Text } from '@components/otoklix-elements';
import { useState } from 'react';

const FacilityDropdown = (props) => {
  const { facilities, workshopType } = props;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      {workshopType === 'non_verified' && (
        <Text
          color="dark"
          weight="bold"
          className="workshop-section-title d-flex align-items-center mb-2 text-md">
          Fasilitas
        </Text>
      )}

      {workshopType === 'non_verified' || facilities?.length === 0 ? (
        <Col className="text-center">
          <Text color="dark" className="text-sm">
            Sayang sekali, informasi fasilitas bengkel ini tidak tersedia
          </Text>
        </Col>
      ) : (
        <>
          <Col
            className={
              isOpen
                ? 'workshop-facility-list --open d-flex flex-wrap'
                : 'workshop-facility-list d-flex flex-wrap'
            }>
            {facilities?.map((facility, index) => {
              return (
                <div className="col-6" key={`${facility?.name}-${index}`}>
                  {index < 4 && (
                    <Col className="col-sm-6 d-flex align-items-center">
                      <Icon
                        card
                        image={facility.image_link}
                        imageHeight={20}
                        imageWidth={20}
                        className="me-2 grayscale-icon"
                      />
                      <Text color="label" className="text-md">
                        {facility?.name?.toLowerCase() === 'non ac'
                          ? 'Ruang Tunggu'
                          : facility?.name}
                      </Text>
                    </Col>
                  )}
                  {isOpen && index >= 4 && (
                    <Col className="col-6 d-flex align-items-center">
                      <Icon
                        card
                        image={facility.image_link}
                        imageHeight={20}
                        imageWidth={20}
                        className="me-2 grayscale-icon"
                      />
                      <Text color="label">
                        {facility?.name?.toLowerCase() === 'non ac'
                          ? 'Ruang Tunggu'
                          : facility?.name}
                      </Text>
                    </Col>
                  )}
                </div>
              );
            })}
          </Col>

          {facilities?.length > 4 && (
            <Col className="d-flex justify-content-center my-2 workshop-facility-toggle">
              <Card
                className="d-flex flex-row d-inline-flex align-items-center px-2 pointer"
                onClick={() => setIsOpen(!isOpen)}>
                <Text color="primary" className="text-xs">
                  {isOpen ? 'Lihat Lebih Sedikit' : 'Lihat Semua Fasilitas'}
                </Text>
                <Icon
                  card
                  image={
                    isOpen
                      ? '/assets/icons/chevron-up-blue.svg'
                      : '/assets/icons/chevron-down-blue.svg'
                  }
                  imageHeight={15}
                  imageWidth={15}
                />
              </Card>
            </Col>
          )}
        </>
      )}
    </div>
  );
};

export default FacilityDropdown;
