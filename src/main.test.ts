import { afterEach, expect, it, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

const { renderMock, createRootMock } = vi.hoisted(() => {
  const renderMock = vi.fn();
  const createRootMock = vi.fn(() => ({
    render: renderMock,
  }));

  return { renderMock, createRootMock };
});

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

vi.mock('./App', () => ({
  App: () => null,
}));

describe('main', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('bootstraps the app into the root element', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('./main');

    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledTimes(1);
  });
});
