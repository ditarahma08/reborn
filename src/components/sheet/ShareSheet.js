import { Button, Col, Container, Icon, Text } from '@components/otoklix-elements';
import { useState } from 'react';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share';
import { BottomSheet } from 'react-spring-bottom-sheet';

const ShareSheet = (props) => {
  const { openSheet, onDismiss, link = '' } = props;

  const [copiedLink, setCopiedLink] = useState(false);
  const [socialShare, setSocialShare] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
  };

  const handleOnDismiss = () => {
    setCopiedLink(false);
    setSocialShare(false);
    onDismiss();
  };

  return (
    <BottomSheet open={openSheet} onDismiss={handleOnDismiss}>
      <Container className="share-sheet">
        <Col className="d-flex justify-content-between align-items-center">
          <Text tag="div" weight="semi-bold">
            Bagikan Bengkel Ini Dengan
          </Text>

          <Icon
            card
            className="pointer"
            image="/assets/icons/circle-close-grey.svg"
            imageHeight={18}
            imageWidth={18}
            onClick={handleOnDismiss}
          />
        </Col>

        <Col className="d-flex mt-3 mb-4">
          {socialShare ? (
            <Col className="d-flex justify-content-around">
              <EmailShareButton url={link}>
                <EmailIcon size={40} round={true} />
              </EmailShareButton>
              <FacebookShareButton url={link}>
                <FacebookIcon size={40} round={true} />
              </FacebookShareButton>
              <TwitterShareButton url={link}>
                <TwitterIcon size={40} round={true} />
              </TwitterShareButton>
              <TelegramShareButton url={link}>
                <TelegramIcon size={40} round={true} />
              </TelegramShareButton>
              <WhatsappShareButton url={link}>
                <WhatsappIcon size={40} round={true} />
              </WhatsappShareButton>
            </Col>
          ) : (
            <>
              <Button
                block
                color={copiedLink ? 'primary' : 'subtle'}
                className="d-flex align-items-center justify-content-center me-1 share-sheet__button"
                onClick={handleCopyLink}>
                <Icon
                  card
                  className="me-2"
                  image={
                    copiedLink ? '/assets/icons/copy-white-xl.svg' : '/assets/icons/copy-blue.svg'
                  }
                  imageHeight={18}
                  imageWidth={18}
                />
                {copiedLink ? 'Tersalin' : 'Link'}
              </Button>

              <Button
                block
                color="subtle"
                className="d-flex align-items-center justify-content-center ms-1 share-sheet__button"
                onClick={() => setSocialShare(true)}>
                <Icon
                  card
                  className="me-2"
                  image="/assets/icons/share-blue.svg"
                  imageHeight={18}
                  imageWidth={18}
                />
                Lainnya
              </Button>
            </>
          )}
        </Col>
      </Container>
    </BottomSheet>
  );
};

export default ShareSheet;
