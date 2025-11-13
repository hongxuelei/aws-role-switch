import {updateTabUrl} from '../../common/browser/tabs';
import {mapToSwitchForm} from '../../common/mappers';
import {removeUndefinedEntries} from '../../common/util';

export const redirectListener = async (
  msg: AWSConfigItem,
  sender: chrome.runtime.MessageSender,
) => {
  // Determine the correct redirect URI and signin URL based on the current console URL
  let redirectUri = 'https://console.aws.amazon.com/console';
  let signinUrl = 'https://signin.aws.amazon.com/switchrole';
  
  if (sender.url) {
    redirectUri = sender.url;
    if (sender.url.includes('.amazonaws.cn')) {
      signinUrl = 'https://signin.amazonaws.cn/switchrole';
    }
  }
  
  const params = mapToSwitchForm(msg, {
    redirect_uri: redirectUri,
    _fromAWSRoleSwitchExtension: 'true',
  });
  const urlParams = new URLSearchParams(
    removeUndefinedEntries(params),
  ).toString();
  
  return updateTabUrl(`${signinUrl}?${urlParams}`);
};