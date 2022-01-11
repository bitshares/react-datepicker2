import React from 'react';
import Enzyme,{ shallow } from 'enzyme';
import Root from '../docs/src/root';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('<Root />', () => {

  it('should render docs ', () => {
    const wrapper = shallow(<Root />);
    wrapper.render();
  });

})