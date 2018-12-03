import { Readable } from "stream";

export const stringToStream = string => {
  const stream = new Readable();
  stream.push(string);
  stream.push(null);
  return stream;
};

export const objectToStream = object => stringToStream(JSON.stringify(object));
