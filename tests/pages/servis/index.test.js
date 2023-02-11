import Index from '@pages/servis/index';
import { expect } from 'chai';
import { shallow } from 'enzyme';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

describe('Index page', function () {
  const propsData = { promos: { data: [] } };
  test('renders index page', () => {
    useRouter.mockImplementationOnce(() => ({
      query: { lat: '0', lng: '0' }
    }));

    expect(shallow(<Index promos={propsData.promos} />)).to.not.be.null;
  });
});
