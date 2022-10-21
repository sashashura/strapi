import React from 'react';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import { render as renderTL, screen, waitFor, fireEvent } from '@testing-library/react';
import { TrackingProvider } from '@strapi/helper-plugin';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import { Settings } from '../Settings';
import { pageSizes } from '../../../../../constants';

const testPageSize = `${pageSizes[0]}`;

const renderSettings = ({ pageSize = testPageSize, onChange = jest.fn() }) =>
  renderTL(
    <IntlProvider locale="en" messages={{}}>
      <TrackingProvider>
        <ThemeProvider theme={lightTheme}>
          <MemoryRouter>
            <Settings pageSize={pageSize} onChange={onChange} />
          </MemoryRouter>
        </ThemeProvider>
      </TrackingProvider>
    </IntlProvider>
  );

describe('Upload - Configure | Settings', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('initial render', () => {
    it('renders and matches the snapshot', async () => {
      const { container } = renderSettings({});

      await waitFor(() => {
        expect(screen.getByText('Entries per page')).toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
    });
  });

  describe('pageSize', () => {
    it('renders all page Sizes', async () => {
      renderSettings({});

      fireEvent.mouseDown(screen.getByTestId('pageSize-select'));
      await waitFor(() => {
        pageSizes.forEach((size) => {
          const option = screen.getByTestId(`pageSize-option-${size}`);
          expect(option).toBeInTheDocument();
          expect(option).toHaveAttribute('data-strapi-value', `${size}`);
        });
      });
    });
  });
});
