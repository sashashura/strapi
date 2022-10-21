export const useConfig = jest.fn().mockReturnValue({
  config: {
    isLoading: false,
    isError: false,
    data: {
      data: {
        pageSize: 10,
      },
    },
    error: '',
  },
  mutation: jest.fn(),
});
