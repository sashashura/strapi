import React from 'react';
import { ThemeProvider, lightTheme } from '@strapi/design-system';
import { render as renderTL, screen, waitFor } from '@testing-library/react';
import { TrackingProvider } from '@strapi/helper-plugin';
import { MemoryRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';

import { ConfigureTheView } from '..';

jest.mock('../../../../hooks/useConfig');
jest.mock('@strapi/helper-plugin', () => ({
  ...jest.requireActual('@strapi/helper-plugin'),
  useNotification: jest.fn(() => jest.fn()),
}));

const renderConfigure = (
  config = {
    data: {
      pageSize: '10',
    },
  }
) =>
  renderTL(
    <IntlProvider locale="en" messages={{}}>
      <TrackingProvider>
        <ThemeProvider theme={lightTheme}>
          <MemoryRouter>
            <ConfigureTheView config={config} />
          </MemoryRouter>
        </ThemeProvider>
      </TrackingProvider>
    </IntlProvider>
  );

describe('Upload - Configure', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe('initial render', () => {
    it('renders and matches the snapshot', async () => {
      const { container } = renderConfigure();

      await waitFor(() => {
        expect(screen.getByRole('main')).toHaveFocus();
        expect(screen.getByText('Configure the view - Media Library')).toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
    });
  });

  describe('save', () => {
    it('save renders and is initially disabled', async () => {
      renderConfigure();

      await waitFor(() => {
        expect(screen.getByText('Configure the view - Media Library')).toBeInTheDocument();
        expect(screen.getByTestId('save')).toHaveAttribute('disabled');
      });
    });
  });
});
