
import { NativeModules } from 'react-native';

export const ObjectCaptureModule = NativeModules.ObjectCaptureModule as {
  startObjectCapture: () => Promise<string>;
};