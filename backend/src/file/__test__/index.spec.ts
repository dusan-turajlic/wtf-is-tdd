import * as fs from 'fs';
import HttpStatusCode from '../../enum/http';
import { uploadToS3 } from '../index';

jest.mock('fs', () => ({
  statSync: jest.fn().mockReturnValue('test'),
}));

describe('upload to s3', () => {
  beforeEach(() => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response('', { status: HttpStatusCode.OK }));
  });

  it('can upload to correct place', () => {
    const path = 'path/to/file';
    const fileName = 'file.txt';
    const blob = new Blob();
    uploadToS3(blob, path, fileName);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/${path}/${fileName}`),
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Content-Type': 'application/octet-stream',
          Date: expect.any(String),
          Authorization: expect.stringContaining('AWS'),
        }),
        body: expect.objectContaining(blob),
      }),
    );
  });
});
