import aws from "aws-sdk";
import { promisify } from "util";
import config from "../../config/config.json";
import fetchJson from "./fetchJson";

const s3Info = config.s3;
const awsInfo = config.aws;

aws.config.update({
  accessKeyId: awsInfo.accessKeyId,
  secretAccessKey: awsInfo.secretAccessKey,
  region: awsInfo.region
});
const s3SDK = new aws.S3();

const getPrefix = ({ type, project }) => {
  switch (type) {
    case "projects":
      return "lib/";
    case "envs":
      return `lib/${project}/environments/`;
    case "versions":
      return `lib/${project}/builds/`;
    default:
      return "lib/";
  }
};

const parseItemFromKey = item => {
  const prefix = item.Prefix;
  const arr = prefix.split("/");
  return arr[arr.length - 2];
};

export const getManifest = ({ project, version }) => {
  return fetchJson(`${s3Info.hostUrl}/pac-react-b2b/lib/${project}/builds/${version}/manifest.json`);
};

export const grabAWSObjects = (type, project) => {
  const prefix = getPrefix({ type, project });
  const params = {
    Bucket: s3Info.bucket,
    Delimiter: "/",
    Prefix: prefix
  };
  return promisify(s3SDK.listObjects)
    .bind(s3SDK)(params)
    .then(data => data.CommonPrefixes.map(parseItemFromKey));
};

export const uploadNewVersionFile = (key, stream) => {
  return promisify(s3SDK.upload)
    .bind(s3SDK)({
      Bucket: s3Info.bucket,
      Key: key,
      Body: stream,
      ACL: "public-read",
      CacheControl: "max-age=0",
      ContentType: "application/json"
    })
    .then(data => {
      if (!data) {
        console.log("Sorry! something wrong happened, try again?");
      }
    });
};

export const grabCurrentVersion = key => {
  console.log(key);
  return promisify(s3SDK.getObject)
    .bind(s3SDK)({
      Bucket: s3Info.bucket,
      Key: key
    })
    .then(data => {
      console.log("CURRENT VERSION:", data.Body.toString());
    });
};
