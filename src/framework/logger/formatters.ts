export const formatters = (): Record<string, any> => ({
  formatters: {
    level: (label: string): Record<string, string> => {
      return { level: label };
    }
  },
});