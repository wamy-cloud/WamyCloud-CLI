import WamyCloudCLI from './core/WamyCloudCLI.js';

const wamyCloudCLI = WamyCloudCLI.factory();

wamyCloudCLI.start(process.env.WAMY_CLOUD_TOKEN);
